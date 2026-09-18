import { api } from './api';
import { Patient, PaginatedResponse } from '../types';

/**
 * Serviço responsável pela comunicação com os endpoints de Pacientes
 * Rotas esperadas do Backend (conforme documentação):
 * GET    /api/patients
 * POST   /api/patients
 * GET    /api/patients/{id}
 * PUT    /api/patients/{id}
 * DELETE /api/patients/{id}
 */

export const PatientService = {
  // Buscar lista de pacientes com paginação e filtros
  getAll: async (page = 0, size = 10, search = ''): Promise<PaginatedResponse<Patient>> => {
    // Na integração real:
    // const response = await api.get('/patients', { params: { page, size, search } });
    // return response.data;

    // Mock response para o Showcase:
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        content: [], // Dados seriam populados aqui
        totalElements: 0,
        totalPages: 0,
        page,
        size
      });
    }, 500));
  },

  // Buscar paciente por ID
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Criar novo paciente
  create: async (data: Partial<Patient>): Promise<Patient> => {
    // const response = await api.post('/patients', data);
    // return response.data;
    console.log("Mock POST /api/patients", data);
    return data as Patient;
  },

  // Atualizar paciente existente
  update: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  // Inativar/Deletar paciente
  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  }
};
