import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Mail, Building2, HelpCircle } from "lucide-react";
import apiAdmin from "../../services/apiAdmin";
import styles from "./TableauBord.module.css";

export default function TableauBord() {
  const [statistiques, setStatistiques] = useState(null);

  useEffect(() => {
    Promise.all([
      apiAdmin.get("/admin/contact/demandes/", { params: { statut: "nouvelle" } }),
      apiAdmin.get("/admin/contact/messages/"),
      apiAdmin.get("/admin/contenu/cliniques/"),
      apiAdmin.get("/admin/contenu/faq/"),
    ]).then(([demandes, messages, cliniques, faq]) => {
      const listeMessages = messages.data.results || messages.data;
      const listeCliniques = cliniques.data.results || cliniques.data;
      setStatistiques({
        demandesNouvelles: (demandes.data.results || demandes.data).length,
        messagesNonLus: listeMessages.filter((m) => !m.lu).length,
        cliniquesConfirmees: listeCliniques.filter((c) => c.collaboration_confirmee).length,
        faqCount: (faq.data.results || faq.data).length,
      });
    });
  }, []);

  const cartes = [
    { titre: "Demandes nouvelles", valeur: statistiques?.demandesNouvelles, icone: Inbox, vers: "/admin/demandes" },
    { titre: "Messages non lus", valeur: statistiques?.messagesNonLus, icone: Mail, vers: "/admin/messages" },
    { titre: "Cliniques confirmées", valeur: statistiques?.cliniquesConfirmees, icone: Building2, vers: "/admin/cliniques" },
    { titre: "Questions FAQ", valeur: statistiques?.faqCount, icone: HelpCircle, vers: "/admin/faq" },
  ];

  return (
    <div>
      <h1 className={styles.titre}>Tableau de bord</h1>
      <p className={styles.sousTitre}>Vue d'ensemble de l'activité du site Duumvirat Business.</p>

      <div className={styles.grille}>
        {cartes.map((carte) => {
          const Icone = carte.icone;
          return (
            <Link to={carte.vers} key={carte.titre} className={styles.carte}>
              <Icone size={20} className={styles.icone} aria-hidden="true" />
              <span className={styles.valeur}>{carte.valeur ?? "…"}</span>
              <span className={styles.libelle}>{carte.titre}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}