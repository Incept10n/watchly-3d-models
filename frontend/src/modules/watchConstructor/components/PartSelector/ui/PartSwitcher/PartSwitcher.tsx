import type { Part } from "@/shared/types";
import type { FC } from "react";
import clsx from "clsx";

import styles from "./PartSwitcher.module.scss";

type PartSwitcherProps = {
  type: "buttons" | "switcher";
  parts: Part[];
  compatiblePartIds: number[];
  onPartClick: (part: Part) => void;
};

export const PartSwitcher: FC<PartSwitcherProps> = ({
  type,
  parts,
  compatiblePartIds,
  onPartClick,
}) => {
  return type === "buttons" ? (
    <div className={styles.buttonSwitcherContainer}>
      {parts.map((part) => (
        <button
          key={part.id}
          className={clsx(styles.part, {
            [styles.disabled]: !compatiblePartIds.includes(part.id),
          })}
          disabled={!compatiblePartIds.includes(part.id)}
          onClick={() => onPartClick(part)}
        >
          {part.name}
        </button>
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
