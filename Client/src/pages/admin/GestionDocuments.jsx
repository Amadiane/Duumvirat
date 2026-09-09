import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionDocuments() {
  return (
    <TableCrudGenerique
      titre="Documents à préparer"
      chemin="/admin/contenu/documents-dossier/"
      colonnes={[
        { cle: "type_document", label: "Type" },
        { cle: "ordre", label: "Ordre" },
        { cle: "titre_fr", label: "Titre (FR)" },
      ]}
      champs={[
        {
          nom: "type_document", label: "Type", type: "select",
          options: [
            { valeur: "essentiel", libelle: "Document essentiel" },
            { valeur: "complementaire", libelle: "Document complémentaire" },
          ],
        },
        { nom: "ordre", label: "Ordre d'affichage", type: "nombre" },
        { nom: "titre_fr", label: "Titre (FR)", type: "texte", requis: true },
        { nom: "titre_en", label: "Titre (EN)", type: "texte" },
        { nom: "description_fr", label: "Description (FR)", type: "zone" },
        { nom: "description_en", label: "Description (EN)", type: "zone" },
      ]}
    />
  );
}