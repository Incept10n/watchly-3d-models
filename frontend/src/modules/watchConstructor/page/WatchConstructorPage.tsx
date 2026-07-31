import { useEffect } from "react";

import { PartTabs, ThreeDModelDisplayer } from "../components";
import { watchConstructorApi } from "../api/watchConstructorApi";
import { useWatchConstructor } from "../store";

import styles from "./WatchConstructorPage.module.scss";

export const WatchConstructorPage = () => {
  const watchConstructor = useWatchConstructor();

  useEffect(() => {
    const initialLoad = async () => {
      const allParts = await watchConstructorApi.getAllParts();

      watchConstructor.setParts(allParts);
    };

    initialLoad();
  }, []);

  return (
    <div>
      <PartTabs className={styles.tabs} />
      <ThreeDModelDisplayer />
    </div>
  );
};
