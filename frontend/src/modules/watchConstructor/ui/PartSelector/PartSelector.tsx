import { type FC, type ReactNode } from "react";
import clsx from "clsx";

import type { Part } from "@/shared/types";
import { useWatchConstructor } from "../../store";
import { PartSwitcher } from "./ui";
import { getAllOfType } from "../../utils";
import { watchConstructorApi } from "../../api/watchConstructorApi";

import styles from "./PartSelector.module.scss";
import { RandomButton } from "../RandomButton";

export type PartSelectorProps = {
  className?: string;
  children?: ReactNode;
};

export const PartSelector: FC<PartSelectorProps> = ({
  children,
  className,
}) => {
  const {
    changeCurrentWatch,
    currentWatch,
    currentTab,
    parts,
    compatability,
    setCompatability,
  } = useWatchConstructor();

  const handleWatchPartClick = async (part: Part) => {
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
    <div className={clsx(styles.partSelectorContainer, className)}>
      <div className={styles.leftSwitcherContainer}>
        <PartSwitcher
          type="buttons"
          parts={getAllOfType(currentTab, parts)}
          selectedId={currentWatch[currentTab].id}
          compatiblePartIds={compatability
            .flatMap((compItem) => compItem.compatableIds)
            .concat(compatability.map((part) => part.baseId))}
          onPartClick={handleWatchPartClick}
        />
        <RandomButton />
      </div>
      <div className={styles.modelDisplayer}>{children}</div>
      <PartSwitcher
        type="switcher"
        parts={getAllOfType(currentTab, parts)}
        selectedId={currentWatch[currentTab].id}
        compatiblePartIds={compatability
          .flatMap((compItem) => compItem.compatableIds)
          .concat(compatability.map((part) => part.baseId))}
        onPartClick={handleWatchPartClick}
      />
    </div>
  );
};
