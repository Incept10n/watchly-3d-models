import { type FC, type ReactNode } from "react";
import clsx from "clsx";

import styles from "./ConstructorContainer.module.scss";

export type ConstructorContainerProps = {
  className?: string;
  children?: ReactNode;
};

export const ConstructorContainer: FC<ConstructorContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.partSelectorContainer, className)}>
      {children}
    </div>
  );
};
