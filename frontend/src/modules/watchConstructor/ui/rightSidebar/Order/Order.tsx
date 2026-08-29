import { Button } from "@/shared/ui";
import { useModalStore } from "@/shared/store";

import { useWatchConstructor } from "@/modules/watchConstructor/store";
import { orderApi } from "@/modules/watchConstructor/api/orderApi";
import { buildOrderSequence } from "../../orderFlow";
import { RublesIcon } from "../../icons";

import styles from "./Order.module.scss";

export const Order = () => {
  const { currentWatch } = useWatchConstructor();
  const runSequence = useModalStore((state) => state.runSequence);

  const totalPrice = Object.entries(currentWatch)
    .map(([, part]) => part.cost)
    .reduce((previousCost, currentCost) => previousCost + currentCost, 0);

  const handleOrder = async () => {
    try {
      const { uid } = await orderApi.createOrder(
        Object.entries(currentWatch).map(([, part]) => part.id),
      );

      runSequence(buildOrderSequence(uid));
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className={styles.orderCotnainer}>
      <div className={styles.priceDisplayContainer}>
        <div className={styles.priceContainer}>
          <div className={styles.price}>{totalPrice}</div>
          <div className={styles.underliningHint}>Стоимость</div>
        </div>
        <RublesIcon className={styles.rublesIcon} />
      </div>
      <Button
        variant="primary"
        className={styles.orderButton}
        onClick={handleOrder}
      >
        Оформить заказ
      </Button>
    </div>
  );
};
