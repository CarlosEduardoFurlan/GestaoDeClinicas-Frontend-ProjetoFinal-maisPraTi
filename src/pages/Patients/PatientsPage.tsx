import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { useApiList } from '../../hooks/useApiList';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { PatientService } from '../../services/patient.service';
import { errorDescription } from '../../lib/api-error';
import { PatientFormModal } from './PatientFormModal';
import type { PatientResponse } from '../../types';

export function PatientsPage() {
  const { items, setItems, loading, loadError, retry } = useApiList(PatientService.getAll);
  const { hasRole } = useAuth(); const canWrite = hasRole(['ADMIN', 'RECEPTIONIST']);
  const { error } = useToast();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<PatientResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false); const [pending, setPending] = useState(false);
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);
  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.cpf.includes(search));
  const openEdit = async (item: PatientResponse) => {
    if (!canWrite || operation.current) return;
    const controller = new AbortController(); operation.current = controller; setPending(true);
    try { const current = await PatientService.getById(item.id, controller.signal); if (!controller.signal.aborted) { setEditing(current); setIsOpen(true); } }
    catch (cause) { if (!controller.signal.aborted) error('Não foi possível carregar paciente', errorDescription(cause)); }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  const saved = (patient: PatientResponse) => { setItems((previous) => editing ? previous.map((item) => item.id === patient.id ? patient : item) : [...previous, patient]); setIsOpen(false); };
  return <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-slate-900">Pacientes</h1><p className="text-slate-500 mt-1">Gerenciamento e histórico de pacientes cadastrados</p></div>{canWrite && <Button disabled={loading || !!loadError || pending} onClick={() => { setEditing(null); setIsOpen(true); }} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Novo Paciente</Button>}</div>
    <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b flex items-center gap-3"><Search className="w-5 h-5 text-slate-400" /><input aria-label="Buscar paciente" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou CPF..." className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm" /></div>
      {loading ? <div role="status" className="p-10 flex justify-center gap-3"><Spinner />Carregando pacientes...</div> : loadError ? <div className="p-6 space-y-3"><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={retry}>Tentar novamente</Button></div> : <>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-5">Paciente & E-mail</th><th className="p-5">CPF</th><th className="p-5">Celular</th><th className="p-5 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-50">
          {!filtered.length ? <tr><td colSpan={4} className="p-10 text-center text-slate-500">{items.length ? 'Nenhum paciente encontrado com os filtros aplicados.' : 'Nenhum paciente cadastrado.'}</td></tr> : filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50/50"><td className="p-5"><Link to={`/patients/${item.id}`} className="font-bold text-slate-900 hover:text-primary">{item.name}</Link><div className="text-sm text-slate-500">{item.email ?? '—'}</div></td><td className="p-5 text-sm">{item.cpf}</td><td className="p-5 text-sm">{item.cellPhone}</td><td className="p-5"><div className="flex justify-end gap-2"><Link to={`/patients/${item.id}`} aria-label={`Visualizar ${item.name}`} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Eye className="w-4 h-4" /></Link>{canWrite && <button disabled={pending} aria-label={`Editar ${item.name}`} onClick={() => void openEdit(item)} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Edit2 className="w-4 h-4" /></button>}</div></td></tr>)}
        </tbody></table></div><div className="p-4 border-t text-sm text-slate-500">Exibindo {filtered.length} de {items.length} pacientes</div>
      </>}
      {pending && <p role="status" className="p-4 text-slate-500">Carregando paciente...</p>}
    </div>
    {canWrite && isOpen && <PatientFormModal patient={editing} onClose={() => setIsOpen(false)} onSaved={saved} />}
  </div>;
}
