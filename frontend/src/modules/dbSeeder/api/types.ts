export type PartType =
  "CASE" | "MOVEMENT" | "DIAL" | "BEZEL" | "HANDS" | "ROTOR" | "CRYSTAL";

export interface Part {
  id: number;
  name: string;
  description: string;
  cost: number;
  type: PartType;
  modelUrl: string;
  itemUrl: string;
}
