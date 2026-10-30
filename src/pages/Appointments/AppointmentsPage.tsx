import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { LoadingContent } from '../../components/ui/Loading/LoadingContent';
import { ScheduleFormModal } from '../../components/appointments/ScheduleFormModal';
import { AppointmentFormModal } from '../../components/appointments/AppointmentFormModal';
import { AppointmentDetailsModal } from '../../components/appointments/AppointmentDetailsModal';
import { StatusBadge } from '../../components/appointments/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useSchedulingData } from '../../hooks/useSchedulingData';
import { availableSchedules, displayDate, displayTime, localDate, shiftDate, slotKey, timeKey, weekDates } from '../../lib/appointments';
import type { ScheduleResponse } from '../../types';

export function AppointmentsPage() {
  const { user, hasRole } = useAuth();
  const canCreate = hasRole(['ADMIN', 'RECEPTIONIST']);
  const canOpenSlot = user?.profile === 'ADMIN' || user?.profile === 'PROFESSIONAL';
  const missingProfessional = user?.profile === 'PROFESSIONAL' && !user.professionalId;
  const data = useSchedulingData();
  const [date, setDate] = useState(localDate);
  const [view, setView] = useState<'Dia' | 'Semana'>('Semana');
  const [professionalFilter, setProfessionalFilter] = useState('');
  const [slotModal, setSlotModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{ slot?: ScheduleResponse } | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const dates = view === 'Dia' ? [date] : weekDates(date);
  const filteredSchedules = data.schedules.filter((item) => !professionalFilter || item.professionalId === professionalFilter);
  const filteredAppointments = data.appointments.filter((item) => !professionalFilter || item.professionalId === professionalFilter);
  const visibleSchedules = filteredSchedules.filter((item) => dates.includes(item.date));
  const visibleAppointments = filteredAppointments.filter((item) => dates.includes(item.date));
  const times = [...new Set([...visibleSchedules, ...visibleAppointments].map((item) => timeKey(item.time)))].sort();
  const free = new Set(availableSchedules(data.schedules, data.appointments).map(slotKey));
  const professionals = useMemo(() => [...new Map([...data.schedules, ...data.appointments].map((item) => [item.professionalId, item.professionalName])).entries()], [data.schedules, data.appointments]);
  const unavailable = data.loading || !!data.loadError;
  const gridStyle = { gridTemplateColumns: `80px repeat(${dates.length}, minmax(160px, 1fr))` };

  return <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agenda de Consultas</h1><p className="text-slate-500 mt-1">Controle de horários e agendamentos dos profissionais</p></div>
      <div className="flex flex-wrap gap-3">
        {canOpenSlot && <Button variant="outline" disabled={unavailable || missingProfessional} onClick={() => setSlotModal(true)} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Adicionar horário</Button>}
        {canCreate && <Button disabled={unavailable} onClick={() => setNewAppointment({})} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Nova Consulta</Button>}
      </div>
    </div>
    {missingProfessional && <p role="alert" className="text-red-700">Sua conta não possui vínculo profissional. Não é possível abrir horários.</p>}
    <div className="bg-white rounded-[1.25rem] p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex bg-slate-100 rounded-lg p-1">{(['Dia', 'Semana'] as const).map((mode) => <button key={mode} onClick={() => setView(mode)} aria-pressed={view === mode} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${view === mode ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>{mode}</button>)}</div>
        <div className="flex items-center gap-2">
          <button aria-label="Período anterior" onClick={() => setDate(shiftDate(date, view === 'Dia' ? -1 : -7))} className="p-2 border rounded-lg text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setDate(localDate())} className="px-3 py-1.5 border rounded-lg text-sm font-semibold">Hoje</button>
          <button aria-label="Próximo período" onClick={() => setDate(shiftDate(date, view === 'Dia' ? 1 : 7))} className="p-2 border rounded-lg text-slate-500"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold"><CalendarIcon className="w-5 h-5 text-primary" /><span className="sr-only">Data da agenda</span><input aria-label="Data da agenda" type="date" required value={date} onChange={(event) => { if (event.target.value) setDate(event.target.value); }} className="bg-slate-50 rounded-lg p-2" /></label>
      </div>
      <div className="flex flex-wrap gap-3">
        {user?.profile !== 'PROFESSIONAL' && <select aria-label="Filtrar profissional" value={professionalFilter} onChange={(event) => setProfessionalFilter(event.target.value)} className="bg-slate-50 border rounded-xl px-4 py-2 text-sm"><option value="">Todos os profissionais</option>{professionals.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>}
        <Button variant="outline" disabled={data.loading} onClick={() => void data.refresh()}>Atualizar agenda</Button>
      </div>
    </div>
    <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
      <LoadingContent loading={data.loading} error={data.loadError} label="Carregando agenda..." errorFallback={<div className="p-6 space-y-3"><p role="alert" className="text-red-700">{data.loadError}</p><Button variant="outline" onClick={() => void data.refresh()}>Tentar novamente</Button></div>}><>
        <div className="overflow-x-auto"><div className="grid border-b border-slate-100" style={gridStyle}>
          <div className="p-4 text-xs font-bold text-slate-400">Horário</div>
          {dates.map((day, index) => <div key={day} className={`p-4 text-center ${day === localDate() ? 'bg-blue-50 text-primary' : 'text-slate-600'}`}><span className="text-xs font-bold">{view === 'Semana' ? ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'][index] : 'DIA'}</span><div className="text-sm font-extrabold mt-1">{displayDate(day)}</div></div>)}
        </div>
        {!times.length ? <p className="p-10 text-center text-slate-500">Nenhum horário ou consulta no período selecionado.</p> : times.map((time) => <div key={time} className="grid border-b border-slate-100 last:border-0 min-h-[110px]" style={gridStyle}>
          <div className="p-3 text-sm font-semibold text-slate-500 border-r">{displayTime(time)}</div>
          {dates.map((day) => <div key={day} className="border-r last:border-0 border-slate-100 p-2 space-y-2">
            {visibleSchedules.filter((item) => item.date === day && timeKey(item.time) === time && free.has(slotKey(item))).map((slot) => <button key={slot.id} data-schedule-id={slot.id} aria-label={`Agendar ${slot.professionalName} ${slot.date} ${displayTime(slot.time)}`} disabled={!canCreate || unavailable} onClick={() => setNewAppointment({ slot })} className="block w-full text-left rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 disabled:cursor-default hover:bg-blue-50">
              <div className="text-xs font-bold text-emerald-700">Disponível · {displayTime(slot.time)}</div><div className="text-xs text-slate-500 mt-1">{slot.professionalName}</div>
            </button>)}
            {visibleAppointments.filter((item) => item.date === day && timeKey(item.time) === time).map((appointment) => <button key={appointment.id} data-appointment-id={appointment.id} aria-label={`Visualizar consulta de ${appointment.patientName} ${appointment.date} ${displayTime(appointment.time)}`} onClick={() => setViewingId(appointment.id)} className={`block w-full text-left rounded-xl border bg-white p-3 shadow-sm ${appointment.statusName === 'Cancelada' ? 'border-red-200' : 'border-blue-200'}`}>
              <StatusBadge status={appointment.statusName} /><div className="text-sm font-bold text-slate-900 mt-2">{appointment.patientName}</div><div className="text-xs text-slate-500 mt-1">{appointment.professionalName}</div><div className="text-xs font-semibold text-slate-500 mt-1">{displayTime(appointment.time)}</div>
            </button>)}
          </div>)}
        </div>)}</div>
        <div className="px-5 py-4 border-t text-sm text-slate-500">{visibleSchedules.length} horários · {visibleAppointments.length} consultas no período</div>
      </></LoadingContent>
    </div>
    <p className="text-xs text-slate-500 px-4">Disponível: horário aberto sem consulta ativa. Consultas canceladas permanecem no histórico.</p>
    {slotModal && canOpenSlot && <ScheduleFormModal initialDate={date} refresh={data.refresh} onClose={() => setSlotModal(false)} onSaved={(saved) => { setDate(saved.date); setSlotModal(false); void data.refresh(); }} />}
    {newAppointment && canCreate && <AppointmentFormModal {...data} initialSlot={newAppointment.slot} onClose={() => setNewAppointment(null)} onSaved={(saved) => { setDate(saved.date); setNewAppointment(null); void data.refresh(); }} />}
    {viewingId && <AppointmentDetailsModal id={viewingId} onClose={() => setViewingId(null)} />}
  </div>;
}
