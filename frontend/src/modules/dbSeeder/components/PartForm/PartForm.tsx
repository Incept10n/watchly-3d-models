import { useEffect, useState } from "react";

import type { PartDetailsDto, SeedPartDto } from "../../api/dto";
import type { PartType } from "../../api/types";
import { CompatabilitySelector } from "../CompatabilitySelector";

import styles from "./PartForm.module.scss";

interface Props {
  part?: PartDetailsDto;

  onSave(dto: SeedPartDto): Promise<void>;
}

const emptyForm: SeedPartDto = {
  name: "",
  description: "",
  cost: 0,

  type: "CASE",

  modelUrl: "",
  itemUrl: "",

  compatibilityIds: [],
};

export function PartForm({ part, onSave }: Props) {
  const [form, setForm] = useState<SeedPartDto>(emptyForm);

  useEffect(() => {
    if (part) {
      setForm(part);
    } else {
      setForm(emptyForm);
    }
  }, [part]);

  function update<K extends keyof SeedPartDto>(key: K, value: SeedPartDto[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await onSave(form);
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <input
        type="number"
        placeholder="Cost"
        value={form.cost}
        onChange={(e) => update("cost", Number(e.target.value))}
      />

      <select
        value={form.type}
        onChange={(e) => update("type", e.target.value as PartType)}
      >
        {["CASE", "MOVEMENT", "DIAL", "BEZEL", "HANDS", "ROTOR", "CRYSTAL"].map(
          (type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ),
        )}
      </select>

      <input
        placeholder="Model URL"
        value={form.modelUrl}
        onChange={(e) => update("modelUrl", e.target.value)}
      />

      <input
        placeholder="Item URL"
        value={form.itemUrl}
        onChange={(e) => update("itemUrl", e.target.value)}
      />

      <CompatabilitySelector
        type={form.type}

        value={form.compatibilityIds}

        onChange={(ids) => update("compatibilityIds", ids)}
      />

      <button>Save</button>
    </form>
  );
}
