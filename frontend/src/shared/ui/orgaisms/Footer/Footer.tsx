import type { FC } from "react";
import clsx from "clsx";

import { Heading, WatchlyLink } from "../../atoms";
import { AvitoIcon, PinterestIcon, VkIcon, YouTubeIcon } from "../../icons";

import styles from "./Footer.module.scss";

type FooterLink = {
  to: string;
  text: string;
  isInternal: boolean;
};

const FOOTER_LINKS: FooterLink[] = [
  {
    to: "/public-offer",
    text: "Публичная оферта",
    isInternal: true,
  },
  {
    to: "/privacy-policy",
    text: "Политика конфиденциальности",
    isInternal: true,
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
            <WatchlyLink to={link.to} isInternal={link.isInternal}>
              {link.text}
            </WatchlyLink>
          ))}
        </div>
      </div>
      <div className={styles.line} />
      <div className={styles.socialMediaLinksWrapper}>
        <WatchlyLink to={import.meta.env.VITE_VK_URL} isInternal={false}>
          <VkIcon />
        </WatchlyLink>
        <WatchlyLink to={import.meta.env.VITE_PINTEREST_URL} isInternal={false}>
          <PinterestIcon />
        </WatchlyLink>
        <WatchlyLink to={import.meta.env.VITE_AVITO_URL} isInternal={false}>
          <AvitoIcon />
        </WatchlyLink>
        <WatchlyLink to={import.meta.env.VITE_YOUTUBE_URL} isInternal={false}>
          <YouTubeIcon />
        </WatchlyLink>
      </div>
    </div>
  );
};
