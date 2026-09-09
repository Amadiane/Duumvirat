from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/contenu/", include("contenu.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/admin/contenu/", include("contenu.urls_admin")),
    path("api/admin/contact/", include("contact.urls_admin")),
    path("api/auth/", include("comptes.urls")),
    path("", include("seo.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)