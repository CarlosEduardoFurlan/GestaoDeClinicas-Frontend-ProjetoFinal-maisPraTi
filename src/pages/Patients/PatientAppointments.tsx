import { useState } from 'react';
import { LoadingContent } from '../../components/ui/Loading/LoadingContent';
import { Button } from '../../components/ui/Button/Button';
import { StatusBadge } from '../../components/appointments/StatusBadge';
import { AppointmentFormModal } from '../../components/appointments/AppointmentFormModal';
import { useApiList } from '../../hooks/useApiList';
import { useSchedulingData } from '../../hooks/useSchedulingData';
import { useAuth } from '../../contexts/AuthContext';
import { AppointmentService } from '../../services/appointment.service';
import { displayDate, displayTime, timeKey } from '../../lib/appointments';

function PatientAppointmentForm({ patientId, onClose, onSaved }: { patientId: string; onClose: () => void; onSaved: () => void }) {
  const data = useSchedulingData();
  return <AppointmentFormModal {...data} initialPatientId={patientId} onClose={onClose} onSaved={onSaved} />;
}

export function PatientAppointments({ patientId }: { patientId: string }) {
  const { hasRole } = useAuth();
  const { items, loading, loadError, retry } = useApiList(AppointmentService.getAll);
  const [creating, setCreating] = useState(false);
  const appointments = items.filter((item) => item.patientId === patientId)
    .sort((a, b) => b.date.localeCompare(a.date) || timeKey(b.time).localeCompare(timeKey(a.time)) || a.id.localeCompare(b.id));
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-lg">Consultas do paciente</h2><div className="flex flex-wrap gap-3"><Button variant="outline" disabled={loading} onClick={retry}>Atualizar consultas</Button>{hasRole(['ADMIN', 'RECEPTIONIST']) && <Button disabled={loading || !!loadError} onClick={() => setCreating(true)}>Agendar Consulta</Button>}</div></div>
    <LoadingContent loading={loading} error={loadError} label="Carregando consultas do paciente..." errorFallback={<div className="space-y-3"><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={retry}>Tentar novamente</Button></div>}>{!appointments.length ? <p className="text-sm text-slate-500">Nenhuma consulta para este paciente.</p> :
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500 bg-slate-50"><tr><th className="p-4">Data / Horário</th><th className="p-4">Profissional</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{appointments.map((appointment) => <tr key={appointment.id} data-appointment-id={appointment.id}><td className="p-4">{displayDate(appointment.date)} · {displayTime(appointment.time)}</td><td className="p-4 font-semibold">{appointment.professionalName}</td><td className="p-4"><StatusBadge status={appointment.statusName} /></td></tr>)}</tbody></table></div>}</LoadingContent>
    {creating && <PatientAppointmentForm patientId={patientId} onClose={() => { setCreating(false); retry(); }} onSaved={() => { setCreating(false); retry(); }} />}
  </div>;
}
