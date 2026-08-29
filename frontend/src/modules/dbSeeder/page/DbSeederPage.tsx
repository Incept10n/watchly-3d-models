import { useEffect, useState } from "react";

import { dbSeederApi } from "../api/dbSeederApi";
import type { PartDetailsDto, SeedPartDto } from "../api/dto";
import { DeletePartConfirmModal } from "../components/DeletePartConfirmModal";
import { PartForm } from "../components/PartForm";
import { PartList } from "../components/PartList";
import { useModalStore } from "@/shared/store";
import type { Part } from "@/shared/types";
import { BasePage, Button, Header, Heading, WatchlyLogo } from "@/shared/ui";

import styles from "./DbSeederPage.module.scss";

export function DbSeederPage() {
  const [parts, setParts] = useState<Part[]>([]);

  const [selectedPart, setSelectedPart] = useState<
    PartDetailsDto | undefined
  >();

  const [loading, setLoading] = useState(false);

  const pushModal = useModalStore((state) => state.pushModal);

  async function loadParts() {
    const data = await dbSeederApi.getAllParts();

    setParts(data);
  }

  useEffect(() => {
    let cancelled = false;

    dbSeederApi.getAllParts().then((data) => {
      if (!cancelled) setParts(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function selectPart(id: number) {
    const part = await dbSeederApi.getPart(id);

    setSelectedPart(part);
  }

  function createNew() {
    setSelectedPart(undefined);
  }

  async function savePart(dto: SeedPartDto) {
    setLoading(true);

    try {
      if (selectedPart) {
        await dbSeederApi.updatePart(selectedPart.id, dto);
      } else {
        await dbSeederApi.createPart(dto);
      }

      await loadParts();
    } finally {
      setLoading(false);
    }
  }

  async function deletePart() {
    if (!selectedPart) return;

    await dbSeederApi.deletePart(selectedPart.id);

    setSelectedPart(undefined);

    await loadParts();
  }

  function confirmDelete() {
    if (!selectedPart) return;

    pushModal({
      id: "delete-part-confirm",
      content: (
        <DeletePartConfirmModal
          partName={selectedPart.name}
          onConfirm={deletePart}
        />
      ),
    });
  }

  return (
    <BasePage
      header={
        <Header
          headerName="DB Seeder"
          leftIcon={<WatchlyLogo width={50} height={50} />}
          rightInfo={<div />}
        />
      }
      footer={<div />}
    >
      <div className={styles.page}>
        <aside className={styles.sidebar}>
          <div className={styles.header}>
            <Heading>Parts</Heading>

            <Button variant="primary" onClick={createNew}>
              Add
            </Button>
          </div>

          <PartList parts={parts} onSelect={selectPart} />
        </aside>

        <main className={styles.content}>
          <div className={styles.title}>
            {selectedPart ? "Edit Part" : "Create Part"}
          </div>

<PartForm
            key={selectedPart?.id ?? "new"}

            part={selectedPart}

            onSave={savePart}
          />

          {selectedPart && (
            <Button variant="primary" className={styles.delete} onClick={confirmDelete}>
              Delete Part
            </Button>
          )}

          {loading && <div className={styles.saving}>Saving...</div>}
        </main>
      </div>
    </BasePage>
  );
}