import type { ReactNode } from 'react';
import { useDelayedLoading } from '../../../hooks/useDelayedLoading';
import { cn } from '../../../lib/utils';
import { Spinner, type SpinnerProps } from '../Spinner/Spinner';

export function DelayedLoading({ active = true, children, className, size }: {
  active?: boolean; children: ReactNode; className?: string; size?: SpinnerProps['size'];
}) {
  const visible = useDelayedLoading(active);
  if (!visible) return null;
  return <div role="status" className={cn('flex items-center gap-3', className)}><Spinner size={size} />{children}</div>;
}
