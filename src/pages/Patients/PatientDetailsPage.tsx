import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, User, Calendar, ClipboardList } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { PatientService } from '../../services/patient.service';
import { errorDescription } from '../../lib/api-error';
import { PatientFormModal } from './PatientFormModal';
import { PatientAppointments } from './PatientAppointments';
import { PatientClinicalRecords } from './PatientClinicalRecords';
import type { PatientResponse } from '../../types';

export function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { hasRole } = useAuth();
  const canWrite = hasRole(['ADMIN', 'RECEPTIONIST']); const canReadRecords = hasRole(['ADMIN']);
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(true); const [loadError, setLoadError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0); const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pessoais' | 'consultas' | 'registros'>('pessoais');
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setLoadError(null); setPatient(null); setEditing(false); setActiveTab('pessoais');
    if (!id) { setLoadError('Paciente não informado.'); setLoading(false); return () => controller.abort(); }
    void PatientService.getById(id, controller.signal).then((data) => { if (!controller.signal.aborted) setPatient(data); })
      .catch((cause: unknown) => { if (!controller.signal.aborted) setLoadError(errorDescription(cause)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, revision]);
  return <div className="max-w-[1600px] mx-auto space-y-6">
    <Link to="/patients" className="flex items-center text-sm font-medium text-slate-500 hover:text-primary w-fit"><ArrowLeft className="w-4 h-4 mr-1.5" />Pacientes{patient && <span className="text-slate-900 ml-1 font-bold">/ {patient.name}</span>}</Link>
    {loading ? <div role="status" className="p-10 flex justify-center gap-3"><Spinner />Carregando paciente...</div> : loadError ? <div className="bg-white rounded-xl p-6 space-y-3"><h1 className="text-xl font-bold">Não foi possível carregar paciente</h1><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={() => setRevision((value) => value + 1)}>Tentar novamente</Button></div> : patient && <>
      <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-center gap-5"><div className="w-20 h-20 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-2xl shrink-0">{patient.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('')}</div><div><h1 className="text-2xl font-extrabold text-slate-900">{patient.name}</h1><p className="text-sm text-slate-500 mt-2">CPF: {patient.cpf}</p><p className="text-sm text-slate-500">Nascimento: {patient.dateBirth.split('-').reverse().join('/')}</p><p className="text-sm text-slate-500">Celular: {patient.cellPhone}</p></div></div>
        {canWrite && <Button variant="outline" onClick={() => setEditing(true)} className="self-start gap-2 rounded-xl"><Edit2 className="w-4 h-4" />Editar Dados</Button>}
      </div>
      <div role="tablist" aria-label="Dados do paciente" className="flex items-center gap-2 overflow-x-auto">
        {([{ key: 'pessoais', label: 'Dados Pessoais', Icon: User }, { key: 'consultas', label: 'Consultas', Icon: Calendar }, ...(canReadRecords ? [{ key: 'registros' as const, label: 'Registros Clínicos', Icon: ClipboardList }] : [])] as const).map(({ key, label, Icon }) => <button key={key} role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${activeTab === key ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}><Icon className="w-4 h-4" />{label}</button>)}
      </div>
      <div role="tabpanel" className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100">
        {activeTab === 'pessoais' ? <><h2 className="font-bold text-lg mb-5">Identificação, contato e endereço</h2><dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">{[
          ['Nome', patient.name], ['CPF', patient.cpf], ['Data de nascimento', patient.dateBirth.split('-').reverse().join('/')], ['Gênero', patient.gender === 'F' ? 'Feminino' : patient.gender === 'M' ? 'Masculino' : patient.gender], ['Telefone', patient.telephone], ['Celular', patient.cellPhone], ['E-mail', patient.email], ['Logradouro', patient.address.address], ['Número', patient.address.number], ['Complemento', patient.address.complement], ['Bairro', patient.address.district], ['Cidade', patient.address.city], ['UF', patient.address.uf], ['CEP', patient.address.zipCode],
        ].map(([label, value]) => <div key={label}><dt className="text-slate-500 mb-1">{label}</dt><dd className="font-semibold text-slate-900">{value ?? '—'}</dd></div>)}</dl></> :
          activeTab === 'consultas' ? <PatientAppointments key={patient.id} patientId={patient.id} /> : canReadRecords && <PatientClinicalRecords key={patient.id} patientId={patient.id} />}
      </div>
      {canWrite && editing && <PatientFormModal key={patient.id} patient={patient} onClose={() => setEditing(false)} onSaved={(saved) => { setPatient(saved); setEditing(false); }} />}
    </>}
  </div>;
}
