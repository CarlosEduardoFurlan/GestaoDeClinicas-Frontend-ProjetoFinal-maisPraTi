import { api } from './api';
import type { SpecialtyRequest, SpecialtyResponse, UUID } from '../types';

export const SpecialtyService = {
  getAll: async (signal?: AbortSignal): Promise<SpecialtyResponse[]> =>
    (await api.get<SpecialtyResponse[]>('/specialties', { signal })).data,
  create: async (data: SpecialtyRequest, signal?: AbortSignal): Promise<SpecialtyResponse> =>
    (await api.post<SpecialtyResponse>('/specialties', data, { signal })).data,
  update: async (id: UUID, data: SpecialtyRequest, signal?: AbortSignal): Promise<SpecialtyResponse> =>
    (await api.put<SpecialtyResponse>(`/specialties/${id}`, data, { signal })).data,
  delete: async (id: UUID, signal?: AbortSignal): Promise<void> => {
    await api.delete(`/specialties/${id}`, { signal });
  },
};
