import React from "react";

export function Footer() {
  return (
    <footer className="py-4 px-6 text-sm text-text-muted border-t border-border mt-auto">
      <div className="flex items-center justify-between">
        <p>© {new Date().getFullYear()} ClinicERP. Todos os direitos reservados.</p>
        <p>Versão 1.0.0</p>
      </div>
    </footer>
  );
}
