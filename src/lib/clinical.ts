import { timeKey } from './appointments';
import type { AppointmentResponse, MedicalRecordResponse } from '../types';

// View model local; o DTO clínico continua contendo somente id, appointmentId e notes.
export function clinicalRecords(records: MedicalRecordResponse[], appointments: AppointmentResponse[]) {
  const byId = new Map(appointments.map((appointment) => [appointment.id, appointment]));
  return records.map((record) => ({ record, appointment: byId.get(record.appointmentId) }))
    .sort((a, b) => (b.appointment?.date ?? '').localeCompare(a.appointment?.date ?? '') ||
      timeKey(b.appointment?.time ?? '').localeCompare(timeKey(a.appointment?.time ?? '')) || a.record.id.localeCompare(b.record.id));
}

export function appointmentsWithoutRecord(records: MedicalRecordResponse[], appointments: AppointmentResponse[]) {
  const occupied = new Set(records.map((record) => record.appointmentId));
  // O backend não exige status Concluída. Não acrescentar restrição clínica aqui.
  return appointments.filter((appointment) => !occupied.has(appointment.id));
}
