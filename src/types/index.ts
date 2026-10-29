// DTOs conferidos com backend develop 9daa1c5. Datas/horas clínicas são locais, sem UTC.
export type UUID = string;
export type Profile = 'ADMIN' | 'RECEPTIONIST' | 'PROFESSIONAL';
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details: string[] | null;
}
export interface LoginRequest { email: string; password: string }
export interface LoginResponse { accessToken: string; tokenType: string; expiresIn: number }
export interface AuthenticatedUser {
  userId: UUID; name: string; email: string; profile: Profile; professionalId: UUID | null;
}
export interface AddressRequest {
  address: string;
  number: number;
  complement?: string | null;
  district: string;
  city: string;
  uf: string;
  zipCode: string;
}
export interface AddressResponse extends Omit<AddressRequest, 'complement'> { complement: string | null }
export interface UserRequest { name: string; email: string; password: string; profile: Profile }
export interface UserUpdateRequest { name: string; password: string; profile: Profile }
export interface UserResponse { id: UUID; name: string; email: string; profile: Profile; created: string | null }
export interface SpecialtyRequest { name: string; description?: string | null }
export interface SpecialtyResponse { id: UUID; name: string; description: string | null; created: string | null }
export interface PatientCreateRequest {
  name: string; cpf: string; dateBirth: string;
  telephone?: string | null; cellPhone: string; email?: string | null;
  /** Exatamente um caractere, validado pelo backend (ex.: F). */
  gender: string;
  address: AddressRequest;
}
export type PatientUpdateRequest = Omit<PatientCreateRequest, 'cpf'>;
export interface PatientResponse {
  id: UUID; name: string; cpf: string; dateBirth: string;
  telephone: string | null; cellPhone: string; email: string | null; gender: string;
  addressId: UUID; address: AddressResponse;
}
export interface ProfessionalCreateRequest {
  name: string; register: string; telephone: string; cellPhone: string; email: string;
  specialtyId: UUID; address: AddressRequest; user: UserRequest;
}
export type ProfessionalUpdateRequest = Omit<ProfessionalCreateRequest, 'user'>;
export interface ProfessionalResponse {
  id: UUID; name: string; register: string; telephone: string; cellPhone: string; email: string;
  specialtyId: UUID | null; specialtyName: string | null; address: AddressResponse | null;
  cityName: string | null; userId: UUID | null;
}
export interface ScheduleRequest { professionalId: UUID; date: string; time: string }
export interface ScheduleResponse extends ScheduleRequest { id: UUID; professionalName: string; created: string | null }
export type AppointmentStatus = 'Agendada' | 'Confirmada' | 'Em atendimento' | 'Concluída' | 'Cancelada';
export interface AppointmentCreateRequest {
  patientId: UUID; professionalId: UUID; date: string; time: string; notes?: string | null;
}
export interface AppointmentStatusUpdateRequest { statusId: UUID }
export interface AppointmentResponse extends Omit<AppointmentCreateRequest, 'notes'> {
  id: UUID; patientName: string; professionalName: string; statusId: UUID;
  statusName: AppointmentStatus; notes: string | null; created: string | null;
}
export interface MedicalRecordCreateRequest { appointmentId: UUID; notes: string }
export interface MedicalRecordUpdateRequest { notes: string }
export interface MedicalRecordResponse extends MedicalRecordCreateRequest { id: UUID }
export interface StatusResponse { id: UUID; description: AppointmentStatus }
