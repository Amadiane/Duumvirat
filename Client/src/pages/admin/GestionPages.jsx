import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionPages() {
  return (
    <TableCrudGenerique
      titre="Pages éditables (Accueil, À propos...)"
      chemin="/admin/contenu/pages/"
      cleId="cle"
      colonnes={[
        { cle: "cle", label: "Clé" },
        { cle: "titre_fr", label: "Titre (FR)" },
      ]}
      champs={[
        { nom: "cle", label: "Clé (ex: accueil, a-propos)", type: "texte", requis: true },
        { nom: "titre_fr", label: "Titre (FR)", type: "texte", requis: true },
        { nom: "titre_en", label: "Titre (EN)", type: "texte" },
        { nom: "contenu_fr", label: "Contenu (FR)", type: "zone" },
        { nom: "contenu_en", label: "Contenu (EN)", type: "zone" },
        { nom: "meta_titre_fr", label: "Meta titre SEO (FR)", type: "texte" },
        { nom: "meta_titre_en", label: "Meta titre SEO (EN)", type: "texte" },
        { nom: "meta_description_fr", label: "Meta description SEO (FR)", type: "zone" },
        { nom: "meta_description_en", label: "Meta description SEO (EN)", type: "zone" },
        { nom: "image_partage", label: "Image de partage (Open Graph)", type: "fichier" },
      ]}
    />
  );
}