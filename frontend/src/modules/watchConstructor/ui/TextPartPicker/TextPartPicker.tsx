import { useState, type FC } from "react";
import clsx from "clsx";

import { useWatchConstructor } from "../../store";
import type { Part } from "@/shared/types";
import { getAllCompatibleIds } from "../../utils";
import { watchConstructorApi } from "../../api/watchConstructorApi";

import styles from "./TextPartPicker.module.scss";

export type TextPartPicker = {
  className?: string;
};

type PartState = "chosen" | "disabled" | "available";

export const TextPartPicker: FC<TextPartPicker> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    parts,
    currentTab,
    compatability,
    currentWatch,
    changeCurrentWatch,
    setCompatability,
  } = useWatchConstructor();

  const tabParts = parts.filter((part) => part.type === currentTab);
  const compatibleParts = getAllCompatibleIds(compatability);

  const getPartState = (part: Part): PartState => {
    if (currentWatch[currentTab].id === part.id) {
      return "chosen";
    }

    if (compatibleParts.includes(part.id)) {
      return "available";
    }

    return "disabled";
  };

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const handleChoosePart = async (part: Part) => {
    const updatedWatch = {
      ...currentWatch,
      [currentTab]: part,
    };

    const dependencyTree =
      await watchConstructorApi.formDependencyTree(updatedWatch);

    changeCurrentWatch(dependencyTree.currentTree);
    setCompatability(dependencyTree.compatability);
  };

  return (
    <div
      className={clsx(
        styles.textTabPickerContainer,
        { [styles.expanded]: isExpanded },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {tabParts.map((part) => (
        <div
          key={part.id}
          className={clsx(styles.partInfoContainer, styles[getPartState(part)])}
          onClick={() => handleChoosePart(part)}
        >
          <div className={clsx(styles.partSquare)} />
          <div className={styles.partName}>{part.name}</div>
        </div>
      ))}
    </div>
  );
};
