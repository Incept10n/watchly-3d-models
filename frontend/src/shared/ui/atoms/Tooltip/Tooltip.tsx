import type { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import type { TooltipPosition } from "./types";

import styles from "./Tooltip.module.scss";

export type TooltipProps = {
  children: ReactNode;
  position: TooltipPosition;
  className?: string;
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  position,
  className,
}) => {
  return createPortal(
    <div
      className={clsx(styles.tooltip, className)}
      style={{ left: position.x, top: position.y }}
      role="tooltip"
    >
      {children}
    </div>,
    document.body,
  );
};
