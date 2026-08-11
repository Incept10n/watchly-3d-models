import type { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button className={clsx(styles.watchlyButton, className)} {...props}>
      {children}
    </button>
  );
};
