import { api } from './api';
import { Appointment, PaginatedResponse } from '../types';

export const AppointmentService = {
  getAll: async (startDate?: string, endDate?: string, professionalId?: string): Promise<Appointment[]> => {
    // const response = await api.get('/appointments', { params: { startDate, endDate, professionalId } });
    // return response.data;
    return [];
  },

  create: async (data: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  }
};
