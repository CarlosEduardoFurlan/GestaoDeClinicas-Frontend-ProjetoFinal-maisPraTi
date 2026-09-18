import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    info("Sessão encerrada", "Você saiu da sua conta com segurança.");
    navigate("/login");
  };
  
  return (
    <header className="h-[var(--navbar-height)] bg-background flex items-center justify-end px-6 sticky top-0 z-10">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity p-1.5 rounded-xl cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'SJ'}
          </div>
          <div className="flex flex-col text-left hidden sm:flex">
            <span className="text-sm font-semibold text-text">{user?.name || "Dra. Sarah Jenkins"}</span>
            <span className="text-xs text-text-secondary">{user?.role === "ADMIN" ? "Administrador" : "Médico"}</span>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sair do Sistema
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
