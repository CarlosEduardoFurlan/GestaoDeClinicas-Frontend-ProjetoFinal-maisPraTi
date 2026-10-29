import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthService } from '../services/auth.service';
import { errorDescription } from '../lib/api-error';
import { onSessionInvalidated, tokenStorage } from '../lib/session';
import type { AuthenticatedUser, LoginRequest, Profile } from '../types';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  sessionError: string | null;
  sessionVersion: number;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  hasRole: (profiles: readonly Profile[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const operation = useRef<AbortController | null>(null);

  const resetSession = useCallback(() => {
    operation.current?.abort();
    operation.current = null;
    setUser(null);
    setSessionError(null);
    setIsRestoring(false);
    setSessionVersion((version) => version + 1);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    resetSession();
  }, [resetSession]);

  const restoreSession = useCallback(async () => {
    operation.current?.abort();
    const controller = new AbortController();
    operation.current = controller;
    setIsRestoring(true);
    setSessionError(null);
    try {
      if (!tokenStorage.get()) { setUser(null); return; }
      const authenticatedUser = await AuthService.me(controller.signal);
      if (!controller.signal.aborted) setUser(authenticatedUser);
    } catch (error) {
      if (!controller.signal.aborted) {
        setUser(null);
        // Erros de rede/403 não destroem o token. A validação pode ser repetida.
        setSessionError(errorDescription(error));
      }
    } finally {
      if (!controller.signal.aborted) setIsRestoring(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    operation.current?.abort();
    const controller = new AbortController();
    operation.current = controller;
    setSessionError(null);
    setUser(null);
    let issuedToken: string | null = null;
    try {
      const response = await AuthService.login(credentials, controller.signal);
      if (controller.signal.aborted) return;
      issuedToken = response.accessToken;
      tokenStorage.set(issuedToken);
      const authenticatedUser = await AuthService.me(controller.signal);
      if (!controller.signal.aborted) {
        setUser(authenticatedUser);
        setSessionVersion((version) => version + 1);
      }
    } catch (error) {
      // Falha de credencial não dispara o encerramento global por 401.
      // Se /me falhar por rede/403, preservar o token para nova validação.
      if (!controller.signal.aborted && issuedToken && tokenStorage.get() === issuedToken) {
        setSessionError(errorDescription(error));
      }
      throw error;
    } finally {
      if (!controller.signal.aborted) setIsRestoring(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSessionInvalidated(resetSession);
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'auth_token' || event.key === null) {
        resetSession();
        void restoreSession();
      }
    };
    window.addEventListener('storage', onStorage);
    void restoreSession();
    return () => {
      operation.current?.abort();
      unsubscribe();
      window.removeEventListener('storage', onStorage);
    };
  }, [resetSession, restoreSession]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isRestoring, sessionError, sessionVersion,
      login, logout, restoreSession,
      hasRole: (profiles) => !!user && profiles.includes(user.profile),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
