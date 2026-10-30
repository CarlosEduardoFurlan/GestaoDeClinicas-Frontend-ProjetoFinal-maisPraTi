import { useEffect, useState, type ReactNode } from 'react';
import { DelayedLoading } from './DelayedLoading';

export function LoadingContent({ loading, error, label, errorFallback, children }: {
  loading: boolean; error: string | null; label: string; errorFallback: ReactNode; children: ReactNode;
}) {
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (!loading && !error) setHasLoaded(true);
  }, [loading, error]);

  // A prontidão pertence a esta montagem; não guarda dados entre rotas ou sessões.
  if (loading && !hasLoaded) return <DelayedLoading className="p-10 justify-center">{label}</DelayedLoading>;
  if (error) return <>{errorFallback}</>;
  return <>
    {children}
    <DelayedLoading active={loading && hasLoaded} size="sm" className="px-5 py-2 text-sm text-slate-500">Atualizando dados...</DelayedLoading>
  </>;
}
