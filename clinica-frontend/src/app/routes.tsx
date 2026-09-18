import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../layouts/AppShell/AppShell";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import { DesignSystemPage } from "../pages/DesignSystem/DesignSystemPage";
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
    // The AppShell now acts as the protected layout for authenticated users
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "design-system",
        element: <DesignSystemPage />,
      },
      {
        path: "appointments",
        element: <AppointmentsPage />,
      },
      {
        path: "consultations",
        element: <ConsultationsPage />,
      },
      {
        path: "patients",
        element: <PatientsPage />,
      },
      {
        path: "patients/:id",
        element: <PatientDetailsPage />,
      },
      {
        path: "professionals",
        element: <ProfessionalsPage />,
      },
      {
        path: "specialties",
        element: <SpecialtiesPage />,
      },
      {
        path: "schedules",
        element: <PlaceholderPage title="Grade de Horários (Disponibilidade)" />,
      },
      {
        path: "medical-records",
        element: <MedicalRecordsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "settings",
        element: <PlaceholderPage title="Configurações" />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
]);
