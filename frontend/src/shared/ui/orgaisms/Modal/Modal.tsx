import type { FC, MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import { CloseIcon } from "../../icons";

import styles from "./Modal.module.scss";

export type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  dismissible?: boolean;
  zIndex?: number;
  className?: string;
};

export const Modal: FC<ModalProps> = ({
  onClose,
  children,
  dismissible = true,
  zIndex = 1000,
  className,
}) => {
  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (dismissible && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      style={{ zIndex }}
      onClick={handleOverlayClick}
    >
      <div
        className={clsx(styles.modal, className)}
        role="dialog"
        aria-modal="true"
      >
        {dismissible && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
};

