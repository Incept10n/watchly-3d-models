import type { FC, ReactNode } from "react";
import clsx from "clsx";

import styles from "./WatchlyLink.module.scss";

export type WatchlyLinkProps = {
  to: string;
  children?: ReactNode;
};

export const WatchlyLink: FC<WatchlyLinkProps> = ({ to, children }) => {
  return (
    <a className={clsx(styles.watchlyLink, styles.className)} href={to}>
      {children}
    </a>
  );
};
