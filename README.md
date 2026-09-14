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

## Reste à faire avant mise en ligne définitive

### ✅ Déjà fait
- [x] Logo réel intégré (header, footer, favicon)
- [x] Numéro WhatsApp réel renseigné (`VITE_WHATSAPP_NUMERO`)
- [x] Zone admin complète (CRUD sur tout le contenu, tableau de bord, gestion
      des messages et demandes)
- [x] Backend déployé sur Render, frontend déployé sur Vercel
- [x] Formulaire de contact : spécialités en menu déroulant multi-choix avec
      champ libre si "Autre", numéro WhatsApp filtré (chiffres uniquement),
      nombre d'accompagnants verrouillé à 0 ou plus
- [x] Page "Nos services" détaillée (4 blocs Préparer / Orienter / Organiser
      / Accompagner, contenu fourni par le client)
- [x] Page "À propos" avec les deux promoteurs (MARO Nuxi et Lassina KANÉ)

### 🖼️ Visuels — priorité discutée le {date à compléter}, à ajouter dès que les photos sont fournies
- [ ] **Photos du fondateur et de l'associé** sur la page "À propos" (priorité
      la plus importante identifiée — aucun visage humain sur le site
      actuellement, alors que la confiance est centrale pour ce service)
- [ ] **Image forte sur la page d'accueil**, en remplacement ou en complément
      du dessin SVG abstrait actuel (ligne Afrique → Maroc)
- [ ] **Logos des cliniques partenaires** dès qu'une collaboration est
      confirmée — le champ `logo` existe déjà dans le modèle `Clinique` et
      dans l'admin, il suffit de l'uploader

### 🔧 Technique / contenu
- [ ] Compléter les traductions anglaises du contenu dynamique via l'admin
      (les champs `_en` existent déjà partout, actuellement vides)
- [ ] Finaliser le texte définitif des mentions légales / politique de
      confidentialité (actuellement un texte provisoire)
- [ ] Configurer un vrai envoi d'e-mail (SMTP) en production sur Render
- [ ] Décider si on développe la vérification WhatsApp par code (OTP) —
      nécessite un service tiers payant (Twilio / WhatsApp Business API),
      mis en attente pour l'instant au profit du filtrage de format déjà en place
- [ ] Vérifier que `VITE_API_BASE_URL` sur Vercel pointe bien vers le backend
      Render avec `/api` à la fin, et que `CORS_ALLOWED_ORIGINS` sur Render
      contient l'URL Vercel exacte (sans slash final) — point de blocage
      rencontré au dernier déploiement, à reconfirmer
- [ ] Renseigner les cliniques partenaires une fois leur collaboration
      confirmée opérationnellement

## Déploiement

**Backend (Render)** — Web Service Python, répertoire racine `Server`, build
command `./build.sh`, start command `gunicorn Server.wsgi`. Variables
d'environnement : voir `Server/.env.example` (`SECRET_KEY`, `DEBUG=False`,
`ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `EMAIL_*`,
`CLOUDINARY_*` si utilisé, `ADMIN_USERNAME`/`ADMIN_EMAIL`/`ADMIN_PASSWORD`
pour la création automatique du compte admin au déploiement).

**Frontend (Vercel)** — Static Site, dossier `Client`, build command
`npm run build`, output `dist`. Variable d'environnement :
`VITE_API_BASE_URL` pointant vers l'URL du backend Render.