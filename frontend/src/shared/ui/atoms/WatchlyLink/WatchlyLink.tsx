import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";

import styles from "./WatchlyLink.module.scss";

export type WatchlyLinkProps = {
  to: string;
  children?: ReactNode;
};

export const WatchlyLink: FC<WatchlyLinkProps> = ({ to, children }) => {
  const isInternal = to.startsWith("/");

  if (isInternal) {
    return (
      <Link className={clsx(styles.watchlyLink, styles.className)} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <a className={clsx(styles.watchlyLink, styles.className)} href={to}>
      {children}
    </a>
  );
};
