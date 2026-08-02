import { create } from "zustand";

import type {
  WatchConstructorState,
  WatchConstructorActions,
  ChosenWatch,
  CompatabilityArray,
} from "./types";

export const useWatchConstructor = create<
  WatchConstructorState & WatchConstructorActions
>((set) => ({
  parts: [],
  compatability: [],
  currentTab: "CASE",
  currentWatch: {} as ChosenWatch,

  setTab: (tab) => set(() => ({ currentTab: tab })),
  setParts: (parts) => set(() => ({ parts })),
  setCompatability: (compatability: CompatabilityArray) =>
    set(() => ({ compatability })),
  changeCurrentWatch: (nextCurrentWatch) =>
    set((state) => ({
      currentWatch: {
        ...state.currentWatch,
        ...nextCurrentWatch,
      },
    })),
}));
