import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Modal } from '../overlay/Modal/Modal';
import { Button } from '../ui/Button/Button';
import { SelectField } from '../appointments/SelectField';
import { MedicalRecordService } from '../../services/medical-record.service';
import { appointmentsWithoutRecord } from '../../lib/clinical';
import { displayDate, displayTime } from '../../lib/appointments';
import { errorDescription, normalizeApiError } from '../../lib/api-error';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { MedicalRecordResponse, AppointmentResponse } from '../../types';

export function MedicalRecordFormModal({ record, records, appointments, loading, loadError, refresh, onClose, onSaved }: {
  record?: MedicalRecordResponse; records: MedicalRecordResponse[]; appointments: AppointmentResponse[];
  loading: boolean; loadError: string | null; refresh: () => Promise<boolean>;
  onClose: () => void; onSaved: (saved: MedicalRecordResponse) => void;
}) {
  const { user } = useAuth(); const { success, error } = useToast();
  const [appointmentId, setAppointmentId] = useState('');
  const [notes, setNotes] = useState(record?.notes ?? '');
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);
  const available = appointmentsWithoutRecord(records, appointments);
  const selected = available.find((appointment) => appointment.id === appointmentId);
  const related = appointments.find((appointment) => appointment.id === record?.appointmentId);
  const own = (appointment: AppointmentResponse | undefined) => !!user?.professionalId && appointment?.professionalId === user.professionalId;
  const allowed = user?.profile === 'PROFESSIONAL' && (!record || own(related));
  const label = (appointment: AppointmentResponse) => `${displayDate(appointment.date)} ${displayTime(appointment.time)} — ${appointment.patientName} (${appointment.statusName})`;

  const save = async (event: FormEvent) => {
    event.preventDefault(); if (!allowed || operation.current || loading || loadError) return;
    if (!notes.trim() || (!record && (!selected || !own(selected)))) { setFormError('Selecione uma consulta própria e preencha as observações clínicas.'); return; }
    const controller = new AbortController(); operation.current = controller; setPending(true); setFormError(null);
    try {
      const saved = record ? await MedicalRecordService.update(record.id, { notes }, controller.signal)
        : await MedicalRecordService.create({ appointmentId: selected!.id, notes }, controller.signal);
      if (controller.signal.aborted) return;
      success(record ? 'Observações atualizadas' : 'Prontuário criado'); onSaved(saved);
    } catch (cause) {
      if (!controller.signal.aborted) {
        const message = errorDescription(cause); setFormError(message); error('Não foi possível salvar prontuário', message);
        if ([404, 409].includes(normalizeApiError(cause).status)) await refresh();
      }
    } finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  return <Modal isOpen title={record ? 'Editar Observações' : 'Novo Prontuário'} onClose={() => { if (!pending) onClose(); }} className="max-w-2xl">
    <form onSubmit={save} aria-busy={pending} className="space-y-4">
      <fieldset disabled={pending || loading || !!loadError || !allowed} className="space-y-4">
        {record ? <div><p className="text-xs font-bold text-slate-700 mb-2">Consulta relacionada</p><p className="text-sm text-slate-600">{related ? label(related) : 'Consulta relacionada indisponível.'}</p></div> :
          <SelectField id="record-appointment" label="Consulta relacionada" required value={selected?.id ?? ''} onChange={(event) => setAppointmentId(event.target.value)}>
            <option value="">Selecione uma consulta</option>
            {available.map((appointment) => <option key={appointment.id} value={appointment.id}>{label(appointment)}</option>)}
          </SelectField>}
        {!record && !available.length && <p className="text-sm text-slate-500">Nenhuma consulta sem prontuário disponível.</p>}
        <div className="space-y-1.5"><label htmlFor="record-notes" className="block text-xs font-bold text-slate-700">Observações clínicas</label>
          <textarea id="record-notes" required rows={8} value={notes} onChange={(event) => setNotes(event.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm" />
        </div>
      </fieldset>
      {loadError && <div><p role="alert" className="text-red-700">{loadError}</p><Button type="button" variant="outline" disabled={pending} onClick={() => void refresh()}>Recarregar dados</Button></div>}
      {formError && <p role="alert" className="text-red-700 text-sm">{formError}</p>}
      <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button><Button type="submit" loading={pending} disabled={!allowed || loading || !!loadError || (!record && !selected)}>Salvar prontuário</Button></div>
    </form>
  </Modal>;
}
