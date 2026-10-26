import axios from 'axios';
import type { ApiErrorResponse } from '../types';

const messages: Record<number, string> = {
  400: 'Verifique os dados informados.',
  401: 'Sua sessão é inválida ou expirou. Entre novamente.',
  403: 'Você não tem permissão para acessar este recurso.',
  404: 'Recurso não encontrado.',
  409: 'A operação entrou em conflito com outro registro.',
};

export class ApiError extends Error {
  readonly timestamp: string;
  readonly status: number;
  readonly error: string;
  readonly path: string;
  readonly details: string[] | null;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    Object.assign(this, response);
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data: unknown = error.response?.data;
    const body = data && typeof data === 'object' ? data as Partial<ApiErrorResponse> : {};
    const networkMessage = error.code === 'ECONNABORTED'
      ? 'O servidor demorou para responder. Tente novamente.'
      : 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    return new ApiError({
      timestamp: typeof body.timestamp === 'string' ? body.timestamp : new Date().toISOString(),
      status,
      error: typeof body.error === 'string' ? body.error : status ? 'HTTP Error' : 'Network Error',
      message: typeof body.message === 'string' ? body.message : status ? messages[status] ?? 'Não foi possível concluir a operação.' : networkMessage,
      path: typeof body.path === 'string' ? body.path : error.config?.url ?? '',
      details: Array.isArray(body.details) ? body.details.filter((item): item is string => typeof item === 'string') : null,
    });
  }
  return new ApiError({
    timestamp: new Date().toISOString(), status: 0, error: 'Client Error', path: '', details: null,
    message: error instanceof Error ? error.message : 'Não foi possível concluir a operação.',
  });
}

export function errorDescription(error: unknown): string {
  const normalized = normalizeApiError(error);
  return [normalized.message, ...(normalized.details ?? [])].join(' ');
}
