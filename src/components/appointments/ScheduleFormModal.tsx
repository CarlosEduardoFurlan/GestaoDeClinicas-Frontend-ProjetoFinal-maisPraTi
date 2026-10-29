import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Modal } from '../overlay/Modal/Modal';
import { Button } from '../ui/Button/Button';
import { FormField } from '../forms/FormField';
import { SelectField } from './SelectField';
import { useApiList } from '../../hooks/useApiList';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ProfessionalService } from '../../services/professional.service';
import { ScheduleService } from '../../services/schedule.service';
import { errorDescription, normalizeApiError } from '../../lib/api-error';
import type { ScheduleResponse } from '../../types';

export function ScheduleFormModal({ initialDate, onClose, onSaved, refresh }: {
  initialDate: string; onClose: () => void; onSaved: (saved: ScheduleResponse) => void; refresh: () => Promise<boolean>;
}) {
  const { user } = useAuth();
  const admin = user?.profile === 'ADMIN';
  const allowed = admin || (user?.profile === 'PROFESSIONAL' && !!user.professionalId);
  const getProfessionals = useCallback((signal?: AbortSignal) => admin ? ProfessionalService.getAll(signal) : Promise.resolve([]), [admin]);
  const professionals = useApiList(getProfessionals);
  const [professionalId, setProfessionalId] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState('');
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  const { success, error } = useToast();
  useEffect(() => () => operation.current?.abort(), []);

  const save = async (event: FormEvent) => {
    event.preventDefault(); if (!allowed || operation.current) return;
    const id = admin ? professionalId : user?.professionalId;
    if (!id || !date || !time) { setFormError('Informe profissional, data e horário.'); return; }
    const controller = new AbortController(); operation.current = controller;
    setPending(true); setFormError(null);
    try {
      const saved = await ScheduleService.create({ professionalId: id, date, time }, controller.signal);
      if (controller.signal.aborted) return;
      success('Horário adicionado'); onSaved(saved);
    } catch (cause) {
      if (!controller.signal.aborted) {
        const message = errorDescription(cause); setFormError(message); error('Não foi possível adicionar horário', message);
        if ([404, 409].includes(normalizeApiError(cause).status)) await refresh();
      }
    } finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };

  return <Modal isOpen title="Adicionar horário" onClose={() => { if (!pending) onClose(); }}>
    <form onSubmit={save} aria-busy={pending} className="space-y-4">
      {!allowed && <p role="alert" className="text-red-700">Sua conta não possui um vínculo profissional válido para abrir horários.</p>}
      <fieldset disabled={pending || !allowed} className="space-y-4">
        {admin ? <SelectField id="schedule-professional" label="Profissional" required value={professionalId} onChange={(event) => setProfessionalId(event.target.value)} disabled={professionals.loading || !!professionals.loadError}>
          <option value="">Selecione o profissional</option>
          {professionals.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </SelectField> : <p className="text-sm text-slate-600">Horário para seu cadastro profissional vinculado à sessão.</p>}
        <FormField id="schedule-date" label="Data" type="date" required value={date} onChange={(event) => setDate(event.target.value)} />
        <FormField id="schedule-time" label="Horário" type="time" step="any" required value={time} onChange={(event) => setTime(event.target.value)} />
      </fieldset>
      {admin && professionals.loading && <p role="status">Carregando profissionais...</p>}
      {admin && professionals.loadError && <div><p role="alert" className="text-red-700">{professionals.loadError}</p><Button type="button" variant="outline" onClick={professionals.retry}>Recarregar profissionais</Button></div>}
      {admin && !professionals.loading && !professionals.loadError && !professionals.items.length && <p>Cadastre um profissional para abrir horários.</p>}
      {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button>
        <Button type="submit" loading={pending} disabled={!allowed || (admin && (professionals.loading || !!professionals.loadError || !professionals.items.length))}>Salvar horário</Button>
      </div>
    </form>
  </Modal>;
}
