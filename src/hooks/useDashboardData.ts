import { useCallback, useEffect, useRef, useState } from 'react';
import { AppointmentService } from '../services/appointment.service';
import { PatientService } from '../services/patient.service';
import { errorDescription } from '../lib/api-error';
import type { AppointmentResponse, PatientResponse } from '../types';

export function useDashboardData(canReadPatients: boolean) {
  const [data, setData] = useState<{ appointments: AppointmentResponse[]; patients: PatientResponse[] | null }>({ appointments: [], patients: null });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    operation.current?.abort();
    const controller = new AbortController(); operation.current = controller;
    setLoading(true); setLoadError(null);
    try {
      const [appointments, patients] = await Promise.all([
        AppointmentService.getAll(controller.signal),
        canReadPatients ? PatientService.getAll(controller.signal) : Promise.resolve(null),
      ]);
      if (!controller.signal.aborted) setData({ appointments, patients });
    } catch (cause) { if (!controller.signal.aborted) setLoadError(errorDescription(cause)); }
    finally { if (!controller.signal.aborted) setLoading(false); }
  }, [canReadPatients]);
  useEffect(() => { void refresh(); return () => operation.current?.abort(); }, [refresh]);
  return { ...data, loading, loadError, refresh };
}
