import { type FC, type ReactNode } from "react";

import styles from "./BasePage.module.scss";

export type BasePageProps = {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
};

export const BasePage: FC<BasePageProps> = ({ header, children, footer }) => {
  return (
    <>
      <div className={styles.headerWrapper}>{header}</div>
      <div className={styles.basePageBody}>{children}</div>
      <div className={styles.basePageFooter}>{footer}</div>
    </>
  );
};
