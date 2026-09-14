import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/publics/Header";
import Footer from "../components/publics/Footer";
import BoutonWhatsappFlottant from "../components/publics/BoutonWhatsappFlottant";
import BanniereCookies from "../components/publics/BanniereCookies";

const DONNEES_ORGANISATION = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Duumvirat Business",
  description: "Accompagnement médical au Maroc pour les patients d'Afrique subsaharienne : étude du dossier, orientation vers une clinique adaptée, organisation du séjour et accompagnement sur place.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rabat",
    addressCountry: "MA",
  },
  areaServed: "Afrique subsaharienne",
  // Ajouter ici les URLs des reseaux sociaux/pages officielles une fois créées,
  // ex: sameAs: ["https://www.facebook.com/duumviratbusiness", "https://www.linkedin.com/company/duumvirat-business"]
};

export default function LayoutPublic() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(DONNEES_ORGANISATION)}</script>
      </Helmet>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BoutonWhatsappFlottant />
      <BanniereCookies />
    </>
  );
}