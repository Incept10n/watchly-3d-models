import type { ReactNode } from "react";

export type TooltipPosition = {
  x: number;
  y: number;
};

export type PositionAwareTooltipProps = {
  children: ReactNode;
  position: TooltipPosition;
};
