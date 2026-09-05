import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import { Heading } from "../../atoms";

import styles from "./Header.module.scss";

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
      <Link to="/" className={styles.logoLink}>
        {leftIcon}
      </Link>
      <Heading>{headerName}</Heading>
      {rightInfo}
    </div>
  );
};
