import { useEffect, useRef, useState } from "react";

import type {
  OrderDetails as OrderDetailsDto,
  OrderSummary,
  PaginatedOrders,
} from "@/modules/ordersClient/api/dto";
import { ordersClientApi } from "@/modules/ordersClient/api/ordersClientApi";
import {
  OrderDetails,
  OrdersGrid,
} from "@/modules/ordersClient/components";
import { BasePage, Button, Header, WatchlyLogo } from "@/shared/ui";

import styles from "./OrdersClientPage.module.scss";

const PAGE_LIMIT = 12;

export function OrdersClientPage() {
  const [input, setInput] = useState("");

  const [uid, setUid] = useState("");

  const [page, setPage] = useState(1);

  const [refreshKey, setRefreshKey] = useState(0);

  const [orders, setOrders] = useState<OrderSummary[]>([]);

  const [pagination, setPagination] = useState<PaginatedOrders["pagination"]>({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const [loadingList, setLoadingList] = useState(false);

  const loadingRef = useRef(false);

  const [selectedUid, setSelectedUid] = useState<string | undefined>();

  const [selectedOrder, setSelectedOrder] = useState<
    OrderDetailsDto | undefined
  >();

  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setUid(input.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoadingList(true);

      try {
        const data = await ordersClientApi.getAllOrders({
          uid: uid || undefined,
          page: 1,
          limit: PAGE_LIMIT,
        });

        if (cancelled) return;

        setOrders(data.items);

        setPagination(data.pagination);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [uid, refreshKey]);

  const hasMore = pagination.totalPages > page;

  async function loadMore() {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;

    setLoadingList(true);

    try {
      const nextPage = page + 1;

      const data = await ordersClientApi.getAllOrders({
        uid: uid || undefined,
        page: nextPage,
        limit: PAGE_LIMIT,
      });

      setOrders((current) => {
        const known = new Set(current.map((order) => order.uid));

        return [...current, ...data.items.filter((order) => !known.has(order.uid))];
      });

      setPage(nextPage);

      setPagination(data.pagination);
    } finally {
      loadingRef.current = false;

      setLoadingList(false);
    }
  }

  async function selectOrder(nextUid: string) {
    setSelectedUid(nextUid);

    setLoadingDetails(true);

    try {
      const data = await ordersClientApi.getOrderByUid(nextUid);

      setSelectedOrder(data);
    } finally {
      setLoadingDetails(false);
    }
  }

  return (
    <BasePage
      header={
        <Header
          headerName="Orders"
          leftIcon={<WatchlyLogo width={50} height={50} />}
          rightInfo={<div />}
        />
      }
      footer={<div />}
    >
      <div className={styles.page}>
        <aside className={styles.sidebar}>
          <div className={styles.header}>
            <h2>Orders</h2>

            <Button
              variant="primary"

              onClick={() => setRefreshKey((key) => key + 1)}

              disabled={loadingList}
            >
              Refresh
            </Button>
          </div>

          <input
            className={styles.filter}

            value={input}

            onChange={(event) => setInput(event.target.value)}

            placeholder="Filter by uid"
          />

          <div className={styles.list}>
            <OrdersGrid
              key={`${uid}-${refreshKey}`}

              orders={orders}

              selectedUid={selectedUid}

              hasMore={hasMore}

              onSelect={selectOrder}

              onLoadMore={loadMore}
            />

            {loadingList && <div className={styles.loading}>Loading...</div>}
          </div>
        </aside>

        <main className={styles.content}>
          <OrderDetails order={selectedOrder} loading={loadingDetails} />
        </main>
      </div>
    </BasePage>
  );
}