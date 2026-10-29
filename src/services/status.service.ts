import { api } from './api';
import type { StatusResponse } from '../types';

export const StatusService = {
  getAll: async (signal?: AbortSignal): Promise<StatusResponse[]> =>
    (await api.get<StatusResponse[]>('/statuses', { signal })).data,
};
