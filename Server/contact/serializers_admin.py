from rest_framework import serializers
from .models import MessageContact, DemandeQualification, PieceJointeDemande


class AdminMessageContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageContact
        fields = "__all__"
        read_only_fields = ["nom", "email", "sujet", "message", "date_envoi"]


class AdminPieceJointeDemandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieceJointeDemande
        fields = ["id", "fichier", "libelle", "date_ajout"]


class AdminDemandeQualificationSerializer(serializers.ModelSerializer):
    pieces_jointes = AdminPieceJointeDemandeSerializer(many=True, read_only=True)

    class Meta:
        model = DemandeQualification
        fields = "__all__"
        read_only_fields = [
            "nom", "prenom", "pays_residence", "whatsapp", "email", "motif",
            "description_probleme", "specialite_recherchee", "budget_indicatif",
            "periode_souhaitee", "nombre_accompagnants", "message_complementaire",
            "consentement_traitement_donnees", "date_creation",
        ]