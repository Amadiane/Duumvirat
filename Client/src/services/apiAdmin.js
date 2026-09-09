import axios from "axios";
import { API_BASE_URL } from "../config/config";

const CLE_ACCES = "db_access_token";
const CLE_RAFRAICHISSEMENT = "db_refresh_token";

export const jetons = {
  lire: () => ({
    acces: localStorage.getItem(CLE_ACCES),
    rafraichissement: localStorage.getItem(CLE_RAFRAICHISSEMENT),
  }),
  ecrire: (acces, rafraichissement) => {
    localStorage.setItem(CLE_ACCES, acces);
    if (rafraichissement) localStorage.setItem(CLE_RAFRAICHISSEMENT, rafraichissement);
  },
  effacer: () => {
    localStorage.removeItem(CLE_ACCES);
    localStorage.removeItem(CLE_RAFRAICHISSEMENT);
  },
};

const apiAdmin = axios.create({ baseURL: API_BASE_URL });

apiAdmin.interceptors.request.use((config) => {
  const { acces } = jetons.lire();
  if (acces) config.headers.Authorization = `Bearer ${acces}`;
  return config;
});

let rafraichissementEnCours = null;

apiAdmin.interceptors.response.use(
  (reponse) => reponse,
  async (erreur) => {
    const requeteOriginale = erreur.config;
    if (erreur.response?.status === 401 && !requeteOriginale._dejaTente) {
      requeteOriginale._dejaTente = true;
      const { rafraichissement } = jetons.lire();
      if (!rafraichissement) {
        jetons.effacer();
        return Promise.reject(erreur);
      }
      try {
        if (!rafraichissementEnCours) {
          rafraichissementEnCours = axios
            .post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: rafraichissement })
            .then((r) => r.data.access)
            .finally(() => {
              rafraichissementEnCours = null;
            });
        }
        const nouvelAcces = await rafraichissementEnCours;
        jetons.ecrire(nouvelAcces, rafraichissement);
        requeteOriginale.headers.Authorization = `Bearer ${nouvelAcces}`;
        return apiAdmin(requeteOriginale);
      } catch (erreurRafraichissement) {
        jetons.effacer();
        return Promise.reject(erreurRafraichissement);
      }
    }
    return Promise.reject(erreur);
  }
);

export default apiAdmin;

/**
 * Fabrique un jeu de fonctions CRUD pour une ressource admin donnee.
 * ex: creerRessourceCrud("/admin/contenu/services/")
 */
export function creerRessourceCrud(cheminBase) {
  return {
    lister: (params) => apiAdmin.get(cheminBase, { params }),
    recuperer: (id) => apiAdmin.get(`${cheminBase}${id}/`),
    creer: (donnees, config) => apiAdmin.post(cheminBase, donnees, config),
    modifier: (id, donnees, config) => apiAdmin.patch(`${cheminBase}${id}/`, donnees, config),
    supprimer: (id) => apiAdmin.delete(`${cheminBase}${id}/`),
  };
}