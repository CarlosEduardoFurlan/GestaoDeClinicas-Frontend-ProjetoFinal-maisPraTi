const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

// Permite ao cliente HTTP invalidar a sessão sem depender de React ou do router.
const listeners = new Set<() => void>();
export function onSessionInvalidated(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function invalidateSession(): void {
  tokenStorage.clear();
  listeners.forEach((listener) => listener());
}
