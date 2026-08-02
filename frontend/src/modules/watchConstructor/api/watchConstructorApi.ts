import type { Part } from "@/shared/types";
import { request } from "@/shared/utils";
import type { ChosenWatch, CompatabilityArray } from "../store/types";

type InitialPartSquenceReponse = {
  ids: number[];
  compatability: CompatabilityArray;
};

type FormDependencyTreeResponse = {
  currentTree: ChosenWatch;
  compatability: CompatabilityArray;
};

export const watchConstructorApi = {
  getAllParts() {
    return request<Part[]>("/watch/parts");
  },

  getCompatibleParts(partIds: number[]) {
    return request<CompatabilityArray>(
      `/watch/compatible-parts?partIds=${partIds}`,
    );
  },

  formDependencyTree(currentTree: ChosenWatch) {
    return request<FormDependencyTreeResponse>(
      `/watch/correctTreeData?currentTree=${JSON.stringify(currentTree)}`,
    );
  },

  getInitialPartsSequence() {
    return request<InitialPartSquenceReponse>(`/watch/initial-parts`);
  },
};
