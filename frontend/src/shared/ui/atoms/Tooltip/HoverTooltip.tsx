import {
  cloneElement,
  useState,
  type FC,
  type MouseEvent,
  type ReactElement,
} from "react";

import type { PositionAwareTooltipProps, TooltipPosition } from "./types";

const TOOLTIP_WIDTH = 300;
const TOOLTIP_HEIGHT = 80;
const TOOLTIP_OFFSET = 16;

export type HoverTooltipProps = {
  children: ReactElement;
  tooltip: ReactElement<PositionAwareTooltipProps>;
  position?: "right" | "left";
  wrapperClassName?: string;
};

export const HoverTooltip: FC<HoverTooltipProps> = ({
  children,
  tooltip,
  position = "right",
  wrapperClassName,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursor, setCursor] = useState<TooltipPosition>({ x: 0, y: 0 });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) =>
    setCursor({ x: event.clientX, y: event.clientY });

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const preferredX =
    position === "left" ? cursor.x - TOOLTIP_OFFSET : cursor.x + TOOLTIP_OFFSET;
  const nearLeftEdge = preferredX < TOOLTIP_OFFSET;
  const nearRightEdge =
    preferredX + TOOLTIP_WIDTH > viewportWidth - TOOLTIP_OFFSET;

  const x = nearRightEdge
    ? cursor.x - TOOLTIP_OFFSET - TOOLTIP_WIDTH
    : nearLeftEdge
      ? cursor.x + TOOLTIP_OFFSET
      : preferredX;

  const nearBottomEdge =
    cursor.y + TOOLTIP_HEIGHT > viewportHeight - TOOLTIP_OFFSET;

  const y = nearBottomEdge
    ? cursor.y - TOOLTIP_HEIGHT - TOOLTIP_OFFSET
    : cursor.y + TOOLTIP_OFFSET;

  return (
    <div
      className={wrapperClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isHovered && cloneElement(tooltip, { position: { x, y } })}
    </div>
  );
};
