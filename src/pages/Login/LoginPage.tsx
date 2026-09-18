import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Profissional");
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error, info } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setIsLoading(false);
        error("Senhas não coincidem", "A confirmação de senha deve ser idêntica à senha.");
        return;
      }

      // Simulate account registration
      setTimeout(() => {
        setIsLoading(false);
        success("Conta cadastrada com sucesso!", `Bem-vindo(a) ${name || "Usuário"}. Redirecionando...`);
        setTimeout(() => {
          login({
            id: String(Date.now()),
            name: name || "Novo Usuário",
            email: email || "usuario@clinicasys.com.br",
            role: role === "Administrador" ? "ADMIN" : "MEDICO",
          });
          navigate("/");
        }, 800);
      }, 800);
    } else {
      // Simulate login
      setTimeout(() => {
        login({
          id: "1",
          name: "Dra. Sarah Jenkins",
          email: email || "sarah.jenkins@clinicasys.com.br",
          role: "ADMIN",
        });
        setIsLoading(false);
        success("Login realizado com sucesso", "Seja bem-vindo(a) ao +PraClinic.");
        navigate("/");
      }, 700);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    info(
      isRegisterMode ? "Modo de Login" : "Modo de Cadastro",
      isRegisterMode ? "Informe suas credenciais para acessar." : "Preencha seus dados para criar sua conta."
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between items-center px-4 py-8 sm:py-12 select-none">
      {/* Top spacing */}
      <div className="w-full" />

      {/* Center Container: Brand + Card */}
      <div className="w-full max-w-[460px] flex flex-col items-center">
        {/* Logo / Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            +PraClinic
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Sistema de Gestão Clínica
          </p>
        </div>

        {/* Login / Register White Card */}
        <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-7 sm:p-10 transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isRegisterMode ? "Criar Nova Conta" : "Acesso ao Sistema"}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1.5">
              {isRegisterMode
                ? "Preencha os dados abaixo para se cadastrar na plataforma."
                : "Informe suas credenciais para acessar sua conta."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome Completo (Modo Cadastro) */}
            {isRegisterMode && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label
                  htmlFor="name"
                  className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  NOME COMPLETO
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dr. Lucas Mendes"
                  required={isRegisterMode}
                  className="w-full bg-[#f4f7fb] border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            )}

            {/* E-mail Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                E-MAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@maispra clinic.com.br"
                required
                className="w-full bg-[#f4f7fb] border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Campo Perfil (Modo Cadastro) */}
            {isRegisterMode && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label
                  htmlFor="role"
                  className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  TIPO DE PERFIL
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#f4f7fb] border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  <option value="Profissional">Profissional de Saúde</option>
                  <option value="Recepção">Recepção / Atendimento</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Paciente">Paciente</option>
                </select>
              </div>
            )}

            {/* Senha Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                SENHA
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#f4f7fb] border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Confirmar Senha (Modo Cadastro) */}
            {isRegisterMode && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  CONFIRMAR SENHA
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={isRegisterMode}
                  className="w-full bg-[#f4f7fb] border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRegisterMode ? "Cadastrando..." : "Entrando..."}</span>
                  </>
                ) : isRegisterMode ? (
                  <>
                    <span>Cadastrar Conta</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divisor & Botão de Cadastro / Alternância */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            {isRegisterMode ? (
              <p className="text-xs text-slate-500 font-medium">
                Já possui uma conta?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-bold text-primary hover:text-blue-700 transition-colors ml-1 cursor-pointer underline-offset-2 hover:underline"
                >
                  Fazer Login
                </button>
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Não possui acesso à plataforma?
                </p>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-primary/40 hover:bg-slate-50 text-slate-700 hover:text-primary font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-primary" />
                  Criar Nova Conta / Cadastre-se
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center py-4">
        <p className="text-xs font-medium text-slate-400">
          Autenticação de Usuário • Acesso Restrito
        </p>
      </footer>
    </div>
  );
}
