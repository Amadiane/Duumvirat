import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import CarteService from "../../components/publics/CarteService";
import Chronologie from "../../components/publics/Chronologie";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
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
            <img
              src="/image-claire.png"
              alt=""
              className={styles.heroPhotoClaire}
            />
            <img
              src="/image-sombre.png"
              alt=""
              className={styles.heroPhotoSombre}
            />
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