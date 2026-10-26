import { api } from './api';
import type { UserRequest, UserUpdateRequest, UserResponse, UUID } from '../types';

export const UserService = {
  getAll: async (signal?: AbortSignal): Promise<UserResponse[]> =>
    (await api.get<UserResponse[]>('/users', { signal })).data,
  getById: async (id: UUID, signal?: AbortSignal): Promise<UserResponse> =>
    (await api.get<UserResponse>(`/users/${id}`, { signal })).data,
  create: async (data: UserRequest, signal?: AbortSignal): Promise<UserResponse> =>
    (await api.post<UserResponse>('/users', data, { signal })).data,
  update: async (id: UUID, data: UserUpdateRequest, signal?: AbortSignal): Promise<UserResponse> =>
    (await api.put<UserResponse>(`/users/${id}`, data, { signal })).data,
  delete: async (id: UUID, signal?: AbortSignal): Promise<void> => {
    await api.delete(`/users/${id}`, { signal });
  },
};
