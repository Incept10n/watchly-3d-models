export const PART_TYPES = [
  "CASE",
  "MOVEMENT",
  "DIAL",
  "BEZEL",
  "HANDS",
  "ROTOR",
  "CRYSTAL",
] as const;

export type PartType = (typeof PART_TYPES)[number];

export type Part = {
  id: number;
  name: string;
  description: string;
  cost: number;
  type: PartType;
  modelUrl: string;
  pictureUrl: string;
  itemUrl: string;
};
