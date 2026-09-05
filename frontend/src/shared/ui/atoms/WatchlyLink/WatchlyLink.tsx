import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";

import styles from "./WatchlyLink.module.scss";

export type WatchlyLinkProps = {
  to: string;
  isInternal: boolean;
  children?: ReactNode;
};

export const WatchlyLink: FC<WatchlyLinkProps> = ({
  to,
  isInternal,
  children,
}) => {
  const className = clsx(styles.watchlyLink);

  if (isInternal) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={to}>
      {children}
    </a>
  );
};
