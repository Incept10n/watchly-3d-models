import { useEffect, useState, type FC } from "react";
import clsx from "clsx";

import type { Part } from "@/shared/types";
import { useWatchConstructor } from "../../store";
import { watchConstructorApi } from "../../api/watchConstructorApi";

import styles from "./PartSelector.module.scss";

export type PartSelectorProps = {
  className?: string;
};

export const PartSelector: FC<PartSelectorProps> = ({ className }) => {
  const { changeCurrentWatch, currentTab, parts, currentWatch } =
    useWatchConstructor();
  const [compatiblePartIds, setCompatiblePartIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCompatibleParts = async () => {
      if (currentTab === "CASE") {
        setCompatiblePartIds(
          parts.filter((part) => part.type === "CASE").map((part) => part.id),
        );
      }

      if (currentTab === "MOVEMENT" || currentTab === "BEZEL") {
        if (!currentWatch.CASE) {
          throw new Error("no case was chosen");
        }

        const compatibleParts = await watchConstructorApi.getCompatibleParts(
          currentWatch.CASE.id,
        );

        setCompatiblePartIds(compatibleParts.map((part) => part.id));
      }

      // if it's not the case or movement bezel, then it's everything else and it depends on movement
      if (!currentWatch.MOVEMENT) {
        throw new Error("no movement was chosen");
      }

      const compatibleParts = await watchConstructorApi.getCompatibleParts(
        currentWatch.MOVEMENT.id,
      );
      setCompatiblePartIds(compatibleParts.map((part) => part.id));
    };

    fetchCompatibleParts();
  }, [currentWatch, currentTab, parts]);

  const handleWatchPartClick = (part: Part) => {
    changeCurrentWatch({ [currentTab]: part });
  };

  return (
    <div className={clsx(styles.partSelectorContainer, className)}>
      {parts.map((part, index) => (
        <button
          key={index}
          className={clsx(styles.part, {
            [styles.disabled]: !compatiblePartIds.includes(part.id),
          })}
          onClick={() => handleWatchPartClick(part)}
        >
          {part.name}
        </button>
      ))}
    </div>
  );
};
