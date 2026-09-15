import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Check, Info, AlertTriangle } from "lucide-react";
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

          <div style={{
            display: "flex", gap: 12, marginTop: 32, padding: "16px 18px",
            background: "var(--couleur-fond-surface)", border: "1px solid var(--couleur-bordure)",
            borderLeft: "3px solid var(--couleur-laiton)", borderRadius: 6,
          }}>
            <Info size={18} style={{ color: "var(--couleur-laiton)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <div>
              <p style={{ fontWeight: 500, marginBottom: 4, fontSize: 15 }}>Utilité</p>
              <p style={{ color: "var(--couleur-texte-att)", fontSize: 14.5, margin: 0 }}>
                Il vous permet d'avoir une idée du coût de la prise en charge et de vous préparer comme il faut.
              </p>
            </div>
          </div>

          <div style={{
            display: "flex", gap: 12, marginTop: 16, padding: "16px 18px",
            background: "var(--couleur-fond)", borderLeft: "3px solid var(--couleur-argile)", borderRadius: 6,
          }}>
            <AlertTriangle size={18} style={{ color: "var(--couleur-argile)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <div>
              <p style={{ fontWeight: 500, marginBottom: 4, fontSize: 15 }}>Important</p>
              <p style={{ color: "var(--couleur-texte)", fontSize: 14.5, margin: 0 }}>
                Le devis est un document estimatif, mais la réalité peut varier : la prise en charge peut coûter
                moins cher ou plus cher que le devis initial. Il faut toujours venir avec un budget permettant
                de gérer les imprévus.
              </p>
            </div>
          </div>

          <div className={styles.centre}>
            <Link to="/contact?motif=devis" className={styles.boutonPrincipal}>{t("cta.devis")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}