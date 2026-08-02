import type { Part, PartType } from "@/shared/types";

export const findPart = (type: PartType, partId: number, allParts: Part[]) =>
  getAllOfType(type, allParts).find((part) => part.id === partId);

export const getAllOfType = (type: PartType, allParts: Part[]) =>
  allParts.filter((part) => part.type === type);
