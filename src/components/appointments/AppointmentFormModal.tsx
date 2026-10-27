import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Modal } from '../overlay/Modal/Modal';
import { Button } from '../ui/Button/Button';
import { FormField } from '../forms/FormField';
import { SelectField } from './SelectField';
import { useApiList } from '../../hooks/useApiList';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { PatientService } from '../../services/patient.service';
import { ProfessionalService } from '../../services/professional.service';
import { AppointmentService } from '../../services/appointment.service';
import { availableSchedules, displayTime, timeKey } from '../../lib/appointments';
import { errorDescription, normalizeApiError } from '../../lib/api-error';
import type { AppointmentResponse, ScheduleResponse } from '../../types';

export function AppointmentFormModal({ schedules, appointments, initialSlot, initialPatientId, loading, loadError, refresh, onSaved, onClose }: {
  schedules: ScheduleResponse[]; appointments: AppointmentResponse[]; initialSlot?: ScheduleResponse;
  initialPatientId?: string;
  loading: boolean; loadError: string | null; refresh: () => Promise<boolean>;
  onSaved: (saved: AppointmentResponse) => void; onClose: () => void;
}) {
  const { hasRole } = useAuth();
  const allowed = hasRole(['ADMIN', 'RECEPTIONIST']);
  const patients = useApiList(PatientService.getAll);
  const professionals = useApiList(ProfessionalService.getAll);
  const [patientId, setPatientId] = useState(initialPatientId ?? '');
  const [professionalId, setProfessionalId] = useState(initialSlot?.professionalId ?? '');
  const [date, setDate] = useState(initialSlot?.date ?? '');
  const [time, setTime] = useState(initialSlot?.time ?? '');
  const [notes, setNotes] = useState('');
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  const { success, error } = useToast();
  useEffect(() => () => operation.current?.abort(), []);

  const slots = availableSchedules(schedules, appointments).filter((item) => item.professionalId === professionalId && item.date === date).sort((a, b) => timeKey(a.time).localeCompare(timeKey(b.time)));
  const selected = slots.find((item) => timeKey(item.time) === timeKey(time));
  const optionsLoading = patients.loading || professionals.loading;
  const optionsError = patients.loadError || professionals.loadError;
  const blocked = loading || !!loadError || optionsLoading || !!optionsError;

  const save = async (event: FormEvent) => {
    event.preventDefault(); if (!allowed || operation.current || blocked) return;
    if (!patientId || !selected) { setFormError('Selecione o paciente e um horário disponível.'); return; }
    const controller = new AbortController(); operation.current = controller;
    setPending(true); setFormError(null);
    try {
      const saved = await AppointmentService.create({ patientId, professionalId: selected.professionalId, date: selected.date, time: selected.time, notes: notes.trim() || null }, controller.signal);
      if (controller.signal.aborted) return;
      success('Consulta agendada', saved.patientName); onSaved(saved);
    } catch (cause) {
      if (!controller.signal.aborted) {
        const message = errorDescription(cause); setFormError(message); error('Não foi possível agendar consulta', message);
        if ([404, 409].includes(normalizeApiError(cause).status)) await refresh();
      }
    } finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };

  return <Modal isOpen title="Nova Consulta" onClose={() => { if (!pending) onClose(); }}>
    <form onSubmit={save} aria-busy={pending} className="space-y-4">
      <fieldset disabled={pending || blocked} className="space-y-4">
        <SelectField id="appointment-patient" label="Paciente" required disabled={!!initialPatientId} value={patientId} onChange={(event) => setPatientId(event.target.value)}>
          <option value="">Selecione o paciente</option>
          {patients.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </SelectField>
        <SelectField id="appointment-professional" label="Profissional" required value={professionalId} onChange={(event) => { setProfessionalId(event.target.value); setTime(''); }}>
          <option value="">Selecione o profissional</option>
          {professionals.items.map((item) => <option key={item.id} value={item.id}>{item.name}{item.specialtyName ? ` — ${item.specialtyName}` : ''}</option>)}
        </SelectField>
        <FormField id="appointment-date" label="Data" type="date" required value={date} onChange={(event) => { setDate(event.target.value); setTime(''); }} />
        <SelectField id="appointment-time" label="Horário disponível" required value={selected?.time ?? ''} onChange={(event) => setTime(event.target.value)}>
          <option value="">Selecione o horário</option>
          {slots.map((item) => <option key={item.id} value={item.time}>{displayTime(item.time)}</option>)}
        </SelectField>
        {professionalId && date && !slots.length && <p className="text-sm text-slate-500">Nenhum horário disponível para este profissional nesta data.</p>}
        <div className="space-y-1.5"><label htmlFor="appointment-notes" className="block text-xs font-bold text-slate-700">Observações</label>
          <textarea id="appointment-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
        </div>
      </fieldset>
      {optionsLoading && <p role="status">Carregando pacientes e profissionais...</p>}
      {optionsError && <div><p role="alert" className="text-red-700">{optionsError}</p><Button type="button" variant="outline" onClick={() => { patients.retry(); professionals.retry(); }}>Recarregar cadastros</Button></div>}
      {!optionsLoading && !optionsError && (!patients.items.length || !professionals.items.length) && <p className="text-sm text-slate-500">Cadastre paciente e profissional antes de agendar.</p>}
      {loadError && <div><p role="alert" className="text-red-700">{loadError}</p><Button type="button" variant="outline" disabled={pending} onClick={() => void refresh()}>Atualizar disponibilidade</Button></div>}
      {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button>
        <Button type="submit" loading={pending} disabled={blocked || !allowed || !selected || !patientId}>Agendar consulta</Button>
      </div>
    </form>
  </Modal>;
}
