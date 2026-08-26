import type { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "secondary" | "primary";
};

export const Button: FC<ButtonProps> = ({
  variant = "secondary",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        {
          [styles.secondary]: variant === "secondary",
          [styles.primary]: variant === "primary",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
