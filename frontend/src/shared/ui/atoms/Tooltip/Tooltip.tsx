import type { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import styles from "./Tooltip.module.scss";

export type TooltipProps = {
  children: ReactNode;
  position: { x: number; y: number };
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
