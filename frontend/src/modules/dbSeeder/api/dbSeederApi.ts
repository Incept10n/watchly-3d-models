import type { Part, PartType } from "@/shared/types/models";
import { request } from "@/shared/utils";

import type { PartDetailsDto, SeedPartDto } from "./dto";

export const dbSeederApi = {
  getAllParts() {
    return request<Part[]>("/db-seeder/parts");
  },

  getPart(id: number) {
    return request<PartDetailsDto>(`/db-seeder/part/${id}`);
  },

  createPart(dto: SeedPartDto) {
    return request<Part>("/db-seeder/part", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  updatePart(id: number, dto: SeedPartDto) {
    return request<Part>(`/db-seeder/part/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  },

  deletePart(id: number) {
    return request<{ success: boolean }>(`/db-seeder/part/${id}`, {
      method: "DELETE",
    });
  },

  getCompatibleOptions(type: PartType) {
    return request<{ id: number; name: string }[]>(
      `/db-seeder/compatible-options/${type}`,
    );
  },
};
