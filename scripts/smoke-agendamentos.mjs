import assert from 'node:assert/strict';
import { build } from 'esbuild';

const { outputFiles } = await build({ entryPoints: ['src/lib/appointments.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const rules = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const schedule = { id: 'slot-a', professionalId: 'professional-a', professionalName: 'A', date: '2030-01-07', time: '08:00:00', created: null };
const appointment = { id: 'appointment-a', patientId: 'patient-a', patientName: 'A', professionalId: schedule.professionalId, professionalName: 'A', date: schedule.date, time: '08:00', statusId: 'from-catalog', statusName: 'Agendada', notes: null, created: null };
const otherProfessional = { ...schedule, id: 'slot-b', professionalId: 'professional-b' };

for (const statusName of ['Agendada', 'Confirmada', 'Em atendimento', 'Concluída']) {
  assert.deepEqual(rules.availableSchedules([schedule, otherProfessional], [{ ...appointment, statusName }]).map(item => item.id), ['slot-b']);
}
assert.deepEqual(rules.availableSchedules([schedule], [{ ...appointment, statusName: 'Cancelada' }]), [schedule]);
assert.deepEqual(rules.availableSchedules([schedule], [{ ...appointment, statusName: 'Cancelada' }, { ...appointment, id: 'new-booking', statusName: 'Agendada' }]), []);
assert.deepEqual(rules.availableSchedules([schedule], [{ ...appointment, date: '2030-01-08' }]), [schedule]);
assert.equal(rules.timeKey('08:00'), rules.timeKey('08:00:00'));
assert.equal(rules.timeKey('08:00:00.100'), rules.timeKey('08:00:00.1'));
assert.notEqual(rules.timeKey('08:00:15'), rules.timeKey('08:00'));
assert.equal(rules.displayTime('08:00:15'), '08:00:15');
console.log('PASS: disponibilidade distingue profissional/data/segundos, status ativo e nova reserva após cancelamento');

const expected = {
  ADMIN: { Agendada: ['Confirmada'], Confirmada: ['Em atendimento'], 'Em atendimento': ['Concluída'] },
  RECEPTIONIST: { Agendada: ['Confirmada'] },
  PROFESSIONAL: { Confirmada: ['Em atendimento'], 'Em atendimento': ['Concluída'] },
};
for (const profile of Object.keys(expected)) {
  for (const statusName of ['Agendada', 'Confirmada', 'Em atendimento', 'Concluída', 'Cancelada']) {
    assert.deepEqual(rules.statusActions(profile, { ...appointment, statusName }, schedule.professionalId).map(action => action.target), expected[profile][statusName] ?? []);
    assert.equal(rules.canCancel(profile, statusName), profile !== 'PROFESSIONAL' && ['Agendada', 'Confirmada'].includes(statusName));
  }
}
assert.deepEqual(rules.statusActions('PROFESSIONAL', { ...appointment, statusName: 'Confirmada' }, 'other'), []);
assert.deepEqual(rules.statusActions('PROFESSIONAL', { ...appointment, statusName: 'Confirmada' }, null), []);
console.log('PASS: matriz de transições por perfil, estados finais e ownership defensivo');

const originalTimezone = process.env.TZ;
try {
  for (const timezone of ['America/Cuiaba', 'Pacific/Kiritimati', 'America/Los_Angeles']) {
    process.env.TZ = timezone;
    assert.equal(rules.shiftDate('2030-01-01', -1), '2029-12-31');
    assert.equal(rules.shiftDate('2028-02-28', 1), '2028-02-29');
    assert.deepEqual(rules.weekDates('2030-01-01'), ['2029-12-31', '2030-01-01', '2030-01-02', '2030-01-03', '2030-01-04', '2030-01-05', '2030-01-06']);
    assert.equal(rules.displayDate('2030-01-07'), '07/01/2030');
  }
} finally {
  if (originalTimezone === undefined) delete process.env.TZ;
  else process.env.TZ = originalTimezone;
}
console.log('PASS: calendário local em três fusos, virada de ano, bissexto e fim de semana');
console.log('Smoke de agendamentos concluído; não substitui o browser/backend real.');
