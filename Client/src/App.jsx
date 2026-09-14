import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LayoutPublic from "./layouts/LayoutPublic";
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

// Zone admin chargee a la demande uniquement : un visiteur public ne
// telecharge jamais ce code (ni recharts, ni les ecrans de gestion).
const LayoutAdmin = lazy(() => import("./layouts/LayoutAdmin"));
const LoginAdmin = lazy(() => import("./pages/admin/LoginAdmin"));
const TableauBord = lazy(() => import("./pages/admin/TableauBord"));
const GestionServices = lazy(() => import("./pages/admin/GestionServices"));
const GestionParcours = lazy(() => import("./pages/admin/GestionParcours"));
const GestionDocuments = lazy(() => import("./pages/admin/GestionDocuments"));
const GestionDevis = lazy(() => import("./pages/admin/GestionDevis"));
const GestionVerifications = lazy(() => import("./pages/admin/GestionVerifications"));
const GestionFaq = lazy(() => import("./pages/admin/GestionFaq"));
const GestionCliniques = lazy(() => import("./pages/admin/GestionCliniques"));
const GestionPages = lazy(() => import("./pages/admin/GestionPages"));
const GestionMessages = lazy(() => import("./pages/admin/GestionMessages"));
const GestionDemandes = lazy(() => import("./pages/admin/GestionDemandes"));

function ChargementAdmin() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--couleur-texte-att)", fontSize: 14.5,
    }}>
      Chargement…
    </div>
  );
}

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

      <Route
        path="/admin/connexion"
        element={
          <Suspense fallback={<ChargementAdmin />}>
            <LoginAdmin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<ChargementAdmin />}>
            <RouteProtegee>
              <LayoutAdmin />
            </RouteProtegee>
          </Suspense>
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