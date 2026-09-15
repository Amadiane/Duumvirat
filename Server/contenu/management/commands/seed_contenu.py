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
        # Nettoyage des anciens intitules remplaces par les nouveaux (evite les doublons)
        DocumentDossier.objects.filter(titre_fr="Passeport valide").delete()
        essentiels = [
            (1, "Compte-rendu médical récent",
             "Permet de comprendre la situation du patient : antécédents, symptômes, examens déjà réalisés, "
             "traitements effectués, médicaments consommés et conclusions du médecin référent."),
            (2, "Passeport à jour",
             "Permet de confirmer l'identité exacte du patient et doit être valide."),
        ]
        complementaires = [
            (1, "Radiographies", ""),
            (2, "IRM", ""),
            (3, "Scanners", ""),
            (4, "Bilan sanguin", ""),
            (5, "Résultats d'analyses", ""),
            (6, "Ordonnances", ""),
            (7, "Autres documents médicaux disponibles", ""),
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
        # Nettoyage des anciennes questions remplacees par la nouvelle selection (evite les doublons)
        Faq.objects.filter(question_fr__in=[
            "Combien coûtent le visa et le billet d'avion ?",
            "Puis-je faire certains examens dans mon pays avant de venir ?",
            "Est-ce que mon budget est suffisant pour mon projet ?",
        ]).delete()
        questions = [
            ("Duumvirat Business, c'est quoi exactement ?",
             "Duumvirat Business accompagne principalement les patients subsahariens qui souhaitent venir au "
             "Maroc pour un projet de soins. Nous intervenons pour faciliter les différentes étapes du projet : "
             "étude du dossier, orientation vers une structure adaptée, demande de devis, organisation du "
             "séjour, hébergement, transport et accompagnement sur place."),
            ("Est-ce que mon cas peut être traité au Maroc ?",
             "Cela dépend de votre situation médicale. Pour vous répondre sérieusement, nous avons besoin de "
             "connaître votre problème et, idéalement, d'étudier votre dossier médical récent. Après étude, "
             "nous pouvons rechercher une orientation adaptée auprès d'une structure de soins."),
            ("Quels documents dois-je envoyer ?",
             "Pour commencer l'étude, il est préférable de nous transmettre un compte-rendu médical récent, "
             "une pièce d'identité (notamment un passeport valide), ainsi que tous les examens disponibles : "
             "IRM, scanner, radiographie, analyses, ordonnances, comptes-rendus d'hospitalisation, etc. Plus le "
             "dossier est complet et récent, plus il est facile de comprendre votre situation."),
            ("Pouvez-vous me fournir un devis avant mon arrivée ?",
             "Nous pouvons faciliter une demande d'estimation ou de devis auprès d'une structure de soins "
             "lorsque le dossier contient suffisamment d'informations. Le montant dépend notamment du problème "
             "médical, des examens nécessaires et de la prise en charge envisagée."),
            ("Le montant du devis est-il définitif ?",
             "Non, un devis médical est généralement une estimation basée sur les informations disponibles au "
             "moment de son établissement. Après l'arrivée du patient, de nouveaux examens ou éléments "
             "médicaux peuvent modifier l'orientation ou le coût de la prise en charge. Il est donc important "
             "de considérer le devis comme une base de préparation budgétaire, et non comme une garantie du "
             "coût final."),
            ("Pouvez-vous organiser mon logement et mon transport ?",
             "Oui. Dans le cadre de votre accompagnement, nous pouvons vous aider à rechercher et organiser un "
             "hébergement adapté à la durée et au programme de votre séjour, ainsi que les transferts et "
             "déplacements nécessaires (aéroport, logement, établissements de soins), selon vos besoins et la "
             "formule d'accompagnement retenue."),
            ("Combien faut-il prévoir pour mon séjour ?",
             "Il n'existe pas de tarif unique. Le budget dépend notamment de la pathologie, des examens "
             "nécessaires, du traitement ou de l'intervention envisagée, de la durée du séjour, de "
             "l'hébergement, du transport, du nombre de personnes et du niveau d'accompagnement souhaité. "
             "C'est pourquoi nous recommandons de faire étudier votre projet avant de réserver votre voyage."),
            ("Comment commencer ma démarche avec Duumvirat Business ?",
             "C'est simple : contactez-nous, présentez-nous votre problème médical, transmettez votre dossier "
             "médical ; nous étudions votre demande, recherchons une orientation adaptée et facilitons la "
             "demande d'estimation ou de devis lorsque cela est possible ; vous décidez ensuite si vous "
             "souhaitez poursuivre votre projet. Vous pouvez nous contacter directement sur WhatsApp pour "
             "commencer l'étude de votre projet."),
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