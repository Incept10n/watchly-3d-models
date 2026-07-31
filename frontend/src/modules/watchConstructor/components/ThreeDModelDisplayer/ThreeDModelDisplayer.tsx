import type { FC } from "react";

import { useWatchConstructor } from "../../store";
import clsx from "clsx";

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
      {Object.entries(currentWatch).map(([partName, part]) => (
        <div>
          {part?.name ??
            `${partName} is not present for this kind of case + movement combo`}
        </div>
      ))}
    </div>
  );
};
