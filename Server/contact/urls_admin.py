from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views_admin import AdminMessageContactViewSet, AdminDemandeQualificationViewSet
from .views_dashboard import TableauDeBordVue

router = DefaultRouter()
router.register("messages", AdminMessageContactViewSet, basename="admin-message")
router.register("demandes", AdminDemandeQualificationViewSet, basename="admin-demande")

urlpatterns = [
    path("tableau-de-bord/", TableauDeBordVue.as_view(), name="tableau-de-bord"),
    path("", include(router.urls)),
]