import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Route, FileText, Receipt, ShieldCheck,
  HelpCircle, Building2, FileEdit, Mail, Inbox, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import styles from "./LayoutAdmin.module.css";

const LIENS = [
  { vers: "/admin", libelle: "Tableau de bord", icone: LayoutDashboard, fin: true },
  { vers: "/admin/services", libelle: "Services", icone: Briefcase },
  { vers: "/admin/parcours", libelle: "Parcours patient", icone: Route },
  { vers: "/admin/documents", libelle: "Documents dossier", icone: FileText },
  { vers: "/admin/devis", libelle: "Points devis", icone: Receipt },
  { vers: "/admin/verifications", libelle: "7 vérifications", icone: ShieldCheck },
  { vers: "/admin/faq", libelle: "FAQ", icone: HelpCircle },
  { vers: "/admin/cliniques", libelle: "Cliniques partenaires", icone: Building2 },
  { vers: "/admin/pages", libelle: "Pages éditables", icone: FileEdit },
  { vers: "/admin/messages", libelle: "Messages de contact", icone: Mail },
  { vers: "/admin/demandes", libelle: "Demandes reçues", icone: Inbox },
];

export default function LayoutAdmin() {
  const { utilisateur, deconnecter } = useAuth();
  const navigate = useNavigate();

  const gererDeconnexion = () => {
    deconnecter();
    navigate("/admin/connexion");
  };

  return (
    <div className={styles.mise_en_page}>
      <aside className={styles.barreLaterale}>
        <div className={styles.entete}>
          <img src={logo} alt="Duumvirat Business" className={styles.logo} />
          <span className={styles.titreAdmin}>Administration</span>
        </div>

        <nav className={styles.nav}>
          {LIENS.map((lien) => {
            const Icone = lien.icone;
            return (
              <NavLink
                key={lien.vers}
                to={lien.vers}
                end={lien.fin}
                className={({ isActive }) => `${styles.lien} ${isActive ? styles.lienActif : ""}`}
              >
                <Icone size={17} aria-hidden="true" />
                <span>{lien.libelle}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.bas}>
          <div className={styles.compte}>
            <span className={styles.pointNom}>{utilisateur?.nom_utilisateur}</span>
          </div>
          <button className={styles.boutonDeconnexion} onClick={gererDeconnexion}>
            <LogOut size={16} aria-hidden="true" /> Déconnexion
          </button>
        </div>
      </aside>

      <main className={styles.contenu}>
        <Outlet />
      </main>
    </div>
  );
}