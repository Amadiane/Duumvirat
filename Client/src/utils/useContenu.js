import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Recupere une liste de contenu depuis l'API et choisit le bon champ
 * selon la langue active (fallback automatique sur le francais).
 */
export function useContenuListe(fonctionAppel) {
  const { i18n } = useTranslation();
  const [donnees, setDonnees] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    let actif = true;
    setChargement(true);
    fonctionAppel()
      .then((reponse) => {
        if (actif) setDonnees(reponse.data);
      })
      .catch((e) => {
        if (actif) setErreur(e);
      })
      .finally(() => {
        if (actif) setChargement(false);
      });
    return () => {
      actif = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const langue = i18n.language === "en" ? "en" : "fr";

  const traduit = (item, champ) => {
    const valeurEn = item[`${champ}_en`];
    return langue === "en" && valeurEn ? valeurEn : item[`${champ}_fr`];
  };

  return { donnees, chargement, erreur, traduit, langue };
}
