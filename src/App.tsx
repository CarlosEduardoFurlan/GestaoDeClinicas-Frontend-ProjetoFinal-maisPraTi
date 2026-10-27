/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SessionApp />
      </ToastProvider>
    </AuthProvider>
  );
}

function SessionApp() {
  const { sessionVersion } = useAuth();
  // Preserva o descarte dos estados das páginas ao trocar/encerrar sessão.
  return <RouterProvider key={sessionVersion} router={router} />;
}
