from rest_framework import viewsets, permissions
from .models import MessageContact, DemandeQualification
from .serializers_admin import AdminMessageContactSerializer, AdminDemandeQualificationSerializer


class EstMembreEquipe(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AdminMessageContactViewSet(viewsets.ModelViewSet):
    permission_classes = [EstMembreEquipe]
    queryset = MessageContact.objects.all()
    serializer_class = AdminMessageContactSerializer
    http_method_names = ["get", "patch", "delete", "head", "options"]


class AdminDemandeQualificationViewSet(viewsets.ModelViewSet):
    permission_classes = [EstMembreEquipe]
    queryset = DemandeQualification.objects.all().prefetch_related("pieces_jointes")
    serializer_class = AdminDemandeQualificationSerializer
    http_method_names = ["get", "patch", "delete", "head", "options"]
    filterset_fields = ["statut", "motif"]