import { useEffect, useState, type FC, type ReactNode } from "react";
import clsx from "clsx";

import type { Part } from "@/shared/types";
import { useWatchConstructor } from "../../store";
import { watchConstructorApi } from "../../api/watchConstructorApi";
import { PartSwitcher } from "./ui";

import styles from "./PartSelector.module.scss";

export type PartSelectorProps = {
  className?: string;
  children?: ReactNode;
};

export const PartSelector: FC<PartSelectorProps> = ({
  children,
  className,
}) => {
  const { changeCurrentWatch, currentTab, parts, currentWatch } =
    useWatchConstructor();
  const [compatiblePartIds, setCompatiblePartIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCompatibleParts = async () => {
      if (currentTab === "CASE") {
        setCompatiblePartIds(
          parts.filter((part) => part.type === "CASE").map((part) => part.id),
        );
        return;
      }

      if (currentTab === "MOVEMENT" || currentTab === "BEZEL") {
        if (!currentWatch.CASE) {
          throw new Error("no case was chosen");
        }

        const compatibleParts = await watchConstructorApi.getCompatibleParts(
          currentWatch.CASE.id,
        );

        setCompatiblePartIds(compatibleParts.map((part) => part.id));
        return;
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
  }, [currentTab, parts]);

  const handleWatchPartClick = (part: Part) => {
    changeCurrentWatch({ [currentTab]: part });
  };

  return (
    <div className={clsx(styles.partSelectorContainer, className)}>
      <PartSwitcher
        type="buttons"
        parts={parts.filter((part) => part.type === currentTab)}
        selectedId={currentWatch[currentTab]?.id || -1}
        compatiblePartIds={compatiblePartIds}
        onPartClick={handleWatchPartClick}
      />
      <div className={styles.modelDisplayer}>{children}</div>
      <PartSwitcher
        type="switcher"
        selectedId={currentWatch[currentTab]?.id || -1}
        parts={parts.filter((part) => part.type === currentTab)}
        compatiblePartIds={compatiblePartIds}
        onPartClick={handleWatchPartClick}
      />
    </div>
  );
};
