import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CheckCircle2, MessageCircle, Upload, X, ChevronDown } from "lucide-react";
import { contactService } from "../../services/api";
import { WHATSAPP_NUMERO } from "../../config/config";
import EntetePage from "./EntetePage";
import styles from "./Contact.module.css";

const SPECIALITES_MEDICALES = [
  "Cardiologie", "Cardiologie interventionnelle", "Neurologie", "Neurochirurgie",
  "Chirurgie orthopédique", "Chirurgie générale", "Chirurgie plastique et esthétique",
  "Chirurgie bariatrique", "Oncologie", "Gynécologie-obstétrique", "Urologie",
  "Ophtalmologie", "ORL (Oto-rhino-laryngologie)", "Gastro-entérologie", "Néphrologie",
  "Endocrinologie / Diabétologie", "Dermatologie", "Pneumologie", "Rhumatologie",
  "Pédiatrie", "Psychiatrie", "Dentaire / Stomatologie", "Fertilité / PMA",
  "Radiologie / Imagerie médicale", "Médecine interne", "Autre",
];
const NON_PRECISE = "Non précisé";

const PAYS_AFRIQUE_SUBSAHARIENNE = [
  "Afrique du Sud", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cameroun", "Comores", "Congo-Brazzaville", "Congo-Kinshasa (RDC)",
  "Côte d'Ivoire", "Djibouti", "Érythrée", "Éthiopie", "Eswatini", "Gabon",
  "Gambie", "Ghana", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Kenya",
  "Lesotho", "Liberia", "Madagascar", "Malawi", "Mali", "Mauritanie", "Maurice",
  "Mozambique", "Namibie", "Niger", "Nigeria", "Ouganda", "Rwanda",
  "Sao Tomé-et-Principe", "Sénégal", "Seychelles", "Sierra Leone", "Somalie",
  "Soudan", "Soudan du Sud", "Tanzanie", "Tchad", "Togo", "Zambie", "Zimbabwe",
  "Autre",
];

const VALEURS_INITIALES = {
  nom: "", prenom: "", pays_residence: "", whatsapp: "", email: "",
  motif: "orientation", description_probleme: "", specialite_recherchee: "",
  budget_montant: "", budget_devise: "EUR", periode_duree: "", periode_unite: "jours", nombre_accompagnants: 0,
  message_complementaire: "", consentement_traitement_donnees: false,
  reference_dossier: "",
};

export default function Contact() {
  const { t } = useTranslation();
  const [parametres] = useSearchParams();
  const motifInitial = parametres.get("motif");
  const [valeurs, setValeurs] = useState(() => ({
    ...VALEURS_INITIALES,
    motif: ["orientation", "devis", "dossier", "accompagnement", "autre"].includes(motifInitial)
      ? motifInitial
      : VALEURS_INITIALES.motif,
  }));
  const [fichiers, setFichiers] = useState([]);
  const [statut, setStatut] = useState(null); // null | "envoi" | "succes" | "erreur"
  const [erreurs, setErreurs] = useState({});

  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "whatsapp") {
      // Chiffres uniquement, avec un eventuel "+" international en tete.
      const nettoye = value.replace(/(?!^\+)[^\d]/g, "").replace(/^(\+?)(.*)$/, (_, plus, chiffres) => plus + chiffres.replace(/\+/g, ""));
      setValeurs((v) => ({ ...v, whatsapp: nettoye }));
      return;
    }

    if (name === "nombre_accompagnants") {
      const nombre = value === "" ? 0 : Math.max(0, parseInt(value, 10) || 0);
      setValeurs((v) => ({ ...v, nombre_accompagnants: nombre }));
      return;
    }

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
      const { periode_duree, periode_unite, budget_montant, budget_devise, ...reste } = valeurs;
      const periode_souhaitee = periode_duree ? `${periode_duree} ${periode_unite}` : "";
      const budget_indicatif = budget_montant ? `${budget_montant} ${budget_devise}` : "";
      Object.entries({ ...reste, periode_souhaitee, budget_indicatif }).forEach(([cle, valeur]) => donnees.append(cle, valeur));
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
              name="reference_dossier"
              value={valeurs.reference_dossier}
              onChange={gererChangement}
              autoComplete="off"
              tabIndex={-1}
              data-lpignore="true"
              data-1p-ignore="true"
              className={styles.champHoneypot}
              aria-hidden="true"
            />

            <div className={styles.ligne}>
              <Champ label={t("contact.champs.prenom")} name="prenom" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.prenom} />
              <Champ label={t("contact.champs.nom")} name="nom" valeurs={valeurs} gererChangement={gererChangement} erreur={erreurs.nom} />
            </div>

            <div className={styles.ligne}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13.5, color: "var(--couleur-texte-att)", marginBottom: 6 }}>
                  {t("contact.champs.pays")}
                </label>
                <select
                  name="pays_residence"
                  value={valeurs.pays_residence}
                  onChange={gererChangement}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 6,
                    border: `1px solid ${erreurs.pays_residence ? "var(--couleur-argile)" : "var(--couleur-bordure)"}`,
                    background: "var(--couleur-fond-surface)", color: "var(--couleur-texte)", fontSize: 14.5,
                  }}
                >
                  <option value="">Sélectionner un pays…</option>
                  {PAYS_AFRIQUE_SUBSAHARIENNE.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <Champ
                label={t("contact.champs.whatsapp")}
                name="whatsapp"
                type="tel"
                inputMode="numeric"
                valeurs={valeurs}
                gererChangement={gererChangement}
                erreur={erreurs.whatsapp}
              />
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

            <SelectSpecialites
              label={t("contact.champs.specialite")}
              valeur={valeurs.specialite_recherchee}
              onChange={(v) => setValeurs((old) => ({ ...old, specialite_recherchee: v }))}
            />

            <div className={styles.ligne}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13.5, color: "var(--couleur-texte-att)", marginBottom: 6 }}>
                  {t("contact.champs.budget")}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={valeurs.budget_montant}
                    onChange={(e) => setValeurs((v) => ({ ...v, budget_montant: e.target.value.replace(/^-/, "") }))}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 6,
                      border: "1px solid var(--couleur-bordure)", background: "var(--couleur-fond-surface)",
                      color: "var(--couleur-texte)", fontSize: 14.5,
                    }}
                  />
                  <select
                    value={valeurs.budget_devise}
                    onChange={(e) => setValeurs((v) => ({ ...v, budget_devise: e.target.value }))}
                    style={{
                      padding: "10px 12px", borderRadius: 6, border: "1px solid var(--couleur-bordure)",
                      background: "var(--couleur-fond-surface)", color: "var(--couleur-texte)", fontSize: 14.5,
                    }}
                  >
                    <option value="EUR">Euro</option>
                    <option value="USD">Dollars américains</option>
                    <option value="MAD">Dirham</option>
                    <option value="XAF">XAF</option>
                    <option value="XOF">XOF</option>
                  </select>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13.5, color: "var(--couleur-texte-att)", marginBottom: 6 }}>
                  {t("contact.champs.periode")}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={valeurs.periode_duree}
                    onChange={(e) => setValeurs((v) => ({ ...v, periode_duree: e.target.value.replace(/^-/, "") }))}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 6,
                      border: "1px solid var(--couleur-bordure)", background: "var(--couleur-fond-surface)",
                      color: "var(--couleur-texte)", fontSize: 14.5,
                    }}
                  />
                  <select
                    value={valeurs.periode_unite}
                    onChange={(e) => setValeurs((v) => ({ ...v, periode_unite: e.target.value }))}
                    style={{
                      padding: "10px 12px", borderRadius: 6, border: "1px solid var(--couleur-bordure)",
                      background: "var(--couleur-fond-surface)", color: "var(--couleur-texte)", fontSize: 14.5,
                    }}
                  >
                    <option value="jours">Jours</option>
                    <option value="semaines">Semaines</option>
                    <option value="mois">Mois</option>
                  </select>
                </div>
              </div>
            </div>

            <Champ
              label={t("contact.champs.accompagnants")}
              name="nombre_accompagnants"
              type="number"
              min={0}
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

function Champ({ label, name, valeurs, gererChangement, type = "text", erreur, min, inputMode }) {
  return (
    <div className="champWrapper" style={{ flex: 1 }}>
      <label style={{ display: "block", fontSize: 13.5, color: "var(--couleur-texte-att)", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        min={min}
        inputMode={inputMode}
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

/**
 * Menu deroulant a choix multiple pour les specialites medicales.
 * "Non precise" est exclusif : le cocher decoche automatiquement les autres, et
 * inversement. Le resultat est stocke comme une chaine separee par des virgules
 * dans specialite_recherchee (le backend garde un simple champ texte).
 */
function SelectSpecialites({ label, valeur, onChange }) {
  const [ouvert, setOuvert] = useState(false);
  const brut = valeur ? valeur.split(",").map((s) => s.trim()).filter(Boolean) : [];

  // "Autre : precision" est stocke comme une seule entree ; on la separe pour
  // l'affichage (case cochee = "Autre", texte a part dans le champ libre).
  const entreeAutre = brut.find((s) => s === "Autre" || s.startsWith("Autre :"));
  const autreCoche = Boolean(entreeAutre);
  const autreTexte = entreeAutre && entreeAutre.startsWith("Autre :")
    ? entreeAutre.slice("Autre :".length).trim()
    : "";
  const selection = brut.filter((s) => s !== entreeAutre).concat(autreCoche ? ["Autre"] : []);

  const reconstruire = (nouvelleSelection, nouveauTexteAutre) => {
    const sansAutre = nouvelleSelection.filter((s) => s !== "Autre");
    const avecAutre = nouvelleSelection.includes("Autre")
      ? [...sansAutre, nouveauTexteAutre ? `Autre : ${nouveauTexteAutre}` : "Autre"]
      : sansAutre;
    onChange(avecAutre.join(", "));
  };

  const basculer = (option) => {
    if (option === NON_PRECISE) {
      onChange(selection.includes(NON_PRECISE) ? "" : NON_PRECISE);
      return;
    }
    let nouvelle = selection.filter((s) => s !== NON_PRECISE);
    if (nouvelle.includes(option)) {
      nouvelle = nouvelle.filter((s) => s !== option);
    } else {
      nouvelle = [...nouvelle, option];
    }
    reconstruire(nouvelle, option === "Autre" ? "" : autreTexte);
    if (option === "Autre") setOuvert(false);
  };

  const gererTexteAutre = (e) => {
    reconstruire(selection, e.target.value);
  };

  const texteAffiche = selection.length === 0
    ? "Sélectionner une ou plusieurs spécialités…"
    : selection.length === 1
      ? selection[0]
      : `${selection.length} spécialités sélectionnées`;

  return (
    <div className={styles.champ} style={{ position: "relative" }}>
      <label className={styles.etiquette}>{label}</label>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        className={styles.saisie}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", cursor: "pointer" }}
      >
        <span style={{ color: selection.length ? "var(--couleur-texte)" : "var(--couleur-texte-att)" }}>{texteAffiche}</span>
        <ChevronDown size={16} style={{ flexShrink: 0, transform: ouvert ? "rotate(180deg)" : "none" }} aria-hidden="true" />
      </button>

      {ouvert && (
        <>
          <div
            onClick={() => setOuvert(false)}
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
            aria-hidden="true"
          />
          <div
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, zIndex: 11,
              background: "var(--couleur-fond-surface)", border: "1px solid var(--couleur-bordure)",
              borderRadius: 6, maxHeight: 260, overflowY: "auto", padding: 6,
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <OptionCase texte={NON_PRECISE} coche={selection.includes(NON_PRECISE)} onClick={() => basculer(NON_PRECISE)} accent />
            <div style={{ height: 1, background: "var(--couleur-bordure)", margin: "6px 0" }} />
            {SPECIALITES_MEDICALES.map((s) => (
              <OptionCase key={s} texte={s} coche={selection.includes(s)} onClick={() => basculer(s)} />
            ))}
          </div>
        </>
      )}

      {autreCoche && (
        <input
          type="text"
          value={autreTexte}
          onChange={gererTexteAutre}
          placeholder="Précisez la spécialité recherchée…"
          className={styles.saisie}
          style={{ marginTop: 8 }}
          autoFocus
        />
      )}
    </div>
  );
}

function OptionCase({ texte, coche, onClick, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px",
        background: coche ? "var(--couleur-fond)" : "transparent", border: "none", borderRadius: 5,
        fontSize: 13.5, color: accent ? "var(--couleur-argile)" : "var(--couleur-texte)", textAlign: "left",
      }}
    >
      <span style={{
        width: 15, height: 15, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${coche ? "var(--couleur-laiton)" : "var(--couleur-bordure-forte)"}`,
        background: coche ? "var(--couleur-laiton)" : "transparent",
      }} />
      {texte}
    </button>
  );
}