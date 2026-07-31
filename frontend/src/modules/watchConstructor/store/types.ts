import type { Nullable, Part, PartType } from "@/shared/types";

export type WatchConstructorState = {
  parts: Part[];
  currentTab: PartType;
  currentWatch: ChosenWatch;
};

export type ChosenWatch = Record<PartType, Nullable<Part>>;

export type WatchConstructorActions = {
  switchTab: (tab: PartType) => void;
  changeCurrentWatch: (nextCurrentWatch: Partial<ChosenWatch>) => void;
  setParts: (parts: Part[]) => void;
};
