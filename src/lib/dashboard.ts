import { localDate, timeKey } from './appointments';
import type { AppointmentResponse } from '../types';

// Derivações de apresentação sobre dados já autorizados pelo backend.
export function dashboardAppointments(appointments: AppointmentResponse[], now: Date) {
  const today = localDate(now);
  const time = timeKey(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`);
  return {
    today: appointments.filter((appointment) => appointment.date === today)
      .sort((a, b) => timeKey(a.time).localeCompare(timeKey(b.time)) || a.id.localeCompare(b.id)),
    upcoming: appointments.filter((appointment) => appointment.statusName !== 'Cancelada' && appointment.statusName !== 'Concluída' &&
      (appointment.date > today || (appointment.date === today && timeKey(appointment.time) > time))),
  };
}
