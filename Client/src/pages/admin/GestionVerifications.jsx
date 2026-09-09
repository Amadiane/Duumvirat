import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionVerifications() {
  return (
    <TableCrudGenerique
      titre="Les 7 vérifications avant de voyager"
      chemin="/admin/contenu/verifications/"
      colonnes={[
        { cle: "numero", label: "N°" },
        { cle: "titre_fr", label: "Titre (FR)" },
      ]}
      champs={[
        { nom: "numero", label: "Numéro", type: "nombre", requis: true },
        { nom: "titre_fr", label: "Titre (FR)", type: "texte", requis: true },
        { nom: "titre_en", label: "Titre (EN)", type: "texte" },
        { nom: "description_fr", label: "Description (FR)", type: "zone", requis: true },
        { nom: "description_en", label: "Description (EN)", type: "zone" },
      ]}
    />
  );
}