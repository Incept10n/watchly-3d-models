import type { Part } from "@/shared/types";

import styles from "./PartCard.module.scss";

interface Props {
  part: Part;

  onClick(): void;
}

export function PartCard({ part, onClick }: Props) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.name}>{part.name}</div>

      <div className={styles.type}>{part.type}</div>

      <div className={styles.cost}>${part.cost}</div>
    </div>
  );
}
