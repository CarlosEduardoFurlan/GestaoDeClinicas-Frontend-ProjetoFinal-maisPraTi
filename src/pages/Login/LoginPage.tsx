import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { errorDescription } from '../../lib/api-error';
import { Button } from '../../components/ui/Button/Button';
import { DelayedLoading } from '../../components/ui/Loading/DelayedLoading';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login, isAuthenticated, isRestoring } = useAuth();
  const { error } = useToast();

  if (isRestoring) return <DelayedLoading className="min-h-screen justify-center">Validando sessão...</DelayedLoading>;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setFormError(null);
    try {
      await login({ email: email.trim(), password });
      setPassword('');
    } catch (cause) {
      const message = errorDescription(cause);
      setFormError(message);
      error('Não foi possível entrar', message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">+PraClinic</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Sistema de Gestão Clínica</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7 sm:p-10">
          <h2 className="text-xl font-extrabold text-slate-900">Acesso ao Sistema</h2>
          <p className="text-xs font-medium text-slate-500 mt-2 mb-6">Informe suas credenciais para acessar sua conta.</p>
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={pending}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 mb-2">E-MAIL</label>
              <input id="email" type="email" autoComplete="username" required value={email} disabled={pending}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 mb-2">SENHA</label>
              <input id="password" type="password" autoComplete="current-password" required value={password} disabled={pending}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
            <Button type="submit" loading={pending} className="w-full rounded-xl gap-2">
              {pending ? 'Entrando...' : 'Entrar'}{!pending && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
      <footer className="text-xs text-slate-500 mt-8">Autenticação de Usuário • Acesso Restrito</footer>
    </div>
  );
}
