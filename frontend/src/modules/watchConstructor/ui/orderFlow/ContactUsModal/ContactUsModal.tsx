import { Button, Heading } from "@/shared/ui";
import { useModalStore } from "@/shared/store";
import {
  communicationLinks,
  type CommunicationChannel,
} from "@/modules/watchConstructor/utils";

import styles from "./ContactUsModal.module.scss";

const CHANNELS: { value: CommunicationChannel; label: string }[] = [
  { value: "avito", label: "Авито" },
  { value: "vk", label: "ВКонтакте" },
  { value: "email", label: "Почта (gmail, yandex)" },
];

export const ContactUsModal = () => {
  const closeTop = useModalStore((state) => state.closeTop);

  const handleChoose = (channel: CommunicationChannel) => () => {
    window.open(communicationLinks[channel], "_blank", "noopener,noreferrer");
    closeTop();
  };

  return (
    <div className={styles.container}>
      <Heading>Связаться с нами</Heading>
      <p className={styles.text}>
        Вы захотели чего-то большего. Возможно, у вас есть своя уникальная идея и
        вам бы хотелось, чтобы мы персонально вам подобрали вид часов. Напишите,
        что у вас на уме, выбрав один из способов связи с нами
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