import { useEffect, useState } from 'react';

// Atrasa apenas o indicador visual; a operação e seu pending continuam imediatos.
export const LOADING_INDICATOR_DELAY_MS = 250;

export function useDelayedLoading(active: boolean) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active) { setVisible(false); return; }
    const timer = window.setTimeout(() => setVisible(true), LOADING_INDICATOR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active]);
  return active && visible;
}
