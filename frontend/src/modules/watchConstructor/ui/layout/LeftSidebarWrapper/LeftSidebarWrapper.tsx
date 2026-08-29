import type { FC, ReactNode } from "react";

import styles from "./LeftSidebarWrapper.module.scss";

export type LeftSidebarWrapperProps = {
  children: ReactNode;
};

export const LeftSidebarWrapper: FC<LeftSidebarWrapperProps> = ({
  children,
}) => {
  return <div className={styles.leftSidebarWrapper}>{children}</div>;
};
