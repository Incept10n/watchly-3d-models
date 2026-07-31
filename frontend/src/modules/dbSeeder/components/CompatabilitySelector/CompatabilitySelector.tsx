import { useEffect, useState } from "react";

import { dbSeederApi } from "../../api/dbSeederApi";
import type { PartType } from "@/shared/types";

import styles from "./CompatabilitySelector.module.scss";

interface CompatibilityOption {
  id: number;
  name: string;
}

interface Props {
  type: PartType;

  value: number[];

  onChange(ids: number[]): void;
}

export function CompatabilitySelector({ type, value, onChange }: Props) {
  const [options, setOptions] = useState<CompatibilityOption[]>([]);

  useEffect(() => {
    async function load() {
      if (type === "CASE") {
        setOptions([]);
        return;
      }

      const result = await dbSeederApi.getCompatibleOptions(type);

      setOptions(result);
    }

    load();
  }, [type]);

  function toggle(id: number) {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div className={styles.wrapper}>
      <h3>Compatibility</h3>

      {options.length === 0 ? (
        <span className={styles.empty}>No compatibility required</span>
      ) : (
        <div className={styles.list}>
          {options.map((option) => (
            <label key={option.id} className={styles.item}>
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                onChange={() => toggle(option.id)}
              />

              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
