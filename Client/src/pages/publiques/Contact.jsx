import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CheckCircle2, MessageCircle, Upload, X } from "lucide-react";
import { contactService } from "../../services/api";
import { WHATSAPP_NUMERO } from "../../config/config";
import EntetePage from "./EntetePage";
import styles from "./Contact.module.css";

const VALEURS_INITIALES = {
  nom: "", prenom: "", pays_residence: "", whatsapp: "", email: "",
  motif: "orientation", description_probleme: "", specialite_recherchee: "",
  budget_indicatif: "", periode_souhaitee: "", nombre_accompagnants: 0,
  message_complementaire: "", consentement_traitement_donnees: false,
  site_web: "",
};

export default function Contact() {
  const { t } = useTranslation();
  const [valeurs, setValeurs] = useState(VALEURS_INITIALES);
  const [fichiers, setFichiers] = useState([]);
  const [statut, setStatut] = useState(null); // null | "envoi" | "succes" | "erreur"
  const [erreurs, setErreurs] = useState({});

  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;
    setValeurs((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  const gererFichiers = (e) => {
    const nouveaux = Array.from(e.target.files || []);
    setFichiers((f) => [...f, ...nouveaux]);
  };

  const retirerFichier = (index) => {
    setFichiers((f) => f.filter((_, i) => i !== index));
  };

  const valider = () => {
    const nouvellesErreurs = {};
    if (!valeurs.nom) nouvellesErreurs.nom = true;
    if (!valeurs.prenom) nouvellesErreurs.prenom = true;
    if (!valeurs.pays_residence) nouvellesErreurs.pays_residence = true;
    if (!valeurs.whatsapp) nouvellesErreurs.whatsapp = true;
    if (!valeurs.email || !valeurs.email.includes("@")) nouvellesErreurs.email = true;
    if (!valeurs.description_probleme) nouvellesErreurs.description_probleme = true;
    if (!valeurs.consentement_traitement_donnees) nouvellesErreurs.consentement_traitement_donnees = true;
    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const gererEnvoi = async (e) => {
    e.preventDefault();
    if (!valider()) return;

    setStatut("envoi");
    try {
      const donnees = new FormData();
      Object.entries(valeurs).forEach(([cle, valeur]) => donnees.append(cle, valeur));
      fichiers.forEach((fichier) => donnees.append("pieces_jointes", fichier));

      await contactService.envoyerDemande(donnees);
      setStatut("succes");
      setValeurs(VALEURS_INITIALES);
      setFichiers([]);
    } catch {
      setStatut("erreur");
    }
  };

  if (statut === "succes") {
    return (
      <>
        <Helmet><title>{t("contact.titre")} — Duumvirat Business</title></Helmet>
        <section className="section">
          <div className={`conteneur ${styles.confirmation}`}>
            <CheckCircle2 size={48} style={{ color: "var(--couleur-laiton)" }} aria-hidden="true" />
            <h1 className={styles.titreConfirmation}>{t("contact.succes_titre")}</h1>
            <p className={styles.texteConfirmation}>{t("contact.succes_texte")}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.boutonWhatsapp}
            >
              <MessageCircle size={18} aria-hidden="true" /> {t("cta.whatsapp")}
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet><title>{t("contact.titre")} — Duumvirat Business</title></Helmet>
      <EntetePage titre={t("contact.titre")} intro={t("contact.intro")} />

      <section className="section">
        <div className={`conteneur ${styles.mise_en_page}`}>
          <form onSubmit={gererEnvoi} className={styles.formulaire} noValidate>
            <input
              type="text"
              name="site_web"
              value={valeurs.site_web}
              onChange={gererChangement}
              autoComplete="off"
              tabIndex={-1}
              className={styles.champHoneypot}
              aria-hidden="true"
            />

            <div className={styles.ligne}>
              <Champ label={t("contact.champs.prenom")} name="prenom" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.prenom} />
              <Champ label={t("contact.champs.nom")} name="nom" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.nom} />
            </div>

            <div className={styles.ligne}>
              <Champ label={t("contact.champs.pays")} name="pays_residence" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.pays_residence} />
              <Champ label={t("contact.champs.whatsapp")} name="whatsapp" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.whatsapp} />
            </div>

            <Champ label={t("contact.champs.email")} name="email" type="email" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.email} />

            <div className={styles.champ}>
              <label className={styles.etiquette}>{t("contact.champs.motif")}</label>
              <select name="motif" value={valeurs.motif} onChange={gererChangement} className={styles.saisie}>
                {["orientation", "devis", "dossier", "accompagnement", "autre"].map((m) => (
                  <option key={m} value={m}>{t(`contact.motifs.${m}`)}</option>
                ))}
              </select>
            </div>

            <div className={styles.champ}>
              <label className={styles.etiquette}>{t("contact.champs.description")}</label>
              <textarea
                name="description_probleme"
                value={valeurs.description_probleme}
                onChange={gererChangement}
                rows={4}
                className={`${styles.saisie} ${erreurs.description_probleme ? styles.saisieErreur : ""}`}
              />
              {erreurs.description_probleme && <p className={styles.messageErreur}>Champ requis</p>}
            </div>

            <Champ label={t("contact.champs.specialite")} name="specialite_recherchee" valeurs={valeurs} gererChangement={gererChangement} />

            <div className={styles.ligne}>
              <Champ label={t("contact.champs.budget")} name="budget_indicatif" valeurs={valeurs} gererChangement={gererChangement} />
              <Champ label={t("contact.champs.periode")} name="periode_souhaitee" valeurs={valeurs} gererChangement={gererChangement} />
            </div>

            <Champ
              label={t("contact.champs.accompagnants")}
              name="nombre_accompagnants"
              type="number"
              valeurs={valeurs}
              gererChangement={gererChangement}
            />

            <div className={styles.champ}>
              <label className={styles.etiquette}>{t("contact.champs.message")}</label>
              <textarea
                name="message_complementaire"
                value={valeurs.message_complementaire}
                onChange={gererChangement}
                rows={3}
                className={styles.saisie}
              />
            </div>

            <div className={styles.champ}>
              <label className={styles.etiquette}>{t("contact.champs.fichiers")}</label>
              <label className={styles.zoneUpload}>
                <Upload size={18} aria-hidden="true" />
                <span>{t("cta.envoyer")} un fichier</span>
                <input type="file" multiple onChange={gererFichiers} className={styles.entreeFichier} />
              </label>
              {fichiers.length > 0 && (
                <ul className={styles.listeFichiers}>
                  {fichiers.map((f, i) => (
                    <li key={`${f.name}-${i}`}>
                      <span>{f.name}</span>
                      <button type="button" onClick={() => retirerFichier(i)} aria-label="Retirer">
                        <X size={14} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className={styles.consentement}>
              <input
                type="checkbox"
                name="consentement_traitement_donnees"
                checked={valeurs.consentement_traitement_donnees}
                onChange={gererChangement}
              />
              <span>{t("contact.champs.consentement")}</span>
            </label>
            {erreurs.consentement_traitement_donnees && (
              <p className={styles.messageErreur}>Ce consentement est obligatoire.</p>
            )}

            {statut === "erreur" && <p className={styles.messageErreur}>{t("contact.erreur")}</p>}

            <button type="submit" disabled={statut === "envoi"} className={styles.boutonEnvoyer}>
              {statut === "envoi" ? t("cta.envoi_en_cours") : t("cta.envoyer")}
            </button>
          </form>

          <aside className={styles.aside}>
            <div className={styles.carteAside}>
              <h3>{t("cta.whatsapp")}</h3>
              <p>{t("contact.intro")}</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.boutonWhatsapp}
              >
                <MessageCircle size={18} aria-hidden="true" /> {t("cta.whatsapp")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Champ({ label, name, valeurs, gererChangement, type = "text", erreur }) {
  return (
    <div className="champWrapper" style={{ flex: 1 }}>
      <label style={{ display: "block", fontSize: 13.5, color: "var(--couleur-texte-att)", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={valeurs[name]}
        onChange={gererChangement}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 6,
          border: `1px solid ${erreur ? "var(--couleur-argile)" : "var(--couleur-bordure)"}`,
          background: "var(--couleur-fond-surface)", color: "var(--couleur-texte)", fontSize: 14.5,
        }}
      />
    </div>
  );
}
