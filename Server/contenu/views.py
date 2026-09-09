from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from .models import (
    Service, EtapeParcours, DocumentDossier, PointDevis,
    Verification, Faq, Clinique, PageStatique,
)
from .serializers import (
    ServiceSerializer, EtapeParcoursSerializer, DocumentDossierSerializer,
    PointDevisSerializer, VerificationSerializer, FaqSerializer,
    CliniqueSerializer, PageStatiqueSerializer,
)


class LectureSeuleMixin:
    http_method_names = ["get", "head", "options"]


class ServiceViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class EtapeParcoursViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = EtapeParcours.objects.all()
    serializer_class = EtapeParcoursSerializer


class DocumentDossierViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = DocumentDossier.objects.all()
    serializer_class = DocumentDossierSerializer
    filterset_fields = ["type_document"]


class PointDevisViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = PointDevis.objects.all()
    serializer_class = PointDevisSerializer


class VerificationViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Verification.objects.all()
    serializer_class = VerificationSerializer


class FaqViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Faq.objects.filter(publie=True)
    serializer_class = FaqSerializer


class CliniqueViewSet(LectureSeuleMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Clinique.objects.filter(collaboration_confirmee=True)
    serializer_class = CliniqueSerializer
    filterset_fields = ["ville"]


class PageStatiqueDetailView(RetrieveAPIView):
    queryset = PageStatique.objects.all()
    serializer_class = PageStatiqueSerializer
    lookup_field = "cle"