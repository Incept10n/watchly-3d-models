import type { Part } from "@/shared/types";
import { request } from "@/shared/utils";

export const watchConstructorApi = {
  getAllParts() {
    return request<Part[]>("/watch/parts");
  },

  getCompatibleParts(part: number) {
    return request<Part[]>(`/watch/compatible-parts?partId=${part}`);
  },
};
