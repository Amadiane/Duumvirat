import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMERO } from "../../config/config";
import logo from "../../assets/images/logo.png";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useTranslation();
  const annee = new Date().getFullYear();

  return (
    <footer className={styles.pied}>
      <div className={`conteneur ${styles.grille}`}>
        <div>
          <div className={styles.logo}>
            <img src={logo} alt="Duumvirat Business" className={styles.monogramme} />
            <span>Duumvirat Business</span>
          </div>
          <p className={styles.adresse}>{t("footer.siege")}</p>
        </div>

        <div className={styles.colonne}>
          <Link to="/nos-services">{t("nav.services")}</Link>
          <Link to="/comment-ca-marche">{t("nav.parcours")}</Link>
          <Link to="/preparer-son-dossier">{t("nav.dossier")}</Link>
          <Link to="/comprendre-le-devis">{t("nav.devis")}</Link>
        </div>

        <div className={styles.colonne}>
          <Link to="/a-propos">{t("nav.apropos")}</Link>
          <Link to="/faq">{t("nav.faq")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
          <Link to="/mentions-legales">{t("footer.mentions")}</Link>
        </div>

        <div className={styles.colonne}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            <MessageCircle size={16} aria-hidden="true" /> {t("cta.whatsapp")}
          </a>
        </div>
      </div>

      <div className={`conteneur ${styles.bas}`}>
        <span>© {annee} Duumvirat Business — {t("footer.droits")}</span>
      </div>
    </footer>
  );
}