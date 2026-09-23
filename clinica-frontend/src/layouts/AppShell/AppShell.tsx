import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { layoutConfig } from "../../config/layout";
import { Sidebar } from "../../components/navigation/Sidebar/Sidebar";
import { Navbar } from "../../components/navigation/Navbar/Navbar";
import { Footer } from "../../components/navigation/Footer/Footer";
import { useAuth } from "../../contexts/AuthContext";

export function AppShell() {
  const { isAuthenticated } = useAuth();

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
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: "var(--sidebar-width)" }}>
        <Navbar />
        <main className="flex-1 w-full max-w-[var(--content-max-width)] mx-auto p-[var(--content-padding)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
