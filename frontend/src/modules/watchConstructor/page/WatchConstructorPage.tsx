import { useEffect, useState } from "react";

import { PartSelector, PartTabs, ThreeDModelDisplayer } from "../components";
import { watchConstructorApi } from "../api/watchConstructorApi";
import { useWatchConstructor } from "../store";
import type { PartType } from "@/shared/types";

import styles from "./WatchConstructorPage.module.scss";

export const WatchConstructorPage = () => {
  const { setParts, changeCurrentWatch, setCompatability } =
    useWatchConstructor();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialLoad = async () => {
      try {
        const [allParts, initialPartSequence] = await Promise.all([
          watchConstructorApi.getAllParts(),
          watchConstructorApi.getInitialPartsSequence(),
        ]);

        const getPartWithTypeAndWithAnyId = (
          partType: PartType,
          ids: number[],
        ) =>
          allParts
            .filter((part) => part.type === partType)
            .find((part) => ids.includes(part.id));

        setParts(allParts);
        changeCurrentWatch({
          CASE: getPartWithTypeAndWithAnyId("CASE", initialPartSequence.ids),
          MOVEMENT: getPartWithTypeAndWithAnyId(
            "MOVEMENT",
            initialPartSequence.ids,
          ),
          BEZEL: getPartWithTypeAndWithAnyId("BEZEL", initialPartSequence.ids),
          HANDS: getPartWithTypeAndWithAnyId("HANDS", initialPartSequence.ids),
          ROTOR: getPartWithTypeAndWithAnyId("ROTOR", initialPartSequence.ids),
          DIAL: getPartWithTypeAndWithAnyId("DIAL", initialPartSequence.ids),
          CRYSTAL: getPartWithTypeAndWithAnyId(
            "CRYSTAL",
            initialPartSequence.ids,
          ),
        });
        setCompatability(initialPartSequence.compatability);
      } catch (error) {
        console.error("Failed to load initial watch data:", error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, [changeCurrentWatch, setParts, setCompatability]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PartTabs className={styles.tabs} />
      <PartSelector className={styles.leftSelector}>
        <ThreeDModelDisplayer className={styles.model} />
      </PartSelector>
    </div>
  );
};
