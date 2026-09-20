import type { FC } from "react";

import { ErrorContent } from "../components/ErrorContent";

import styles from "./ErrorPage.module.scss";

export const ErrorPage: FC = () => {
  return (
    <main className={styles.page}>
      <ErrorContent />
    </main>
  );
};
