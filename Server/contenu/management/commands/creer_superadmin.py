"""
Cree automatiquement un compte administrateur a partir de variables d'environnement,
si aucun n'existe encore. Concu pour tourner sans interaction dans build.sh sur Render
(le tier gratuit n'a pas d'acces shell pour lancer createsuperuser a la main).
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Cree un superutilisateur depuis ADMIN_USERNAME/ADMIN_EMAIL/ADMIN_PASSWORD si aucun n'existe."

    def handle(self, *args, **options):
        nom_utilisateur = os.environ.get("ADMIN_USERNAME")
        email = os.environ.get("ADMIN_EMAIL", "")
        mot_de_passe = os.environ.get("ADMIN_PASSWORD")

        if not nom_utilisateur or not mot_de_passe:
            self.stdout.write("ADMIN_USERNAME / ADMIN_PASSWORD non definis, aucune creation.")
            return

        if User.objects.filter(username=nom_utilisateur).exists():
            self.stdout.write(f"Le compte '{nom_utilisateur}' existe deja, rien a faire.")
            return

        User.objects.create_superuser(nom_utilisateur, email, mot_de_passe)
        self.stdout.write(self.style.SUCCESS(f"Superutilisateur '{nom_utilisateur}' cree."))