import { useEffect, useState } from "react";

import { PartSelector, PartTabs, ThreeDModelDisplayer } from "../components";
import { watchConstructorApi } from "../api/watchConstructorApi";
import { useWatchConstructor } from "../store";
import type { Part, PartType } from "@/shared/types";
import { getAllOfType } from "../utils";

import styles from "./WatchConstructorPage.module.scss";

export const WatchConstructorPage = () => {
  const setParts = useWatchConstructor((state) => state.setParts);
  const changeCurrentWatch = useWatchConstructor(
    (state) => state.changeCurrentWatch,
  );
  const setCompatibleParts = useWatchConstructor(
    (state) => state.setCompatability,
  );
  const currentWatch = useWatchConstructor((state) => state.currentWatch);
  const parts = useWatchConstructor((state) => state.parts);
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
          CASE: getPartWithTypeAndWithAnyId("CASE", initialPartSequence),
          MOVEMENT: getPartWithTypeAndWithAnyId(
            "MOVEMENT",
            initialPartSequence,
          ),
          BEZEL: getPartWithTypeAndWithAnyId("BEZEL", initialPartSequence),
          HANDS: getPartWithTypeAndWithAnyId("HANDS", initialPartSequence),
          ROTOR: getPartWithTypeAndWithAnyId("ROTOR", initialPartSequence),
          DIAL: getPartWithTypeAndWithAnyId("DIAL", initialPartSequence),
          CRYSTAL: getPartWithTypeAndWithAnyId("CRYSTAL", initialPartSequence),
        });
      } catch (error) {
        console.error("Failed to load initial watch data:", error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, [changeCurrentWatch, setParts]);

  useEffect(() => {
    if (isLoading || !currentWatch.CASE || !currentWatch.MOVEMENT) return;

    const loadCompatibleParts = async () => {
      try {
        const compatibleParts = await watchConstructorApi.getCompatibleParts([
          currentWatch.CASE.id,
          currentWatch.MOVEMENT.id,
        ]);
        setCompatibleParts(compatibleParts);

        const flattenedCompatiblePartIds = compatibleParts
          .flatMap((compPart) => compPart.compatableIds)
          .concat(compatibleParts.map((part) => part.baseId));

        for (const [type, part] of Object.entries(currentWatch) as [
          PartType,
          Part,
        ][]) {
          if (!flattenedCompatiblePartIds.includes(part.id)) {
            const replacement = getAllOfType(type, parts).find((part) =>
              flattenedCompatiblePartIds.includes(part.id),
            );
            if (replacement) {
              changeCurrentWatch({
                [type]: replacement,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to load compatible parts:", error);
        // Handle error appropriately
      }
    };

    loadCompatibleParts();
  }, [
    currentWatch.CASE?.id,
    currentWatch.MOVEMENT?.id,
    isLoading,
    changeCurrentWatch,
    setCompatibleParts,
  ]);

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
