import type { Part } from "@/shared/types";
import type { FC } from "react";
import clsx from "clsx";

import { ArrowIcon } from "../../../icons";
import { useWatchConstructor } from "@/modules/watchConstructor/store";

import styles from "./ImageCarousel.module.scss";

export type ImageCarouselProps = {
  parts: Part[];
  onSelect: (part: Part) => void;
  className?: string;
};

// TODO: add disabled state

export const ImageCarousel: FC<ImageCarouselProps> = ({
  parts,
  onSelect,
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

    console.log("here");

    onSelect(parts[nextPartIndex]);
  };

  return (
    <div className={clsx(styles.imageSwitcherContainer, className)}>
      <div className={styles.imageContainer}>
        <div
          className={styles.imageOverflowContainer}
          style={{ top: 150 - 300 * chosenIndex }}
        >
          {parts.map((part, index) => (
            <img
              key={index}
              src={part.pictureUrl}
              alt="picture"
              className={styles.image}
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
