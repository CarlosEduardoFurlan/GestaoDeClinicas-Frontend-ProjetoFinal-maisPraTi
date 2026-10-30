import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { layoutConfig } from "../../config/layout";
import { Sidebar } from "../../components/navigation/Sidebar/Sidebar";
import { Navbar } from "../../components/navigation/Navbar/Navbar";
import { Footer } from "../../components/navigation/Footer/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { schedulePagePrefetch } from '../../app/pageLoaders';

export function AppShell() {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (isAuthenticated && user) return schedulePagePrefetch(user.profile);
  }, [isAuthenticated, user?.profile]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div 
      className="min-h-screen bg-background text-text flex"
      style={{
        '--sidebar-width': `${layoutConfig.sidebar.width}px`,
        '--navbar-height': `${layoutConfig.navbar.height}px`,
        '--content-max-width': `${layoutConfig.content.maxWidth}px`,
        '--content-padding': `${layoutConfig.content.padding}px`,
      } as React.CSSProperties}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white p-3 rounded-lg">Ir para o conteúdo</a>
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[var(--sidebar-width)]">
        <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((value) => !value)} />
        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 w-full max-w-[var(--content-max-width)] mx-auto p-4 sm:p-6 lg:p-[var(--content-padding)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
