import type { FC } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/shared/ui";
import { NotFoundWatchIcon } from "../NotFoundWatchIcon";

import styles from "./NotFoundContent.module.scss";

export const NotFoundContent: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.hero}>
        <span className={styles.digit} aria-hidden>
          4
        </span>
        <NotFoundWatchIcon width={190} height={190} />
        <span className={styles.digit} aria-hidden>
          4
        </span>
      </div>
      <p className={styles.message}>
        К сожалению, такой страницы не существует
      </p>
      <div className={styles.actions}>
        <Button variant="primary" onClick={() => navigate("/")}>
          Вернуться на главную
        </Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Перезагрузить
        </Button>
      </div>
    </>
  );
};
