import { useEffect, useRef } from "react";

import type { OrderSummary } from "@/modules/ordersClient/api/dto";

import { OrderCard } from "../OrderCard";

import styles from "./OrdersGrid.module.scss";

interface Props {
  orders: OrderSummary[];

  selectedUid?: string;

  hasMore: boolean;

  onSelect(uid: string): void;

  onLoadMore(): void;
}

export function OrdersGrid({
  orders,
  selectedUid,
  hasMore,
  onSelect,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, onLoadMore, orders.length]);

  if (orders.length === 0) {
    return <div className={styles.empty}>No orders found</div>;
  }

  return (
    <div className={styles.grid}>
      {orders.map((order) => (
        <OrderCard
          key={order.uid}

          order={order}

          selected={order.uid === selectedUid}

          onClick={() => onSelect(order.uid)}
        />
      ))}

      {hasMore && <div className={styles.sentinel} ref={sentinelRef} />}
    </div>
  );
}