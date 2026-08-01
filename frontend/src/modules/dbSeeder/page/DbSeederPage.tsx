import { useEffect, useState } from "react";

import { dbSeederApi } from "../api/dbSeederApi";
import type { PartDetailsDto, SeedPartDto } from "../api/dto";
import { PartList } from "../components/PartList";
import { PartForm } from "../components/PartForm";
import type { Part } from "@/shared/types";

import styles from "./DbSeederPage.module.scss";

export function DbSeederPage() {
  const [parts, setParts] = useState<Part[]>([]);

  const [selectedPart, setSelectedPart] = useState<
    PartDetailsDto | undefined
  >();

  const [loading, setLoading] = useState(false);

  async function loadParts() {
    const data = await dbSeederApi.getAllParts();

    setParts(data);
  }

  useEffect(() => {
    loadParts();
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

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h2>Parts</h2>

          <button onClick={createNew}>+ Add</button>
        </div>

        <PartList
          parts={parts}

          onSelect={selectPart}
        />
      </aside>

      <main className={styles.content}>
        <div className={styles.title}>
          {selectedPart ? "Edit Part" : "Create Part"}
        </div>

        <PartForm
          part={selectedPart}

          onSave={savePart}
        />

        {selectedPart && (
          <button
            className={styles.delete}

            onClick={deletePart}
          >
            Delete Part
          </button>
        )}

        {loading && <div>Saving...</div>}
      </main>
    </div>
  );
}
