import type { OrderDetails as OrderDetailsDto } from "@/modules/ordersClient/api/dto";
import { RublesIcon } from "@/shared/ui";

import styles from "./OrderDetails.module.scss";

interface Props {
  order?: OrderDetailsDto;

  loading?: boolean;
}

export function OrderDetails({ order, loading }: Props) {
  if (loading) {
    return <div className={styles.placeholder}>Loading...</div>;
  }

  if (!order) {
    return (
      <div className={styles.placeholder}>
        Select an order to view details
      </div>
    );
  }

  return (
    <div className={styles.details}>
      <div className={styles.uid}>{order.uid}</div>

      <div className={styles.date}>
        {new Date(order.createdAt).toLocaleString()}
      </div>

      <div className={styles.items}>
        {order.items.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.part.pictureUrl ? (
              <img
                className={styles.image}

                src={item.part.pictureUrl}

                alt=""
              />
            ) : (
              <div className={styles.imageFallback} />
            )}

            <div className={styles.itemInfo}>
              <div className={styles.itemName}>{item.part.name}</div>

              <div className={styles.itemType}>{item.part.type}</div>
            </div>

            <div className={styles.itemCost}>
              <span>{item.part.cost}</span>

              <RublesIcon width={16} height={16} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.total}>
        <span>Total</span>

        <span className={styles.totalValue}>
          {order.totalCost}

          <RublesIcon width={20} height={20} className={styles.rublesIcon} />
        </span>
      </div>
    </div>
  );
}