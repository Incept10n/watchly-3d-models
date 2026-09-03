import { useState, type FC } from "react";
import clsx from "clsx";

import type { Part } from "@/shared/types";
import { HoverTooltip, InfoTooltip, Tooltip } from "@/shared/ui";
import { useWatchConstructor } from "@/modules/watchConstructor/store";
import {
  getAllCompatibleIds,
  getPartConflictInfo,
  getTooltipText,
} from "@/modules/watchConstructor/utils";
import { watchConstructorApi } from "@/modules/watchConstructor/api/watchConstructorApi";

import styles from "./TextPartPicker.module.scss";

export type TextPartPickerProps = {
  className?: string;
};

type PartState = "chosen" | "disabled" | "available";

export const TextPartPicker: FC<TextPartPickerProps> = ({ className }) => {
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

  const renderPartRow = (part: Part) => {
    const partState = getPartState(part);
    const conflictInfo = getPartConflictInfo(part, currentWatch, compatability);
    const isDisabled = partState === "disabled";

    const tooltip =
      isDisabled && conflictInfo ? (
        <Tooltip position={{ x: 0, y: 0 }}>
          {getTooltipText(conflictInfo)}
        </Tooltip>
      ) : (
        <InfoTooltip position={{ x: 0, y: 0 }} title={part.name}>
          {part.description}
        </InfoTooltip>
      );

    return (
      <HoverTooltip
        key={part.id}
        tooltip={tooltip}
        position="right"
        wrapperClassName={styles.tooltipWrapper}
      >
        <div
          className={clsx(styles.partInfoContainer, styles[partState])}
          onClick={() => handleChoosePart(part)}
        >
          <div className={clsx(styles.partSquare)} />
          <div className={styles.partName}>{part.name}</div>
        </div>
      </HoverTooltip>
    );
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
      {tabParts.map(renderPartRow)}
    </div>
  );
};
