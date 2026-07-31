import { create } from "zustand";

import type { WatchConstructorState, WatchConstructorActions } from "./types";

export const useWatchConstructor = create<
  WatchConstructorState & WatchConstructorActions
>((set) => ({
  parts: [],
  currentTab: "CASE",
  currentWatch: {
    CASE: null,
    BEZEL: null,
    CRYSTAL: null,
    DIAL: null,
    HANDS: null,
    MOVEMENT: null,
    ROTOR: null,
  },
  switchTab: (tab) => set(() => ({ currentTab: tab })),
  setParts: (parts) => set(() => ({ parts })),
  changeCurrentWatch: (nextCurrentWatch) =>
    set((state) => ({
      currentWatch: {
        ...state.currentWatch,
        ...nextCurrentWatch,
      },
    })),
}));
