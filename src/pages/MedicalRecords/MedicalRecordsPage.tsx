import { useEffect, useRef, useState } from 'react';
import { FileText, Eye, Plus, Edit2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { LoadingContent } from '../../components/ui/Loading/LoadingContent';
import { StatusBadge } from '../../components/appointments/StatusBadge';
import { MedicalRecordFormModal } from '../../components/medical-records/MedicalRecordFormModal';
import { useClinicalData } from '../../hooks/useClinicalData';
import { useAuth } from '../../contexts/AuthContext';
import { MedicalRecordService } from '../../services/medical-record.service';
import { clinicalRecords } from '../../lib/clinical';
import { displayDate, displayTime } from '../../lib/appointments';
import { errorDescription } from '../../lib/api-error';
import type { MedicalRecordResponse } from '../../types';

export function MedicalRecordsPage() {
  const { user, hasRole } = useAuth();
  const data = useClinicalData(hasRole(['ADMIN', 'PROFESSIONAL']));
  const canWrite = user?.profile === 'PROFESSIONAL';
  const [search, setSearch] = useState('');
  const [professionalFilter, setProfessionalFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selected, setSelected] = useState<MedicalRecordResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formRecord, setFormRecord] = useState<MedicalRecordResponse | undefined>();
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);
  const joined = clinicalRecords(data.records, data.appointments);
  const filtered = joined.filter(({ appointment }) =>
    (!search || appointment?.patientName.toLowerCase().includes(search.toLowerCase())) &&
    (!professionalFilter || appointment?.professionalId === professionalFilter) && (!dateFilter || appointment?.date === dateFilter));
  const professionals = [...new Map(data.appointments.map((appointment) => [appointment.professionalId, appointment.professionalName])).entries()];
  const related = data.appointments.find((appointment) => appointment.id === selected?.appointmentId);

  const loadRecord = async (id: string, edit = false) => {
    if (operation.current || (edit && !canWrite)) return;
    const controller = new AbortController(); operation.current = controller;
    setSelectedId(id); setSelected(previous => previous?.id === id ? previous : null); setRecordLoading(true); setRecordError(null);
    try {
      const record = await MedicalRecordService.getById(id, controller.signal);
      if (controller.signal.aborted) return;
      setSelected(record);
      if (edit) { setFormRecord(record); setFormOpen(true); }
    } catch (cause) { if (!controller.signal.aborted) setRecordError(errorDescription(cause)); }
    finally { operation.current = null; if (!controller.signal.aborted) setRecordLoading(false); }
  };
  const refresh = async () => {
    if (await data.refresh()) { if (selectedId) await loadRecord(selectedId); }
  };

  return <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-slate-900">Prontuários</h1><p className="text-slate-500 mt-1">Registros clínicos vinculados às consultas</p></div>
      <div className="flex gap-3"><Button variant="outline" disabled={data.loading || recordLoading} onClick={() => void refresh()}>Atualizar prontuários</Button>{canWrite && <Button disabled={data.loading || !!data.loadError || recordLoading} onClick={() => { setFormRecord(undefined); setFormOpen(true); }} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Novo Prontuário</Button>}</div>
    </div>
    <div className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-slate-100 flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input aria-label="Buscar paciente no prontuário" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar paciente..." className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm" /></div>
      {user?.profile === 'ADMIN' && <select aria-label="Filtrar profissional" value={professionalFilter} onChange={(event) => setProfessionalFilter(event.target.value)} className="bg-slate-50 border rounded-xl px-3 py-2.5 text-sm"><option value="">Todos os profissionais</option>{professionals.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>}
      <input aria-label="Filtrar data" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="bg-slate-50 border rounded-xl px-3 py-2.5 text-sm" />
    </div>
    <LoadingContent loading={data.loading} error={data.loadError} label="Carregando prontuários..." errorFallback={<div className="bg-white rounded-xl p-6 space-y-3"><p role="alert" className="text-red-700">{data.loadError}</p><Button variant="outline" onClick={() => void refresh()}>Tentar novamente</Button></div>}><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden"><div className="p-5 border-b text-sm font-bold">{filtered.length} prontuários</div>
          {!filtered.length ? <p className="p-6 text-sm text-slate-500">{data.records.length ? 'Nenhum prontuário encontrado com os filtros aplicados.' : 'Nenhum prontuário cadastrado.'}</p> : <div className="divide-y divide-slate-100">{filtered.map(({ record, appointment }) => <button key={record.id} data-record-id={record.id} aria-label={`Visualizar prontuário de ${appointment?.patientName ?? 'consulta indisponível'}`} onClick={() => void loadRecord(record.id)} disabled={recordLoading} className={`w-full text-left p-5 space-y-2 hover:bg-slate-50 ${selectedId === record.id ? 'bg-blue-50/50 border-l-4 border-primary' : ''}`}>
            <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-slate-500">{appointment ? `${displayDate(appointment.date)} · ${displayTime(appointment.time)}` : 'Consulta relacionada indisponível'}</span><Eye className="w-4 h-4 text-slate-400 shrink-0" /></div>
            <h2 className="font-bold text-slate-900">{appointment?.patientName ?? 'Dados da consulta indisponíveis'}</h2><p className="text-xs text-slate-500">{appointment?.professionalName}</p><p className="text-sm text-slate-600 line-clamp-2 break-words">{record.notes}</p>
          </button>)}</div>}
        </div>
        <div className="lg:col-span-2 bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100">
          <LoadingContent key={selectedId} loading={recordLoading} error={recordError} label="Carregando prontuário..." errorFallback={<div className="space-y-3"><p role="alert" className="text-red-700">{recordError}</p><Button variant="outline" onClick={() => { if (selectedId) void loadRecord(selectedId); }}>Tentar novamente</Button></div>}>{selected ? <div data-record-detail-id={selected.id} className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4"><div><h2 className="text-xl font-bold text-slate-900">{related?.patientName ?? 'Consulta relacionada indisponível'}</h2>{related && <p className="text-sm text-slate-500 mt-1">{related.professionalName} · {displayDate(related.date)} às {displayTime(related.time)}</p>}</div>
              {canWrite && related?.professionalId === user?.professionalId && <Button variant="outline" disabled={recordLoading || data.loading} onClick={() => void loadRecord(selected.id, true)} className="gap-2"><Edit2 className="w-4 h-4" />Editar Observações</Button>}
            </div>
            {related && <StatusBadge status={related.statusName} />}
            <div className="border-t pt-5"><h3 className="font-bold text-slate-900 flex gap-2 items-center mb-4"><FileText className="w-4 h-4 text-primary" />Observações clínicas</h3><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{selected.notes}</p></div>
          </div> : <div className="p-10 text-center text-slate-500"><FileText className="w-10 h-10 mx-auto mb-4 text-slate-300" /><p>Selecione um prontuário para visualizar.</p></div>}</LoadingContent>
        </div>
      </div></LoadingContent>
    {formOpen && canWrite && <MedicalRecordFormModal record={formRecord} {...data} onClose={() => setFormOpen(false)} onSaved={(saved) => { setSelected(saved); setSelectedId(saved.id); setFormOpen(false); void data.refresh(); }} />}
  </div>;
}
