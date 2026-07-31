import type { PartType } from "@/shared/types";

export interface SeedPartDto {
  name: string;
  description: string;
  cost: number;
  type: PartType;
  modelUrl: string;
  itemUrl: string;

  compatibilityIds: number[];
}

export interface PartDetailsDto extends SeedPartDto {
  id: number;
}
