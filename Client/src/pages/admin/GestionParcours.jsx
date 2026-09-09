import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionParcours() {
  return (
    <TableCrudGenerique
      titre="Parcours patient (10 étapes)"
      chemin="/admin/contenu/etapes-parcours/"
      colonnes={[
        { cle: "numero", label: "N°" },
        { cle: "titre_fr", label: "Titre (FR)" },
        { cle: "titre_en", label: "Titre (EN)" },
      ]}
      champs={[
        { nom: "numero", label: "Numéro de l'étape", type: "nombre", requis: true },
        { nom: "titre_fr", label: "Titre (FR)", type: "texte", requis: true },
        { nom: "titre_en", label: "Titre (EN)", type: "texte" },
        { nom: "description_fr", label: "Description (FR)", type: "zone" },
        { nom: "description_en", label: "Description (EN)", type: "zone" },
      ]}
    />
  );
}