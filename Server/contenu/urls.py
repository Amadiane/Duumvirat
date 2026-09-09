from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    ServiceViewSet, EtapeParcoursViewSet, DocumentDossierViewSet,
    PointDevisViewSet, VerificationViewSet, FaqViewSet, CliniqueViewSet,
    PageStatiqueDetailView,
)

router = DefaultRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("etapes-parcours", EtapeParcoursViewSet, basename="etape-parcours")
router.register("documents-dossier", DocumentDossierViewSet, basename="document-dossier")
router.register("points-devis", PointDevisViewSet, basename="point-devis")
router.register("verifications", VerificationViewSet, basename="verification")
router.register("faq", FaqViewSet, basename="faq")
router.register("cliniques", CliniqueViewSet, basename="clinique")

urlpatterns = [
    path("pages/<slug:cle>/", PageStatiqueDetailView.as_view(), name="page-statique"),
    path("", include(router.urls)),
]