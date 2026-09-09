from django.contrib import admin
from .models import MessageContact, DemandeQualification, PieceJointeDemande


@admin.register(MessageContact)
class MessageContactAdmin(admin.ModelAdmin):
    list_display = ("nom", "email", "sujet", "date_envoi", "lu")
    list_filter = ("lu",)
    list_editable = ("lu",)
    readonly_fields = ("date_envoi",)


class PieceJointeInline(admin.TabularInline):
    model = PieceJointeDemande
    extra = 0
    readonly_fields = ("date_ajout",)


@admin.register(DemandeQualification)
class DemandeQualificationAdmin(admin.ModelAdmin):
    list_display = ("prenom", "nom", "motif", "pays_residence", "statut", "date_creation")
    list_filter = ("statut", "motif", "pays_residence")
    list_editable = ("statut",)
    search_fields = ("nom", "prenom", "email", "whatsapp")
    readonly_fields = ("date_creation",)
    inlines = [PieceJointeInline]
    fieldsets = (
        ("Contact", {"fields": ("nom", "prenom", "pays_residence", "whatsapp", "email")}),
        ("Demande", {"fields": ("motif", "description_probleme", "specialite_recherchee")}),
        ("Voyage", {"fields": ("budget_indicatif", "periode_souhaitee", "nombre_accompagnants", "message_complementaire")}),
        ("Consentement", {"fields": ("consentement_traitement_donnees",)}),
        ("Suivi interne", {"fields": ("statut", "notes_internes", "date_creation")}),
    )
