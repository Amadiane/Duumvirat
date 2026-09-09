import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Page404.module.css";

export default function Page404() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet><title>{t("page404.titre")} — Duumvirat Business</title></Helmet>
      <section className={`section ${styles.section}`}>
        <div className={`conteneur ${styles.contenu}`}>
          <span className={styles.monogramme}>DB</span>
          <h1 className={styles.titre}>{t("page404.titre")}</h1>
          <p className={styles.texte}>{t("page404.texte")}</p>
          <Link to="/" className={styles.bouton}>{t("page404.retour")}</Link>
        </div>
      </section>
    </>
  );
}
