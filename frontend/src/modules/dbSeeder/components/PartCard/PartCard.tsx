import type { Part } from "@/shared/types";
import { RublesIcon } from "@/shared/ui";

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

      <div className={styles.cost}>
        <span>{part.cost}</span>

        <RublesIcon width={12} height={12} />
      </div>
    </div>
  );
}