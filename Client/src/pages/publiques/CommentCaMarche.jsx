import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import Chronologie from "../../components/publics/Chronologie";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import EntetePage from "./EntetePage";
import photoAeroport from "../../assets/images/galerie/airport.jpg";
import styles from "./PageGenerique.module.css";

export default function CommentCaMarche() {
  const { t } = useTranslation();
  const parcours = useContenuListe(contenuService.etapesParcours);

  return (
    <>
      <Helmet><title>{t("parcours.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("parcours.titre")} intro={t("parcours.intro")} />
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="conteneur" style={{ maxWidth: 720 }}>
          <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
            <img
              src={photoAeroport}
              alt="Accueil et accompagnement d'un patient à son arrivée au Maroc"
              style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
            />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="conteneur" style={{ maxWidth: 720 }}>
          {parcours.chargement ? (
            <SquelettteCarte lignes={6} />
          ) : (
            <Chronologie
              etapes={parcours.donnees.map((e) => ({
                numero: e.numero,
                titre: parcours.traduit(e, "titre"),
                description: parcours.traduit(e, "description"),
              }))}
            />
          )}
        </div>
        <div className={styles.centre}>
          <Link to="/contact" className={styles.boutonPrincipal}>{t("cta.orientation")}</Link>
        </div>
      </section>
    </>
  );
}