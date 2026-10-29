import { api } from './api';
import type { ScheduleRequest, ScheduleResponse } from '../types';

export const ScheduleService = {
  getAll: async (signal?: AbortSignal): Promise<ScheduleResponse[]> =>
    (await api.get<ScheduleResponse[]>('/schedules', { signal })).data,
  create: async (data: ScheduleRequest, signal?: AbortSignal): Promise<ScheduleResponse> =>
    (await api.post<ScheduleResponse>('/schedules', data, { signal })).data,
};
