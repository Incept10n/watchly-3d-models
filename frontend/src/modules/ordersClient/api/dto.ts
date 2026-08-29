import type { PartType } from "@/shared/types";

export interface OrderSummary {
  id: number;
  uid: string;
  createdAt: string;
  itemCount: number;
  totalCost: number;
}

export interface OrderDetails {
  id: number;
  uid: string;
  createdAt: string;
  items: {
    id: number;
    part: {
      id: number;
      name: string;
      type: PartType;
      cost: number;
      pictureUrl: string;
    };
  }[];
  totalCost: number;
}

export interface PaginatedOrders {
  items: OrderSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}