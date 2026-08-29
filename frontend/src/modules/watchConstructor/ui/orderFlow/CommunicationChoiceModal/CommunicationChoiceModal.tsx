import { Button, Heading } from "@/shared/ui";
import { useModalStore } from "@/shared/store";
import type { CommunicationChannel } from "@/modules/watchConstructor/utils";
import { useWatchConstructor } from "@/modules/watchConstructor/store";

import styles from "./CommunicationChoiceModal.module.scss";

const CHANNELS: { value: CommunicationChannel; label: string }[] = [
  { value: "avito", label: "Авито" },
  { value: "vk", label: "ВКонтакте" },
  { value: "email", label: "Почта (gmail, yandex)" },
];

export const CommunicationChoiceModal = () => {
  const setCommunicationChannel = useWatchConstructor(
    (state) => state.setCommunicationChannel,
  );
  const confirmCurrentStep = useModalStore((state) => state.confirmCurrentStep);

  const handleChoose = (channel: CommunicationChannel) => () => {
    setCommunicationChannel(channel);
    confirmCurrentStep();
  };

  return (
    <div className={styles.container}>
      <Heading>Оформление заказа</Heading>
      <p className={styles.text}>
        Ваш заказ был сформирован. Для того, чтобы мы могли начать его делать, а
        вы его оплатить, выбирите, пожалуйста способ коммуникации с нами
      </p>
      <div className={styles.channels}>
        {CHANNELS.map((channel) => (
          <Button
            key={channel.value}
            className={styles.channelButton}
            onClick={handleChoose(channel.value)}
          >
            {channel.label}
          </Button>
        ))}
      </div>
    </div>
  );
};