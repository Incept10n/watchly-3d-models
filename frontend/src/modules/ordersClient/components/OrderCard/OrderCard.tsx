import clsx from "clsx";

import type { OrderSummary } from "@/modules/ordersClient/api/dto";
import { RublesIcon } from "@/shared/ui";

import styles from "./OrderCard.module.scss";

interface Props {
  order: OrderSummary;

  selected: boolean;

  onClick(): void;
}

export function OrderCard({ order, selected, onClick }: Props) {
  return (
    <div
      className={clsx(styles.card, { [styles.selected]: selected })}

      onClick={onClick}
    >
      <div className={styles.uid}>{order.uid}</div>

      <div className={styles.meta}>
        <span>{new Date(order.createdAt).toLocaleString()}</span>

        <span>{order.itemCount} parts</span>
      </div>

      <div className={styles.cost}>
        <span>{order.totalCost}</span>

        <RublesIcon width={14} height={14} className={styles.rublesIcon} />
      </div>
    </div>
  );
}