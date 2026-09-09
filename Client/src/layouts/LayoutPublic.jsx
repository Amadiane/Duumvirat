import { Outlet } from "react-router-dom";
import Header from "../components/publics/Header";
import Footer from "../components/publics/Footer";
import BoutonWhatsappFlottant from "../components/publics/BoutonWhatsappFlottant";
import BanniereCookies from "../components/publics/BanniereCookies";

export default function LayoutPublic() {
  return (
    <>
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
