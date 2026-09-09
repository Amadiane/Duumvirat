from rest_framework import serializers
from .models import (
    Service, EtapeParcours, DocumentDossier, PointDevis,
    Verification, Faq, Clinique, PageStatique,
)


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "ordre", "icone", "titre_fr", "titre_en", "description_fr", "description_en"]


class EtapeParcoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapeParcours
        fields = ["id", "numero", "titre_fr", "titre_en", "description_fr", "description_en"]


class DocumentDossierSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentDossier
        fields = ["id", "type_document", "ordre", "titre_fr", "titre_en", "description_fr", "description_en"]


class PointDevisSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointDevis
        fields = ["id", "ordre", "contenu_fr", "contenu_en"]


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = ["id", "numero", "titre_fr", "titre_en", "description_fr", "description_en"]


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ["id", "ordre", "question_fr", "question_en", "reponse_fr", "reponse_en"]


class CliniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinique
        fields = [
            "id", "nom", "ville", "specialites_fr", "specialites_en",
            "interlocuteur", "canal_transmission", "documents_requis_fr",
            "documents_requis_en", "processus_etude_fr", "processus_etude_en",
            "delai_devis_indicatif", "logo",
        ]


class PageStatiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageStatique
        fields = [
            "cle", "titre_fr", "titre_en", "contenu_fr", "contenu_en",
            "meta_titre_fr", "meta_titre_en", "meta_description_fr",
            "meta_description_en", "image_partage",
        ]