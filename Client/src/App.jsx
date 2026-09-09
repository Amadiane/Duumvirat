import { Routes, Route } from "react-router-dom";
import LayoutPublic from "./layouts/LayoutPublic";
import LayoutAdmin from "./layouts/LayoutAdmin";
import RouteProtegee from "./routes/RouteProtegee";

import Accueil from "./pages/publiques/Accueil";
import NosServices from "./pages/publiques/NosServices";
import CommentCaMarche from "./pages/publiques/CommentCaMarche";
import PreparerDossier from "./pages/publiques/PreparerDossier";
import ComprendreDevis from "./pages/publiques/ComprendreDevis";
import SeptVerifications from "./pages/publiques/SeptVerifications";
import APropos from "./pages/publiques/APropos";
import Faq from "./pages/publiques/Faq";
import Contact from "./pages/publiques/Contact";
import MentionsLegales from "./pages/publiques/MentionsLegales";
import Page404 from "./pages/publiques/Page404";

import LoginAdmin from "./pages/admin/LoginAdmin";
import TableauBord from "./pages/admin/TableauBord";
import GestionServices from "./pages/admin/GestionServices";
import GestionParcours from "./pages/admin/GestionParcours";
import GestionDocuments from "./pages/admin/GestionDocuments";
import GestionDevis from "./pages/admin/GestionDevis";
import GestionVerifications from "./pages/admin/GestionVerifications";
import GestionFaq from "./pages/admin/GestionFaq";
import GestionCliniques from "./pages/admin/GestionCliniques";
import GestionPages from "./pages/admin/GestionPages";
import GestionMessages from "./pages/admin/GestionMessages";
import GestionDemandes from "./pages/admin/GestionDemandes";

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/nos-services" element={<NosServices />} />
        <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
        <Route path="/preparer-son-dossier" element={<PreparerDossier />} />
        <Route path="/comprendre-le-devis" element={<ComprendreDevis />} />
        <Route path="/7-verifications" element={<SeptVerifications />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="*" element={<Page404 />} />
      </Route>

      <Route path="/admin/connexion" element={<LoginAdmin />} />
      <Route
        path="/admin"
        element={
          <RouteProtegee>
            <LayoutAdmin />
          </RouteProtegee>
        }
      >
        <Route index element={<TableauBord />} />
        <Route path="services" element={<GestionServices />} />
        <Route path="parcours" element={<GestionParcours />} />
        <Route path="documents" element={<GestionDocuments />} />
        <Route path="devis" element={<GestionDevis />} />
        <Route path="verifications" element={<GestionVerifications />} />
        <Route path="faq" element={<GestionFaq />} />
        <Route path="cliniques" element={<GestionCliniques />} />
        <Route path="pages" element={<GestionPages />} />
        <Route path="messages" element={<GestionMessages />} />
        <Route path="demandes" element={<GestionDemandes />} />
      </Route>
    </Routes>
  );
}