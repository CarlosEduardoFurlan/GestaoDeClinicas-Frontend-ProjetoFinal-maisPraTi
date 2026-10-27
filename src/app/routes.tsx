import { lazy, Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner/Spinner';
import { createBrowserRouter, Link } from "react-router-dom";
import { AppShell } from "../layouts/AppShell/AppShell";
import { RouteGuard, SessionGuard } from './RouteGuard';
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const PatientsPage = lazy(() => import('../pages/Patients/PatientsPage').then((module) => ({ default: module.PatientsPage })));
const PatientDetailsPage = lazy(() => import('../pages/Patients/PatientDetailsPage').then((module) => ({ default: module.PatientDetailsPage })));
const MedicalRecordsPage = lazy(() => import('../pages/MedicalRecords/MedicalRecordsPage').then((module) => ({ default: module.MedicalRecordsPage })));
const ProfessionalsPage = lazy(() => import('../pages/Professionals/ProfessionalsPage').then((module) => ({ default: module.ProfessionalsPage })));
const SpecialtiesPage = lazy(() => import('../pages/Specialties/SpecialtiesPage').then((module) => ({ default: module.SpecialtiesPage })));
const UsersPage = lazy(() => import('../pages/Users/UsersPage').then((module) => ({ default: module.UsersPage })));
const LoginPage = lazy(() => import('../pages/Login/LoginPage').then((module) => ({ default: module.LoginPage })));
const AppointmentsPage = lazy(() => import('../pages/Appointments/AppointmentsPage').then((module) => ({ default: module.AppointmentsPage })));
const ConsultationsPage = lazy(() => import('../pages/Consultations/ConsultationsPage').then((module) => ({ default: module.ConsultationsPage })));

function RouteLoading({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div role="status" className="flex items-center justify-center gap-3 p-10"><Spinner />Carregando página...</div>}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionGuard />,
    children: [{ element: <AppShell />, children: [
      {
        index: true,
        element: <RouteLoading><DashboardPage /></RouteLoading>,
      },
      {
        path: "appointments",
        element: <RouteGuard path="/appointments"><RouteLoading><AppointmentsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "consultations",
        element: <RouteGuard path="/consultations"><RouteLoading><ConsultationsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "patients",
        element: <RouteGuard path="/patients"><RouteLoading><PatientsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "patients/:id",
        element: <RouteGuard path="/patients"><RouteLoading><PatientDetailsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "professionals",
        element: <RouteGuard path="/professionals"><RouteLoading><ProfessionalsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "specialties",
        element: <RouteGuard path="/specialties"><RouteLoading><SpecialtiesPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "medical-records",
        element: <RouteGuard path="/medical-records"><RouteLoading><MedicalRecordsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "users",
        element: <RouteGuard path="/users"><RouteLoading><UsersPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "*",
        element: <div className="space-y-4"><h1 className="text-2xl font-bold">Página não encontrada</h1><Link to="/" className="text-primary underline">Voltar ao Dashboard</Link></div>,
      },
    ] }],
  },
  {
    path: "/login",
    element: <RouteLoading><LoginPage /></RouteLoading>,
  }
], {
  basename: import.meta.env.BASE_URL,
});
