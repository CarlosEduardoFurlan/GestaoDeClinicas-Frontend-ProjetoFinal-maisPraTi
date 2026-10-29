import type { SelectHTMLAttributes } from 'react';

export function SelectField({ label, id, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string }) {
  return <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-bold text-slate-700">{label}</label>
    <select id={id} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm disabled:opacity-50" {...props}>{children}</select>
  </div>;
}
