from django.urls import path
from .views import MessageContactCreateView, DemandeQualificationCreateView

urlpatterns = [
    path("messages/", MessageContactCreateView.as_view(), name="message-contact-create"),
    path("demandes/", DemandeQualificationCreateView.as_view(), name="demande-qualification-create"),
]