import clsx from "clsx";

import { PART_TYPES, type PartType } from "@/shared/types";
import { useWatchConstructor } from "../../store";
import type { FC } from "react";

import styles from "./PartTabs.module.scss";

const PartTypeToRussianName: Record<PartType, string> = {
  CRYSTAL: "Стекло",
  ROTOR: "Ротор",
  MOVEMENT: "Механизм",
  HANDS: "Стрелки",
  DIAL: "Циферблат",
  BEZEL: "Безель",
  CASE: "Корпус",
};

const toRussianNames = (type: PartType) => PartTypeToRussianName[type];

type PartTabsProps = {
  className?: string;
};

export const PartTabs: FC<PartTabsProps> = ({ className }) => {
  const { setTab, currentTab } = useWatchConstructor();

  const handleTabClick = (tab: PartType) => setTab(tab);

  return (
    <div className={clsx(styles.tabContainer, className)}>
      {PART_TYPES.map((type, index) => (
        <div
          key={index}
          className={clsx(styles.tab, { [styles.active]: currentTab === type })}
          onClick={() => handleTabClick(type)}
        >
          {toRussianNames(type)}
        </div>
      ))}
    </div>
  );
};
