import type { Part } from "@/shared/types";
import type { FC } from "react";
import clsx from "clsx";

import styles from "./PartSwitcher.module.scss";
import { Button } from "@/shared/ui";

type PartSwitcherProps = {
  type: "buttons" | "switcher";
  parts: Part[];
  compatiblePartIds: number[];
  selectedId: number;
  onPartClick: (part: Part) => void;
};

export const PartSwitcher: FC<PartSwitcherProps> = ({
  type,
  parts,
  selectedId,
  compatiblePartIds,
  onPartClick,
}) => {
  return type === "buttons" ? (
    <div className={styles.buttonSwitcherContainer}>
      {parts.map((part) => (
        <Button
          key={part.id}
          className={clsx(styles.button, {
            [styles.selected]: part.id === selectedId,
          })}
          disabled={!compatiblePartIds.includes(part.id)}
          onClick={() => onPartClick(part)}
        >
          {part.name}
        </Button>
      ))}
    </div>
  ) : (
    <div className={styles.imageSwitcherContainer}>
      <div className={styles.imageDisplayContainer}>
        {parts.map((part) => (
          <button
            key={part.id}
            className={clsx(styles.partImage, {
              [styles.disabled]: !compatiblePartIds.includes(part.id),
              [styles.selected]: part.id === selectedId,
            })}
            disabled={!compatiblePartIds.includes(part.id)}
            onClick={() => onPartClick(part)}
          >
            {part.name}
          </button>
        ))}
      </div>
      <div className={styles.controls}></div>
    </div>
  );
};
