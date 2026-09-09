import styles from "./Chronologie.module.css";

export default function Chronologie({ etapes }) {
  return (
    <ol className={styles.ligne}>
      {etapes.map((etape) => (
        <li key={etape.numero} className={styles.etape}>
          <span className={styles.puce}>{etape.numero}</span>
          <div className={styles.contenu}>
            <h3 className={styles.titre}>{etape.titre}</h3>
            {etape.description && <p className={styles.description}>{etape.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
