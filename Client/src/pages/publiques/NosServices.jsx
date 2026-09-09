import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import CarteService from "../../components/publics/CarteService";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import EntetePage from "./EntetePage";
import styles from "./PageGenerique.module.css";

export default function NosServices() {
  const { t } = useTranslation();
  const services = useContenuListe(contenuService.services);

  return (
    <>
      <Helmet><title>{t("services.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("services.titre")} intro={t("services.intro")} />
      <section className="section">
        <div className={`conteneur ${styles.grille4}`}>
          {services.chargement
            ? Array.from({ length: 4 }).map((_, i) => <SquelettteCarte key={i} lignes={3} />)
            : services.donnees.map((s, i) => (
                <CarteService
                  key={s.id}
                  numero={i + 1}
                  titre={services.traduit(s, "titre")}
                  description={services.traduit(s, "description")}
                />
              ))}
        </div>
        <div className={styles.centre}>
          <Link to="/contact" className={styles.boutonPrincipal}>{t("cta.orientation")}</Link>
        </div>
      </section>
    </>
  );
}
