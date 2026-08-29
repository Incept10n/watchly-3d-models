import { useModalStore } from "@/shared/store";
import { Button, Heading } from "@/shared/ui";

import styles from "./DeletePartConfirmModal.module.scss";

interface Props {
  partName: string;

  onConfirm(): Promise<void>;
}

export function DeletePartConfirmModal({ partName, onConfirm }: Props) {
  const closeTop = useModalStore((state) => state.closeTop);

  async function confirm() {
    await onConfirm();

    closeTop();
  }

  return (
    <div className={styles.container}>
      <Heading>Delete part</Heading>

      <p className={styles.text}>
        Are you sure you want to delete <strong>{partName}</strong>? This cannot
        be undone.
      </p>

      <div className={styles.actions}>
        <Button onClick={closeTop}>Cancel</Button>

        <Button variant="primary" className={styles.confirm} onClick={confirm}>
          Delete
        </Button>
      </div>
    </div>
  );
}