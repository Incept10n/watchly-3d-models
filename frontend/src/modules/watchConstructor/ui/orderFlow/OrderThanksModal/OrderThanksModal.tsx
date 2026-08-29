import { Heading } from "@/shared/ui";

import styles from "./OrderThanksModal.module.scss";

export const OrderThanksModal = () => {
  return (
    <div className={styles.container}>
      <Heading>Оформление заказа</Heading>
      <p className={styles.text}>
        Спасибо за заказ. Мы совсем скоро с вами свяжемся :)
      </p>
    </div>
  );
};