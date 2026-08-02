import { Part } from 'generated/prisma/client';
import { PartType } from 'generated/prisma/enums';

export type CompatabilityPair = {
  baseId: number;
  compatableIds: number[];
};

export type CompatabilityArray = CompatabilityPair[];

export type ChosenWatch = Record<PartType, Part>;

export type FormDependencyTreeResponse = {
  currentTree: ChosenWatch;
  compatability: CompatabilityArray;
};
