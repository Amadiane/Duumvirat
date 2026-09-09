from django.contrib import admin
from .models import (
    Service, EtapeParcours, DocumentDossier, PointDevis,
    Verification, Faq, Clinique, PageStatique,
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("titre_fr", "ordre")
    list_editable = ("ordre",)
    ordering = ("ordre",)


@admin.register(EtapeParcours)
class EtapeParcoursAdmin(admin.ModelAdmin):
    list_display = ("numero", "titre_fr")
    ordering = ("numero",)


@admin.register(DocumentDossier)
class DocumentDossierAdmin(admin.ModelAdmin):
    list_display = ("titre_fr", "type_document", "ordre")
    list_filter = ("type_document",)
    list_editable = ("ordre",)


@admin.register(PointDevis)
class PointDevisAdmin(admin.ModelAdmin):
    list_display = ("contenu_fr", "ordre")
    list_editable = ("ordre",)


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ("numero", "titre_fr")
    ordering = ("numero",)


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    list_display = ("question_fr", "publie", "ordre")
    list_editable = ("publie", "ordre")
    search_fields = ("question_fr", "reponse_fr")


@admin.register(Clinique)
class CliniqueAdmin(admin.ModelAdmin):
    list_display = ("nom", "ville", "collaboration_confirmee")
    list_filter = ("ville", "collaboration_confirmee")
    fieldsets = (
        ("Identite", {"fields": ("nom", "ville", "logo")}),
        ("Contenu public", {"fields": (
            "specialites_fr", "specialites_en", "documents_requis_fr",
            "documents_requis_en", "processus_etude_fr", "processus_etude_en",
            "delai_devis_indicatif",
        )}),
        ("Usage interne (non publie)", {"fields": (
            "interlocuteur", "coordonnees", "canal_transmission",
            "modalites_suivi_fr", "modalites_suivi_en", "conditions_financieres",
        )}),
        ("Publication", {"fields": ("collaboration_confirmee",),
                          "description": "Regle impérative : ne cocher qu'apres confirmation operationnelle de la clinique."}),
    )


@admin.register(PageStatique)
class PageStatiqueAdmin(admin.ModelAdmin):
    list_display = ("cle", "titre_fr", "date_modification")
    search_fields = ("cle", "titre_fr")
