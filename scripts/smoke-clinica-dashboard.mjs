import assert from 'node:assert/strict';
import { build } from 'esbuild';
async function load(entry) {
  const { outputFiles } = await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', write: false });
  return import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
}
const { clinicalRecords, appointmentsWithoutRecord } = await load('src/lib/clinical.ts');
const { dashboardAppointments } = await load('src/lib/dashboard.ts');
const appointment = (id, date, time, statusName = 'Agendada', patientId = 'patient-a') => ({ id, patientId, patientName: patientId, professionalId: 'professional-a', professionalName: 'A', date, time, statusId: 'catalog-id', statusName, notes: null, created: null });
const appointments = [appointment('a', '2030-01-07', '08:00'), appointment('b', '2030-01-08', '09:00', 'Cancelada', 'patient-b'), appointment('c', '2030-01-07', '10:00', 'Confirmada')];
const records = [{ id: 'record-a', appointmentId: 'a', notes: 'Notes A' }, { id: 'record-b', appointmentId: 'b', notes: 'Notes B' }, { id: 'orphan', appointmentId: 'missing', notes: 'Notes sem consulta disponível' }];
const original = JSON.stringify({ appointments, records });
const joined = clinicalRecords(records, appointments);
assert.deepEqual(joined.map(item => item.record.id), ['record-b', 'record-a', 'orphan']);
assert.equal(joined[0].appointment.patientId, 'patient-b');
assert.equal(joined.find(item => item.record.id === 'orphan').appointment, undefined);
assert.deepEqual(Object.keys(joined[0].record).sort(), ['appointmentId', 'id', 'notes']);
assert.equal(JSON.stringify({ appointments, records }), original);
assert.deepEqual(appointmentsWithoutRecord(records, appointments).map(item => item.id), ['c']);
assert.deepEqual(appointmentsWithoutRecord([], appointments).map(item => item.id), ['a', 'b', 'c']);
console.log('PASS: join por UUID, isolamento de Patient, ordenação, órfão sem identidade fabricada e DTO preservado');
console.log('PASS: opções sem duplicidade e sem restrição clínica de status inventada');

const originalTimezone = process.env.TZ;
try {
  for (const timezone of ['America/Cuiaba', 'Pacific/Kiritimati', 'America/Los_Angeles']) {
    process.env.TZ = timezone;
    const now = new Date(2030, 0, 7, 23, 30, 0, 100);
    const list = [
      appointment('future', '2030-01-08', '08:00'),
      appointment('cancelled', '2030-01-08', '09:00', 'Cancelada'),
      appointment('completed', '2030-01-08', '10:00', 'Concluída'),
      appointment('late', '2030-01-07', '23:45', 'Confirmada'),
      appointment('early', '2030-01-07', '08:00', 'Concluída'),
      appointment('cancelled-today', '2030-01-07', '09:00', 'Cancelada'),
      appointment('in-progress', '2030-01-07', '23:40', 'Em atendimento'),
      appointment('equal', '2030-01-07', '23:30:00.1'),
      appointment('fraction', '2030-01-07', '23:30:00.100001'),
      appointment('past', '2030-01-06', '23:59'),
    ];
    const result = dashboardAppointments(list, now);
    assert.equal(result.today.length, 6);
    assert.deepEqual(result.today.map(item => item.id), ['early', 'cancelled-today', 'equal', 'fraction', 'in-progress', 'late']);
    assert.deepEqual(result.upcoming.map(item => item.id), ['future', 'late', 'in-progress', 'fraction']);
    assert.deepEqual(dashboardAppointments([], now), { today: [], upcoming: [] });
    const early = dashboardAppointments([appointment('local', '2030-01-07', '00:45')], new Date(2030, 0, 7, 0, 30));
    assert.equal(early.today.length, 1); assert.equal(early.upcoming.length, 1);
  }
} finally {
  if (originalTimezone === undefined) delete process.env.TZ;
  else process.env.TZ = originalTimezone;
}
console.log('PASS: Dashboard em três fusos, dia local, estados finais, ordem e precisão de LocalTime');
