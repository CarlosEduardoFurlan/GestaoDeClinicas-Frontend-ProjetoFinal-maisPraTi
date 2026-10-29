import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/ui/Spinner/Spinner';
import { Button } from '../components/ui/Button/Button';
import { routeProfiles } from '../config/permissions';

export function SessionGuard() {
  const { isRestoring, isAuthenticated, sessionError, restoreSession, logout } = useAuth();
  if (isRestoring) return <div className="min-h-screen flex items-center justify-center gap-3" role="status"><Spinner />Validando sessão...</div>;
  if (sessionError && !isAuthenticated) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <p role="alert" className="text-red-700">{sessionError}</p>
      <Button onClick={() => void restoreSession()}>Tentar novamente</Button>
      <Button variant="outline" onClick={logout}>Voltar ao login</Button>
    </div>
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RouteGuard({ path, children }: { path: string; children: React.ReactNode }) {
  const { hasRole } = useAuth();
  if (!hasRole(routeProfiles[path] ?? [])) return (
    <div className="space-y-4" role="alert">
      <h1 className="text-2xl font-bold">Acesso negado</h1>
      <p>Seu perfil não tem permissão para acessar esta página.</p>
      <Link to="/" className="text-primary underline">Voltar ao Dashboard</Link>
    </div>
  );
  return <>{children}</>;
}
