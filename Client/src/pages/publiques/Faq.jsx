import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { contenuService } from "../../services/api";
import { useContenuListe } from "../../utils/useContenu";
import SquelettteCarte from "../../components/publics/SquelettteCarte";
import EntetePage from "./EntetePage";
import styles from "./Faq.module.css";

export default function Faq() {
  const { t } = useTranslation();
  const faq = useContenuListe(contenuService.faq);
  const [ouverte, setOuverte] = useState(null);

  return (
    <>
      <Helmet><title>{t("faq.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("faq.titre")} />
      <section className="section">
        <div className="conteneur" style={{ maxWidth: 720 }}>
          {faq.chargement ? (
            <SquelettteCarte lignes={4} />
          ) : (
            <div className={styles.liste}>
              {faq.donnees.map((item) => {
                const active = ouverte === item.id;
                return (
                  <div key={item.id} className={styles.item}>
                    <button
                      className={styles.question}
                      onClick={() => setOuverte(active ? null : item.id)}
                      aria-expanded={active}
                    >
                      <span>{faq.traduit(item, "question")}</span>
                      <ChevronDown
                        size={18}
                        className={active ? styles.icone_ouverte : styles.icone}
                        aria-hidden="true"
                      />
                    </button>
                    {active && <p className={styles.reponse}>{faq.traduit(item, "reponse")}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
