from django.apps import AppConfig


class ContenuConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "contenu"

    def ready(self):
        from auditlog.registry import auditlog
        from .models import Service, EtapeParcours, DocumentDossier, PointDevis, Verification, Faq, Clinique, PageStatique

        for modele in [Service, EtapeParcours, DocumentDossier, PointDevis, Verification, Faq, Clinique, PageStatique]:
            auditlog.register(modele)
