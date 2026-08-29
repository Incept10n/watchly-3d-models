import { useEffect } from "react";

import { useModalStore } from "@/shared/store";
import { Modal } from "../Modal";

const BASE_Z_INDEX = 1000;

export const ModalHost = () => {
  const queue = useModalStore((state) => state.queue);
  const sequence = useModalStore((state) => state.sequence);
  const closeTop = useModalStore((state) => state.closeTop);
  const dismissCurrentStep = useModalStore((state) => state.dismissCurrentStep);

  const currentStep = sequence
    ? sequence.steps[sequence.currentIndex]
    : undefined;
  const topOfQueue = queue[queue.length - 1];

  const activeModal = currentStep ?? topOfQueue;
  const dismissible =
    activeModal?.dismissible === undefined ? true : activeModal.dismissible;

  useEffect(() => {
    if (!dismissible) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (currentStep) {
          dismissCurrentStep();
        } else {
          closeTop();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dismissible, currentStep, dismissCurrentStep, closeTop]);

  return (
    <>
      {queue.map((descriptor, index) => (
        <Modal
          key={descriptor.id}
          onClose={closeTop}
          dismissible={descriptor.dismissible}
          zIndex={BASE_Z_INDEX + index}
        >
          {descriptor.content}
        </Modal>
      ))}
      {currentStep && sequence && (
        <Modal
          key={`${sequence.id}-${sequence.currentIndex}`}
          onClose={dismissCurrentStep}
          dismissible={currentStep.dismissible}
          zIndex={BASE_Z_INDEX + queue.length}
        >
          {currentStep.content}
        </Modal>
      )}
    </>
  );
};