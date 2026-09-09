import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionDevis() {
  return (
    <TableCrudGenerique
      titre="Comprendre le devis — points clés"
      chemin="/admin/contenu/points-devis/"
      colonnes={[
        { cle: "ordre", label: "Ordre" },
        { cle: "contenu_fr", label: "Contenu (FR)" },
      ]}
      champs={[
        { nom: "ordre", label: "Ordre d'affichage", type: "nombre" },
        { nom: "contenu_fr", label: "Contenu (FR)", type: "zone", requis: true },
        { nom: "contenu_en", label: "Contenu (EN)", type: "zone" },
      ]}
    />
  );
}