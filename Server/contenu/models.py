from django.db import models


class ContenuBilingueMixin(models.Model):
    """Mixin abstrait : tout contenu éditorial existe en FR (obligatoire) et EN (optionnel)."""

    class Meta:
        abstract = True

    def valeur(self, champ, langue="fr"):
        """Renvoie la valeur EN si elle existe et que langue == 'en', sinon la valeur FR."""
        champ_en = getattr(self, f"{champ}_en", "")
        if langue == "en" and champ_en:
            return champ_en
        return getattr(self, f"{champ}_fr")


class MetaSEOMixin(models.Model):
    meta_titre_fr = models.CharField(max_length=70, blank=True)
    meta_titre_en = models.CharField(max_length=70, blank=True)
    meta_description_fr = models.CharField(max_length=160, blank=True)
    meta_description_en = models.CharField(max_length=160, blank=True)
    image_partage = models.ImageField(upload_to="og/", blank=True, null=True,
                                       help_text="Image affichée lors du partage sur les réseaux")

    class Meta:
        abstract = True


class Service(ContenuBilingueMixin):
    """Les 4 services d'accompagnement (section 3 du cahier des charges)."""

    ordre = models.PositiveSmallIntegerField(default=0)
    icone = models.CharField(max_length=50, blank=True, help_text="Nom d'icône (lucide-react)")
    titre_fr = models.CharField(max_length=150)
    titre_en = models.CharField(max_length=150, blank=True)
    description_fr = models.TextField()
    description_en = models.TextField(blank=True)

    class Meta:
        ordering = ["ordre"]

    def __str__(self):
        return self.titre_fr


class EtapeParcours(ContenuBilingueMixin):
    """Les 10 étapes du parcours patient (section 4)."""

    numero = models.PositiveSmallIntegerField()
    titre_fr = models.CharField(max_length=200)
    titre_en = models.CharField(max_length=200, blank=True)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    class Meta:
        ordering = ["numero"]

    def __str__(self):
        return f"{self.numero}. {self.titre_fr}"


class TypeDocument(models.TextChoices):
    ESSENTIEL = "essentiel", "Document essentiel"
    COMPLEMENTAIRE = "complementaire", "Document complémentaire"


class DocumentDossier(ContenuBilingueMixin):
    """Documents à préparer (section 5)."""

    type_document = models.CharField(max_length=20, choices=TypeDocument.choices,
                                       default=TypeDocument.ESSENTIEL)
    ordre = models.PositiveSmallIntegerField(default=0)
    titre_fr = models.CharField(max_length=150)
    titre_en = models.CharField(max_length=150, blank=True)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    class Meta:
        ordering = ["type_document", "ordre"]

    def __str__(self):
        return self.titre_fr


class PointDevis(ContenuBilingueMixin):
    """Points clés pour comprendre le devis médical (section 6)."""

    ordre = models.PositiveSmallIntegerField(default=0)
    contenu_fr = models.TextField()
    contenu_en = models.TextField(blank=True)

    class Meta:
        ordering = ["ordre"]

    def __str__(self):
        return self.contenu_fr[:60]


class Verification(ContenuBilingueMixin):
    """Les 7 vérifications avant de voyager (section 7)."""

    numero = models.PositiveSmallIntegerField()
    titre_fr = models.CharField(max_length=150)
    titre_en = models.CharField(max_length=150, blank=True)
    description_fr = models.TextField()
    description_en = models.TextField(blank=True)

    class Meta:
        ordering = ["numero"]

    def __str__(self):
        return f"{self.numero}. {self.titre_fr}"


class Faq(ContenuBilingueMixin):
    """Foire aux questions (section 12)."""

    ordre = models.PositiveSmallIntegerField(default=0)
    question_fr = models.CharField(max_length=255)
    question_en = models.CharField(max_length=255, blank=True)
    reponse_fr = models.TextField()
    reponse_en = models.TextField(blank=True)
    publie = models.BooleanField(default=True)

    class Meta:
        ordering = ["ordre"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQ"

    def __str__(self):
        return self.question_fr


class Clinique(ContenuBilingueMixin):
    """
    Cliniques partenaires (section 11).
    Règle impérative du cahier des charges : ne publier une clinique que si
    la collaboration et les informations opérationnelles ont été confirmées.
    """

    nom = models.CharField(max_length=200)
    ville = models.CharField(max_length=100)
    specialites_fr = models.TextField(help_text="Spécialités / prises en charge confirmées")
    specialites_en = models.TextField(blank=True)
    interlocuteur = models.CharField(max_length=150, blank=True)
    coordonnees = models.CharField(max_length=255, blank=True)
    canal_transmission = models.CharField(max_length=255, blank=True)
    documents_requis_fr = models.TextField(blank=True)
    documents_requis_en = models.TextField(blank=True)
    processus_etude_fr = models.TextField(blank=True)
    processus_etude_en = models.TextField(blank=True)
    delai_devis_indicatif = models.CharField(max_length=150, blank=True)
    modalites_suivi_fr = models.TextField(blank=True)
    modalites_suivi_en = models.TextField(blank=True)
    conditions_financieres = models.TextField(
        blank=True, help_text="Conditions/commission lorsqu'elles sont formalisées (usage interne)"
    )
    collaboration_confirmee = models.BooleanField(
        default=False,
        help_text="Doit être cochée pour que la clinique apparaisse publiquement sur le site."
    )
    logo = models.ImageField(upload_to="cliniques/", blank=True, null=True)

    class Meta:
        ordering = ["ville", "nom"]
        verbose_name = "Clinique partenaire"

    def __str__(self):
        return f"{self.nom} ({self.ville})"


class PageStatique(ContenuBilingueMixin, MetaSEOMixin):
    """
    Textes éditables des pages qui ne sont pas listés (Accueil, À propos, etc.)
    — permet une modification simple des textes sans redéploiement.
    """

    cle = models.SlugField(unique=True, help_text="ex: accueil, a-propos, mentions-legales")
    titre_fr = models.CharField(max_length=200)
    titre_en = models.CharField(max_length=200, blank=True)
    contenu_fr = models.TextField(blank=True)
    contenu_en = models.TextField(blank=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Page (texte éditable)"

    def __str__(self):
        return self.cle
