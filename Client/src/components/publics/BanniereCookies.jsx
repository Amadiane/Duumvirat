import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./BanniereCookies.module.css";

export default function BanniereCookies() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(
    () => !localStorage.getItem("db_cookies_acceptes")
  );

  const accepter = () => {
    localStorage.setItem("db_cookies_acceptes", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banniere} role="region" aria-label="Cookies">
      <p className={styles.texte}>{t("cookies.message")}</p>
      <button className={styles.bouton} onClick={accepter}>
        {t("cookies.accepter")}
      </button>
    </div>
  );
}
