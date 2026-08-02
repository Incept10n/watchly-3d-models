import type { Part } from "@/shared/types";
import { request } from "@/shared/utils";
import type { CompatabilityArray } from "../store/types";

export const watchConstructorApi = {
  getAllParts() {
    return request<Part[]>("/watch/parts");
  },

  getCompatibleParts(partIds: number[]) {
    return request<CompatabilityArray>(
      `/watch/compatible-parts?partIds=${partIds}`,
    );
  },

  getInitialPartsSequence() {
    return request<number[]>(`/watch/initial-parts`);
  },
};
