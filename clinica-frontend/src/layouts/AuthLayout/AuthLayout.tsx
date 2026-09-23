import React from "react";
import { Outlet } from "react-router-dom";
import { Activity } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-text">
          Clinica ERP
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Bem-vindo! Acesse sua conta para continuar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-border">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
