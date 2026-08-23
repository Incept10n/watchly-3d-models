import type { CompatabilityArray } from "../store/types";

export const getAllCompatibleIds = (compatibility: CompatabilityArray) =>
  compatibility
    .flatMap((part) => part.compatableIds)
    .concat(compatibility.map((part) => part.baseId));
