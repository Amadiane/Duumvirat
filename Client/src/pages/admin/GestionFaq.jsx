import TableCrudGenerique from "../../components/admin/TableCrudGenerique";

export default function GestionFaq() {
  return (
    <TableCrudGenerique
      titre="Foire aux questions"
      chemin="/admin/contenu/faq/"
      colonnes={[
        { cle: "ordre", label: "Ordre" },
        { cle: "question_fr", label: "Question (FR)" },
        { cle: "publie", label: "Publiée" },
      ]}
      champs={[
        { nom: "ordre", label: "Ordre d'affichage", type: "nombre" },
        { nom: "question_fr", label: "Question (FR)", type: "texte", requis: true },
        { nom: "question_en", label: "Question (EN)", type: "texte" },
        { nom: "reponse_fr", label: "Réponse (FR)", type: "zone", requis: true },
        { nom: "reponse_en", label: "Réponse (EN)", type: "zone" },
        { nom: "publie", label: "Publiée sur le site", type: "case" },
      ]}
    />
  );
}