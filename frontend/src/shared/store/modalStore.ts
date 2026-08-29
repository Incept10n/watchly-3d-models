import { create } from "zustand";

import type { ModalStore } from "./types";

export const useModalStore = create<ModalStore>((set, get) => ({
  queue: [],
  sequence: null,

  pushModal: (descriptor) =>
    set((state) => ({ queue: [...state.queue, descriptor] })),

  runSequence: (steps) =>
    set(() => ({
      sequence: {
        id: crypto.randomUUID(),
        steps,
        currentIndex: 0,
      },
    })),

  closeTop: () =>
    set((state) => {
      const top = state.queue[state.queue.length - 1];
      top?.onClose?.();

      return { queue: state.queue.slice(0, -1) };
    }),

  confirmCurrentStep: () => {
    const { sequence } = get();
    const current = sequence?.steps[sequence.currentIndex];
    current?.onClose?.();

    if (current?.onConfirm) {
      current.onConfirm();
      return;
    }

    get().nextStep();
  },

  dismissCurrentStep: () => {
    const { sequence } = get();
    const current = sequence?.steps[sequence.currentIndex];
    current?.onClose?.();

    if (current?.onDismiss) {
      current.onDismiss();
      return;
    }

    get().previousStep();
  },

  nextStep: () =>
    set((state) => {
      const { sequence } = state;
      if (!sequence) {
        return state;
      }

      const nextIndex = sequence.currentIndex + 1;

      if (nextIndex >= sequence.steps.length) {
        return { sequence: null };
      }

      return { sequence: { ...sequence, currentIndex: nextIndex } };
    }),

  previousStep: () =>
    set((state) => {
      const { sequence } = state;
      if (!sequence) {
        return state;
      }

      const previousIndex = sequence.currentIndex - 1;

      if (previousIndex < 0) {
        return { sequence: null };
      }

      return { sequence: { ...sequence, currentIndex: previousIndex } };
    }),

  closeAll: () => set(() => ({ queue: [], sequence: null })),
}));

