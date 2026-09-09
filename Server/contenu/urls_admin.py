from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views_admin import (
    AdminServiceViewSet, AdminEtapeParcoursViewSet, AdminDocumentDossierViewSet,
    AdminPointDevisViewSet, AdminVerificationViewSet, AdminFaqViewSet,
    AdminCliniqueViewSet, AdminPageStatiqueViewSet,
)

router = DefaultRouter()
router.register("services", AdminServiceViewSet, basename="admin-service")
router.register("etapes-parcours", AdminEtapeParcoursViewSet, basename="admin-etape-parcours")
router.register("documents-dossier", AdminDocumentDossierViewSet, basename="admin-document-dossier")
router.register("points-devis", AdminPointDevisViewSet, basename="admin-point-devis")
router.register("verifications", AdminVerificationViewSet, basename="admin-verification")
router.register("faq", AdminFaqViewSet, basename="admin-faq")
router.register("cliniques", AdminCliniqueViewSet, basename="admin-clinique")
router.register("pages", AdminPageStatiqueViewSet, basename="admin-page")

urlpatterns = [
    path("", include(router.urls)),
]