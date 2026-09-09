import { Helmet } from "react-helmet-async";
import EntetePage from "./EntetePage";

export default function MentionsLegales() {
  return (
    <>
      <Helmet><title>Mentions légales — Duumvirat Business</title></Helmet>
      <EntetePage titre="Mentions légales / Confidentialité" />
      <section className="section">
        <div className="conteneur" style={{ maxWidth: 680, color: "var(--couleur-texte-att)", fontSize: 15, lineHeight: 1.8 }}>
          <p>
            Cette page présente les mentions légales et la politique de confidentialité de
            Duumvirat Business. Ce contenu doit être finalisé avec un texte juridique complet
            (identité de l'entreprise, hébergeur, conditions d'utilisation, politique de
            protection des données personnelles conforme à la réglementation applicable).
          </p>
          <p style={{ marginTop: 16 }}>
            En attendant la finalisation de ce texte, sachez que les informations transmises via
            le formulaire de contact ou de dossier médical sont utilisées uniquement dans le cadre
            de l'étude de votre demande par Duumvirat Business, avec votre consentement explicite.
          </p>
        </div>
      </section>
    </>
  );
}
