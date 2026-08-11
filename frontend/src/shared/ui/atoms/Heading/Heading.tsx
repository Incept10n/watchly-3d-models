import type { FC, ReactNode } from "react";

import styles from "./Heading.module.scss";

export type HeadingProps = {
  children: ReactNode;
};

export const Heading: FC<HeadingProps> = ({ children }) => {
  return <h2 className={styles.heading}>{children}</h2>;
};
