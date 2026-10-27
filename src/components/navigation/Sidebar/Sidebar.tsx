import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navigation, NavItem } from "../../../config/navigation";
import { cn } from "../../../lib/utils";
import { PlusSquare, LogOut, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { routeProfiles } from '../../../config/permissions';

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const mobileDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const dialog = mobileDialog.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const change = () => { if (media.matches) onClose(); };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, [onClose]);
  const { logout, hasRole } = useAuth();
  const visibleNavigation = navigation.map((group) => ({
    ...group,
    items: group.items.filter((item) => !!item.path && hasRole(routeProfiles[item.path] ?? [])),
  })).filter((group) => group.items.length > 0);
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    logout();
    info("Sessão encerrada", "Você saiu da sua conta com segurança.");
    navigate("/login");
  };

  const content = (mobile: boolean) => <>
      {/* Brand Header */}
      <div className="h-[var(--navbar-height)] shrink-0 flex items-center justify-between px-6 border-b border-border/50">
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
        {mobile && <button type="button" onClick={onClose} aria-label="Fechar menu de navegação" className="p-2 -mr-3 rounded-lg"><X className="w-5 h-5" /></button>}
      </div>

      {/* Navigation Links */}
      <nav aria-label="Navegação principal" className="flex-1 min-h-0 overflow-y-auto py-4 px-4 flex flex-col gap-6">
        {visibleNavigation.map((group, index) => (
          <div key={index} className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider pl-3">
              {group.label}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item, idx) => (
                <SidebarItem key={idx} item={item} onNavigate={mobile ? onClose : undefined} />
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
    </>;
  return <>
    <aside className="hidden lg:flex fixed left-0 top-0 h-dvh bg-surface border-r border-border flex-col z-20" style={{ width: 'var(--sidebar-width)' }}>{content(false)}</aside>
    <dialog id="mobile-navigation" aria-label="Menu de navegação" ref={mobileDialog} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="mobile-navigation lg:hidden fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(85vw,280px)] max-w-none p-0 border-0 bg-surface text-text shadow-xl">
      <div className="flex h-full flex-col">{content(true)}</div>
    </dialog>
  </>;
}

function SidebarItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void; key?: React.Key }) {
  if (!item.path) return null;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onNavigate}
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
