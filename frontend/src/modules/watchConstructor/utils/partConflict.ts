import { PART_TYPE_NAMES } from "@/shared/constants";
import type { Part, PartType } from "@/shared/types";
import type { ChosenWatch, CompatabilityArray } from "../store/types";

export type PartConflictInfo = {
  partTypeName: string;
  partName: string;
};

const PARENT_TYPE: Partial<Record<PartType, PartType>> = {
  MOVEMENT: "CASE",
  BEZEL: "CASE",
  HANDS: "MOVEMENT",
  ROTOR: "MOVEMENT",
  DIAL: "MOVEMENT",
  CRYSTAL: "MOVEMENT",
};

export const getPartConflictInfo = (
  part: Part,
  currentWatch: ChosenWatch,
  compatability: CompatabilityArray,
): PartConflictInfo | null => {
  const parentType = PARENT_TYPE[part.type];

  if (!parentType) {
    return null;
  }

  const parent = currentWatch[parentType];
  const parentPair = compatability.find((pair) => pair.baseId === parent.id);

  if (!parentPair || parentPair.compatableIds.includes(part.id)) {
    return null;
  }

  return {
    partTypeName: PART_TYPE_NAMES[parentType].instrumental,
    partName: parent.name,
  };
};

export const getTooltipText = (conflict: PartConflictInfo): string => {
  const { partTypeName, partName } = conflict;

  return `Эта часть несовместима с ${partTypeName} «${partName}». Чтобы использовать её, выберите другой ${partTypeName}, совместимый с этой частью.`;
};
