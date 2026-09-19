import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import CarteService from "../../components/publics/CarteService";
import Chronologie from "../../components/publics/Chronologie";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import CarrouselPhotos from "../../components/publics/CarrouselPhotos";
import photoAeroport from "../../assets/images/galerie/airport.jpg";
import photoChambre from "../../assets/images/galerie/chambre.jpg";
import photoSalleDeBain from "../../assets/images/galerie/salle_de_bain.jpg";
import photoAkdital from "../../assets/images/galerie/akdital.jpg";
import photoStructureModerne from "../../assets/images/galerie/structure_moderne.jpg";
import photoSanteGouv from "../../assets/images/galerie/sante_gouv.jpg";
import photoAccompagnement2 from "../../assets/images/galerie/accompagnement_2.jpg";
import styles from "./Accueil.module.css";

export default function Accueil() {
  const { t } = useTranslation();
  const services = useContenuListe(contenuService.services);
  const parcours = useContenuListe(contenuService.etapesParcours);
  const cliniques = useContenuListe(contenuService.cliniques);

  return (
    <>
      <Helmet>
        <title>{t("accueil.titre")} — Duumvirat Business</title>
        <meta name="description" content={t("accueil.sous_titre")} />
        <meta property="og:title" content={t("accueil.titre")} />
        <meta property="og:description" content={t("accueil.sous_titre")} />
      </Helmet>

      <section className={styles.hero}>
        <div className={`conteneur ${styles.heroGrille}`}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className={styles.eyebrow}>{t("accueil.eyebrow")}</p>
            <h1 className={styles.titre}>{t("accueil.titre")}</h1>
            <p className={styles.sousTitre}>{t("accueil.sous_titre")}</p>
            <div className={styles.actionsHero}>
              <Link to="/contact" className={styles.boutonPrincipal}>{t("cta.orientation")}</Link>
              <Link to="/comment-ca-marche" className={styles.boutonSecondaire}>{t("cta.en_savoir_plus")}</Link>
            </div>
            <p className={styles.reassurance}>{t("accueil.reassurance")}</p>
          </motion.div>

          <div className={styles.heroVisuel} aria-hidden="true">
            <svg viewBox="0 0 520 520" className={styles.svgAnime}>
              <defs>
                <radialGradient id="lueurMaroc" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--couleur-laiton)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--couleur-laiton)" stopOpacity="0" />
                </radialGradient>
                <clipPath id="rondEtablissement">
                  <circle cx="0" cy="0" r="62" />
                </clipPath>
              </defs>

              <path
                d="M180 90 C 120 95, 90 150, 95 220 C 100 290, 80 340, 110 400
                   C 140 455, 210 470, 260 440 C 300 415, 290 360, 320 330
                   C 350 300, 340 240, 310 200 C 285 165, 270 110, 220 92
                   C 208 88, 194 88, 180 90 Z"
                fill="var(--couleur-encre)" opacity="0.85"
              />

              <circle cx="175" cy="115" r="90" fill="url(#lueurMaroc)" />

              <g fill="none" stroke="var(--couleur-laiton)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5 7">
                <path d="M175 115 C 150 180, 140 230, 130 300" opacity="0.75" />
                <path d="M175 115 C 165 190, 175 260, 165 340" opacity="0.65" />
                <path d="M175 115 C 190 200, 210 270, 205 360" opacity="0.6" />
                <path d="M175 115 C 210 190, 250 240, 250 320" opacity="0.55" />
                <path d="M175 115 C 130 160, 100 190, 70 230" opacity="0.5" />
              </g>
              <g fill="none" stroke="var(--couleur-laiton)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5 7" className={styles.lignesAnimees}>
                <path d="M175 115 C 150 180, 140 230, 130 300" style={{ animationDelay: "0s" }} />
                <path d="M175 115 C 165 190, 175 260, 165 340" style={{ animationDelay: "0.15s" }} />
                <path d="M175 115 C 190 200, 210 270, 205 360" style={{ animationDelay: "0.3s" }} />
                <path d="M175 115 C 210 190, 250 240, 250 320" style={{ animationDelay: "0.45s" }} />
                <path d="M175 115 C 130 160, 100 190, 70 230" style={{ animationDelay: "0.6s" }} />
              </g>

              <circle cx="130" cy="300" r="4" fill="var(--couleur-laiton)" />
              <circle cx="165" cy="340" r="4" fill="var(--couleur-laiton)" />
              <circle cx="205" cy="360" r="4" fill="var(--couleur-laiton)" />
              <circle cx="250" cy="320" r="4" fill="var(--couleur-laiton)" />
              <circle cx="70" cy="230" r="4" fill="var(--couleur-laiton)" />

              <g transform="translate(175,115)">
                <circle r="10" fill="var(--couleur-fond-surface)" stroke="var(--couleur-laiton)" strokeWidth="2" />
                <path d="M0 -5 v10 M-5 0 h10" stroke="var(--couleur-argile)" strokeWidth="2.4" strokeLinecap="round" />
                <circle r="10" fill="none" stroke="var(--couleur-laiton)" strokeWidth="1.5" className={styles.pulsation} />
              </g>

              <path id="trajetAvion" d="M185 100 C 260 40, 340 45, 400 80" fill="none" stroke="var(--couleur-encre)" strokeWidth="1.4" strokeDasharray="4 6" opacity="0.5" />
              <path d="M0 0 L14 2 L24 -1 L26 1 L16 5 L14 12 L11 13 L10 6 L0 4 Z" fill="var(--couleur-encre)" transform="scale(1.1)">
                <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#trajetAvion" />
                </animateMotion>
              </path>

              <g transform="translate(415,78)">
                <circle r="66" fill="var(--couleur-fond)" stroke="var(--couleur-laiton)" strokeWidth="3" />
                <g clipPath="url(#rondEtablissement)">
                  <rect x="-62" y="-62" width="124" height="124" fill="var(--couleur-fond)" />
                  <rect x="-40" y="-10" width="80" height="52" fill="var(--couleur-fond-surface)" stroke="var(--couleur-bordure)" />
                  <rect x="-28" y="4" width="16" height="38" fill="var(--couleur-encre)" opacity="0.15" />
                  <rect x="12" y="4" width="16" height="38" fill="var(--couleur-encre)" opacity="0.15" />
                  <path d="M-8 -10 v-14 M-15 -17 h14" stroke="var(--couleur-argile)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M-45 12 q4 -20 0 -40" stroke="#1E6B45" strokeWidth="3" fill="none" opacity="0.5" />
                  <path d="M38 12 q-4 -20 0 -40" stroke="#1E6B45" strokeWidth="3" fill="none" opacity="0.5" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section className={`section ${styles.sectionServices}`}>
        <div className="conteneur">
          <h2 className={styles.titreSection}>{t("accueil.services_titre")}</h2>
          <div className={styles.grilleServices}>
            {services.chargement
              ? Array.from({ length: 4 }).map((_, i) => <SquelettteCarte key={i} lignes={2} />)
              : services.donnees.map((s, i) => (
                  <CarteService
                    key={s.id}
                    numero={i + 1}
                    titre={services.traduit(s, "titre")}
                    description={services.traduit(s, "description")}
                  />
                ))}
          </div>
          <Link to="/nos-services" className={styles.lienParcours}>
            {t("accueil.services_lien")} →
          </Link>
        </div>
      </section>

      <section className={`section ${styles.sectionParcours}`}>
        <div className="conteneur">
          <h2 className={styles.titreSection}>{t("accueil.parcours_titre")}</h2>
          {parcours.chargement ? (
            <SquelettteCarte lignes={5} />
          ) : (
            <Chronologie
              etapes={parcours.donnees.slice(0, 5).map((e) => ({
                numero: e.numero,
                titre: parcours.traduit(e, "titre"),
                description: parcours.traduit(e, "description"),
              }))}
            />
          )}
          <Link to="/comment-ca-marche" className={styles.lienParcours}>
            {t("accueil.parcours_lien")} →
          </Link>
        </div>
      </section>

      <section className={`section ${styles.sectionHistoire}`}>
        <div className="conteneur">
          <h2 className={styles.titreSection}>{t("accueil.histoire_titre")}</h2>
          <blockquote className={styles.citation}>
            Un patient venu pour un check-up avait contacté Duumvirat Business alors que son avion
            avait déjà décollé. L'équipe a dû organiser en urgence l'hébergement, le véhicule et
            l'accueil auprès de la clinique. À l'arrivée, un problème lié aux informations
            d'identité figurant sur le billet a retardé le patient à l'aéroport. Son état de santé
            affaibli a ensuite nécessité une hospitalisation imprévue et une réorganisation du
            logement et du budget.
          </blockquote>
          <p className={styles.lecon}>
            <strong>{t("accueil.histoire_lecon")} : </strong>
            préparer le dossier, vérifier les informations de voyage, anticiper le logement, le
            transport, le budget et le calendrier permet d'éviter une partie des difficultés
            organisationnelles.
          </p>
        </div>
      </section>

      <section className={`section ${styles.sectionGalerie}`}>
        <div className="conteneur">
          <h2 className={styles.titreSection}>Duumvirat Business en images</h2>
          <div className={styles.enveloppeGalerie}>
            <CarrouselPhotos
              photos={[
                { src: photoAeroport, alt: "Accueil d'un patient à l'aéroport", legende: "Accueil et accompagnement dès l'arrivée au Maroc" },
                { src: photoChambre, alt: "Chambre pour le séjour médical", legende: "Un cadre confortable pour le séjour" },
                { src: photoSalleDeBain, alt: "Salle de bain accessible", legende: "Des structures pensées pour le confort du patient" },
                { src: photoAkdital, alt: "Établissement de soins au Maroc", legende: "Des établissements de soins modernes au Maroc" },
                { src: photoStructureModerne, alt: "Structure moderne au Maroc", legende: "Des structures modernes et accueillantes" },
                { src: photoSanteGouv, alt: "Bâtiment lié au système de santé marocain", legende: "Un système de santé structuré au Maroc" },
                { src: photoAccompagnement2, alt: "Accompagnement d'un patient à l'aéroport", legende: "Un accompagnement humain, à chaque étape" },
              ]}
            />
          </div>
        </div>
      </section>

      {!cliniques.chargement && cliniques.donnees.length > 0 && (
        <section className={`section ${styles.sectionCliniques}`}>
          <div className="conteneur">
            <h2 className={styles.titreSection}>{t("accueil.cliniques_titre")}</h2>
            <div className={styles.grilleCliniques}>
              {cliniques.donnees.map((c) => (
                <div key={c.id} className={styles.carteClinique}>
                  <h3>{c.nom}</h3>
                  <p>{c.ville}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${styles.ctaFinale}`}>
        <div className={`conteneur ${styles.ctaFinaleContenu}`}>
          <h2 className={styles.titreCtaFinale}>{t("accueil.cta_finale_titre")}</h2>
          <p className={styles.texteCtaFinale}>{t("accueil.cta_finale_texte")}</p>
          <Link to="/contact" className={styles.boutonPrincipalInverse}>{t("cta.dossier")}</Link>
        </div>
      </section>
    </>
  );
}