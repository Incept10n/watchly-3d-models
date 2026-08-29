import type { Part } from "@/shared/types";
import type { FC } from "react";
import clsx from "clsx";

import { useWatchConstructor } from "@/modules/watchConstructor/store";
import { getAllCompatibleIds } from "@/modules/watchConstructor/utils";
import { watchConstructorApi } from "@/modules/watchConstructor/api/watchConstructorApi";
// import { ArrowIcon } from "../icons";

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

  // const handleClickUp = async () => {
  //   const nextPartIndex =
  //     chosenIndex - 1 < 0 ? tabParts.length - 1 : chosenIndex - 1;
  //
  //   await choosePart(tabParts[nextPartIndex]);
  // };

  // const handleClickDown = async () => {
  //   const nextPartIndex =
  //     chosenIndex + 1 >= tabParts.length ? 0 : chosenIndex + 1;
  //
  //   await choosePart(tabParts[nextPartIndex]);
  // };

  return (
    <div className={clsx(styles.imageSwitcherContainer, className)}>
      <div className={styles.imageContainer}>
        <div
          className={styles.imageOverflowContainer}
          style={{ transform: `translateY(${125 - 250 * chosenIndex}px)` }}
        >
          {tabParts.map((part, index) => (
            <img
              key={index}
              src={part.pictureUrl}
              alt="picture"
              className={clsx(styles.image, {
                [styles.disabled]: !compatiblePartIds.includes(part.id),
              })}
              onClick={() => choosePart(part)}
            />
          ))}
        </div>
      </div>

      {
        // <div className={styles.controlls}>
        //   <ArrowIcon className={styles.arrow} onClick={handleClickUp} />
        //   <div className={styles.line}></div>
        //   <ArrowIcon
        //     className={clsx(styles.arrow, styles.bottom)}
        //     onClick={handleClickDown}
        //   />
        // </div>
      }
    </div>
  );
};
