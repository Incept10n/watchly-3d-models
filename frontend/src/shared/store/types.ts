import type { ReactNode } from "react";

export type ModalDescriptor = {
  id: string;
  content: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onDismiss?: () => void;
};

export type SequenceState = {
  id: string;
  steps: ModalDescriptor[];
  currentIndex: number;
};

type ModalState = {
  queue: ModalDescriptor[];
  sequence: SequenceState | null;
};

type ModalActions = {
  pushModal: (descriptor: ModalDescriptor) => void;
  runSequence: (steps: ModalDescriptor[]) => void;
  closeTop: () => void;

  confirmCurrentStep: () => void;
  dismissCurrentStep: () => void;

  nextStep: () => void;
  previousStep: () => void;
  closeAll: () => void;
};

export type ModalStore = ModalState & ModalActions;
