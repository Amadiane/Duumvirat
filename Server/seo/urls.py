from django.urls import path
from django.contrib.sitemaps.views import sitemap
from django.http import HttpResponse
from .sitemaps import PageStatiqueSitemap

sitemaps = {"pages": PageStatiqueSitemap}


def robots_txt(request):
    contenu = "\n".join([
        "User-agent: *",
        "Allow: /",
        "Sitemap: https://www.duumviratbusiness.com/sitemap.xml",
    ])
    return HttpResponse(contenu, content_type="text/plain")


urlpatterns = [
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
    path("robots.txt", robots_txt, name="robots"),
]
