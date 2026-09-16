from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import ScopedRateThrottle

from .models import PieceJointeDemande
from .serializers import MessageContactSerializer, DemandeQualificationSerializer


def notifier_par_email(sujet, contexte, template):
    """Envoie une notification a l'equipe a chaque nouvelle demande (fonctionnalite obligatoire du cahier des charges)."""
    corps = render_to_string(template, contexte)
    send_mail(
        subject=sujet,
        message=corps,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=settings.EMAIL_NOTIFICATION_DESTINATAIRES,
        fail_silently=True,
    )


def confirmer_par_email(destinataire, sujet, contexte, template_texte, template_html):
    """
    Envoie un accuse de reception au visiteur ayant rempli le formulaire, a son adresse.
    Version HTML habillee de la charte du site, avec repli en texte brut pour les
    clients mail qui n'affichent pas le HTML.
    """
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
        for index, fichier in enumerate(fichiers):
            libelle = libelles[index] if index < len(libelles) else ""
            PieceJointeDemande.objects.create(demande=demande, fichier=fichier, libelle=libelle)

        notifier_par_email(
            sujet=f"Nouvelle demande ({demande.get_motif_display()}) - {demande.prenom} {demande.nom}",
            contexte={"demande": demande, "nombre_pieces": len(fichiers)},
            template="contact/email_nouvelle_demande.txt",
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