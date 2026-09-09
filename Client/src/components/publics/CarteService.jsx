import styles from "./CarteService.module.css";

export default function CarteService({ numero, titre, description }) {
  return (
    <div className={styles.carte}>
      <span className={styles.numero}>{String(numero).padStart(2, "0")}</span>
      <h3 className={styles.titre}>{titre}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
