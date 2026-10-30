import { routeProfiles } from '../config/permissions';
import type { Profile } from '../types';

export const pageLoaders = {
  dashboard: () => import('../pages/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })),
  appointments: () => import('../pages/Appointments/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })),
  consultations: () => import('../pages/Consultations/ConsultationsPage').then(m => ({ default: m.ConsultationsPage })),
  patients: () => import('../pages/Patients/PatientsPage').then(m => ({ default: m.PatientsPage })),
  patientDetails: () => import('../pages/Patients/PatientDetailsPage').then(m => ({ default: m.PatientDetailsPage })),
  professionals: () => import('../pages/Professionals/ProfessionalsPage').then(m => ({ default: m.ProfessionalsPage })),
  specialties: () => import('../pages/Specialties/SpecialtiesPage').then(m => ({ default: m.SpecialtiesPage })),
  users: () => import('../pages/Users/UsersPage').then(m => ({ default: m.UsersPage })),
  medicalRecords: () => import('../pages/MedicalRecords/MedicalRecordsPage').then(m => ({ default: m.MedicalRecordsPage })),
  login: () => import('../pages/Login/LoginPage').then(m => ({ default: m.LoginPage })),
};

const protectedPages = [
  ['/', pageLoaders.dashboard], ['/appointments', pageLoaders.appointments],
  ['/consultations', pageLoaders.consultations], ['/patients', pageLoaders.patients],
  ['/patients', pageLoaders.patientDetails], ['/professionals', pageLoaders.professionals],
  ['/specialties', pageLoaders.specialties], ['/users', pageLoaders.users],
  ['/medical-records', pageLoaders.medicalRecords],
] as const;

export function schedulePagePrefetch(profile: Profile) {
  let cancelled = false;
  const preload = () => {
    if (cancelled) return;
    for (const [path, load] of protectedPages) {
      if (routeProfiles[path]?.includes(profile)) void load().catch(() => undefined);
    }
  };
  if (typeof window.requestIdleCallback === 'function') {
    const task = window.requestIdleCallback(preload);
    return () => { cancelled = true; window.cancelIdleCallback(task); };
  }
  // Dois frames deixam o primeiro paint passar, sem atrasar login ou requests de dados.
  let frame = window.requestAnimationFrame(() => { frame = window.requestAnimationFrame(preload); });
  return () => { cancelled = true; window.cancelAnimationFrame(frame); };
}
