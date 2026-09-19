import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./CarrouselPhotos.module.css";

/**
 * Carrousel de photos qui defile automatiquement, avec navigation manuelle
 * et points de position. Utilise sur l'accueil pour donner vie au site avec
 * de vraies images (structures, accompagnement, sejour...).
 */
export default function CarrouselPhotos({ photos, dureeMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const [enPause, setEnPause] = useState(false);

  useEffect(() => {
    if (enPause) return;
    const minuteur = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, dureeMs);
    return () => clearInterval(minuteur);
  }, [enPause, photos.length, dureeMs]);

  const suivant = () => setIndex((i) => (i + 1) % photos.length);
  const precedent = () => setIndex((i) => (i - 1 + photos.length) % photos.length);

  const photo = photos[index];

  return (
    <div
      className={styles.carrousel}
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
    >
      <div className={styles.fenetre}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.diapositive}
          >
            <img src={photo.src} alt={photo.alt} className={styles.image} />
            {photo.legende && (
              <div className={styles.legende}>
                <p>{photo.legende}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button className={`${styles.fleche} ${styles.flecheGauche}`} onClick={precedent} aria-label="Photo précédente">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button className={`${styles.fleche} ${styles.flecheDroite}`} onClick={suivant} aria-label="Photo suivante">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.points}>
        {photos.map((_, i) => (
          <button
            key={i}
            className={`${styles.point} ${i === index ? styles.pointActif : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Aller à la photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}