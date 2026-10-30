import { lazy, Suspense, useEffect, useState } from 'react';
import { DelayedLoading } from '../components/ui/Loading/DelayedLoading';
import { createBrowserRouter, Link } from "react-router-dom";
import { AppShell } from "../layouts/AppShell/AppShell";
import { RouteGuard, SessionGuard } from './RouteGuard';
import { pageLoaders } from './pageLoaders';
const DashboardPage = lazy(pageLoaders.dashboard);
const PatientsPage = lazy(pageLoaders.patients);
const PatientDetailsPage = lazy(pageLoaders.patientDetails);
const MedicalRecordsPage = lazy(pageLoaders.medicalRecords);
const ProfessionalsPage = lazy(pageLoaders.professionals);
const SpecialtiesPage = lazy(pageLoaders.specialties);
const UsersPage = lazy(pageLoaders.users);
const LoginPage = lazy(pageLoaders.login);
const AppointmentsPage = lazy(pageLoaders.appointments);
const ConsultationsPage = lazy(pageLoaders.consultations);

type PageLoader = () => Promise<unknown>;

function RouteFallback({ load }: { load: PageLoader }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    // Suspense pode reter seu fallback depois de o chunk chegar.
    // A importação nativa compartilha o módulo com lazy, sem outra request.
    void load().then(() => { if (mounted) setLoading(false); }, () => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [load]);
  return <DelayedLoading active={loading} className="p-10 justify-center">Carregando página...</DelayedLoading>;
}

function RouteLoading({ children, load }: { children: React.ReactNode; load: PageLoader }) {
  return <Suspense fallback={<RouteFallback load={load} />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionGuard />,
    children: [{ element: <AppShell />, children: [
      {
        index: true,
        element: <RouteLoading load={pageLoaders.dashboard}><DashboardPage /></RouteLoading>,
      },
      {
        path: "appointments",
        element: <RouteGuard path="/appointments"><RouteLoading load={pageLoaders.appointments}><AppointmentsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "consultations",
        element: <RouteGuard path="/consultations"><RouteLoading load={pageLoaders.consultations}><ConsultationsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "patients",
        element: <RouteGuard path="/patients"><RouteLoading load={pageLoaders.patients}><PatientsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "patients/:id",
        element: <RouteGuard path="/patients"><RouteLoading load={pageLoaders.patientDetails}><PatientDetailsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "professionals",
        element: <RouteGuard path="/professionals"><RouteLoading load={pageLoaders.professionals}><ProfessionalsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "specialties",
        element: <RouteGuard path="/specialties"><RouteLoading load={pageLoaders.specialties}><SpecialtiesPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "medical-records",
        element: <RouteGuard path="/medical-records"><RouteLoading load={pageLoaders.medicalRecords}><MedicalRecordsPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "users",
        element: <RouteGuard path="/users"><RouteLoading load={pageLoaders.users}><UsersPage /></RouteLoading></RouteGuard>,
      },
      {
        path: "*",
        element: <div className="space-y-4"><h1 className="text-2xl font-bold">Página não encontrada</h1><Link to="/" className="text-primary underline">Voltar ao Dashboard</Link></div>,
      },
    ] }],
  },
  {
    path: "/login",
    element: <RouteLoading load={pageLoaders.login}><LoginPage /></RouteLoading>,
  }
], {
  basename: import.meta.env.BASE_URL,
});
