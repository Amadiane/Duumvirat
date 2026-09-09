from rest_framework import serializers
from .models import (
    Service, EtapeParcours, DocumentDossier, PointDevis,
    Verification, Faq, Clinique, PageStatique,
)


class AdminServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class AdminEtapeParcoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapeParcours
        fields = "__all__"


class AdminDocumentDossierSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentDossier
        fields = "__all__"


class AdminPointDevisSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointDevis
        fields = "__all__"


class AdminVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = "__all__"


class AdminFaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = "__all__"


class AdminCliniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinique
        fields = "__all__"


class AdminPageStatiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageStatique
        fields = "__all__"