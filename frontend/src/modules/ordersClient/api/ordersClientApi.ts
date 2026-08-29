import { request } from "@/shared/utils";

import type { OrderDetails, PaginatedOrders } from "./dto";

export const ordersClientApi = {
  getAllOrders(params?: { uid?: string; page?: number; limit?: number }) {
    const search = new URLSearchParams();

    if (params?.uid) {
      search.set("uid", params.uid);
    }

    if (params?.page) {
      search.set("page", String(params.page));
    }

    if (params?.limit) {
      search.set("limit", String(params.limit));
    }

    const query = search.toString();

    return request<PaginatedOrders>(`/order${query ? `?${query}` : ""}`);
  },

  getOrderByUid(uid: string) {
    return request<OrderDetails>(`/order/${uid}`);
  },
};