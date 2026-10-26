import { api } from './api';
import type { AppointmentCreateRequest, AppointmentStatusUpdateRequest, AppointmentResponse, UUID } from '../types';

// Agenda e Consultas usarão este mesmo service na próxima etapa.
// O mock de listagem é mantido até a integração dessas páginas.
export const AppointmentService = {
  getAll: async (): Promise<AppointmentResponse[]> => [],
  getById: async (id: UUID): Promise<AppointmentResponse> => (await api.get<AppointmentResponse>(`/appointments/${id}`)).data,
  create: async (data: AppointmentCreateRequest): Promise<AppointmentResponse> => (await api.post<AppointmentResponse>('/appointments', data)).data,
  updateStatus: async (id: UUID, data: AppointmentStatusUpdateRequest): Promise<AppointmentResponse> => (await api.put<AppointmentResponse>(`/appointments/${id}`, data)).data,
  cancel: async (id: UUID): Promise<void> => { await api.delete(`/appointments/${id}`); },
};
