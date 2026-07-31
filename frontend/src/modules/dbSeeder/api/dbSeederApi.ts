import type { Part, PartType } from "./types";
import type { PartDetailsDto, SeedPartDto } from "./dto";

// const API_URL = `${import.meta.env.BACKEND_URL}/db-seeder`;
const API_URL = `http://localhost:3000/db-seeder`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const dbSeederApi = {
  getAllParts() {
    return request<Part[]>("/parts");
  },

  getPart(id: number) {
    return request<PartDetailsDto>(`/part/${id}`);
  },

  createPart(dto: SeedPartDto) {
    return request<Part>("/part", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  updatePart(id: number, dto: SeedPartDto) {
    return request<Part>(`/part/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  },

  deletePart(id: number) {
    return request<{ success: boolean }>(`/part/${id}`, {
      method: "DELETE",
    });
  },

  getCompatibleOptions(type: PartType) {
    return request<{ id: number; name: string }[]>(
      `/compatible-options/${type}`,
    );
  },
};
