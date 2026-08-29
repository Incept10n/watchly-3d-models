import type { ModalDescriptor } from "@/shared/store";
import { useModalStore } from "@/shared/store";

import { CommunicationChoiceModal } from "./CommunicationChoiceModal";
import { OrderLinkConfirmModal } from "./OrderLinkConfirmModal";
import { OrderThanksModal } from "./OrderThanksModal";

export const buildOrderSequence = (orderUid: string): ModalDescriptor[] => [
  {
    id: "order-communication-choice",
    content: <CommunicationChoiceModal />,
  },
  {
    id: "order-link-confirm",
    content: <OrderLinkConfirmModal orderUid={orderUid} />,
  },
  {
    id: "order-thanks",
    content: <OrderThanksModal />,
    onDismiss: () => useModalStore.getState().closeAll(),
  },
];

