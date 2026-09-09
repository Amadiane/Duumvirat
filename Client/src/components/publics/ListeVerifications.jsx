import styles from "./ListeVerifications.module.css";

export default function ListeVerifications({ verifications }) {
  return (
    <div className={styles.grille}>
      {verifications.map((v) => (
        <div key={v.numero} className={styles.carte}>
          <div className={styles.entete}>
            <span className={styles.numero}>{v.numero}</span>
            <h3 className={styles.titre}>{v.titre}</h3>
          </div>
          <p className={styles.description}>{v.description}</p>
        </div>
      ))}
    </div>
  );
}
