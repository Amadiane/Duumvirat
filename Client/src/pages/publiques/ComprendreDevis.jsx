import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import EntetePage from "./EntetePage";
import styles from "./PageGenerique.module.css";

export default function ComprendreDevis() {
  const { t } = useTranslation();
  const points = useContenuListe(contenuService.pointsDevis);

  return (
    <>
      <Helmet><title>{t("devis.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("devis.titre")} intro={t("devis.intro")} />
      <section className="section">
        <div className="conteneur" style={{ maxWidth: 720 }}>
          <h2 className={styles.sousTitre} style={{ marginTop: 0 }}>{t("devis.points_titre")}</h2>
          {points.chargement ? (
            <SquelettteCarte lignes={5} />
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {points.donnees.map((p) => (
                <li key={p.id} style={{ display: "flex", gap: 10 }}>
                  <Check size={17} style={{ color: "var(--couleur-laiton)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                  <span style={{ color: "var(--couleur-texte-att)", fontSize: 15 }}>{points.traduit(p, "contenu")}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.centre}>
            <Link to="/contact" className={styles.boutonPrincipal}>{t("cta.devis")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
