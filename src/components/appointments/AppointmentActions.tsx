import { Button } from '../ui/Button/Button';
import { canCancel, statusActions } from '../../lib/appointments';
import type { AppointmentResponse, AppointmentStatus, AuthenticatedUser, StatusResponse } from '../../types';

export function AppointmentActions({ appointment, user, statuses, disabled, pending, onTransition, onCancel }: {
  appointment: AppointmentResponse; user: AuthenticatedUser; statuses: StatusResponse[];
  disabled: boolean; pending: boolean;
  onTransition: (appointment: AppointmentResponse, target: AppointmentStatus) => void;
  onCancel: (appointment: AppointmentResponse) => void;
}) {
  return <>
    {statusActions(user.profile, appointment, user.professionalId).map((action) => <Button
      key={action.target} size="sm" variant="outline" aria-label={`${action.label} consulta de ${appointment.patientName}`}
      disabled={disabled || !statuses.some((status) => status.description === action.target)} loading={pending}
      onClick={() => onTransition(appointment, action.target)}
    >{action.label}</Button>)}
    {canCancel(user.profile, appointment.statusName) && <Button
      size="sm" variant="outline" aria-label={`Cancelar consulta de ${appointment.patientName}`}
      disabled={disabled || !statuses.some((status) => status.description === 'Cancelada')} loading={pending}
      onClick={() => onCancel(appointment)}
    >Cancelar</Button>}
  </>;
}
