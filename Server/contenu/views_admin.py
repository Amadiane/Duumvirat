from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import (
    Service, EtapeParcours, DocumentDossier, PointDevis,
    Verification, Faq, Clinique, PageStatique,
)
from .serializers_admin import (
    AdminServiceSerializer, AdminEtapeParcoursSerializer, AdminDocumentDossierSerializer,
    AdminPointDevisSerializer, AdminVerificationSerializer, AdminFaqSerializer,
    AdminCliniqueSerializer, AdminPageStatiqueSerializer,
)


class EstMembreEquipe(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class ViewSetAdminBase(viewsets.ModelViewSet):
    permission_classes = [EstMembreEquipe]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminServiceViewSet(ViewSetAdminBase):
    queryset = Service.objects.all()
    serializer_class = AdminServiceSerializer


class AdminEtapeParcoursViewSet(ViewSetAdminBase):
    queryset = EtapeParcours.objects.all()
    serializer_class = AdminEtapeParcoursSerializer


class AdminDocumentDossierViewSet(ViewSetAdminBase):
    queryset = DocumentDossier.objects.all()
    serializer_class = AdminDocumentDossierSerializer


class AdminPointDevisViewSet(ViewSetAdminBase):
    queryset = PointDevis.objects.all()
    serializer_class = AdminPointDevisSerializer


class AdminVerificationViewSet(ViewSetAdminBase):
    queryset = Verification.objects.all()
    serializer_class = AdminVerificationSerializer


class AdminFaqViewSet(ViewSetAdminBase):
    queryset = Faq.objects.all()
    serializer_class = AdminFaqSerializer


class AdminCliniqueViewSet(ViewSetAdminBase):
    queryset = Clinique.objects.all()
    serializer_class = AdminCliniqueSerializer


class AdminPageStatiqueViewSet(ViewSetAdminBase):
    queryset = PageStatique.objects.all()
    serializer_class = AdminPageStatiqueSerializer
    lookup_field = "cle"