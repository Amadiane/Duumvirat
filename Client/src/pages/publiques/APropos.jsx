import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import EntetePage from "./EntetePage";
import photoMaro from "../../assets/images/maro-nuxi-portrait.png";
import styles from "./PageGenerique.module.css";

const stylesCitation = {
  fontFamily: "var(--font-titre)", fontSize: 18, lineHeight: 1.6,
  color: "var(--couleur-encre)", borderLeft: "3px solid var(--couleur-laiton)",
  paddingLeft: 22, margin: 0,
};

const stylesNom = {
  fontSize: 13, color: "var(--couleur-texte-att)", marginBottom: 10,
  letterSpacing: "0.04em", textTransform: "uppercase",
};

export default function APropos() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet><title>{t("apropos.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("apropos.titre")} />
      <section className="section">
        <div className="conteneur" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 16, color: "var(--couleur-texte-att)", marginBottom: 20 }}>
            Duumvirat Business est une entreprise créée officiellement en août 2026, à partir
            d'une initiative prise depuis janvier 2025. Son siège est à Rabat et son activité
            couvre actuellement Rabat et Casablanca. Sa mission est d'accompagner les patients
            venant d'Afrique subsaharienne avant, durant et après leur séjour au Maroc.
          </p>

          <div className={styles.grille2} style={{ margin: "36px 0" }}>
            <div className={styles.carteEncadre}>
              <p style={{ fontSize: 13, color: "var(--couleur-texte-att)", marginBottom: 4 }}>Création officielle</p>
              <p style={{ fontWeight: 500 }}>Août 2026</p>
            </div>
            <div className={styles.carteEncadre}>
              <p style={{ fontSize: 13, color: "var(--couleur-texte-att)", marginBottom: 4 }}>Initiative depuis</p>
              <p style={{ fontWeight: 500 }}>Janvier 2025</p>
            </div>
            <div className={styles.carteEncadre}>
              <p style={{ fontSize: 13, color: "var(--couleur-texte-att)", marginBottom: 4 }}>Siège</p>
              <p style={{ fontWeight: 500 }}>Rabat, Maroc</p>
            </div>
            <div className={styles.carteEncadre}>
              <p style={{ fontSize: 13, color: "var(--couleur-texte-att)", marginBottom: 4 }}>Villes couvertes</p>
              <p style={{ fontWeight: 500 }}>Rabat et Casablanca</p>
            </div>
          </div>

          <h2 className={styles.sousTitre}>Les promoteurs</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              <img
                src={photoMaro}
                alt="Maro Nuxi, promoteur de Duumvirat Business"
                style={{
                  width: 120, height: 120, borderRadius: "50%", objectFit: "cover",
                  flexShrink: 0, border: "3px solid var(--couleur-fond-surface)",
                  boxShadow: "0 0 0 1px var(--couleur-bordure)",
                }}
              />
              <div style={{ flex: 1, minWidth: 240 }}>
                <p style={stylesNom}>MARO Nuxi</p>
                <blockquote style={stylesCitation}>
                  « Ingénieur agronome formé au Maroc, entrepreneur ayant développé plusieurs
                  activités, aujourd'hui promoteur de Duumvirat Business, service d'accompagnement
                  de patients étrangers vers des structures de soins au Maroc. »
                </blockquote>
              </div>
            </div>

            <div>
              <p style={stylesNom}>Lassina KANÉ</p>
              <blockquote style={stylesCitation}>
                Titulaire d'une Licence en Finance-Comptabilité et d'un Master en Comptabilité,
                Contrôle et Audit.
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}