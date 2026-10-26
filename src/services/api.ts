import axios from 'axios';
import { normalizeApiError } from '../lib/api-error';
import { invalidateSession, tokenStorage } from '../lib/session';

const baseURL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '');

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (!baseURL) throw new Error('Configure VITE_API_URL no arquivo .env.local e reinicie o frontend.');
  const token = tokenStorage.get();
  if (token && config.url !== '/auth/login') {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    if (axios.isAxiosError(error) && error.response?.status === 401 && error.config?.url !== '/auth/login') {
      // Uma resposta tardia da sessão anterior não encerra uma sessão nova.
      const token = tokenStorage.get();
      if (!token || error.config?.headers?.get('Authorization') === `Bearer ${token}`) invalidateSession();
    }
    return Promise.reject(normalizeApiError(error));
  },
);
