import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { Modal } from '../../components/overlay/Modal/Modal';
import { AppointmentFormModal } from '../../components/appointments/AppointmentFormModal';
import { AppointmentDetailsModal } from '../../components/appointments/AppointmentDetailsModal';
import { AppointmentActions } from '../../components/appointments/AppointmentActions';
import { StatusBadge } from '../../components/appointments/StatusBadge';
import { useSchedulingData } from '../../hooks/useSchedulingData';
import { useApiList } from '../../hooks/useApiList';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { AppointmentService } from '../../services/appointment.service';
import { StatusService } from '../../services/status.service';
import { canCancel, displayDate, displayTime, statusActions, timeKey } from '../../lib/appointments';
import { errorDescription } from '../../lib/api-error';
import type { AppointmentResponse, AppointmentStatus } from '../../types';

const requiredStatuses: AppointmentStatus[] = ['Agendada', 'Confirmada', 'Em atendimento', 'Concluída', 'Cancelada'];

export function ConsultationsPage() {
  const { user, hasRole } = useAuth();
  const canCreate = hasRole(['ADMIN', 'RECEPTIONIST']);
  const data = useSchedulingData();
  const catalog = useApiList(StatusService.getAll);
  const { success, error } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [professionalFilter, setProfessionalFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [creating, setCreating] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [canceling, setCanceling] = useState<AppointmentResponse | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);

  const missingStatuses = requiredStatuses.filter((name) => !catalog.items.some((status) => status.description === name));
  const catalogError = catalog.loadError || (!catalog.loading && missingStatuses.length ? `Catálogo de status incompleto: ${missingStatuses.join(', ')}. Recarregue antes de executar a ação.` : null);
  const professionals = useMemo(() => [...new Map(data.appointments.map((item) => [item.professionalId, item.professionalName])).entries()], [data.appointments]);
  const filtered = data.appointments.filter((item) =>
    (!search || `${item.patientName} ${item.professionalName}`.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || item.statusId === statusFilter) && (!professionalFilter || item.professionalId === professionalFilter) &&
    (!dateFilter || item.date === dateFilter),
  ).sort((a, b) => a.date.localeCompare(b.date) || timeKey(a.time).localeCompare(timeKey(b.time)) || a.id.localeCompare(b.id));

  const transition = async (appointment: AppointmentResponse, target: AppointmentStatus) => {
    if (!user || operation.current || !statusActions(user.profile, appointment, user.professionalId).some((action) => action.target === target)) return;
    const status = catalog.items.find((item) => item.description === target);
    if (!status) { setActionError('Status necessário não disponível no catálogo. Recarregue os status.'); return; }
    const controller = new AbortController(); operation.current = controller; setPendingId(appointment.id); setActionError(null);
    try {
      await AppointmentService.updateStatus(appointment.id, { statusId: status.id }, controller.signal);
      if (controller.signal.aborted) return;
      success('Status atualizado', target);
    } catch (cause) {
      if (!controller.signal.aborted) { const message = errorDescription(cause); setActionError(message); error('Não foi possível alterar status', message); }
    } finally {
      if (!controller.signal.aborted) await data.refresh();
      operation.current = null; if (!controller.signal.aborted) setPendingId(null);
    }
  };

  const cancel = async () => {
    if (!canceling || !user || operation.current || !canCancel(user.profile, canceling.statusName)) return;
    const controller = new AbortController(); operation.current = controller; setPendingId(canceling.id); setActionError(null);
    try {
      await AppointmentService.cancel(canceling.id, controller.signal);
      if (controller.signal.aborted) return;
      success('Consulta cancelada', canceling.patientName); setCanceling(null);
    } catch (cause) {
      if (!controller.signal.aborted) { const message = errorDescription(cause); setActionError(message); error('Não foi possível cancelar consulta', message); }
    } finally {
      // DELETE é lógico: recarregar, nunca filtrar/remover o UUID como exclusão física.
      if (!controller.signal.aborted) await data.refresh();
      operation.current = null; if (!controller.signal.aborted) setPendingId(null);
    }
  };

  return <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Consultas</h1><p className="text-slate-500 mt-1">Gerenciamento de consultas e estados de atendimento</p></div>
      {canCreate && <Button disabled={data.loading || !!data.loadError || !!pendingId} onClick={() => setCreating(true)} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Nova Consulta</Button>}
    </div>
    <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input aria-label="Buscar consulta" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar paciente ou profissional..." className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm" /></div>
        <select aria-label="Filtrar status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-slate-50 border rounded-xl px-3 py-2.5 text-sm"><option value="">Todos os status</option>{catalog.items.map((item) => <option key={item.id} value={item.id}>{item.description}</option>)}</select>
        {user?.profile !== 'PROFESSIONAL' && <select aria-label="Filtrar profissional" value={professionalFilter} onChange={(event) => setProfessionalFilter(event.target.value)} className="bg-slate-50 border rounded-xl px-3 py-2.5 text-sm"><option value="">Todos os profissionais</option>{professionals.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>}
        <input aria-label="Filtrar data" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="bg-slate-50 border rounded-xl px-3 py-2 text-sm" />
        <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter(''); setProfessionalFilter(''); setDateFilter(''); }}>Limpar filtros</Button>
        <Button variant="outline" disabled={data.loading || !!pendingId} onClick={() => void data.refresh()}>Atualizar consultas</Button>
      </div>
      {data.loading ? <div role="status" className="p-10 flex justify-center gap-3"><Spinner />Carregando consultas...</div> : data.loadError ? <div className="p-6 space-y-3"><p role="alert" className="text-red-700">{data.loadError}</p><Button variant="outline" onClick={() => void data.refresh()}>Tentar novamente</Button></div> : <>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-5">Data / Horário</th><th className="p-5">Paciente</th><th className="p-5">Profissional</th><th className="p-5">Status</th><th className="p-5 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-50">
          {!filtered.length ? <tr><td colSpan={5} className="p-10 text-center text-slate-500">{data.appointments.length ? 'Nenhuma consulta encontrada com os filtros aplicados.' : 'Nenhuma consulta cadastrada.'}</td></tr> : filtered.map((item) => <tr key={item.id} data-appointment-id={item.id} className="hover:bg-slate-50/50">
            <td className="p-5 text-sm"><div className="font-bold text-slate-900">{displayTime(item.time)}</div><div className="text-slate-500">{displayDate(item.date)}</div></td>
            <td className="p-5 text-sm font-bold text-slate-900">{item.patientName}</td><td className="p-5 text-sm text-slate-600">{item.professionalName}</td><td className="p-5"><StatusBadge status={item.statusName} /></td>
            <td className="p-5"><div className="flex flex-wrap justify-end gap-2"><button aria-label={`Visualizar consulta de ${item.patientName}`} onClick={() => setViewingId(item.id)} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Eye className="w-4 h-4" /></button>
              {user && <AppointmentActions appointment={item} user={user} statuses={catalog.items} disabled={!!pendingId || catalog.loading || !!catalog.loadError} pending={pendingId === item.id} onTransition={(appointment, target) => void transition(appointment, target)} onCancel={(appointment) => { setActionError(null); setCanceling(appointment); }} />}
            </div></td>
          </tr>)}
        </tbody></table></div><div className="px-5 py-4 border-t text-sm text-slate-500">Exibindo {filtered.length} de {data.appointments.length} consultas</div>
      </>}
    </div>
    {catalog.loading && <p role="status" className="text-sm text-slate-500">Carregando status...</p>}
    {catalogError && <div className="space-y-3"><p role="alert" className="text-red-700">{catalogError}</p><Button variant="outline" onClick={catalog.retry}>Recarregar status</Button></div>}
    {actionError && !canceling && <p role="alert" className="text-sm text-red-700">{actionError}</p>}
    {creating && canCreate && <AppointmentFormModal {...data} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); void data.refresh(); }} />}
    {viewingId && <AppointmentDetailsModal id={viewingId} onClose={() => setViewingId(null)} />}
    {canceling && <Modal isOpen title="Cancelar Consulta" onClose={() => { if (!pendingId) setCanceling(null); }}>
      <p className="text-sm text-slate-600 mb-4">Cancelar a consulta de {canceling.patientName} em {displayDate(canceling.date)} às {displayTime(canceling.time)}? O registro continuará no histórico.</p>
      {actionError && <p role="alert" className="text-sm text-red-700 mb-4">{actionError}</p>}
      <div className="flex justify-end gap-3"><Button variant="outline" disabled={!!pendingId} onClick={() => setCanceling(null)}>Voltar</Button><Button variant="danger" loading={!!pendingId} onClick={() => void cancel()}>Confirmar cancelamento</Button></div>
    </Modal>}
  </div>;
}
