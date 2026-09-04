import type { FC } from "react";
import clsx from "clsx";

import { Heading, WatchlyLink } from "../../atoms";
import { AvitoIcon, PinterestIcon, VkIcon, YouTubeIcon } from "../../icons";

import styles from "./Footer.module.scss";

type FooterLink = {
  to: string;
  text: string;
};

const FOOTER_LINKS: FooterLink[] = [
  {
    to: import.meta.env.VITE_OFFERTA_URL,
    text: "Публичная оферта",
  },
  {
    to: import.meta.env.VITE_PRIVACY_URL,
    text: "Политика конфиденциальности",
  },
  {
    to: import.meta.env.VITE_CONSENT_URL,
    text: "Согласие на обработку персональных данных",
  },
];

export type FooterProps = {
  className?: string;
};

export const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <div className={clsx(styles.footerWrapper, className)}>
      <div className={styles.upperPart}>
        <Heading>Дизайн времени</Heading>
        <div className={styles.legallLinksWrapper}>
          {FOOTER_LINKS.map((link) => (
            <WatchlyLink to={link.to}>{link.text}</WatchlyLink>
          ))}
        </div>
      </div>
      <div className={styles.line} />
      <div className={styles.socialMediaLinksWrapper}>
        <WatchlyLink to={import.meta.env.VITE_VK_URL}>
          <VkIcon />
        </WatchlyLink>
        <WatchlyLink to={import.meta.env.VITE_PINTEREST_URL}>
          <PinterestIcon />
        </WatchlyLink>
        <WatchlyLink to={import.meta.env.VITE_AVITO_URL}>
          <AvitoIcon />
        </WatchlyLink>
        <WatchlyLink to={import.meta.env.VITE_YOUTUBE_URL}>
          <YouTubeIcon />
        </WatchlyLink>
      </div>
    </div>
  );
};
