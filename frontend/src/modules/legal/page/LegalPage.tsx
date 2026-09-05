import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

import { BasePage, Header, WatchlyLogo } from "@/shared/ui";

import styles from "./LegalPage.module.scss";

export type LegalPageProps = {
  title: string;
  content: string;
  className?: string;
};

export const LegalPage: FC<LegalPageProps> = ({ title, content, className }) => {
  return (
    <BasePage
      header={
        <Header
          headerName={title}
          leftIcon={<WatchlyLogo width={50} height={50} />}
          rightInfo={<div />}
        />
      }
      footer={<div />}
    >
      <div className={clsx(styles.legalPage, className)}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.content}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </BasePage>
  );
};