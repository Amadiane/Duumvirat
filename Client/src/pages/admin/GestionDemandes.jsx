import { useEffect, useState } from "react";
import { Paperclip, Trash2 } from "lucide-react";
import { creerRessourceCrud } from "../../services/apiAdmin";
import styles from "./GestionDemandes.module.css";

const crud = creerRessourceCrud("/admin/contact/demandes/");

const LIBELLES_MOTIF = {
  orientation: "Demande d'orientation",
  devis: "Demande de devis",
  dossier: "Envoi de dossier médical",
  accompagnement: "Être accompagné au Maroc",
  autre: "Autre",
};

const STATUTS = [
  { valeur: "nouvelle", libelle: "Nouvelle" },
  { valeur: "en_etude", libelle: "En étude" },
  { valeur: "orientee", libelle: "Orientée" },
  { valeur: "cloturee", libelle: "Clôturée" },
];

export default function GestionDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [selectionnee, setSelectionnee] = useState(null);
  const [notes, setNotes] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = () => {
    setChargement(true);
    crud.lister().then((r) => setDemandes(r.data.results || r.data)).finally(() => setChargement(false));
  };

  useEffect(() => { charger(); }, []);

  const ouvrir = (demande) => {
    setSelectionnee(demande);
    setNotes(demande.notes_internes || "");
  };

  const changerStatut = async (statut) => {
    const miseAJour = await crud.modifier(selectionnee.id, { statut });
    setSelectionnee(miseAJour.data);
    charger();
  };

  const enregistrerNotes = async () => {
    setEnregistrement(true);
    try {
      const miseAJour = await crud.modifier(selectionnee.id, { notes_internes: notes });
      setSelectionnee(miseAJour.data);
    } finally {
      setEnregistrement(false);
    }
  };

  const supprimer = async (demande) => {
    if (!window.confirm("Supprimer cette demande et ses pièces jointes ?")) return;
    await crud.supprimer(demande.id);
    setSelectionnee(null);
    charger();
  };

  return (
    <div>
      <h1 className={styles.titre}>Demandes reçues</h1>

      <div className={styles.mise_en_page}>
        <div className={styles.liste}>
          {chargement ? (
            <p className={styles.etatVide}>Chargement…</p>
          ) : demandes.length === 0 ? (
            <p className={styles.etatVide}>Aucune demande pour le moment.</p>
          ) : (
            demandes.map((d) => (
              <button
                key={d.id}
                className={`${styles.ligne} ${selectionnee?.id === d.id ? styles.ligneActive : ""}`}
                onClick={() => ouvrir(d)}
              >
                <div className={styles.infosLigne}>
                  <span className={styles.nomLigne}>{d.prenom} {d.nom}</span>
                  <span className={styles.motifLigne}>{LIBELLES_MOTIF[d.motif]}</span>
                </div>
                <span className={`${styles.badgeStatut} ${styles[`statut_${d.statut}`]}`}>
                  {STATUTS.find((s) => s.valeur === d.statut)?.libelle}
                </span>
              </button>
            ))
          )}
        </div>

        <div className={styles.details}>
          {!selectionnee ? (
            <p className={styles.etatVide}>Sélectionnez une demande pour voir le détail.</p>
          ) : (
            <>
              <div className={styles.detailsEntete}>
                <div>
                  <h2>{selectionnee.prenom} {selectionnee.nom}</h2>
                  <p className={styles.sousInfos}>
                    {selectionnee.pays_residence} · {selectionnee.whatsapp} · {selectionnee.email}
                  </p>
                </div>
                <button className={styles.boutonSupprimer} onClick={() => supprimer(selectionnee)}>
                  <Trash2 size={15} aria-hidden="true" /> Supprimer
                </button>
              </div>

              <div className={styles.grilleInfos}>
                <Info label="Motif" valeur={LIBELLES_MOTIF[selectionnee.motif]} />
                <Info label="Spécialité recherchée" valeur={selectionnee.specialite_recherchee || "—"} />
                <Info label="Budget indicatif" valeur={selectionnee.budget_indicatif || "—"} />
                <Info label="Période souhaitée" valeur={selectionnee.periode_souhaitee || "—"} />
                <Info label="Accompagnants" valeur={selectionnee.nombre_accompagnants} />
                <Info label="Reçue le" valeur={new Date(selectionnee.date_creation).toLocaleString("fr-FR")} />
              </div>

              <h3 className={styles.sousTitre}>Description</h3>
              <p className={styles.texte}>{selectionnee.description_probleme}</p>

              {selectionnee.message_complementaire && (
                <>
                  <h3 className={styles.sousTitre}>Message complémentaire</h3>
                  <p className={styles.texte}>{selectionnee.message_complementaire}</p>
                </>
              )}

              <h3 className={styles.sousTitre}>Pièces jointes</h3>
              {selectionnee.pieces_jointes?.length > 0 ? (
                <ul className={styles.listeFichiers}>
                  {selectionnee.pieces_jointes.map((p) => (
                    <li key={p.id}>
                      <a href={p.fichier} target="_blank" rel="noopener noreferrer">
                        <Paperclip size={14} aria-hidden="true" /> {p.libelle || "Document"}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.texte}>Aucune pièce jointe.</p>
              )}

              <h3 className={styles.sousTitre}>Statut</h3>
              <div className={styles.boutonsStatut}>
                {STATUTS.map((s) => (
                  <button
                    key={s.valeur}
                    className={`${styles.boutonStatut} ${selectionnee.statut === s.valeur ? styles.boutonStatutActif : ""}`}
                    onClick={() => changerStatut(s.valeur)}
                  >
                    {s.libelle}
                  </button>
                ))}
              </div>

              <h3 className={styles.sousTitre}>Notes internes</h3>
              <textarea
                className={styles.zoneNotes}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Notes visibles uniquement par l'équipe…"
              />
              <button className={styles.boutonEnregistrerNotes} onClick={enregistrerNotes} disabled={enregistrement}>
                {enregistrement ? "Enregistrement…" : "Enregistrer les notes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, valeur }) {
  return (
    <div>
      <p style={{ fontSize: 12.5, color: "var(--couleur-texte-att)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14 }}>{valeur}</p>
    </div>
  );
}