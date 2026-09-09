import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { creerRessourceCrud } from "../../services/apiAdmin";
import styles from "./GestionMessages.module.css";

const crud = creerRessourceCrud("/admin/contact/messages/");

export default function GestionMessages() {
  const [messages, setMessages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [selectionne, setSelectionne] = useState(null);

  const charger = () => {
    setChargement(true);
    crud.lister().then((r) => setMessages(r.data.results || r.data)).finally(() => setChargement(false));
  };

  useEffect(() => { charger(); }, []);

  const ouvrir = async (message) => {
    setSelectionne(message);
    if (!message.lu) {
      await crud.modifier(message.id, { lu: true });
      charger();
    }
  };

  const supprimer = async (message) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    await crud.supprimer(message.id);
    setSelectionne(null);
    charger();
  };

  return (
    <div>
      <h1 className={styles.titre}>Messages de contact</h1>

      <div className={styles.mise_en_page}>
        <div className={styles.liste}>
          {chargement ? (
            <p className={styles.etatVide}>Chargement…</p>
          ) : messages.length === 0 ? (
            <p className={styles.etatVide}>Aucun message pour le moment.</p>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                className={`${styles.ligneMessage} ${selectionne?.id === m.id ? styles.ligneActive : ""}`}
                onClick={() => ouvrir(m)}
              >
                {m.lu ? <MailOpen size={16} aria-hidden="true" /> : <Mail size={16} aria-hidden="true" />}
                <div className={styles.infosMessage}>
                  <span className={styles.nomExpediteur}>{m.nom}</span>
                  <span className={styles.apercu}>{m.sujet || m.message.slice(0, 40)}</span>
                </div>
                {!m.lu && <span className={styles.pastilleNonLu} />}
              </button>
            ))
          )}
        </div>

        <div className={styles.details}>
          {selectionne ? (
            <>
              <div className={styles.detailsEntete}>
                <div>
                  <h2>{selectionne.nom}</h2>
                  <a href={`mailto:${selectionne.email}`} className={styles.email}>{selectionne.email}</a>
                </div>
                <button className={styles.boutonSupprimer} onClick={() => supprimer(selectionne)}>
                  <Trash2 size={15} aria-hidden="true" /> Supprimer
                </button>
              </div>
              {selectionne.sujet && <p className={styles.sujet}>{selectionne.sujet}</p>}
              <p className={styles.corps}>{selectionne.message}</p>
              <p className={styles.date}>Reçu le {new Date(selectionne.date_envoi).toLocaleString("fr-FR")}</p>
            </>
          ) : (
            <p className={styles.etatVide}>Sélectionnez un message pour le lire.</p>
          )}
        </div>
      </div>
    </div>
  );
}