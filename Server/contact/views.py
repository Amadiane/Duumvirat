from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import PieceJointeDemande
from .serializers import MessageContactSerializer, DemandeQualificationSerializer


def notifier_par_email(sujet, contexte, template):
    corps = render_to_string(template, contexte)
    send_mail(
        subject=sujet,
        message=corps,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=settings.EMAIL_NOTIFICATION_DESTINATAIRES,
        fail_silently=True,
    )


class MessageContactCreateView(generics.CreateAPIView):
    serializer_class = MessageContactSerializer

    def perform_create(self, serializer):
        message = serializer.save()
        notifier_par_email(
            sujet=f"Nouveau message de contact - {message.nom}",
            contexte={"message": message},
            template="contact/email_nouveau_message.txt",
        )
        self.instance_creee = message


class DemandeQualificationCreateView(generics.CreateAPIView):
    serializer_class = DemandeQualificationSerializer
    parser_classes = [MultiPartParser, FormParser]

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

        return Response(
            {"id": demande.id, "message": "Votre demande a bien ete envoyee."},
            status=status.HTTP_201_CREATED,
        )