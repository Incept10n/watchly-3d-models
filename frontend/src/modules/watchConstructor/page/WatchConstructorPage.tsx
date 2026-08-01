import { useEffect } from "react";

import { PartSelector, PartTabs, ThreeDModelDisplayer } from "../components";
import { watchConstructorApi } from "../api/watchConstructorApi";
import { useWatchConstructor } from "../store";

import styles from "./WatchConstructorPage.module.scss";

export const WatchConstructorPage = () => {
  const watchConstructor = useWatchConstructor();

  useEffect(() => {
    const initialLoad = async () => {
      const [allParts, initialPartSequence] = await Promise.all([
        watchConstructorApi.getAllParts(),
        watchConstructorApi.getInitialPartsSequence(),
      ]);

      watchConstructor.setParts(allParts);
      watchConstructor.changeCurrentWatch({
        CASE: initialPartSequence.find((part) => part.type === "CASE"),
        MOVEMENT: initialPartSequence.find((part) => part.type === "MOVEMENT"),
        BEZEL: initialPartSequence.find((part) => part.type === "BEZEL"),
        HANDS: initialPartSequence.find((part) => part.type === "HANDS"),
        ROTOR: initialPartSequence.find((part) => part.type === "ROTOR"),
        DIAL: initialPartSequence.find((part) => part.type === "DIAL"),
        CRYSTAL: initialPartSequence.find((part) => part.type === "CRYSTAL"),
      });
    };

    initialLoad();
  }, []);

  return (
    <div>
      <PartTabs className={styles.tabs} />
      <ThreeDModelDisplayer />
      <PartSelector />
    </div>
  );
};
