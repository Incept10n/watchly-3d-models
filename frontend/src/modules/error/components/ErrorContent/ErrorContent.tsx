import type { FC } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/shared/ui";

import styles from "./ErrorContent.module.scss";

export const ErrorContent: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.hero}>ой!</div>
      <h1 className={styles.title}>Что-то пошло не так</h1>
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

