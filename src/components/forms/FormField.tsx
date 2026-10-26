import React from 'react';
import { Input, type InputProps } from '../ui/Input/Input';

export function FormField({ label, id, ...props }: InputProps & { label: string; id: string }) {
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-xs font-bold text-slate-700">{label}</label><Input id={id} className="bg-slate-50 rounded-xl h-11" {...props} /></div>;
}
