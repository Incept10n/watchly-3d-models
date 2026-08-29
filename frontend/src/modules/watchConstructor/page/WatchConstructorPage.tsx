import { useEffect, useState } from "react";

import {
  ConstructorContainer,
  ContactUsModal,
  ContactsWrapper,
  FavouritesButton,
  ImageCarousel,
  LeftSidebarWrapper,
  MakeCutomButton,
  Order,
  PartTabs,
  PhoneIcon,
  RandomizeModel,
  Separator,
  SideFeatures,
  TextPartPicker,
  ThreeDModelDisplayer,
} from "../ui";
import { watchConstructorApi } from "../api/watchConstructorApi";
import { useWatchConstructor } from "../store";
import { useModalStore } from "@/shared/store";
import type { PartType } from "@/shared/types";
import { BasePage, Header, WatchlyLogo } from "@/shared/ui";

import styles from "./WatchConstructorPage.module.scss";

export const WatchConstructorPage = () => {
  const { setParts, changeCurrentWatch, setCompatability } =
    useWatchConstructor();
  const pushModal = useModalStore((state) => state.pushModal);
  const [isLoading, setIsLoading] = useState(true);

  const handleContactUs = () => {
    pushModal({ id: "contact-us", content: <ContactUsModal /> });
  };

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
              <button
                type="button"
                className={styles.contactButton}
                onClick={handleContactUs}
                aria-label="Связаться с нами"
              >
                <PhoneIcon width={25} height={25} />
              </button>
            </ContactsWrapper>
          }
        />
      }
      footer={<div></div>}
    >
      <PartTabs className={styles.tabs} />
      <ConstructorContainer className={styles.constructorContainer}>
        <LeftSidebarWrapper>
          <TextPartPicker className={styles.textPicker} />
          <ImageCarousel className={styles.imageCarousel} />
        </LeftSidebarWrapper>
        <ThreeDModelDisplayer className={styles.threeDModelDisplayer} />
        <SideFeatures>
          <Order />
          <Separator />
          <RandomizeModel />
          <FavouritesButton />
          <MakeCutomButton />
        </SideFeatures>
      </ConstructorContainer>
    </BasePage>
  );
};
