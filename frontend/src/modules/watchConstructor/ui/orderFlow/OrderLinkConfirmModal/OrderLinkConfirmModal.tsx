import { useState } from "react";

import { Heading } from "@/shared/ui";
import { useModalStore } from "@/shared/store";
import { communicationLinks } from "@/modules/watchConstructor/utils";
import { useWatchConstructor } from "@/modules/watchConstructor/store";
import { CheckedIcon, CopyIcon } from "../../icons";

import styles from "./OrderLinkConfirmModal.module.scss";

export type OrderLinkConfirmModalProps = {
  orderUid: string;
};

export const OrderLinkConfirmModal = ({
  orderUid,
}: OrderLinkConfirmModalProps) => {
  const [copied, setCopied] = useState(false);

  const communicationChannel = useWatchConstructor(
    (state) => state.communicationChannel,
  );
  const confirmCurrentStep = useModalStore((state) => state.confirmCurrentStep);

  const messageToCopy = `Здравствуйте! Я хочу оформить заказ номер ${orderUid}.`;
  const chatLink = communicationLinks[communicationChannel ?? "vk"];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(messageToCopy);
    setCopied(true);
  };

  return (
    <div className={styles.container}>
      <Heading>Оформление заказа</Heading>
      <p className={styles.text}>
        Теперь остался последний шаг. Скопируйте сообщение о вашем заказе ниже,
        нажмите на кнопку ниже, чтобы перейти в чат с нами и отправьте сообщение
      </p>
      <div className={styles.copyableMessage}>
        <span className={styles.message}>{messageToCopy}</span>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Скопировать сообщение"
        >
          {copied ? <CheckedIcon /> : <CopyIcon />}
        </button>
      </div>
      <a
        className={styles.chatLink}
        href={chatLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={confirmCurrentStep}
      >
        Перейти в чат
      </a>
    </div>
  );
};