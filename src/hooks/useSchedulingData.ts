import { useCallback, useEffect, useRef, useState } from 'react';
import { AppointmentService } from '../services/appointment.service';
import { ScheduleService } from '../services/schedule.service';
import { errorDescription } from '../lib/api-error';
import type { AppointmentResponse, ScheduleResponse } from '../types';

// Cada montagem/refetch consulta a mesma fonte backend. Nunca mantém cache global por sessão.
export function useSchedulingData() {
  const [data, setData] = useState<{ schedules: ScheduleResponse[]; appointments: AppointmentResponse[] }>({ schedules: [], appointments: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);

  const refresh = useCallback(async (): Promise<boolean> => {
    operation.current?.abort();
    const controller = new AbortController();
    operation.current = controller;
    setLoading(true); setLoadError(null);
    try {
      const [schedules, appointments] = await Promise.all([
        ScheduleService.getAll(controller.signal), AppointmentService.getAll(controller.signal),
      ]);
      if (controller.signal.aborted) return false;
      setData({ schedules, appointments });
      return true;
    } catch (cause) {
      if (!controller.signal.aborted) setLoadError(errorDescription(cause));
      return false;
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => operation.current?.abort();
  }, [refresh]);
  return { ...data, loading, loadError, refresh };
}
