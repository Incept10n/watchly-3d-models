import { useEffect, useState } from "react";

import {
  ConstructorContainer,
  ContactsWrapper,
  ImageCarousel,
  Order,
  PartTabs,
  PhoneIcon,
  Separator,
  SideFeatures,
  TextPartPicker,
  ThreeDModelDisplayer,
  UserIcon,
} from "../ui";
import { watchConstructorApi } from "../api/watchConstructorApi";
import { useWatchConstructor } from "../store";
import type { PartType } from "@/shared/types";
import { BasePage, Header, WatchlyLogo } from "@/shared/ui";

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
    <BasePage
      header={
        <Header
          headerName="Дизайн времени"
          leftIcon={<WatchlyLogo width={50} height={50} />}
          rightInfo={
            <ContactsWrapper>
              <UserIcon width={25} height={25} />
              <PhoneIcon width={25} height={25} />
            </ContactsWrapper>
          }
        />
      }
      footer={<div></div>}
    >
      <PartTabs className={styles.tabs} />
      <ConstructorContainer className={styles.constructorContainer}>
        <TextPartPicker className={styles.textPicker} />
        <ImageCarousel className={styles.imageCarousel} />
        <ThreeDModelDisplayer className={styles.threeDModelDisplayer} />
        <SideFeatures>
          <Order />
          <Separator />
        </SideFeatures>
      </ConstructorContainer>
    </BasePage>
  );
};
