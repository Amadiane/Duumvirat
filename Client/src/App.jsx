import { Routes, Route } from "react-router-dom";
import LayoutPublic from "./layouts/LayoutPublic";
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
    </Routes>
  );
}
