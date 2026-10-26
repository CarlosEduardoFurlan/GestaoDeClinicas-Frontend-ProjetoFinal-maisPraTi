import { api } from './api';
import type { ProfessionalCreateRequest, ProfessionalUpdateRequest, ProfessionalResponse, UUID } from '../types';

export const ProfessionalService = {
  getAll: async (signal?: AbortSignal): Promise<ProfessionalResponse[]> =>
    (await api.get<ProfessionalResponse[]>('/professionals', { signal })).data,
  getById: async (id: UUID, signal?: AbortSignal): Promise<ProfessionalResponse> =>
    (await api.get<ProfessionalResponse>(`/professionals/${id}`, { signal })).data,
  create: async (data: ProfessionalCreateRequest, signal?: AbortSignal): Promise<ProfessionalResponse> =>
    (await api.post<ProfessionalResponse>('/professionals', data, { signal })).data,
  update: async (id: UUID, data: ProfessionalUpdateRequest, signal?: AbortSignal): Promise<ProfessionalResponse> =>
    (await api.put<ProfessionalResponse>(`/professionals/${id}`, data, { signal })).data,
  delete: async (id: UUID, signal?: AbortSignal): Promise<void> => {
    await api.delete(`/professionals/${id}`, { signal });
  },
};
