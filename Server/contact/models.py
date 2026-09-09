from django.db import models


class MessageContact(models.Model):
    """Formulaire de contact simple (page Contact)."""

    nom = models.CharField(max_length=150)
    email = models.EmailField()
    sujet = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)

    class Meta:
        ordering = ["-date_envoi"]
        verbose_name = "Message de contact"

    def __str__(self):
        return f"{self.nom} - {self.date_envoi:%d/%m/%Y}"


class MotifDemande(models.TextChoices):
    ORIENTATION = "orientation", "Demande d'orientation"
    DEVIS = "devis", "Demande de devis"
    DOSSIER = "dossier", "Envoi de dossier medical"
    ACCOMPAGNEMENT = "accompagnement", "Etre accompagne au Maroc"
    AUTRE = "autre", "Autre"


class StatutDemande(models.TextChoices):
    NOUVELLE = "nouvelle", "Nouvelle"
    EN_ETUDE = "en_etude", "En etude"
    ORIENTEE = "orientee", "Orientee"
    CLOTUREE = "cloturee", "Cloturee"


class DemandeQualification(models.Model):
    """
    Formulaire de qualification / demande — section 8 du cahier des charges.
    Reprend l'ensemble des champs demandes pour permettre a l'equipe de
    qualifier la demande (orientation, devis, envoi de dossier medical).
    """

    # Identite / contact
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    pays_residence = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=30, verbose_name="Numero WhatsApp / telephone")
    email = models.EmailField()

    # Demande
    motif = models.CharField(max_length=20, choices=MotifDemande.choices)
    description_probleme = models.TextField(verbose_name="Probleme medical / description libre")
    specialite_recherchee = models.CharField(max_length=150, blank=True)

    # Voyage
    budget_indicatif = models.CharField(max_length=100, blank=True)
    periode_souhaitee = models.CharField(max_length=150, blank=True)
    nombre_accompagnants = models.PositiveSmallIntegerField(default=0)
    message_complementaire = models.TextField(blank=True)

    # Consentement (section 8 : case obligatoire)
    consentement_traitement_donnees = models.BooleanField(default=False)

    # Suivi interne
    statut = models.CharField(max_length=20, choices=StatutDemande.choices, default=StatutDemande.NOUVELLE)
    date_creation = models.DateTimeField(auto_now_add=True)
    notes_internes = models.TextField(blank=True)

    class Meta:
        ordering = ["-date_creation"]
        verbose_name = "Demande de qualification"

    def __str__(self):
        return f"{self.prenom} {self.nom} - {self.get_motif_display()}"


class PieceJointeDemande(models.Model):
    """
    Documents medicaux/identite joints a une demande :
    compte-rendu, passeport, IRM, radios, analyses, ordonnances, autres.
    """

    demande = models.ForeignKey(DemandeQualification, related_name="pieces_jointes", on_delete=models.CASCADE)
    fichier = models.FileField(upload_to="dossiers_medicaux/%Y/%m/")
    libelle = models.CharField(max_length=150, blank=True, help_text="ex: Compte-rendu, Passeport, IRM...")
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.libelle or self.fichier.name
