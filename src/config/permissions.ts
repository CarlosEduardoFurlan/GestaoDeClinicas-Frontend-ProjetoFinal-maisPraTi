import type { Profile } from '../types';

const all: readonly Profile[] = ['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL'];
const administrative: readonly Profile[] = ['ADMIN', 'RECEPTIONIST'];

// A mesma matriz é usada no menu e nas rotas. Segurança/ownership continuam no backend.
export const routeProfiles: Record<string, readonly Profile[]> = {
  '/': all,
  '/appointments': all,
  '/consultations': all,
  '/patients': administrative,
  '/professionals': administrative,
  '/specialties': all,
  '/medical-records': ['ADMIN', 'PROFESSIONAL'],
  '/users': ['ADMIN'],
};
