from datetime import timedelta

from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MessageContact, DemandeQualification, StatutDemande, MotifDemande
from contenu.models import Service, EtapeParcours, DocumentDossier, PointDevis, Verification, Faq, Clinique, PageStatique


class EstMembreEquipe(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_staff


class TableauDeBordVue(APIView):
    """
    Vue d'ensemble agregee de l'activite du site : une seule requete pour
    alimenter tout le tableau de bord admin, plutot que d'enchainer les
    appels endpoint par endpoint.
    """
    permission_classes = [EstMembreEquipe]

    def get(self, request):
        demandes = DemandeQualification.objects.all()
        messages = MessageContact.objects.all()

        # Repartition des demandes par statut (toutes, meme anciennes)
        par_statut = {s.value: 0 for s in StatutDemande}
        for ligne in demandes.values("statut").annotate(total=Count("id")):
            par_statut[ligne["statut"]] = ligne["total"]

        # Repartition par motif
        par_motif = {m.value: 0 for m in MotifDemande}
        for ligne in demandes.values("motif").annotate(total=Count("id")):
            par_motif[ligne["motif"]] = ligne["total"]

        # Activite des 7 derniers jours (nombre de demandes recues par jour)
        debut = timezone.now() - timedelta(days=6)
        par_jour_qs = (
            demandes.filter(date_creation__gte=debut.date())
            .annotate(jour=TruncDate("date_creation"))
            .values("jour")
            .annotate(total=Count("id"))
        )
        compte_par_jour = {ligne["jour"].isoformat(): ligne["total"] for ligne in par_jour_qs}
        activite_7_jours = []
        for i in range(6, -1, -1):
            jour = (timezone.now() - timedelta(days=i)).date()
            activite_7_jours.append({"jour": jour.isoformat(), "total": compte_par_jour.get(jour.isoformat(), 0)})

        dernieres_demandes = [
            {
                "id": d.id,
                "nom_complet": f"{d.prenom} {d.nom}",
                "motif": d.motif,
                "motif_libelle": d.get_motif_display(),
                "statut": d.statut,
                "date_creation": d.date_creation,
            }
            for d in demandes.order_by("-date_creation")[:6]
        ]

        derniers_messages = [
            {"id": m.id, "nom": m.nom, "sujet": m.sujet, "lu": m.lu, "date_envoi": m.date_envoi}
            for m in messages.order_by("-date_envoi")[:6]
        ]

        return Response({
            "demandes": {
                "total": demandes.count(),
                "nouvelles": par_statut.get("nouvelle", 0),
                "par_statut": par_statut,
                "par_motif": par_motif,
                "activite_7_jours": activite_7_jours,
                "dernieres": dernieres_demandes,
            },
            "messages": {
                "total": messages.count(),
                "non_lus": messages.filter(lu=False).count(),
                "derniers": derniers_messages,
            },
            "contenu": {
                "services": Service.objects.count(),
                "etapes_parcours": EtapeParcours.objects.count(),
                "documents_dossier": DocumentDossier.objects.count(),
                "points_devis": PointDevis.objects.count(),
                "verifications": Verification.objects.count(),
                "faq_total": Faq.objects.count(),
                "faq_publiees": Faq.objects.filter(publie=True).count(),
                "cliniques_total": Clinique.objects.count(),
                "cliniques_confirmees": Clinique.objects.filter(collaboration_confirmee=True).count(),
                "pages": PageStatique.objects.count(),
            },
        })