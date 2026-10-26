import { api } from './api';
import type { AuthenticatedUser, LoginRequest, LoginResponse } from '../types';

export const AuthService = {
  login: async (data: LoginRequest, signal?: AbortSignal): Promise<LoginResponse> =>
    (await api.post<LoginResponse>('/auth/login', data, { signal })).data,
  me: async (signal?: AbortSignal): Promise<AuthenticatedUser> =>
    (await api.get<AuthenticatedUser>('/auth/me', { signal })).data,
};
