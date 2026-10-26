import { api } from './api';
import type { PatientCreateRequest, PatientUpdateRequest, PatientResponse, UUID } from '../types';

export const PatientService = {
  getAll: async (signal?: AbortSignal): Promise<PatientResponse[]> => (await api.get<PatientResponse[]>('/patients', { signal })).data,
  getById: async (id: UUID, signal?: AbortSignal): Promise<PatientResponse> => (await api.get<PatientResponse>(`/patients/${id}`, { signal })).data,
  create: async (data: PatientCreateRequest, signal?: AbortSignal): Promise<PatientResponse> => (await api.post<PatientResponse>('/patients', data, { signal })).data,
  update: async (id: UUID, data: PatientUpdateRequest, signal?: AbortSignal): Promise<PatientResponse> => (await api.put<PatientResponse>(`/patients/${id}`, data, { signal })).data,
};
