/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { AppProvider } from "./contexts/AppContext";
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
  // Descarta estados das páginas e do contexto de negócio ao trocar/encerrar sessão.
  return <AppProvider key={sessionVersion}><RouterProvider router={router} /></AppProvider>;
}
