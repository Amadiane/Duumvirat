import styles from "./SquelettteCarte.module.css";

export default function SquelettteCarte({ lignes = 3 }) {
  return (
    <div className={styles.carte}>
      <div className={styles.ligneTitre} />
      {Array.from({ length: lignes }).map((_, i) => (
        <div key={i} className={styles.ligne} />
      ))}
    </div>
  );
}
