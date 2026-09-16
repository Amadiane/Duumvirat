from rest_framework import serializers
from .models import MessageContact, DemandeQualification, PieceJointeDemande


class MessageContactSerializer(serializers.ModelSerializer):
    # Champ honeypot anti-spam : normalement rempli seulement par un robot.
    # Ne bloque plus la demande s'il est rempli (l'auto-remplissage du
    # navigateur peut parfois le declencher chez un vrai visiteur) : on se
    # contente de l'ignorer silencieusement. La limite de 15 envois/heure
    # (ScopedRateThrottle) reste la vraie protection anti-spam.
    reference_dossier = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = MessageContact
        fields = ["nom", "email", "sujet", "message", "reference_dossier"]

    def create(self, validated_data):
        validated_data.pop("reference_dossier", None)
        return MessageContact.objects.create(**validated_data)


class PieceJointeDemandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieceJointeDemande
        fields = ["id", "fichier", "libelle"]


class DemandeQualificationSerializer(serializers.ModelSerializer):
    reference_dossier = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = DemandeQualification
        fields = [
            "id", "nom", "prenom", "pays_residence", "whatsapp", "email",
            "motif", "description_probleme", "specialite_recherchee",
            "budget_indicatif", "periode_souhaitee", "nombre_accompagnants",
            "message_complementaire", "consentement_traitement_donnees",
            "date_creation", "reference_dossier",
        ]
        read_only_fields = ["id", "date_creation"]

    def validate_consentement_traitement_donnees(self, valeur):
        if not valeur:
            raise serializers.ValidationError(
                "Le consentement au traitement des informations est obligatoire."
            )
        return valeur

    def create(self, validated_data):
        validated_data.pop("reference_dossier", None)
        return DemandeQualification.objects.create(**validated_data)