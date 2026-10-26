import type { AppointmentResponse, AppointmentStatus, Profile, ScheduleResponse } from '../types';

export function localDate(value = new Date()): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

// Date é usado apenas para aritmética de calendário local, ao meio-dia; nunca UTC.
export function shiftDate(value: string, days: number): string {
  const [year, month, day] = value.split('-').map(Number);
  return localDate(new Date(year, month - 1, day + days, 12));
}

export function weekDates(value: string): string[] {
  const [year, month, day] = value.split('-').map(Number);
  const weekday = new Date(year, month - 1, day, 12).getDay();
  const monday = shiftDate(value, -((weekday + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
}

export const displayDate = (value: string) => value.split('-').reverse().join('/');

// LocalTime pode omitir segundos iguais a zero; frações são preservadas sem UTC.
export function timeKey(value: string): string {
  const [hour, minute, seconds = '00'] = value.split(':');
  const [second, fraction = ''] = seconds.split('.');
  const significant = fraction.replace(/0+$/, '');
  return `${hour}:${minute}:${second}${significant ? `.${significant}` : ''}`;
}
export function displayTime(value: string): string {
  const normalized = timeKey(value);
  return normalized.endsWith(':00') ? normalized.slice(0, 5) : normalized;
}

export function slotKey(value: { professionalId: string; date: string; time: string }): string {
  return `${value.professionalId}|${value.date}|${timeKey(value.time)}`;
}

export function availableSchedules(schedules: ScheduleResponse[], appointments: AppointmentResponse[]): ScheduleResponse[] {
  const occupied = new Set(appointments.filter((item) => item.statusName !== 'Cancelada').map(slotKey));
  return schedules.filter((slot) => !occupied.has(slotKey(slot)));
}

export interface StatusAction { label: string; target: AppointmentStatus }
export function statusActions(profile: Profile, appointment: AppointmentResponse, ownProfessionalId: string | null): StatusAction[] {
  if (profile === 'PROFESSIONAL' && appointment.professionalId !== ownProfessionalId) return [];
  if (appointment.statusName === 'Agendada' && profile !== 'PROFESSIONAL') return [{ label: 'Confirmar', target: 'Confirmada' }];
  if (appointment.statusName === 'Confirmada' && profile !== 'RECEPTIONIST') return [{ label: 'Iniciar atendimento', target: 'Em atendimento' }];
  if (appointment.statusName === 'Em atendimento' && profile !== 'RECEPTIONIST') return [{ label: 'Concluir', target: 'Concluída' }];
  return [];
}
export function canCancel(profile: Profile, status: AppointmentStatus): boolean {
  return profile !== 'PROFESSIONAL' && (status === 'Agendada' || status === 'Confirmada');
}
