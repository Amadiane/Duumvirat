import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { creerRessourceCrud } from "../../services/apiAdmin";
import styles from "./TableCrudGenerique.module.css";

/**
 * Composant CRUD generique piloté par config, reutilise pour tous les
 * contenus simples de la zone admin (services, parcours, documents, devis,
 * verifications, FAQ, cliniques, pages).
 *
 * props:
 * - titre: string
 * - chemin: string (ex: "/admin/contenu/services/")
 * - colonnes: [{ cle, label }]  -> colonnes affichees dans le tableau
 * - champs: [{ nom, label, type: 'texte'|'zone'|'nombre'|'case'|'fichier'|'select', options?, requis? }]
 * - cleId: string (par defaut "id", ex: "cle" pour PageStatique)
 */
export default function TableCrudGenerique({ titre, chemin, colonnes, champs, cleId = "id" }) {
  const crud = creerRessourceCrud(chemin);
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [edition, setEdition] = useState(null); // null = ferme, {} = creation, {...} = edition
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = () => {
    setChargement(true);
    crud
      .lister()
      .then((r) => setLignes(r.data.results || r.data))
      .catch(() => setErreur("Impossible de charger les données."))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chemin]);

  const ouvrirCreation = () => {
    const vide = {};
    champs.forEach((c) => (vide[c.nom] = c.type === "case" ? false : ""));
    setEdition(vide);
  };

  const ouvrirEdition = (ligne) => setEdition({ ...ligne });

  const fermer = () => setEdition(null);

  const gererSuppression = async (ligne) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    await crud.supprimer(ligne[cleId]);
    charger();
  };

  const gererEnregistrement = async (e) => {
    e.preventDefault();
    setEnregistrement(true);
    try {
      const contientFichier = champs.some((c) => c.type === "fichier" && edition[c.nom] instanceof File);
      let donnees = edition;
      let config = {};
      if (contientFichier) {
        const formData = new FormData();
        Object.entries(edition).forEach(([cle, valeur]) => {
          if (valeur !== null && valeur !== undefined) formData.append(cle, valeur);
        });
        donnees = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }

      if (edition[cleId]) {
        await crud.modifier(edition[cleId], donnees, config);
      } else {
        await crud.creer(donnees, config);
      }
      fermer();
      charger();
    } catch {
      setErreur("Erreur lors de l'enregistrement. Vérifiez les champs.");
    } finally {
      setEnregistrement(false);
    }
  };

  const gererChangementChamp = (nom, valeur) => setEdition((e) => ({ ...e, [nom]: valeur }));

  return (
    <div>
      <div className={styles.entete}>
        <h1 className={styles.titre}>{titre}</h1>
        <button className={styles.boutonAjouter} onClick={ouvrirCreation}>
          <Plus size={16} aria-hidden="true" /> Ajouter
        </button>
      </div>

      {erreur && <p className={styles.messageErreur}>{erreur}</p>}

      <div className={styles.tableauConteneur}>
        <table className={styles.tableau}>
          <thead>
            <tr>
              {colonnes.map((col) => (
                <th key={col.cle}>{col.label}</th>
              ))}
              <th className={styles.colonneActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={colonnes.length + 1} className={styles.etatVide}>Chargement…</td></tr>
            ) : lignes.length === 0 ? (
              <tr><td colSpan={colonnes.length + 1} className={styles.etatVide}>Aucun élément pour le moment.</td></tr>
            ) : (
              lignes.map((ligne) => (
                <tr key={ligne[cleId]}>
                  {colonnes.map((col) => (
                    <td key={col.cle}>{formaterValeur(ligne[col.cle])}</td>
                  ))}
                  <td className={styles.colonneActions}>
                    <button className={styles.boutonIcone} onClick={() => ouvrirEdition(ligne)} aria-label="Modifier">
                      <Pencil size={15} aria-hidden="true" />
                    </button>
                    <button className={styles.boutonIconeDanger} onClick={() => gererSuppression(ligne)} aria-label="Supprimer">
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {edition && (
        <div className={styles.superposition} role="dialog" aria-modal="true">
          <div className={styles.panneau}>
            <div className={styles.panneauEntete}>
              <h2>{edition[cleId] ? "Modifier" : "Ajouter"}</h2>
              <button className={styles.boutonFermer} onClick={fermer} aria-label="Fermer">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={gererEnregistrement} className={styles.formulaire}>
              {champs.map((champ) => (
                <ChampFormulaire
                  key={champ.nom}
                  champ={champ}
                  valeur={edition[champ.nom]}
                  onChange={(v) => gererChangementChamp(champ.nom, v)}
                />
              ))}
              <div className={styles.actionsFormulaire}>
                <button type="button" onClick={fermer} className={styles.boutonAnnuler}>Annuler</button>
                <button type="submit" disabled={enregistrement} className={styles.boutonEnregistrer}>
                  {enregistrement ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChampFormulaire({ champ, valeur, onChange }) {
  if (champ.type === "zone") {
    return (
      <div className={styles.champ}>
        <label>{champ.label}</label>
        <textarea value={valeur || ""} onChange={(e) => onChange(e.target.value)} rows={4} required={champ.requis} />
      </div>
    );
  }
  if (champ.type === "case") {
    return (
      <label className={styles.champCase}>
        <input type="checkbox" checked={!!valeur} onChange={(e) => onChange(e.target.checked)} />
        <span>{champ.label}</span>
      </label>
    );
  }
  if (champ.type === "select") {
    return (
      <div className={styles.champ}>
        <label>{champ.label}</label>
        <select value={valeur || ""} onChange={(e) => onChange(e.target.value)}>
          {champ.options.map((opt) => (
            <option key={opt.valeur} value={opt.valeur}>{opt.libelle}</option>
          ))}
        </select>
      </div>
    );
  }
  if (champ.type === "fichier") {
    return (
      <div className={styles.champ}>
        <label>{champ.label}</label>
        <input type="file" onChange={(e) => onChange(e.target.files[0])} accept="image/*" />
        {typeof valeur === "string" && valeur && (
          <a href={valeur} target="_blank" rel="noopener noreferrer" className={styles.lienFichierExistant}>
            Voir le fichier actuel
          </a>
        )}
      </div>
    );
  }
  return (
    <div className={styles.champ}>
      <label>{champ.label}</label>
      <input
        type={champ.type === "nombre" ? "number" : "text"}
        value={valeur ?? ""}
        onChange={(e) => onChange(champ.type === "nombre" ? Number(e.target.value) : e.target.value)}
        required={champ.requis}
      />
    </div>
  );
}

function formaterValeur(valeur) {
  if (typeof valeur === "boolean") return valeur ? "Oui" : "Non";
  if (valeur === null || valeur === undefined || valeur === "") return "—";
  if (typeof valeur === "string" && valeur.length > 80) return valeur.slice(0, 80) + "…";
  return String(valeur);
}