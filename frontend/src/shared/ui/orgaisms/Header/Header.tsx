import type { FC, ReactNode } from "react";

import styles from "./Header.module.scss";
import { Heading } from "../../atoms";

export type HeaderProps = {
  leftIcon: ReactNode;
  headerName: string;
  rightInfo: ReactNode;
};

export const Header: FC<HeaderProps> = ({
  leftIcon,
  headerName,
  rightInfo,
}) => {
  return (
    <div className={styles.header}>
      {leftIcon}
      <Heading>{headerName}</Heading>
      {rightInfo}
    </div>
  );
};
