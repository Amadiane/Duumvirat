import axios from "axios";
import { API_BASE_URL } from "../config/config";

const api = axios.create({ baseURL: API_BASE_URL });

export const contenuService = {
  services: () => api.get("/contenu/services/"),
  etapesParcours: () => api.get("/contenu/etapes-parcours/"),
  documentsDossier: () => api.get("/contenu/documents-dossier/"),
  pointsDevis: () => api.get("/contenu/points-devis/"),
  verifications: () => api.get("/contenu/verifications/"),
  faq: () => api.get("/contenu/faq/"),
  cliniques: () => api.get("/contenu/cliniques/"),
  page: (cle) => api.get(`/contenu/pages/${cle}/`),
};

export const contactService = {
  envoyerMessage: (donnees) => api.post("/contact/messages/", donnees),
  envoyerDemande: (formData) =>
    api.post("/contact/demandes/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
