import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionServices() {
  return (
    <TableCrudGenerique
      titre="Services"
      chemin="/admin/contenu/services/"
      colonnes={[
        { cle: "ordre", label: "Ordre" },
        { cle: "titre_fr", label: "Titre (FR)" },
        { cle: "titre_en", label: "Titre (EN)" },
      ]}
      champs={[
        { nom: "ordre", label: "Ordre d'affichage", type: "nombre" },
        { nom: "icone", label: "Icône (lucide-react)", type: "texte" },
        { nom: "titre_fr", label: "Titre (FR)", type: "texte", requis: true },
        { nom: "titre_en", label: "Titre (EN)", type: "texte" },
        { nom: "description_fr", label: "Description (FR)", type: "zone", requis: true },
        { nom: "description_en", label: "Description (EN)", type: "zone" },
      ]}
    />
  );
}