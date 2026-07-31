import type { Part } from "@/shared/types";

import { PartCard } from "../PartCard";

import styles from "./PartList.module.scss";

interface Props {
  parts: Part[];

  onSelect(id: number): void;
}

export function PartList({ parts, onSelect }: Props) {
  return (
    <div className={styles.list}>
      {parts.map((part) => (
        <PartCard
          key={part.id}

          part={part}

          onClick={() => onSelect(part.id)}
        />
      ))}
    </div>
  );
}
