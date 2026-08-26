import type { FC, ReactNode } from "react";

import styles from "./ContactsWrapper.module.scss";

export type ContactsWrapperProps = {
  children: ReactNode;
};

export const ContactsWrapper: FC<ContactsWrapperProps> = ({ children }) => {
  return <div className={styles.contactsWrapper}>{children}</div>;
};
