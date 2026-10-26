import { createBrowserRouter, Link } from "react-router-dom";
import { AppShell } from "../layouts/AppShell/AppShell";
import { RouteGuard, SessionGuard } from './RouteGuard';
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { PatientsPage } from "../pages/Patients/PatientsPage";
import { PatientDetailsPage } from "../pages/Patients/PatientDetailsPage";
import { MedicalRecordsPage } from "../pages/MedicalRecords/MedicalRecordsPage";
import { ProfessionalsPage } from "../pages/Professionals/ProfessionalsPage";
import { SpecialtiesPage } from "../pages/Specialties/SpecialtiesPage";
import { UsersPage } from "../pages/Users/UsersPage";
import { LoginPage } from "../pages/Login/LoginPage";
import { AppointmentsPage } from "../pages/Appointments/AppointmentsPage";
import { ConsultationsPage } from "../pages/Consultations/ConsultationsPage";

// Placeholder pages to allow navigation without errors while modules are not ready
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-text-muted">
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p>Módulo em desenvolvimento - Integração com API pendente.</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionGuard />,
    children: [{ element: <AppShell />, children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "appointments",
        element: <RouteGuard path="/appointments"><AppointmentsPage /></RouteGuard>,
      },
      {
        path: "consultations",
        element: <RouteGuard path="/consultations"><ConsultationsPage /></RouteGuard>,
      },
      {
        path: "patients",
        element: <RouteGuard path="/patients"><PatientsPage /></RouteGuard>,
      },
      {
        path: "patients/:id",
        element: <RouteGuard path="/patients"><PatientDetailsPage /></RouteGuard>,
      },
      {
        path: "professionals",
        element: <RouteGuard path="/professionals"><ProfessionalsPage /></RouteGuard>,
      },
      {
        path: "specialties",
        element: <RouteGuard path="/specialties"><SpecialtiesPage /></RouteGuard>,
      },
      {
        path: "schedules",
        element: <RouteGuard path="/schedules"><PlaceholderPage title="Grade de Horários (Disponibilidade)" /></RouteGuard>,
      },
      {
        path: "medical-records",
        element: <RouteGuard path="/medical-records"><MedicalRecordsPage /></RouteGuard>,
      },
      {
        path: "users",
        element: <RouteGuard path="/users"><UsersPage /></RouteGuard>,
      },
      {
        path: "*",
        element: <div className="space-y-4"><h1 className="text-2xl font-bold">Página não encontrada</h1><Link to="/" className="text-primary underline">Voltar ao Dashboard</Link></div>,
      },
    ] }],
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
], {
  basename: import.meta.env.BASE_URL,
});
