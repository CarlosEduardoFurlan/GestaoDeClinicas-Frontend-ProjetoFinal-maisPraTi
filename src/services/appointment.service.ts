import { api } from './api';
import type { AppointmentCreateRequest, AppointmentStatusUpdateRequest, AppointmentResponse, UUID } from '../types';

// Agenda e Consultas consomem o mesmo recurso; DELETE é cancelamento lógico.
export const AppointmentService = {
  getAll: async (signal?: AbortSignal): Promise<AppointmentResponse[]> =>
    (await api.get<AppointmentResponse[]>('/appointments', { signal })).data,
  getById: async (id: UUID, signal?: AbortSignal): Promise<AppointmentResponse> =>
    (await api.get<AppointmentResponse>(`/appointments/${id}`, { signal })).data,
  create: async (data: AppointmentCreateRequest, signal?: AbortSignal): Promise<AppointmentResponse> =>
    (await api.post<AppointmentResponse>('/appointments', data, { signal })).data,
  updateStatus: async (id: UUID, data: AppointmentStatusUpdateRequest, signal?: AbortSignal): Promise<AppointmentResponse> =>
    (await api.put<AppointmentResponse>(`/appointments/${id}`, data, { signal })).data,
  cancel: async (id: UUID, signal?: AbortSignal): Promise<void> => {
    await api.delete(`/appointments/${id}`, { signal });
  },
};
