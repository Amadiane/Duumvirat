from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views_admin import AdminMessageContactViewSet, AdminDemandeQualificationViewSet

router = DefaultRouter()
router.register("messages", AdminMessageContactViewSet, basename="admin-message")
router.register("demandes", AdminDemandeQualificationViewSet, basename="admin-demande")

urlpatterns = [
    path("", include(router.urls)),
]