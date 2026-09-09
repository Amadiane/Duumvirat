from django.contrib.sitemaps import Sitemap
from contenu.models import PageStatique


class PageStatiqueSitemap(Sitemap):
    """
    Sitemap dynamique. Les pages listees dans l'arborescence (section 15 du
    cahier des charges) sont ajoutees ici avec leur URL frontend (React/Vercel).
    """
    changefreq = "monthly"
    priority = 0.7

    PAGES_FIXES = [
        "", "nos-services", "comment-ca-marche", "preparer-son-dossier",
        "comprendre-le-devis", "7-verifications", "a-propos", "faq", "contact",
        "mentions-legales",
    ]

    def items(self):
        return self.PAGES_FIXES

    def location(self, item):
        return f"/{item}" if item else "/"
