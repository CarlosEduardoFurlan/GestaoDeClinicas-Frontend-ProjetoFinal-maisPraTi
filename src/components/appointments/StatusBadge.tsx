import type { AppointmentStatus } from '../../types';

const colors: Record<AppointmentStatus, string> = {
  Agendada: 'bg-indigo-50 text-indigo-700', Confirmada: 'bg-teal-50 text-teal-700',
  'Em atendimento': 'bg-amber-50 text-amber-800', Concluída: 'bg-blue-50 text-blue-700',
  Cancelada: 'bg-red-50 text-red-700',
};
export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${colors[status] ?? 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}
