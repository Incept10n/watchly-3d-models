import { Button } from "@/shared/ui";

import styles from "./RandomButton.module.scss";

export const RandomButton = () => {
  return <Button className={styles.randomizeButton}>Перемешать модель</Button>;
};
