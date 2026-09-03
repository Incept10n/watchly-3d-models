import type { Part } from "@/shared/types";
import type { FC } from "react";
import clsx from "clsx";

import { useWatchConstructor } from "@/modules/watchConstructor/store";
import {
  getAllCompatibleIds,
  getPartConflictInfo,
  getTooltipText,
} from "@/modules/watchConstructor/utils";
import { HoverTooltip, InfoTooltip, Tooltip } from "@/shared/ui";
import { watchConstructorApi } from "@/modules/watchConstructor/api/watchConstructorApi";

import styles from "./ImageCarousel.module.scss";

export type ImageCarouselProps = {
  className?: string;
};

export const ImageCarousel: FC<ImageCarouselProps> = ({ className }) => {
  const {
    currentTab,
    currentWatch,
    changeCurrentWatch,
    setCompatability,
    compatability,
    parts,
  } = useWatchConstructor();

  const tabParts = parts.filter((part) => part.type === currentTab);

  const chosenIndex = tabParts.findIndex(
    (part) => part.id === currentWatch[currentTab].id,
  );

  const compatiblePartIds = getAllCompatibleIds(compatability);

  const choosePart = async (part: Part) => {
    const updatedWatch = {
      ...currentWatch,
      [currentTab]: part,
    };

    const dependencyTree =
      await watchConstructorApi.formDependencyTree(updatedWatch);

    changeCurrentWatch(dependencyTree.currentTree);
    setCompatability(dependencyTree.compatability);
  };

  const renderPartImage = (part: Part, index: number) => {
    const isDisabled = !compatiblePartIds.includes(part.id);
    const conflictInfo = getPartConflictInfo(part, currentWatch, compatability);

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
      <HoverTooltip key={index} tooltip={tooltip} position="right">
        <img
          src={part.pictureUrl}
          alt="picture"
          className={clsx(styles.image, {
            [styles.disabled]: isDisabled,
          })}
          onClick={() => choosePart(part)}
        />
      </HoverTooltip>
    );
  };

  return (
    <div className={clsx(styles.imageSwitcherContainer, className)}>
      <div className={styles.imageContainer}>
        <div
          className={styles.imageOverflowContainer}
          style={{ transform: `translateY(${125 - 250 * chosenIndex}px)` }}
        >
          {tabParts.map(renderPartImage)}
        </div>
      </div>
    </div>
  );
};
