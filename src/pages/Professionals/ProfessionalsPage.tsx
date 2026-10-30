import { DelayedLoading } from '../../components/ui/Loading/DelayedLoading';
import React, { useEffect, useRef, useState } from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/overlay/Modal/Modal';
import { LoadingContent } from '../../components/ui/Loading/LoadingContent';
import { FormField } from '../../components/forms/FormField';
import { AddressFields, addressFormFrom, addressPayload, emptyAddress, type AddressFormState } from '../../components/forms/AddressFields';
import { useApiList } from '../../hooks/useApiList';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ProfessionalService } from '../../services/professional.service';
import { SpecialtyService } from '../../services/specialty.service';
import { errorDescription } from '../../lib/api-error';
import type { ProfessionalResponse, ProfessionalUpdateRequest } from '../../types';

interface ProfessionalForm {
  name: string; register: string; telephone: string; cellPhone: string; email: string;
  specialtyId: string; address: AddressFormState; accountName: string; accountEmail: string; password: string;
}
const emptyForm = (): ProfessionalForm => ({ name: '', register: '', telephone: '', cellPhone: '', email: '', specialtyId: '', address: emptyAddress(), accountName: '', accountEmail: '', password: '' });

export function ProfessionalsPage() {
  const { items, setItems, loading, loadError, retry } = useApiList(ProfessionalService.getAll);
  const specialties = useApiList(SpecialtyService.getAll);
  const { hasRole } = useAuth(); const canWrite = hasRole(['ADMIN']);
  const { success, error } = useToast();
  const [search, setSearch] = useState(''); const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [editing, setEditing] = useState<ProfessionalResponse | null>(null);
  const [viewing, setViewing] = useState<ProfessionalResponse | null>(null);
  const [deleting, setDeleting] = useState<ProfessionalResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false); const [pending, setPending] = useState(false);
  const [form, setForm] = useState<ProfessionalForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);
  const filtered = items.filter((item) => (item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.register.toLowerCase().includes(search.toLowerCase())) && (!specialtyFilter || item.specialtyId === specialtyFilter));
  const change = (key: keyof Omit<ProfessionalForm, 'address'>, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const openNew = () => { if (!canWrite || operation.current) return; setEditing(null); setForm(emptyForm()); setFormError(null); setIsOpen(true); };
  const loadOne = async (item: ProfessionalResponse, mode: 'view' | 'edit') => {
    if (operation.current || (mode === 'edit' && !canWrite)) return;
    const controller = new AbortController(); operation.current = controller; setPending(true);
    try {
      const current = await ProfessionalService.getById(item.id, controller.signal);
      if (controller.signal.aborted) return;
      if (mode === 'view') setViewing(current);
      else { setEditing(current); setForm({ ...emptyForm(), name: current.name, register: current.register, telephone: current.telephone, cellPhone: current.cellPhone, email: current.email, specialtyId: current.specialtyId ?? '', address: addressFormFrom(current.address) }); setFormError(null); setIsOpen(true); }
    } catch (cause) { if (!controller.signal.aborted) error('Não foi possível carregar profissional', errorDescription(cause)); }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!canWrite || operation.current) return;
    if (!form.name.trim() || !form.register.trim() || !form.telephone.trim() || !form.cellPhone.trim() || !form.email.trim() || !form.specialtyId || (!editing && (!form.accountName.trim() || !form.accountEmail.trim() || !form.password.trim()))) { setFormError('Preencha os campos obrigatórios.'); return; }
    const controller = new AbortController(); operation.current = controller; setPending(true); setFormError(null);
    try {
      const request: ProfessionalUpdateRequest = { name: form.name.trim(), register: form.register.trim(), telephone: form.telephone.trim(), cellPhone: form.cellPhone.trim(), email: form.email.trim(), specialtyId: form.specialtyId, address: addressPayload(form.address) };
      const saved = editing ? await ProfessionalService.update(editing.id, request, controller.signal)
        : await ProfessionalService.create({ ...request, user: { name: form.accountName.trim(), email: form.accountEmail.trim(), password: form.password, profile: 'PROFESSIONAL' } }, controller.signal);
      if (controller.signal.aborted) return;
      setItems((previous) => editing ? previous.map((item) => item.id === saved.id ? saved : item) : [...previous, saved]);
      setIsOpen(false); setForm(emptyForm()); success(editing ? 'Profissional atualizado' : 'Profissional cadastrado', saved.name);
    } catch (cause) { if (!controller.signal.aborted) { const message = errorDescription(cause); setFormError(message); error('Não foi possível salvar profissional', message); } }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  const remove = async () => {
    if (!canWrite || !deleting || operation.current) return;
    const controller = new AbortController(); operation.current = controller; setPending(true); setFormError(null);
    try {
      await ProfessionalService.delete(deleting.id, controller.signal); if (controller.signal.aborted) return;
      setItems((previous) => previous.filter((item) => item.id !== deleting.id)); setDeleting(null); success('Profissional excluído', deleting.name);
    } catch (cause) { if (!controller.signal.aborted) { const message = errorDescription(cause); setFormError(message); error('Não foi possível excluir profissional', message); } }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };

  return <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-slate-900">Profissionais de Saúde</h1><p className="text-slate-500 mt-1">Corpo clínico e áreas de atuação vinculadas</p></div>{canWrite && <Button disabled={loading || !!loadError || pending} onClick={openNew} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Novo Profissional</Button>}</div>
    <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b flex flex-wrap gap-4"><input aria-label="Buscar profissional" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, registro ou e-mail..." className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm" /><select aria-label="Filtrar especialidade" value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)} className="bg-slate-50 rounded-xl px-4 py-3 text-sm"><option value="">Todas as especialidades</option>{specialties.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
      <LoadingContent loading={loading} error={loadError} label="Carregando profissionais..." errorFallback={<div className="p-6 space-y-3"><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={retry}>Tentar novamente</Button></div>}><>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-5">Profissional & E-mail</th><th className="p-5">Registro profissional</th><th className="p-5">Especialidade</th><th className="p-5 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-50">
          {!filtered.length ? <tr><td colSpan={4} className="p-10 text-center text-slate-500">{items.length ? 'Nenhum profissional encontrado com os filtros aplicados.' : 'Nenhum profissional cadastrado.'}</td></tr> : filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50/50"><td className="p-5"><div className="font-bold text-slate-900">{item.name}</div><div className="text-sm text-slate-500">{item.email}</div></td><td className="p-5 text-sm">{item.register}</td><td className="p-5 text-sm">{item.specialtyName ?? '—'}</td><td className="p-5"><div className="flex justify-end gap-2"><button disabled={loading || pending} aria-label={`Visualizar ${item.name}`} onClick={() => void loadOne(item, 'view')} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Eye className="w-4 h-4" /></button>{canWrite && <><button disabled={loading || pending} aria-label={`Editar ${item.name}`} onClick={() => void loadOne(item, 'edit')} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Edit2 className="w-4 h-4" /></button><button disabled={loading || pending} aria-label={`Excluir ${item.name}`} onClick={() => { setFormError(null); setDeleting(item); }} className="p-2 text-slate-500 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></>}</div></td></tr>)}
        </tbody></table></div><div className="p-4 border-t text-sm text-slate-500">Exibindo {filtered.length} de {items.length} profissionais</div>
      </></LoadingContent>
      <DelayedLoading active={pending && !isOpen && !deleting} size="sm" className="p-4 text-slate-500">Carregando profissional...</DelayedLoading>
    </div>
    {specialties.loadError && <div className="space-y-2"><p role="alert" className="text-red-700">{specialties.loadError}</p><Button variant="outline" onClick={specialties.retry}>Recarregar especialidades</Button></div>}
    {canWrite && <Modal isOpen={isOpen} onClose={() => { if (!pending) { setIsOpen(false); setForm(emptyForm()); } }} title={editing ? 'Editar Profissional' : 'Novo Profissional'} className="max-w-2xl">
      <form onSubmit={save} className="space-y-4" aria-busy={pending}>
        <fieldset disabled={pending} className="space-y-4"><legend className="text-sm font-bold mb-3">Dados profissionais</legend>
          <FormField id="professional-name" label="Nome do profissional" required maxLength={100} value={form.name} onChange={(event) => change('name', event.target.value)} />
          <FormField id="professional-register" label="Registro profissional" required maxLength={30} value={form.register} onChange={(event) => change('register', event.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FormField id="professional-telephone" label="Telefone" required maxLength={20} value={form.telephone} onChange={(event) => change('telephone', event.target.value)} /><FormField id="professional-cellPhone" label="Celular" required maxLength={20} value={form.cellPhone} onChange={(event) => change('cellPhone', event.target.value)} /></div>
          <FormField id="professional-email" label="E-mail de contato" type="email" required maxLength={100} value={form.email} onChange={(event) => change('email', event.target.value)} />
          <div><label htmlFor="professional-specialty" className="block text-xs font-bold mb-2">Especialidade</label><select id="professional-specialty" required value={form.specialtyId} disabled={pending || specialties.loading || !!specialties.loadError} onChange={(event) => change('specialtyId', event.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm"><option value="">Selecione a especialidade</option>{specialties.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{specialties.loading ? <p role="status" className="text-sm text-slate-500">Carregando especialidades...</p> : !specialties.loadError && !specialties.items.length && <p className="text-sm text-slate-500">Cadastre uma especialidade antes de criar o profissional.</p>}</div>
        </fieldset>
        <AddressFields prefix="professional" disabled={pending} value={form.address} onChange={(address) => setForm({ ...form, address })} />
        {!editing && <fieldset disabled={pending} className="space-y-4 border-t pt-4"><legend className="text-sm font-bold">Conta de acesso</legend><p className="text-sm text-slate-500">Perfil: Profissional</p>
          <FormField id="professional-account-name" label="Nome do usuário" required maxLength={100} value={form.accountName} onChange={(event) => change('accountName', event.target.value)} />
          <FormField id="professional-account-email" label="E-mail de acesso" type="email" required maxLength={100} autoComplete="off" value={form.accountEmail} onChange={(event) => change('accountEmail', event.target.value)} />
          <FormField id="professional-password" label="Senha" type="password" required maxLength={20} autoComplete="new-password" value={form.password} onChange={(event) => change('password', event.target.value)} />
        </fieldset>}
        {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
        <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" disabled={pending} onClick={() => { setIsOpen(false); setForm(emptyForm()); }}>Cancelar</Button><Button type="submit" loading={pending} disabled={specialties.loading || !!specialties.loadError || !specialties.items.length}>Salvar Profissional</Button></div>
      </form>
    </Modal>}
    <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Dados do Profissional" className="max-w-2xl">
      {viewing && <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">{[
        ['Nome', viewing.name], ['Registro profissional', viewing.register], ['Especialidade', viewing.specialtyName], ['Telefone', viewing.telephone], ['Celular', viewing.cellPhone], ['E-mail de contato', viewing.email],
        ['Logradouro', viewing.address?.address], ['Número', viewing.address?.number], ['Complemento', viewing.address?.complement], ['Bairro', viewing.address?.district], ['Cidade', viewing.address?.city], ['UF', viewing.address?.uf], ['CEP', viewing.address?.zipCode],
      ].map(([label, value]) => <div key={label}><dt className="text-slate-500 mb-1">{label}</dt><dd className="font-semibold text-slate-900">{value ?? '—'}</dd></div>)}</dl>}
    </Modal>
    {canWrite && <Modal isOpen={!!deleting} onClose={() => { if (!pending) setDeleting(null); }} title="Excluir Profissional"><p className="mb-4">Excluir o cadastro de {deleting?.name}? A conta de acesso será preservada.</p>{formError && <p role="alert" className="mb-4 text-sm text-red-700">{formError}</p>}<div className="flex flex-wrap justify-end gap-3"><Button variant="outline" disabled={pending} onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="danger" loading={pending} onClick={() => void remove()}>Excluir</Button></div></Modal>}
  </div>;
}
