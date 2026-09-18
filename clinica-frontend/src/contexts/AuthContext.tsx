import React, { createContext, useContext, useState } from "react";

export type Role = "ADMIN" | "DOCTOR" | "RECEPTIONIST";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasRole: (allowedRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos com um usuário mock para facilitar o desenvolvimento
  // Numa implementação real, checaríamos o localStorage/token
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Administrador Geral",
    email: "admin@clinica.com",
    role: "ADMIN"
  });

  const login = (userData: User) => {
    setUser(userData);
    // TODO: persistir no localStorage
  };

  const logout = () => {
    setUser(null);
    // TODO: limpar localStorage
  };

  const hasRole = (allowedRoles: Role[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
