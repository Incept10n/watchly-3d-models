import type { Part } from "@/shared/types";
import type { FC } from "react";
import clsx from "clsx";

import { ArrowIcon } from "../../../icons";
import { useWatchConstructor } from "@/modules/watchConstructor/store";

import styles from "./ImageCarousel.module.scss";

export type ImageCarouselProps = {
  parts: Part[];
  onSelect: (part: Part) => void;
  compatiblePartIds: number[];
  className?: string;
};

export const ImageCarousel: FC<ImageCarouselProps> = ({
  parts,
  onSelect,
  compatiblePartIds,
  className,
}) => {
  const { currentTab, currentWatch } = useWatchConstructor();
  const chosenIndex = parts.findIndex(
    (part) => part.id === currentWatch[currentTab].id,
  );

  const handleClickUp = () => {
    const nextPartIndex =
      chosenIndex - 1 < 0 ? parts.length - 1 : chosenIndex - 1;

    onSelect(parts[nextPartIndex]);
  };

  const handleClickDown = () => {
    const nextPartIndex = chosenIndex + 1 >= parts.length ? 0 : chosenIndex + 1;

    onSelect(parts[nextPartIndex]);
  };

  return (
    <div className={clsx(styles.imageSwitcherContainer, className)}>
      <div className={styles.imageContainer}>
        <div
          className={styles.imageOverflowContainer}
          style={{ transform: `translateY(${150 - 300 * chosenIndex}px)` }}
        >
          {parts.map((part, index) => (
            <img
              key={index}
              src={part.pictureUrl}
              alt="picture"
              className={clsx(styles.image, {
                [styles.disabled]: !compatiblePartIds.includes(part.id),
              })}
              onClick={() => onSelect(part)}
            />
          ))}
        </div>
      </div>
      <div className={styles.controlls}>
        <ArrowIcon className={styles.arrow} onClick={handleClickUp} />
        <div className={styles.line}></div>
        <ArrowIcon
          className={clsx(styles.arrow, styles.bottom)}
          onClick={handleClickDown}
        />
      </div>
    </div>
  );
};
