import { useEffect, useState } from 'react';
import { Modal } from '../overlay/Modal/Modal';
import { Button } from '../ui/Button/Button';
import { AppointmentService } from '../../services/appointment.service';
import { errorDescription } from '../../lib/api-error';
import { displayDate, displayTime } from '../../lib/appointments';
import { StatusBadge } from './StatusBadge';
import type { AppointmentResponse } from '../../types';

export function AppointmentDetailsModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setLoadError(null); setAppointment(null);
    void AppointmentService.getById(id, controller.signal).then((data) => { if (!controller.signal.aborted) setAppointment(data); })
      .catch((cause: unknown) => { if (!controller.signal.aborted) setLoadError(errorDescription(cause)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, revision]);
  return <Modal isOpen title="Dados da Consulta" onClose={onClose}>
    {loading ? <p role="status">Carregando consulta...</p> : loadError ? <div className="space-y-3"><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={() => setRevision((value) => value + 1)}>Tentar novamente</Button></div> : appointment && <div className="space-y-4" data-appointment-id={appointment.id}>
      <StatusBadge status={appointment.statusName} />
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {[
          ['Paciente', appointment.patientName], ['Profissional', appointment.professionalName],
          ['Data', displayDate(appointment.date)], ['Horário', displayTime(appointment.time)], ['Observações', appointment.notes],
        ].map(([label, value]) => <div key={label}><dt className="text-slate-500 mb-1">{label}</dt><dd className="font-semibold text-slate-900 whitespace-pre-wrap break-words">{value ?? '—'}</dd></div>)}
      </dl>
    </div>}
  </Modal>;
}
