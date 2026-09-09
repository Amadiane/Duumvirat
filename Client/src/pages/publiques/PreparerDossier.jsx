import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import EntetePage from "./EntetePage";
import styles from "./PageGenerique.module.css";

export default function PreparerDossier() {
  const { t } = useTranslation();
  const documents = useContenuListe(contenuService.documentsDossier);

  const essentiels = documents.donnees.filter((d) => d.type_document === "essentiel");
  const complementaires = documents.donnees.filter((d) => d.type_document === "complementaire");

  return (
    <>
      <Helmet><title>{t("dossier.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("dossier.titre")} intro={t("dossier.intro")} />
      <section className="section">
        <div className="conteneur">
          <h2 className={styles.sousTitre}>{t("dossier.essentiels")}</h2>
          {documents.chargement ? (
            <SquelettteCarte lignes={3} />
          ) : (
            <div className={styles.grille2}>
              {essentiels.map((d) => (
                <div key={d.id} className={styles.carteEncadre}>
                  <h3 style={{ marginBottom: 8, fontSize: 17 }}>{documents.traduit(d, "titre")}</h3>
                  <p style={{ color: "var(--couleur-texte-att)", fontSize: 14.5 }}>
                    {documents.traduit(d, "description")}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h2 className={styles.sousTitre}>{t("dossier.complementaires")}</h2>
          {!documents.chargement && (
            <ul className={styles.listePuces}>
              {complementaires.map((d) => (
                <li key={d.id}>{documents.traduit(d, "titre")}</li>
              ))}
            </ul>
          )}

          <div className={styles.bloc} style={{ marginTop: 44 }}>
            <h3 style={{ fontSize: 17, marginBottom: 8 }}>{t("dossier.sans_compte_rendu_titre")}</h3>
            <p style={{ color: "var(--couleur-texte-att)", fontSize: 14.5 }}>
              {t("dossier.sans_compte_rendu_texte")}
            </p>
          </div>

          <div className={styles.centre}>
            <Link to="/contact" className={styles.boutonPrincipal}>{t("cta.dossier")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
