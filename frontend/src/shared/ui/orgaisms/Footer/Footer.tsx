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
    to: "<...>",
    text: "Публичная оферта",
  },
  {
    to: "<...>",
    text: "Политика конфиденциальности",
  },
  {
    to: "<...>",
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
        <WatchlyLink to={""}>
          <VkIcon />
        </WatchlyLink>
        <WatchlyLink to={""}>
          <PinterestIcon />
        </WatchlyLink>
        <WatchlyLink to={""}>
          <AvitoIcon />
        </WatchlyLink>
        <WatchlyLink to={""}>
          <YouTubeIcon />
        </WatchlyLink>
      </div>
    </div>
  );
};
