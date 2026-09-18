// Models that represent the structure mapped from the database/migrations
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email?: string;
  addressId?: string;
  address?: Address;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
}

export interface Professional {
  id: string;
  userId: string;
  user?: User;
  crmCrp: string;
  specialtyId: string;
  specialty?: Specialty;
  phone: string;
  isActive: boolean;
}

export interface Schedule {
  id: string;
  professionalId: string;
  professional?: Professional;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  startTime: string; // '08:00'
  endTime: string; // '18:00'
  slotDurationMinutes: number; // 30
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  professionalId: string;
  professional?: Professional;
  appointmentDate: string; // ISO date-time
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  type: 'FIRST_VISIT' | 'RETURN' | 'EXAM';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  appointment?: Appointment;
  patientId: string;
  professionalId: string;
  clinicalNotes: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: string;
}

// API DTOs (Data Transfer Objects) examples
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
