import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionCliniques() {
  return (
    <TableCrudGenerique
      titre="Cliniques partenaires"
      chemin="/admin/contenu/cliniques/"
      colonnes={[
        { cle: "nom", label: "Nom" },
        { cle: "ville", label: "Ville" },
        { cle: "collaboration_confirmee", label: "Confirmée" },
      ]}
      champs={[
        { nom: "nom", label: "Nom de la clinique", type: "texte", requis: true },
        { nom: "ville", label: "Ville", type: "texte", requis: true },
        { nom: "specialites_fr", label: "Spécialités (FR)", type: "zone", requis: true },
        { nom: "specialites_en", label: "Spécialités (EN)", type: "zone" },
        { nom: "interlocuteur", label: "Interlocuteur (interne)", type: "texte" },
        { nom: "coordonnees", label: "Coordonnées (interne)", type: "texte" },
        { nom: "canal_transmission", label: "Canal de transmission", type: "texte" },
        { nom: "documents_requis_fr", label: "Documents requis (FR)", type: "zone" },
        { nom: "documents_requis_en", label: "Documents requis (EN)", type: "zone" },
        { nom: "processus_etude_fr", label: "Processus d'étude (FR)", type: "zone" },
        { nom: "processus_etude_en", label: "Processus d'étude (EN)", type: "zone" },
        { nom: "delai_devis_indicatif", label: "Délai devis indicatif", type: "texte" },
        { nom: "modalites_suivi_fr", label: "Modalités de suivi (FR, interne)", type: "zone" },
        { nom: "modalites_suivi_en", label: "Modalités de suivi (EN, interne)", type: "zone" },
        { nom: "conditions_financieres", label: "Conditions financières (interne)", type: "zone" },
        { nom: "logo", label: "Logo", type: "fichier" },
        {
          nom: "collaboration_confirmee",
          label: "Collaboration confirmée (rend la clinique visible sur le site public)",
          type: "case",
        },
      ]}
    />
  );
}