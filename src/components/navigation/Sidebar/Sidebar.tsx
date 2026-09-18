import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navigation, NavGroup, NavItem } from "../../../config/navigation";
import { cn } from "../../../lib/utils";
import { PlusSquare, LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";

export function Sidebar() {
  const { logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    info("Sessão encerrada", "Você saiu da sua conta com segurança.");
    navigate("/login");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-surface border-r border-border flex flex-col z-20 transition-all duration-300"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Brand Header */}
      <div className="h-[var(--navbar-height)] flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white shadow-sm">
            <PlusSquare className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none tracking-tight text-primary">
              +PraClinic
            </span>
            <span className="text-[10px] font-semibold text-text-secondary tracking-widest uppercase mt-0.5">
              Gestão Clínica
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-6">
        {navigation.map((group, index) => (
          <div key={index} className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider pl-3">
              {group.label}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item, idx) => (
                <SidebarItem key={idx} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Area: Logout Button */}
      <div className="p-4 border-t border-border/60 bg-slate-50/40">
        <button
          onClick={handleLogout}
          title="Deslogar do sistema"
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-[var(--radius-lg)] text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center group-hover:bg-red-200/80 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="leading-tight">Sair do Sistema</span>
            <span className="text-[11px] font-normal text-slate-400">Desconectar conta</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ item }: { item: NavItem; key?: React.Key }) {
  if (!item.path) return null;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-[var(--radius-lg)] transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-secondary hover:bg-surface-secondary hover:text-text"
        )
      }
    >
      {item.icon && <item.icon className="w-5 h-5" />}
      <span>{item.label}</span>
    </NavLink>
  );
}
