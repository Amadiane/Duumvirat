import logging

from django.conf import settings
from django.core.mail import send_mail, EmailMessage, EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import ScopedRateThrottle

from .models import PieceJointeDemande
from .serializers import MessageContactSerializer, DemandeQualificationSerializer

logger = logging.getLogger(__name__)

# Au-dela de cette taille cumulee, on n'attache plus les fichiers a l'e-mail
# (risque de rejet par le serveur SMTP) : l'equipe les recupere alors depuis
# l'admin (/admin/demandes), ou le mail le precise.
TAILLE_MAX_PIECES_JOINTES_MAIL = 15 * 1024 * 1024  # 15 Mo


def notifier_par_email(sujet, contexte, template, pieces_jointes=None):
    """
    Envoie une notification a l'equipe a chaque nouvelle demande (fonctionnalite
    obligatoire du cahier des charges). Ne doit jamais faire echouer la requete :
    la demande est deja enregistree en base a ce stade, un souci d'e-mail (SMTP,
    template manquant...) ne doit pas se traduire par une erreur 500 pour le visiteur.

    pieces_jointes : liste optionnelle d'objets PieceJointeDemande. Pour ne pas
    multiplier la consommation de stockage des boites mail (chaque destinataire
    a son propre quota LWS), les fichiers ne sont attaches qu'au PREMIER
    destinataire de EMAIL_NOTIFICATION_DESTINATAIRES (le service client, sac@) ;
    les autres destinataires recoivent la meme notification texte, sans fichiers.
    """
    try:
        corps = render_to_string(template, contexte)
        destinataires = list(settings.EMAIL_NOTIFICATION_DESTINATAIRES)
        if not destinataires:
            return
        destinataire_principal, *autres_destinataires = destinataires

        pieces_a_joindre = []
        if pieces_jointes:
            taille_cumulee = 0
            for piece in pieces_jointes:
                try:
                    taille = piece.fichier.size
                except (OSError, ValueError):
                    continue
                if taille_cumulee + taille > TAILLE_MAX_PIECES_JOINTES_MAIL:
                    corps += (
                        "\n\nCertaines pieces jointes n'ont pas ete incluses dans ce mail "
                        "(taille totale trop importante) : consultez la demande dans l'admin "
                        "pour les telecharger."
                    )
                    break
                taille_cumulee += taille
                pieces_a_joindre.append(piece)

        corps_sans_pieces = corps
        if pieces_a_joindre:
            corps_sans_pieces += (
                f"\n\nLes pieces jointes de cette demande ont ete envoyees a "
                f"{destinataire_principal} uniquement ; consultez l'admin pour les voir ici aussi."
            )

        # Destinataire principal : avec pieces jointes si presentes.
        if pieces_a_joindre:
            email = EmailMessage(
                subject=sujet,
                body=corps,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[destinataire_principal],
            )
            for piece in pieces_a_joindre:
                piece.fichier.open("rb")
                try:
                    email.attach(piece.fichier.name.rsplit("/", 1)[-1], piece.fichier.read())
                finally:
                    piece.fichier.close()
            email.send(fail_silently=True)
        else:
            send_mail(
                subject=sujet, message=corps, from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[destinataire_principal], fail_silently=True,
            )

        # Autres destinataires : toujours sans pieces jointes.
        if autres_destinataires:
            send_mail(
                subject=sujet,
                message=corps_sans_pieces,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=autres_destinataires,
                fail_silently=True,
            )
    except Exception:
        logger.exception("Echec de l'envoi de la notification interne (%s)", template)


def confirmer_par_email(destinataire, sujet, contexte, template_texte, template_html):
    """
    Envoie un accuse de reception au visiteur ayant rempli le formulaire, a son adresse.
    Version HTML habillee de la charte du site, avec repli en texte brut. Comme pour
    notifier_par_email, toute erreur est journalisee mais jamais propagee.
    """
    try:
        corps_texte = render_to_string(template_texte, contexte)
        corps_html = render_to_string(template_html, contexte)
        email = EmailMultiAlternatives(
            subject=sujet,
            body=corps_texte,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[destinataire],
        )
        email.attach_alternative(corps_html, "text/html")
        email.send(fail_silently=True)
    except Exception:
        logger.exception("Echec de l'envoi de la confirmation au visiteur (%s)", template_html)


class MessageContactCreateView(generics.CreateAPIView):
    """POST /api/contact/messages/ — formulaire de contact simple."""
    serializer_class = MessageContactSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "demande_contact"

    def perform_create(self, serializer):
        message = serializer.save()
        notifier_par_email(
            sujet=f"Nouveau message de contact - {message.nom}",
            contexte={"message": message},
            template="contact/email_nouveau_message.txt",
        )
        confirmer_par_email(
            destinataire=message.email,
            sujet="Votre message a bien ete recu - Duumvirat Business",
            contexte={"message": message},
            template_texte="contact/email_confirmation_message.txt",
            template_html="contact/email_confirmation_message.html",
        )
        self.instance_creee = message


class DemandeQualificationCreateView(generics.CreateAPIView):
    """
    POST /api/contact/demandes/ — formulaire complet de qualification / envoi de dossier.
    Accepte du multipart/form-data avec un ou plusieurs champs 'pieces_jointes'
    (fichiers : compte-rendu, passeport, IRM, radios, analyses, ordonnances...).
    """
    serializer_class = DemandeQualificationSerializer
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "demande_contact"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        demande = serializer.save()

        fichiers = request.FILES.getlist("pieces_jointes")
        libelles = request.data.getlist("libelles_pieces_jointes") if hasattr(request.data, "getlist") else []
        pieces_creees = []
        for index, fichier in enumerate(fichiers):
            libelle = libelles[index] if index < len(libelles) else ""
            pieces_creees.append(
                PieceJointeDemande.objects.create(demande=demande, fichier=fichier, libelle=libelle)
            )

        notifier_par_email(
            sujet=f"Nouvelle demande ({demande.get_motif_display()}) - {demande.prenom} {demande.nom}",
            contexte={"demande": demande, "nombre_pieces": len(fichiers)},
            template="contact/email_nouvelle_demande.txt",
            pieces_jointes=pieces_creees,
        )
        confirmer_par_email(
            destinataire=demande.email,
            sujet="Votre demande a bien ete recue - Duumvirat Business",
            contexte={"demande": demande},
            template_texte="contact/email_confirmation_demande.txt",
            template_html="contact/email_confirmation_demande.html",
        )

        return Response(
            {"id": demande.id, "message": "Votre demande a bien ete envoyee."},
            status=status.HTTP_201_CREATED,
        )