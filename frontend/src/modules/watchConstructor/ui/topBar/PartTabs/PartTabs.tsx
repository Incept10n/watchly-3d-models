import clsx from "clsx";
import { useRef, useEffect, useState } from "react";
import { PART_TYPES, type PartType } from "@/shared/types";
import type { FC } from "react";
import { useWatchConstructor } from "@/modules/watchConstructor/store";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const handleTabClick = (tab: PartType) => setTab(tab);

  useEffect(() => {
    if (containerRef.current) {
      const activeTab = containerRef.current.querySelector(`.${styles.active}`);

      if (activeTab) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        setIndicatorStyle({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
        });
      }
    }
  }, [currentTab]);

  return (
    <div ref={containerRef} className={clsx(styles.tabContainer, className)}>
      {PART_TYPES.map((type, index) => (
        <div
          key={index}
          className={clsx(styles.tab, { [styles.active]: currentTab === type })}
          onClick={() => handleTabClick(type)}
        >
          {toRussianNames(type)}
        </div>
      ))}
      <div
        className={styles.indicator}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  );
};
