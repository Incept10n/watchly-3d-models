import type { FC, ReactNode } from "react";
import clsx from "clsx";

import { Button } from "@/shared/ui";

import styles from "./AdditionalActionButton.module.scss";

export type AdditionalActionButton = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

export const AdditionalActionButton: FC<AdditionalActionButton> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <Button
      className={clsx(styles.additionalActionButton, className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
