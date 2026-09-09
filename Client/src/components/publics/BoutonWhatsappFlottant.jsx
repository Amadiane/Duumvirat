import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WHATSAPP_NUMERO } from "../../config/config";
import styles from "./BoutonWhatsappFlottant.module.css";

export default function BoutonWhatsappFlottant() {
  const { t } = useTranslation();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMERO}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.bouton}
      aria-label={t("cta.whatsapp")}
    >
      <MessageCircle size={24} aria-hidden="true" />
    </a>
  );
}
