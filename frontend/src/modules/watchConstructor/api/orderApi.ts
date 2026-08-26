import { request } from "@/shared/utils";

export const orderApi = {
  createOrder(partIds: number[]) {
    return request<{ uid: string }>("/order", {
      method: "POST",
      body: JSON.stringify({ partIds }),
    });
  },
};
