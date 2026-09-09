import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import ListeVerifications from "../../components/publics/ListeVerifications";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import EntetePage from "./EntetePage";
import styles from "./PageGenerique.module.css";

const CONSEILS_PRATIQUES = [
  "Vérifier que les informations du billet d'avion correspondent à celles du passeport.",
  "Si l'état de santé le nécessite, prévoir un accompagnement adapté à l'aéroport.",
  "Se renseigner sur les règles de déclaration des sommes d'argent transportées, qui peuvent varier selon les pays.",
  "Décrire clairement son état de santé et transmettre les informations médicales disponibles.",
  "Prendre contact suffisamment tôt avant le voyage afin de permettre une meilleure organisation.",
];

export default function SeptVerifications() {
  const { t } = useTranslation();
  const verifications = useContenuListe(contenuService.verifications);

  return (
    <>
      <Helmet><title>{t("verifications.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("verifications.titre")} intro={t("verifications.intro")} />
      <section className="section">
        <div className="conteneur">
          {verifications.chargement ? (
            <SquelettteCarte lignes={4} />
          ) : (
            <ListeVerifications
              verifications={verifications.donnees.map((v) => ({
                numero: v.numero,
                titre: verifications.traduit(v, "titre"),
                description: verifications.traduit(v, "description"),
              }))}
            />
          )}

          <h2 className={styles.sousTitre}>{t("verifications.conseils_titre")}</h2>
          <ul className={styles.listePuces}>
            {CONSEILS_PRATIQUES.map((conseil) => (
              <li key={conseil}>{conseil}</li>
            ))}
          </ul>

          <div className={styles.centre}>
            <Link to="/contact" className={styles.boutonPrincipal}>{t("cta.orientation")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
