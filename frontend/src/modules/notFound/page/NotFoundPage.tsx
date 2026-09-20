import type { FC } from "react";

import { NotFoundContent } from "../components";

import styles from "./NotFoundPage.module.scss";

export const NotFoundPage: FC = () => {
  return (
    <main className={styles.page}>
      <NotFoundContent />
    </main>
  );
};
