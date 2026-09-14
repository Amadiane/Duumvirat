import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox, Mail, Building2, HelpCircle, Briefcase, FileText, ArrowRight, Bell, Users,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import apiAdmin from "../../services/apiAdmin";
import logo from "../../assets/images/logo.png";
import styles from "./TableauBord.module.css";

const LIBELLES_STATUT = {
  nouvelle: "Nouvelle", en_etude: "En étude", orientee: "Orientée", cloturee: "Clôturée",
};
const COULEURS_STATUT = {
  nouvelle: "#8C3A2B", en_etude: "#C08D3A", orientee: "#1E6B45", cloturee: "#B9B7A9",
};
const LIBELLES_MOTIF = {
  orientation: "Orientation", devis: "Devis", dossier: "Dossier médical",
  accompagnement: "Accompagnement", autre: "Autre",
};

export default function TableauBord() {
  const { utilisateur } = useAuth();
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    apiAdmin
      .get("/admin/contact/tableau-de-bord/")
      .then((r) => setDonnees(r.data))
      .catch(() => setErreur(true));
  }, []);

  if (erreur) return <p className={styles.erreur}>Impossible de charger le tableau de bord.</p>;
  if (!donnees) return <p className={styles.chargement}>Chargement du tableau de bord…</p>;

  const { demandes, messages, contenu } = donnees;

  const donneesDonut = Object.entries(demandes.par_statut)
    .map(([cle, valeur]) => ({ cle, nom: LIBELLES_STATUT[cle], valeur, couleur: COULEURS_STATUT[cle] }))
    .filter((d) => d.valeur > 0);

  const donneesGraphique = demandes.activite_7_jours.map((j) => ({
    jour: new Date(j.jour).toLocaleDateString("fr-FR", { weekday: "short" }),
    total: j.total,
  }));

  const dateAujourdhui = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const initiale = (utilisateur?.nom_utilisateur || "?").charAt(0).toUpperCase();

  return (
    <div>
      {/* Banniere de bienvenue */}
      <div className={styles.banniere}>
        <div className={styles.bannierteContenu}>
          <img src={logo} alt="" className={styles.bannierteLogo} aria-hidden="true" />
          <div>
            <h1 className={styles.bannierteTitre}>Bienvenue, {utilisateur?.nom_utilisateur}</h1>
            <p className={styles.bannierteSousTitre}>
              Connecté en tant que {utilisateur?.est_superutilisateur ? "Fondateur" : "Membre de l'équipe"}
            </p>
          </div>
        </div>
        <div className={styles.bannierteActions}>
          <span className={styles.dateActuelle}>{dateAujourdhui}</span>
          <span className={styles.iconeRonde}><Bell size={16} aria-hidden="true" /></span>
          <span className={styles.avatar}>{initiale}</span>
        </div>
      </div>

      {/* Indicateurs cles */}
      <div className={styles.grilleKpi}>
        <CarteKpi titre="Demandes nouvelles" valeur={demandes.nouvelles} icone={Inbox} vers="/admin/demandes" couleur="#8C3A2B" />
        <CarteKpi titre="Total demandes" valeur={demandes.total} icone={Users} vers="/admin/demandes" couleur="#12312D" />
        <CarteKpi titre="Messages non lus" valeur={messages.non_lus} icone={Mail} vers="/admin/messages" couleur="#2563A8" />
        <CarteKpi titre="Cliniques confirmées" valeur={`${contenu.cliniques_confirmees}/${contenu.cliniques_total}`} icone={Building2} vers="/admin/cliniques" couleur="#1E6B45" />
        <CarteKpi titre="FAQ publiées" valeur={`${contenu.faq_publiees}/${contenu.faq_total}`} icone={HelpCircle} vers="/admin/faq" couleur="#C08D3A" />
        <CarteKpi titre="Services actifs" valeur={contenu.services} icone={Briefcase} vers="/admin/services" couleur="#6B4C9A" />
      </div>

      <div className={styles.grillePrincipale}>
        {/* Donut repartition statut */}
        <div className={styles.carteBloc}>
          <h2 className={styles.titreBloc}>Répartition par statut</h2>
          {donneesDonut.length === 0 ? (
            <p className={styles.etatVide}>Aucune demande pour le moment.</p>
          ) : (
            <div className={styles.zoneDonut}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={donneesDonut}
                    dataKey="valeur"
                    nameKey="nom"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={donneesDonut.length > 1 ? 2 : 0}
                    stroke="none"
                  >
                    {donneesDonut.map((d) => <Cell key={d.cle} fill={d.couleur} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--couleur-fond-surface)", border: "1px solid var(--couleur-bordure)", borderRadius: 6, fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className={styles.legendeDonut}>
                {donneesDonut.map((d) => (
                  <li key={d.cle}>
                    <span className={styles.pointLegende} style={{ background: d.couleur }} />
                    {d.nom} <span className={styles.valeurLegende}>({d.valeur})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* A traiter en priorite */}
        <div className={styles.carteBloc}>
          <div className={styles.enteteBloc}>
            <h2 className={styles.titreBloc}>À traiter en priorité</h2>
            <Link to="/admin/demandes" className={styles.lienVoirTout}>Voir tout <ArrowRight size={13} aria-hidden="true" /></Link>
          </div>
          {demandes.dernieres.filter((d) => d.statut === "nouvelle").length === 0 ? (
            <p className={styles.etatVide}>Aucune demande nouvelle en attente.</p>
          ) : (
            <ul className={styles.listeActions}>
              {demandes.dernieres
                .filter((d) => d.statut === "nouvelle")
                .map((d) => {
                  const date = new Date(d.date_creation);
                  return (
                    <li key={d.id} className={styles.ligneAction}>
                      <div className={styles.badgeDate}>
                        <span className={styles.badgeDateJour}>{date.getDate()}</span>
                        <span className={styles.badgeDateMois}>{date.toLocaleDateString("fr-FR", { month: "short" })}</span>
                      </div>
                      <div className={styles.infoAction}>
                        <span className={styles.nomAction}>{d.nom_complet}</span>
                        <span className={styles.detailAction}>{d.motif_libelle}</span>
                      </div>
                      <Link to="/admin/demandes" className={styles.boutonAction}>Traiter</Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.grillePrincipale}>
        {/* Activite 7 jours */}
        <div className={styles.carteBloc}>
          <h2 className={styles.titreBloc}>Demandes reçues — 7 derniers jours</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={donneesGraphique} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--couleur-bordure)" />
              <XAxis dataKey="jour" tick={{ fontSize: 12.5, fill: "var(--couleur-texte-att)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12.5, fill: "var(--couleur-texte-att)" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ background: "var(--couleur-fond-surface)", border: "1px solid var(--couleur-bordure)", borderRadius: 6, fontSize: 13 }} />
              <Bar dataKey="total" fill="var(--couleur-laiton)" radius={[4, 4, 0, 0]} name="Demandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Repartition par motif + contenu */}
        <div className={styles.carteBloc}>
          <h2 className={styles.titreBloc}>Répartition par motif</h2>
          <div className={styles.listeRepartition}>
            {Object.entries(demandes.par_motif).map(([cle, valeur]) => {
              const total = demandes.total || 1;
              return (
                <div key={cle} className={styles.ligneRepartition}>
                  <div className={styles.enteteRepartition}>
                    <span>{LIBELLES_MOTIF[cle]}</span>
                    <span className={styles.valeurRepartition}>{valeur}</span>
                  </div>
                  <div className={styles.barreFond}>
                    <div className={styles.barreRemplissage} style={{ width: `${(valeur / total) * 100}%`, background: "var(--couleur-encre)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.grillePrincipale}>
        {/* Dernieres demandes */}
        <div className={styles.carteBloc}>
          <div className={styles.enteteBloc}>
            <h2 className={styles.titreBloc}>Dernières demandes</h2>
            <Link to="/admin/demandes" className={styles.lienVoirTout}>Voir tout <ArrowRight size={13} aria-hidden="true" /></Link>
          </div>
          {demandes.dernieres.length === 0 ? (
            <p className={styles.etatVide}>Aucune demande pour le moment.</p>
          ) : (
            <ul className={styles.listeActivite}>
              {demandes.dernieres.map((d) => (
                <li key={d.id}>
                  <span className={styles.nomActivite}>{d.nom_complet}</span>
                  <span className={styles.detailActivite}>{d.motif_libelle}</span>
                  <span className={styles.badgeStatut} style={{ background: `${COULEURS_STATUT[d.statut]}22`, color: COULEURS_STATUT[d.statut] }}>
                    {LIBELLES_STATUT[d.statut]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Derniers messages */}
        <div className={styles.carteBloc}>
          <div className={styles.enteteBloc}>
            <h2 className={styles.titreBloc}>Derniers messages</h2>
            <Link to="/admin/messages" className={styles.lienVoirTout}>Voir tout <ArrowRight size={13} aria-hidden="true" /></Link>
          </div>
          {messages.derniers.length === 0 ? (
            <p className={styles.etatVide}>Aucun message pour le moment.</p>
          ) : (
            <ul className={styles.listeActivite}>
              {messages.derniers.map((m) => (
                <li key={m.id}>
                  <span className={styles.nomActivite}>{m.nom}</span>
                  <span className={styles.detailActivite}>{m.sujet || "—"}</span>
                  {!m.lu && <span className={styles.pastilleNonLu} />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Contenu du site */}
      <div className={styles.carteBloc}>
        <h2 className={styles.titreBloc}>Contenu du site</h2>
        <div className={styles.grilleContenu}>
          <MiniStat icone={Briefcase} label="Services" valeur={contenu.services} vers="/admin/services" />
          <MiniStat icone={FileText} label="Étapes parcours" valeur={contenu.etapes_parcours} vers="/admin/parcours" />
          <MiniStat icone={FileText} label="Documents" valeur={contenu.documents_dossier} vers="/admin/documents" />
          <MiniStat icone={FileText} label="Points devis" valeur={contenu.points_devis} vers="/admin/devis" />
          <MiniStat icone={FileText} label="Vérifications" valeur={contenu.verifications} vers="/admin/verifications" />
          <MiniStat icone={FileText} label="Pages éditables" valeur={contenu.pages} vers="/admin/pages" />
        </div>
      </div>
    </div>
  );
}

function CarteKpi({ titre, valeur, icone: Icone, vers, couleur }) {
  return (
    <Link to={vers} className={styles.carteKpi}>
      <span className={styles.iconeRondeKpi} style={{ background: `${couleur}1A`, color: couleur }}>
        <Icone size={18} aria-hidden="true" />
      </span>
      <span className={styles.valeurKpi}>{valeur}</span>
      <span className={styles.libelleKpi}>{titre}</span>
    </Link>
  );
}

function MiniStat({ icone: Icone, label, valeur, vers }) {
  return (
    <Link to={vers} className={styles.miniStat}>
      <Icone size={16} aria-hidden="true" />
      <span className={styles.miniStatValeur}>{valeur}</span>
      <span className={styles.miniStatLabel}>{label}</span>
    </Link>
  );
}