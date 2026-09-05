import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

import { BasePage, Footer, Header, WatchlyLogo } from "@/shared/ui";
import { useModalStore } from "@/shared/store";
import {
  ContactUsModal,
  ContactsWrapper,
  PhoneIcon,
} from "@/modules/watchConstructor/ui";

import styles from "./LegalPage.module.scss";

export type LegalPageProps = {
  title: string;
  content: string;
  className?: string;
};

export const LegalPage: FC<LegalPageProps> = ({
  title,
  content,
  className,
}) => {
  const pushModal = useModalStore((state) => state.pushModal);

  return (
    <BasePage
      header={
        <Header
          headerName={title}
          leftIcon={<WatchlyLogo width={50} height={50} />}
          rightInfo={
            <ContactsWrapper>
              <button
                type="button"
                className={styles.contactButton}
                onClick={() =>
                  pushModal({ id: "contact-us", content: <ContactUsModal /> })
                }
                aria-label="Связаться с нами"
              >
                <PhoneIcon width={25} height={25} />
              </button>
            </ContactsWrapper>
          }
        />
      }
      footer={<Footer />}
    >
      <div className={clsx(styles.legalPage, className)}>
        <div className={styles.content}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </BasePage>
  );
};
