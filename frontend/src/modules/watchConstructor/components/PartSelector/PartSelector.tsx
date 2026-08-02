import { type FC, type ReactNode } from "react";
import clsx from "clsx";

import type { Part } from "@/shared/types";
import { useWatchConstructor } from "../../store";
import { PartSwitcher } from "./ui";
import { getAllOfType } from "../../utils";

import styles from "./PartSelector.module.scss";

export type PartSelectorProps = {
  className?: string;
  children?: ReactNode;
};

export const PartSelector: FC<PartSelectorProps> = ({
  children,
  className,
}) => {
  const { changeCurrentWatch, currentWatch, currentTab, parts, compatability } =
    useWatchConstructor();

  const handleWatchPartClick = async (part: Part) => {
    changeCurrentWatch({ [currentTab]: part });
  };

  return (
    <div className={clsx(styles.partSelectorContainer, className)}>
      <PartSwitcher
        type="buttons"
        parts={getAllOfType(currentTab, parts)}
        selectedId={currentWatch[currentTab].id}
        compatiblePartIds={compatability
          .flatMap((compItem) => compItem.compatableIds)
          .concat(compatability.map((part) => part.baseId))}
        onPartClick={handleWatchPartClick}
      />
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
