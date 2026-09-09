import styles from "./EntetePage.module.css";

export default function EntetePage({ titre, intro }) {
  return (
    <div className={styles.entete}>
      <div className="conteneur">
        <h1 className={styles.titre}>{titre}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
    </div>
  );
}
