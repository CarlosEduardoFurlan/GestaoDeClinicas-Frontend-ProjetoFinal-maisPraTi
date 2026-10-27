import { api } from './api';
import type { MedicalRecordCreateRequest, MedicalRecordUpdateRequest, MedicalRecordResponse, UUID } from '../types';

export const MedicalRecordService = {
  getAll: async (signal?: AbortSignal): Promise<MedicalRecordResponse[]> =>
    (await api.get<MedicalRecordResponse[]>('/medical-records', { signal })).data,
  getById: async (id: UUID, signal?: AbortSignal): Promise<MedicalRecordResponse> =>
    (await api.get<MedicalRecordResponse>(`/medical-records/${id}`, { signal })).data,
  create: async (data: MedicalRecordCreateRequest, signal?: AbortSignal): Promise<MedicalRecordResponse> =>
    (await api.post<MedicalRecordResponse>('/medical-records', data, { signal })).data,
  update: async (id: UUID, data: MedicalRecordUpdateRequest, signal?: AbortSignal): Promise<MedicalRecordResponse> =>
    (await api.put<MedicalRecordResponse>(`/medical-records/${id}`, data, { signal })).data,
};
