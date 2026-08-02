import type { Part, PartType } from "@/shared/types";

export type WatchConstructorState = {
  parts: Part[];
  compatability: CompatabilityArray;
  currentWatch: ChosenWatch;
  currentTab: PartType;
};

export type CompatabilityPair = {
  baseId: number;
  compatableIds: number[];
};
export type CompatabilityArray = CompatabilityPair[];

export type ChosenWatch = Record<PartType, Part>;

export type WatchConstructorActions = {
  setTab: (tab: PartType) => void;
  setCompatability: (compatability: CompatabilityArray) => void;
  setParts: (parts: Part[]) => void;

  changeCurrentWatch: (nextCurrentWatch: Partial<ChosenWatch>) => void;
};
