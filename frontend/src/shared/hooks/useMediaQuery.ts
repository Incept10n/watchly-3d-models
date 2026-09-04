import { useSyncExternalStore } from "react";

const getSnapshot = (query: string) => () => window.matchMedia(query).matches;

const subscribe = (query: string) => (onStoreChange: () => void) => {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onStoreChange);

  return () => mediaQueryList.removeEventListener("change", onStoreChange);
};

export const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    subscribe(query),
    getSnapshot(query),
    getSnapshot(query),
  );

