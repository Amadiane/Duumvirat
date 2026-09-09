# Duumvirat Business — Site web

Site web bilingue (FR/EN) pour Duumvirat Business, service d'accompagnement de
patients d'Afrique subsaharienne vers des structures de soins au Maroc.

Stack : Django + DRF (backend) / React + Vite (frontend), conforme au template
de démarrage fourni.

## Structure

Deux grands dossiers à la racine : `Server` (backend) et `Client` (frontend).
Chaque app Django est autonome, aucune n'englobe les autres.

```
duumvirat-business/
├── Server/
│   ├── manage.py
│   ├── requirements.txt
│   ├── build.sh              # script de déploiement Render
│   ├── .env.example
│   ├── Server/                # settings.py, urls.py, wsgi.py, asgi.py
│   ├── contenu/                # Services, parcours, documents, devis, vérifications, FAQ, cliniques
│   ├── contact/                 # formulaire de contact + demande de qualification (avec pièces jointes)
│   └── seo/                     # sitemap.xml, robots.txt
└── Client/                   # application React (Vite)
```

## Démarrer le backend en local

```bash
cd duumvirat-business/Server
python3 -m venv venv
source venv/bin/activate          # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # puis ajuster si besoin
python manage.py migrate
python manage.py seed_contenu     # charge le contenu réel du cahier des charges (FR)
python manage.py createsuperuser  # pour accéder à /admin/
python manage.py runserver
```

Le backend tourne sur `http://127.0.0.1:8000`. L'admin Django
(`http://127.0.0.1:8000/admin/`) permet de modifier tous les textes du site
(services, FAQ, parcours, etc.) et de gérer les demandes reçues — c'est
l'« interface simple pour modifier les textes et la FAQ » demandée dans le
cahier des charges.

**Important** : les cliniques partenaires n'apparaissent sur le site que si
la case *« Collaboration confirmée »* est cochée dans l'admin — c'est la règle
impérative du cahier des charges (section 11).

## Démarrer le frontend en local

```bash
cd duumvirat-business/Client
npm install
cp .env.example .env.local        # VITE_API_BASE_URL doit pointer vers le backend
npm run dev
```

Le site est disponible sur `http://localhost:5173`.

## Contenu déjà en place

Toutes les pages de l'arborescence (section 15 du cahier des charges) sont
construites et connectées à l'API :

- Accueil, Nos services, Comment ça marche, Préparer son dossier,
  Comprendre le devis, 7 vérifications, À propos, FAQ, Contact, Mentions
  légales, page 404.
- Le formulaire de contact (`/contact`) reprend exactement les champs de la
  section 8 (identité, motif, description, spécialité, budget, période,
  pièces jointes, consentement obligatoire) et envoie une notification
  e-mail à chaque nouvelle demande.
- Bouton WhatsApp flottant + dans l'en-tête, sélecteur de langue FR/EN, mode
  sombre/clair, bannière cookies, squelettes de chargement.

Le texte éditorial dynamique (services, étapes, documents, devis,
vérifications, FAQ) est actuellement rempli en **français** via la commande
`seed_contenu` — les champs `_en` existent déjà dans chaque modèle et peuvent
être complétés depuis l'admin dès que les traductions anglaises seront
prêtes ; le site utilisera alors automatiquement l'anglais quand la langue
EN est sélectionnée (repli sur le français sinon).

## Reste à faire avant mise en ligne

- [ ] Fournir le logo final (actuellement un monogramme texte "DB")
- [ ] Fournir/valider les couleurs et typographies définitives si vous
      souhaitez ajuster la direction visuelle proposée
- [ ] Compléter les traductions anglaises du contenu dynamique via l'admin
- [ ] Renseigner un numéro WhatsApp réel (`VITE_WHATSAPP_NUMERO`)
- [ ] Finaliser le texte des mentions légales / politique de confidentialité
- [ ] Configurer un vrai envoi d'e-mail (SMTP) en production
- [ ] Déployer le backend sur Render et le frontend sur Vercel (fichiers de
      déploiement déjà présents : `build.sh`, `Client/vercel.json`)
- [ ] Renseigner les cliniques partenaires une fois leur collaboration
      confirmée opérationnellement

## Déploiement

**Backend (Render)** — Web Service Python, répertoire racine `Server`, build
command `./build.sh`, start command `gunicorn Server.wsgi`. Variables
d'environnement : voir `Server/.env.example` (`SECRET_KEY`, `DEBUG=False`,
`ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `EMAIL_*`,
`CLOUDINARY_*` si utilisé).

**Frontend (Vercel)** — Static Site, dossier `Client`, build command
`npm run build`, output `dist`. Variable d'environnement :
`VITE_API_BASE_URL` pointant vers l'URL du backend Render.
