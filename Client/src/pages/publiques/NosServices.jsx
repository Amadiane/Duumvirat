import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Compass, Plane, HeartHandshake, Check, ShieldAlert,
} from "lucide-react";
import EntetePage from "./EntetePage";
import styles from "./NosServices.module.css";
import stylesGeneriques from "./PageGenerique.module.css";

const CLES_BLOCS = [
  { cle: "preparer", icone: ClipboardList },
  { cle: "orienter", icone: Compass },
  { cle: "organiser", icone: Plane },
  { cle: "accompagner", icone: HeartHandshake },
];

export default function NosServices() {
  const { t } = useTranslation();
  const [actif, setActif] = useState(0);

  const blocs = CLES_BLOCS.map(({ cle, icone }) => ({
    cle,
    icone,
    titre: t(`services_detail.${cle}.titre`),
    accroche: t(`services_detail.${cle}.accroche`),
    points: t(`services_detail.${cle}.points`, { returnObjects: true }),
    avertissement: t(`services_detail.${cle}.avertissement`, { defaultValue: "" }),
  }));

  const bloc = blocs[actif];
  const Icone = bloc.icone;

  return (
    <>
      <Helmet><title>{t("services.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("services.titre")} intro={t("services_detail.intro")} />

      <section className="section">
        <div className="conteneur">
          <div className={styles.onglets}>
            {blocs.map((b, index) => {
              const estActif = index === actif;
              return (
                <button
                  key={b.cle}
                  className={`${styles.onglet} ${estActif ? styles.ongletActif : ""}`}
                  onClick={() => setActif(index)}
                >
                  <span className={styles.ongletNumero}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.ongletTitre}>{b.titre}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={bloc.cle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={styles.panneau}
            >
              <div className={styles.panneauEntete}>
                <span className={styles.panneauIcone}><Icone size={26} aria-hidden="true" /></span>
                <div>
                  <h2 className={styles.panneauTitre}>{bloc.titre}</h2>
                  <p className={styles.panneauAccroche}>{bloc.accroche}</p>
                </div>
              </div>

              <ul className={styles.listePoints}>
                {bloc.points.map((point) => (
                  <li key={point}>
                    <Check size={15} className={styles.icoCheck} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {bloc.avertissement && (
                <div className={styles.avertissement}>
                  <ShieldAlert size={16} aria-hidden="true" />
                  <p>{bloc.avertissement}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`conteneur ${styles.blocPersonnalise}`}>
          <p>{t("services_detail.personnalise")}</p>
        </div>

        <div className={stylesGeneriques.centre}>
          <Link to="/contact" className={stylesGeneriques.boutonPrincipal}>{t("cta.orientation")}</Link>
          <div style={{ marginTop: 14 }}>
            <Link to="/comment-ca-marche" className={styles.lienParcours}>
              {t("accueil.parcours_lien")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}