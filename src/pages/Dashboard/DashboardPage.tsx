import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { LoadingContent } from '../../components/ui/Loading/LoadingContent';
import { StatusBadge } from '../../components/appointments/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { dashboardAppointments } from '../../lib/dashboard';
import { displayDate, displayTime, localDate, shiftDate, weekDates } from '../../lib/appointments';

export function DashboardPage() {
  const { hasRole } = useAuth(); const canReadPatients = hasRole(['ADMIN', 'RECEPTIONIST']);
  const data = useDashboardData(canReadPatients);
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer); }, []);
  const derived = dashboardAppointments(data.appointments, now);
  const days = weekDates(shiftDate(localDate(now), weekOffset * 7));
  const metrics = [
    { key: 'today', label: 'Consultas Hoje', value: derived.today.length, suffix: 'consultas', Icon: Calendar },
    { key: 'upcoming', label: 'Próximas Consultas', value: derived.upcoming.length, suffix: 'consultas', Icon: Clock },
    ...(canReadPatients && data.patients ? [{ key: 'patients', label: 'Total de Pacientes', value: data.patients.length, suffix: 'cadastrados', Icon: Users }] : []),
  ];

  return <div className="max-w-6xl mx-auto space-y-8">
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1><p className="text-slate-500 mt-1">Visão geral dos atendimentos de hoje</p></div>
      <div className="flex flex-wrap gap-3 items-center"><div className="flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold"><Calendar className="w-4 h-4" /><span data-local-date={localDate(now)}>Hoje, {new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(now)}</span></div><Button variant="outline" disabled={data.loading} onClick={() => { setNow(new Date()); void data.refresh(); }}>Atualizar</Button>{canReadPatients && <Button className="rounded-full" onClick={() => navigate('/consultations')}>+ Nova Consulta</Button>}</div>
    </div>
    <LoadingContent loading={data.loading} error={data.loadError} label="Carregando dashboard..." errorFallback={<div className="bg-white rounded-xl p-6 space-y-3"><p role="alert" className="text-red-700">{data.loadError}</p><Button variant="outline" onClick={() => void data.refresh()}>Tentar novamente</Button></div>}><>
      <div className={`grid grid-cols-1 ${canReadPatients ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>{metrics.map(({ key, label, value, suffix, Icon }) => <section key={key} aria-label={label} className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start"><h2 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{label}</h2><div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center"><Icon className="w-4 h-4" /></div></div><div className="mt-4 flex items-baseline gap-2"><span data-metric={key} className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</span><span className="text-sm text-slate-500 font-medium">{suffix}</span></div>
      </section>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section aria-label="Consultas de Hoje" className="lg:col-span-2 bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6"><div><h2 className="text-lg font-bold text-slate-900">Consultas de Hoje</h2><p className="text-sm text-slate-500">Listagem dos atendimentos do dia</p></div><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">{derived.today.length} consultas</span></div>
          {!derived.today.length ? <p className="py-6 text-sm text-slate-500">Nenhuma consulta para hoje.</p> : <div className="space-y-4">{derived.today.map((appointment) => <article key={appointment.id} data-appointment-id={appointment.id} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50/80 rounded-[1.25rem] border border-slate-100/50">
            <div className="flex items-center gap-5"><span className="text-base font-bold text-slate-900 border-r border-slate-200 pr-5">{displayTime(appointment.time)}</span><div><h3 className="font-bold text-slate-900">{appointment.patientName}</h3><p className="text-xs text-slate-500 mt-1 font-medium">{appointment.professionalName}</p></div></div><StatusBadge status={appointment.statusName} />
          </article>)}</div>}
        </section>
        <section aria-label="Calendário semanal" className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start gap-3 mb-6"><div><h2 className="text-lg font-bold text-slate-900">{weekOffset === 0 ? 'Esta Semana' : 'Semana selecionada'}</h2><p className="text-xs text-slate-500 mt-1" data-week-range>{displayDate(days[0])} — {displayDate(days[6])}</p></div><div className="flex gap-1 text-slate-400"><button aria-label="Semana anterior" onClick={() => setWeekOffset((value) => value - 1)} className="p-1 hover:bg-slate-50 rounded-full"><ChevronLeft className="w-4 h-4" /></button><button aria-label="Próxima semana" onClick={() => setWeekOffset((value) => value + 1)} className="p-1 hover:bg-slate-50 rounded-full"><ChevronRight className="w-4 h-4" /></button></div></div>
          <div className="grid grid-cols-7 gap-1 text-center mt-8">{days.map((day, index) => <div key={day} data-calendar-date={day} aria-current={day === localDate(now) ? 'date' : undefined} className={`flex flex-col gap-3 py-3 rounded-xl ${day === localDate(now) ? 'bg-primary text-white shadow-md' : 'text-slate-600'}`}><span className="text-[10px] font-semibold">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}</span><span className="text-sm font-bold">{day.slice(-2)}</span></div>)}</div>
          {weekOffset !== 0 && <Button variant="ghost" size="sm" className="mt-4" onClick={() => setWeekOffset(0)}>Semana atual</Button>}
        </section>
      </div>
    </></LoadingContent>
  </div>;
}
