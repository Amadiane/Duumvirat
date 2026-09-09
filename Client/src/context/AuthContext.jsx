import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/config";
import apiAdmin, { jetons } from "../services/apiAdmin";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const { acces } = jetons.lire();
    if (!acces) {
      setChargement(false);
      return;
    }
    apiAdmin
      .get("/auth/moi/")
      .then((reponse) => setUtilisateur(reponse.data))
      .catch(() => jetons.effacer())
      .finally(() => setChargement(false));
  }, []);

  const connecter = async (nomUtilisateur, motDePasse) => {
    const reponse = await axios.post(`${API_BASE_URL}/auth/token/`, {
      username: nomUtilisateur,
      password: motDePasse,
    });
    jetons.ecrire(reponse.data.access, reponse.data.refresh);
    const moi = await apiAdmin.get("/auth/moi/");
    setUtilisateur(moi.data);
    return moi.data;
  };

  const deconnecter = () => {
    jetons.effacer();
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, chargement, connecter, deconnecter }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);