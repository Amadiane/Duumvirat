from django.core.management.base import BaseCommand
from contenu.models import (
    Service, EtapeParcours, DocumentDossier, PointDevis, Verification,
    Faq, PageStatique, TypeDocument,
)


class Command(BaseCommand):
    help = "Peuple le contenu editorial du site avec les textes reels du cahier des charges Duumvirat Business."

    def handle(self, *args, **options):
        self.seed_services()
        self.seed_parcours()
        self.seed_documents()
        self.seed_devis()
        self.seed_verifications()
        self.seed_faq()
        self.seed_pages()
        self.stdout.write(self.style.SUCCESS("Contenu Duumvirat Business initialise."))

    def seed_services(self):
        donnees = [
            (1, "briefcase-medical", "Étude du dossier du patient",
             "Analyse des informations et documents médicaux transmis pour comprendre le besoin."),
            (2, "map-pin", "Orientation vers la bonne clinique",
             "Recherche d'une structure adaptée à la pathologie et au budget, selon les informations disponibles et les possibilités confirmées."),
            (3, "calendar-check", "Organisation du séjour",
             "Organisation du programme, de l'hébergement et du transport."),
            (4, "hand-heart", "Accompagnement quotidien",
             "Accompagnement du patient pendant son séjour au Maroc."),
        ]
        for ordre, icone, titre, description in donnees:
            Service.objects.update_or_create(
                titre_fr=titre,
                defaults={"ordre": ordre, "icone": icone, "description_fr": description},
            )

    def seed_parcours(self):
        etapes = [
            (1, "Prise de contact avec Duumvirat Business", ""),
            (2, "Transmission des informations et documents", ""),
            (3, "Étude du dossier", ""),
            (4, "Orientation vers une structure adaptée", ""),
            (5, "Transmission du dossier à la structure concernée",
             "Pour étude et devis, lorsque nécessaire."),
            (6, "Présentation au patient des informations disponibles", ""),
            (7, "Décision du patient de poursuivre ou non", ""),
            (8, "Organisation du séjour si le patient poursuit", ""),
            (9, "Accompagnement pendant le séjour", ""),
            (10, "Suivi après le retour",
             "Selon les besoins et les possibilités d'organisation."),
        ]
        for numero, titre, description in etapes:
            EtapeParcours.objects.update_or_create(
                numero=numero, defaults={"titre_fr": titre, "description_fr": description}
            )

    def seed_documents(self):
        essentiels = [
            (1, "Compte-rendu médical récent",
             "Permet de comprendre la situation du patient : antécédents, symptômes, examens déjà réalisés, "
             "traitements effectués, médicaments consommés et conclusions du médecin référent."),
            (2, "Passeport valide",
             "Permet de confirmer l'identité exacte du patient et doit être valide."),
        ]
        complementaires = [
            (1, "IRM", ""),
            (2, "Radiographies", ""),
            (3, "Ordonnances", ""),
            (4, "Résultats d'analyses", ""),
            (5, "Autres documents médicaux disponibles", ""),
        ]
        for ordre, titre, description in essentiels:
            DocumentDossier.objects.update_or_create(
                titre_fr=titre,
                defaults={"type_document": TypeDocument.ESSENTIEL, "ordre": ordre, "description_fr": description},
            )
        for ordre, titre, description in complementaires:
            DocumentDossier.objects.update_or_create(
                titre_fr=titre,
                defaults={"type_document": TypeDocument.COMPLEMENTAIRE, "ordre": ordre, "description_fr": description},
            )

    def seed_devis(self):
        points = [
            "Le devis doit être adapté au cas du patient sur la base des informations disponibles.",
            "Un dossier incomplet peut empêcher ou limiter l'établissement d'un devis fiable.",
            "Le coût final peut évoluer si de nouveaux éléments médicaux ou de nouvelles prestations apparaissent.",
            "Le devis constitue une référence pour aider le patient à se situer et à préparer son budget.",
            "Il faut regarder les prestations incluses et pas uniquement le montant final.",
        ]
        for ordre, contenu in enumerate(points, start=1):
            PointDevis.objects.update_or_create(ordre=ordre, defaults={"contenu_fr": contenu})

    def seed_verifications(self):
        verifications = [
            (1, "Clinique",
             "Spécialité nécessaire, capacité de prise en charge, plateau technique, équipements, "
             "hospitalisation éventuelle et adéquation avec le budget."),
            (2, "Interlocuteur",
             "Personne ou service responsable du dossier, de l'orientation, du devis et du suivi."),
            (3, "Devis",
             "Prestations prévues, éléments inclus ou non, estimation du coût et éventuelles limites."),
            (4, "Services inclus",
             "Distinguer les frais médicaux des services d'accompagnement, de l'hébergement et du transport."),
            (5, "Budget logistique",
             "Voyage, hébergement, alimentation, déplacements, accompagnement et réserve pour les imprévus."),
            (6, "Calendrier",
             "Principales étapes du séjour, durée prévisionnelle et marge pour les imprévus."),
            (7, "Preuves et conditions avant paiement",
             "Savoir ce qui est payé, à qui, combien, pourquoi, dans quelles conditions, et conserver les justificatifs."),
        ]
        for numero, titre, description in verifications:
            Verification.objects.update_or_create(
                numero=numero, defaults={"titre_fr": titre, "description_fr": description}
            )

    def seed_faq(self):
        questions = [
            ("Est-ce que mon cas peut être traité au Maroc ?",
             "Cela dépend de votre dossier médical. Transmettez-nous un compte-rendu médical récent afin que "
             "notre équipe puisse étudier votre situation et vous orienter vers une structure adaptée, selon "
             "les possibilités confirmées."),
            ("Combien coûtent le visa et le billet d'avion ?",
             "Ces coûts varient selon votre pays de résidence et la période du voyage. Ils font partie du "
             "budget logistique à prévoir en complément des frais médicaux ; parlez-en avec notre équipe pour "
             "une estimation adaptée à votre situation."),
            ("Puis-je faire certains examens dans mon pays avant de venir ?",
             "Oui, dans de nombreux cas cela permet de préparer un dossier plus complet. Transmettez-nous les "
             "résultats disponibles (IRM, radiographies, analyses) afin de faciliter l'étude de votre dossier."),
            ("Est-ce que mon budget est suffisant pour mon projet ?",
             "Cela dépend des prestations nécessaires. Le devis médical vous donnera une estimation des coûts, "
             "à laquelle il faut ajouter le budget logistique (voyage, hébergement, accompagnement). Nous vous "
             "aidons à y voir clair avant de vous engager."),
        ]
        for ordre, (question, reponse) in enumerate(questions, start=1):
            Faq.objects.update_or_create(
                question_fr=question, defaults={"ordre": ordre, "reponse_fr": reponse}
            )

    def seed_pages(self):
        pages = [
            ("accueil", "Duumvirat Business — Votre parcours médical au Maroc, accompagné",
             "Duumvirat Business accompagne les patients d'Afrique subsaharienne avant, durant et après leur "
             "séjour médical au Maroc.",
             "Duumvirat Business — Accompagnement médical au Maroc",
             "Étude de dossier, orientation vers la bonne clinique, organisation du séjour et accompagnement "
             "quotidien au Maroc pour les patients d'Afrique subsaharienne."),
            ("a-propos", "À propos de Duumvirat Business",
             "Duumvirat Business est une entreprise créée officiellement en août 2026, à partir d'une "
             "initiative prise depuis janvier 2025. Son siège est à Rabat et son activité couvre actuellement "
             "Rabat et Casablanca. Sa mission est d'accompagner les patients venant d'Afrique subsaharienne "
             "avant, durant et après leur séjour au Maroc.\n\n"
             "Mon nom est MARO Nuxi, ingénieur agronome formé au Maroc, entrepreneur ayant développé plusieurs "
             "activités, aujourd'hui promoteur de Duumvirat Business, service d'accompagnement de patients "
             "étrangers vers des structures de soins au Maroc.",
             "À propos — Duumvirat Business",
             "Notre mission : accompagner les patients d'Afrique subsaharienne avant, durant et après leur "
             "séjour médical au Maroc."),
            ("mentions-legales", "Mentions légales et confidentialité",
             "Politique de confidentialité et informations juridiques à finaliser.",
             "Mentions légales — Duumvirat Business", ""),
        ]
        for cle, titre, contenu, meta_titre, meta_description in pages:
            PageStatique.objects.update_or_create(
                cle=cle,
                defaults={
                    "titre_fr": titre, "contenu_fr": contenu,
                    "meta_titre_fr": meta_titre, "meta_description_fr": meta_description,
                },
            )
