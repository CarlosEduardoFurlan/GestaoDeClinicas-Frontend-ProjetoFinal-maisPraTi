/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}
