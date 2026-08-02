import type { FC } from "react";
import clsx from "clsx";

import { useWatchConstructor } from "../../store";

import styles from "./ThreeDModelDisplayer.module.scss";

type ThreeDModelDisplayerProps = {
  className?: string;
};

export const ThreeDModelDisplayer: FC<ThreeDModelDisplayerProps> = ({
  className,
}) => {
  const { currentWatch } = useWatchConstructor();

  return (
    <div className={clsx(styles.modelContainer, className)}>
      {Object.entries(currentWatch).map(([partName, part], index) => (
        <div key={index} style={{ textAlign: "center" }}>
          {part?.name ??
            `${partName} is not present for this kind of case + movement combo`}
        </div>
      ))}
    </div>
  );
};
