import { useCallback, useEffect, useRef, useState } from 'react';
import { MedicalRecordService } from '../services/medical-record.service';
import { AppointmentService } from '../services/appointment.service';
import { errorDescription } from '../lib/api-error';
import type { MedicalRecordResponse, AppointmentResponse } from '../types';

export function useClinicalData(enabled = true) {
  const [data, setData] = useState<{ records: MedicalRecordResponse[]; appointments: AppointmentResponse[] }>({ records: [], appointments: [] });
  const [loading, setLoading] = useState(enabled);
  const [loadError, setLoadError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  const refresh = useCallback(async (): Promise<boolean> => {
    operation.current?.abort();
    if (!enabled) { setData({ records: [], appointments: [] }); setLoading(false); setLoadError(null); return false; }
    const controller = new AbortController(); operation.current = controller;
    setLoading(true); setLoadError(null);
    try {
      const [records, appointments] = await Promise.all([
        MedicalRecordService.getAll(controller.signal), AppointmentService.getAll(controller.signal),
      ]);
      if (controller.signal.aborted) return false;
      setData({ records, appointments }); return true;
    } catch (cause) {
      if (!controller.signal.aborted) setLoadError(errorDescription(cause));
      return false;
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }, [enabled]);
  useEffect(() => { void refresh(); return () => operation.current?.abort(); }, [refresh]);
  return { ...data, loading, loadError, refresh };
}
