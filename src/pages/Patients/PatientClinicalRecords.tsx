import { Button } from '../../components/ui/Button/Button';
import { useClinicalData } from '../../hooks/useClinicalData';
import { useAuth } from '../../contexts/AuthContext';
import { clinicalRecords } from '../../lib/clinical';
import { displayDate, displayTime } from '../../lib/appointments';

export function PatientClinicalRecords({ patientId }: { patientId: string }) {
  const { hasRole } = useAuth();
  const data = useClinicalData(hasRole(['ADMIN']));
  const records = clinicalRecords(data.records, data.appointments).filter(({ appointment }) => appointment?.patientId === patientId);
  return <div className="space-y-5">
    <div className="flex items-center justify-between gap-3"><h2 className="font-bold text-lg">Registros clínicos do paciente</h2><Button variant="outline" disabled={data.loading} onClick={() => void data.refresh()}>Atualizar registros</Button></div>
    {data.loading ? <p role="status">Carregando registros clínicos...</p> : data.loadError ? <div className="space-y-3"><p role="alert" className="text-red-700">{data.loadError}</p><Button variant="outline" onClick={() => void data.refresh()}>Tentar novamente</Button></div> : !records.length ? <p className="text-sm text-slate-500">Nenhum registro clínico para este paciente.</p> :
      <div className="space-y-4">{records.map(({ record, appointment }) => <article key={record.id} data-record-id={record.id} className="rounded-xl border border-slate-100 p-5"><h3 className="font-semibold text-slate-900">{appointment?.professionalName}</h3>{appointment && <p className="text-xs text-slate-500 mt-1">{displayDate(appointment.date)} · {displayTime(appointment.time)}</p>}<p className="mt-4 text-sm text-slate-700 whitespace-pre-wrap break-words">{record.notes}</p></article>)}</div>}
  </div>;
}
