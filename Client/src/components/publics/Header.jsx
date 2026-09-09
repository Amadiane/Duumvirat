import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Moon, Sun, MessageCircle, ArrowUpRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { WHATSAPP_NUMERO } from "../../config/config";
import logo from "../../assets/images/logo.png";
import styles from "./Header.module.css";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, basculerTheme } = useTheme();
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);

  useEffect(() => {
    const auScroll = () => setDefile(window.scrollY > 8);
    window.addEventListener("scroll", auScroll, { passive: true });
    return () => window.removeEventListener("scroll", auScroll);
  }, []);

  const liens = [
    { vers: "/nos-services", libelle: t("nav_court.services") },
    { vers: "/comment-ca-marche", libelle: t("nav_court.parcours") },
    { vers: "/preparer-son-dossier", libelle: t("nav_court.dossier") },
    { vers: "/comprendre-le-devis", libelle: t("nav_court.devis") },
    { vers: "/7-verifications", libelle: t("nav_court.verifications") },
    { vers: "/a-propos", libelle: t("nav_court.apropos") },
    { vers: "/faq", libelle: t("nav_court.faq") },
  ];

  const basculerLangue = () => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");

  return (
    <header className={`${styles.entete} ${defile ? styles.enteteDefile : ""}`}>
      <div className={`conteneur ${styles.barre}`}>
        <Link to="/" className={styles.logo} onClick={() => setOuvert(false)}>
          <img src={logo} alt="Duumvirat Business" className={styles.monogramme} />
          <span className={styles.nomSite}>Duumvirat Business</span>
        </Link>

        <nav className={`${styles.nav} ${ouvert ? styles.navOuverte : ""}`}>
          {liens.map((lien) => (
            <NavLink
              key={lien.vers}
              to={lien.vers}
              className={({ isActive }) => `${styles.lien} ${isActive ? styles.lienActif : ""}`}
              onClick={() => setOuvert(false)}
            >
              {lien.libelle}
            </NavLink>
          ))}

          <Link to="/contact" className={styles.cta} onClick={() => setOuvert(false)}>
            {t("cta.orientation")}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </nav>

        <div className={styles.actions}>
          <div className={styles.groupeActions}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.boutonWhatsapp}
              aria-label={t("cta.whatsapp")}
            >
              <MessageCircle size={16} aria-hidden="true" />
            </a>
            <button className={styles.boutonIcone} onClick={basculerLangue} aria-label="Changer de langue">
              {i18n.language === "fr" ? "EN" : "FR"}
            </button>
            <button
              className={styles.boutonIcone}
              onClick={basculerTheme}
              aria-label={theme === "clair" ? t("theme.sombre") : t("theme.clair")}
            >
              {theme === "clair" ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
            </button>
          </div>
          <button
            className={styles.boutonMenu}
            onClick={() => setOuvert((o) => !o)}
            aria-label="Menu"
            aria-expanded={ouvert}
          >
            {ouvert ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}