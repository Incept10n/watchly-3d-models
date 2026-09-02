import type { PartType } from "@/shared/types";

type PartTypeName = {
  nominative: string;
  instrumental: string;
};

export const PART_TYPE_NAMES: Record<PartType, PartTypeName> = {
  CASE: { nominative: "Корпус", instrumental: "корпусом" },
  MOVEMENT: { nominative: "Механизм", instrumental: "механизмом" },
  DIAL: { nominative: "Циферблат", instrumental: "циферблатом" },
  BEZEL: { nominative: "Безель", instrumental: "безелем" },
  HANDS: { nominative: "Стрелки", instrumental: "стрелками" },
  ROTOR: { nominative: "Ротор", instrumental: "ротором" },
  CRYSTAL: { nominative: "Стекло", instrumental: "стеклом" },
};
