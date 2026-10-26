import { api } from './api';
import type { PatientCreateRequest, PatientUpdateRequest, PatientResponse, UUID } from '../types';

// Contratos preparados para a próxima etapa; nenhuma página está integrada.
// Os mocks preexistentes de listagem/criação são preservados nesta rodada.
// Não existe paginação no contrato final nem DELETE permitido de Patient.
export const PatientService = {
  getAll: async (): Promise<PatientResponse[]> => new Promise((resolve) => setTimeout(() => resolve([]), 500)),
  getById: async (id: UUID): Promise<PatientResponse> => (await api.get<PatientResponse>(`/patients/${id}`)).data,
  // Mock: devolve somente a entrada, sem fingir que recebeu ID/resposta persistida.
  create: async (data: PatientCreateRequest): Promise<PatientCreateRequest> => data,
  update: async (id: UUID, data: PatientUpdateRequest): Promise<PatientResponse> => (await api.put<PatientResponse>(`/patients/${id}`, data)).data,
};
