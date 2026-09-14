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

const BLOCS = [
  {
    numero: "01",
    icone: ClipboardList,
    titre: "Préparer",
    accroche: "Étude du dossier et préparation du projet médical",
    points: [
      "Analyse du compte-rendu médical, des résultats d'analyses, radiographies, IRM ou scanners disponibles",
      "Prise en compte des traitements déjà suivis et des antécédents médicaux",
      "Téléconsultation possible avec un professionnel de santé si le dossier transmis est insuffisant",
      "Objectif : éviter de voyager avec un dossier incomplet ou sans savoir quelles démarches entreprendre",
    ],
  },
  {
    numero: "02",
    icone: Compass,
    titre: "Orienter",
    accroche: "Recherche d'une structure adaptée et facilitation de la demande de devis",
    points: [
      "Orientation tenant compte de la pathologie, de la spécialité recherchée, des examens nécessaires, du budget et, lorsque c'est possible, de la ville souhaitée",
      "Facilitation de la transmission du dossier à la structure de soins concernée",
      "Aide à comprendre les différents postes du devis : consultations, examens, interventions, hospitalisation, traitements",
      "Un devis médical reste une estimation, qui peut évoluer selon les résultats des examens et les décisions médicales",
    ],
    avertissement: "Duumvirat ne pose pas de diagnostic et ne décide pas du traitement. L'orientation médicale et les décisions thérapeutiques relèvent des professionnels de santé.",
  },
  {
    numero: "03",
    icone: Plane,
    titre: "Organiser",
    accroche: "Hébergement, transport, rendez-vous et programme du séjour",
    points: [
      "Recherche et réservation d'un hébergement adapté à la durée du programme médical",
      "Transfert depuis l'aéroport et déplacements vers les établissements de soins",
      "Coordination des différentes étapes du programme et des rendez-vous",
      "Accueil à l'arrivée au Maroc et aide à l'installation, pour les patients qui en ont besoin",
    ],
  },
  {
    numero: "04",
    icone: HeartHandshake,
    titre: "Accompagner",
    accroche: "Accompagnement sur place et suivi organisationnel après le retour",
    points: [
      "Accompagnement aux rendez-vous et transport vers les établissements de soins pendant le séjour",
      "Coordination avec les différents interlocuteurs concernés",
      "Assistance dans certaines démarches pratiques et administratives liées au séjour",
      "Suivi organisationnel à distance après le retour du patient, lorsque cela est nécessaire et possible",
    ],
  },
];

export default function NosServices() {
  const { t } = useTranslation();
  const [actif, setActif] = useState(0);
  const bloc = BLOCS[actif];
  const Icone = bloc.icone;

  return (
    <>
      <Helmet><title>{t("services.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage
        titre={t("services.titre")}
        intro="Vous avez un projet de soins au Maroc. Nous vous aidons à préparer votre dossier, rechercher une orientation adaptée, obtenir les informations nécessaires, organiser votre séjour et vous accompagner sur place."
      />

      <section className="section">
        <div className="conteneur">
          {/* Selecteur d'onglets */}
          <div className={styles.onglets}>
            {BLOCS.map((b, index) => {
              const estActif = index === actif;
              return (
                <button
                  key={b.numero}
                  className={`${styles.onglet} ${estActif ? styles.ongletActif : ""}`}
                  onClick={() => setActif(index)}
                >
                  <span className={styles.ongletNumero}>{b.numero}</span>
                  <span className={styles.ongletTitre}>{b.titre}</span>
                </button>
              );
            })}
          </div>

          {/* Panneau de detail unique */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bloc.numero}
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
          <p>
            Tous les patients n'ont pas les mêmes besoins : certains viennent pour une simple
            consultation ou des examens, d'autres pour une intervention nécessitant plusieurs
            jours d'hospitalisation, d'autres encore ont besoin d'un accompagnement plus
            important selon leur âge, leur état général ou la complexité de leur séjour.
            Duumvirat adapte l'organisation en fonction du problème médical, du projet du
            patient, de la durée du séjour, du budget et du niveau d'accompagnement nécessaire.
          </p>
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