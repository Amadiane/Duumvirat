import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import styles from "./LoginAdmin.module.css";

export default function LoginAdmin() {
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const emplacement = useLocation();
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const gererEnvoi = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnCours(true);
    try {
      await connecter(nomUtilisateur, motDePasse);
      const destination = emplacement.state?.depuis?.pathname || "/admin";
      navigate(destination, { replace: true });
    } catch {
      setErreur("Identifiant ou mot de passe incorrect.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={gererEnvoi} className={styles.carte}>
        <img src={logo} alt="Duumvirat Business" className={styles.logo} />
        <h1 className={styles.titre}>Espace administration</h1>
        <p className={styles.sousTitre}>Réservé à l'équipe Duumvirat Business.</p>

        <div className={styles.champ}>
          <label>Identifiant</label>
          <input
            type="text"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className={styles.champ}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>

        {erreur && <p className={styles.erreur}>{erreur}</p>}

        <button type="submit" disabled={enCours} className={styles.bouton}>
          {enCours ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}