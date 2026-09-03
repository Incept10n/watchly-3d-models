import type { FC, ReactNode } from "react";

import { Tooltip, type TooltipProps } from "./Tooltip";

import styles from "./InfoTooltip.module.scss";

export type InfoTooltipProps = Omit<TooltipProps, "className"> & {
  title?: ReactNode;
};

export const InfoTooltip: FC<InfoTooltipProps> = ({
  title,
  children,
  ...tooltipProps
}) => (
  <Tooltip className={styles.infoTooltip} {...tooltipProps}>
    {title && <div className={styles.title}>{title}</div>}
    {children}
  </Tooltip>
);
