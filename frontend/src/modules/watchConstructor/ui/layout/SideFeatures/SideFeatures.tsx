import type { FC, ReactNode } from "react";
import clsx from "clsx";

import styles from "./SideFeatures.module.scss";

export type SideFeaturesProps = {
  children: ReactNode;
  className?: string;
};

export const SideFeatures: FC<SideFeaturesProps> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.sideFeaturesContainer, className)}>
      {children}
    </div>
  );
};
