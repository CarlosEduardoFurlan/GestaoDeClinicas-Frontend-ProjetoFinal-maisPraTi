import React, { useEffect, useRef, useState } from 'react';
import { Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/overlay/Modal/Modal';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UserService } from '../../services/user.service';
import { useApiList } from '../../hooks/useApiList';
import { errorDescription } from '../../lib/api-error';
import type { Profile, UserResponse } from '../../types';

interface UserForm { name: string; email: string; password: string; profile: Profile }
const profiles: Record<Profile, string> = { ADMIN: 'Administrador', RECEPTIONIST: 'Recepção', PROFESSIONAL: 'Profissional' };
const emptyForm: UserForm = { name: '', email: '', password: '', profile: 'RECEPTIONIST' };
const fieldClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export function UsersPage() {
  const { items, setItems, loading, loadError, retry } = useApiList(UserService.getAll);
  const { user, hasRole, logout, restoreSession } = useAuth();
  const canWrite = hasRole(['ADMIN']);
  const { success, error } = useToast();
  const [search, setSearch] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<UserResponse | null>(null);
  const [deleting, setDeleting] = useState<UserResponse | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);

  const filtered = items.filter((item) => (item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase())) && (!profileFilter || item.profile === profileFilter));

  const openNew = () => {
    if (!canWrite || operation.current) return;
    setEditing(null); setForm({ ...emptyForm }); setFormError(null); setIsOpen(true);
  };
  const openEdit = async (item: UserResponse) => {
    if (!canWrite || operation.current) return;
    const controller = new AbortController(); operation.current = controller; setPending(true);
    try {
      const current = await UserService.getById(item.id, controller.signal);
      if (controller.signal.aborted) return;
      setEditing(current); setForm({ name: current.name, email: current.email, password: '', profile: current.profile });
      setFormError(null); setIsOpen(true);
    } catch (cause) { if (!controller.signal.aborted) error('Não foi possível carregar usuário', errorDescription(cause)); }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canWrite || operation.current) return;
    if (!form.name.trim() || !form.password.trim()) { setFormError('Nome e senha são obrigatórios.'); return; }
    const controller = new AbortController(); operation.current = controller; setPending(true); setFormError(null);
    try {
      const update = { name: form.name.trim(), password: form.password, profile: form.profile };
      const saved = editing ? await UserService.update(editing.id, update, controller.signal)
        : await UserService.create({ ...update, email: form.email.trim() }, controller.signal);
      if (controller.signal.aborted) return;
      setItems((previous) => editing ? previous.map((item) => item.id === saved.id ? saved : item) : [...previous, saved]);
      setIsOpen(false); setForm({ ...emptyForm });
      success(editing ? 'Usuário atualizado' : 'Usuário cadastrado', saved.name);
      if (saved.id === user?.userId) await restoreSession();
    } catch (cause) { if (!controller.signal.aborted) { const message = errorDescription(cause); setFormError(message); error('Não foi possível salvar usuário', message); } }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  const remove = async () => {
    if (!canWrite || !deleting || operation.current) return;
    const controller = new AbortController(); operation.current = controller; setPending(true); setFormError(null);
    try {
      await UserService.delete(deleting.id, controller.signal);
      if (controller.signal.aborted) return;
      setItems((previous) => previous.filter((item) => item.id !== deleting.id));
      setDeleting(null); success('Usuário excluído', deleting.name);
      if (deleting.id === user?.userId) logout();
    } catch (cause) { if (!controller.signal.aborted) { const message = errorDescription(cause); setFormError(message); error('Não foi possível excluir usuário', message); } }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };

  return <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold text-slate-900">Usuários e Acessos</h1><p className="text-slate-500 mt-1">Gerenciamento de contas e perfis de acesso ao sistema</p></div>
      {canWrite && <Button onClick={openNew} disabled={loading || !!loadError || pending} className="rounded-xl gap-2"><UserPlus className="w-4 h-4" />Novo Usuário</Button>}
    </div>
    <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b flex flex-wrap gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" /><input aria-label="Buscar usuário" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filtrar por nome ou e-mail..." className={fieldClass + ' pl-11'} /></div>
        <select aria-label="Filtrar perfil" value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)} className="bg-slate-50 rounded-xl px-4 py-2 text-sm"><option value="">Todos os perfis</option>{Object.entries(profiles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>
      {loading ? <div role="status" className="p-10 flex justify-center gap-3"><Spinner />Carregando usuários...</div> : loadError ? <div className="p-6 space-y-3"><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={retry}>Tentar novamente</Button></div> : <>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-5">Usuário & E-mail</th><th className="p-5">Perfil de acesso</th><th className="p-5 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-50">
          {!filtered.length ? <tr><td colSpan={3} className="p-10 text-center text-slate-500">{items.length ? 'Nenhum usuário encontrado com os filtros aplicados.' : 'Nenhum usuário cadastrado.'}</td></tr> : filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50/50"><td className="p-5"><div className="font-bold text-slate-900">{item.name}</div><div className="text-sm text-slate-500">{item.email}</div></td><td className="p-5 text-sm">{profiles[item.profile]}</td><td className="p-5"><div className="flex justify-end gap-2">{canWrite && <><button disabled={pending} aria-label={`Editar ${item.name}`} onClick={() => void openEdit(item)} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Edit2 className="w-4 h-4" /></button><button disabled={pending} aria-label={`Excluir ${item.name}`} onClick={() => { setFormError(null); setDeleting(item); }} className="p-2 text-slate-500 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></>}</div></td></tr>)}
        </tbody></table></div><div className="p-4 border-t text-sm text-slate-500">Exibindo {filtered.length} de {items.length} usuários</div>
      </>}
      {pending && !isOpen && !deleting && <p role="status" className="p-4 text-slate-500">Carregando usuário...</p>}
    </div>
    {canWrite && <Modal isOpen={isOpen} onClose={() => { if (!pending) { setIsOpen(false); setForm({ ...emptyForm }); } }} title={editing ? 'Editar Usuário' : 'Novo Usuário'}>
      <form onSubmit={save} className="space-y-4" aria-busy={pending}>
        <div><label htmlFor="user-name" className="block text-xs font-bold mb-2">Nome Completo</label><input id="user-name" required maxLength={100} disabled={pending} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={fieldClass} /></div>
        <div><label htmlFor="user-email" className="block text-xs font-bold mb-2">E-mail Institucional</label><input id="user-email" type="email" required readOnly={!!editing} disabled={pending} maxLength={100} autoComplete="off" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={fieldClass} /></div>
        <div><label htmlFor="user-password" className="block text-xs font-bold mb-2">Senha</label><input id="user-password" type="password" required maxLength={20} autoComplete="new-password" disabled={pending} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={fieldClass} /></div>
        <div><label htmlFor="user-profile" className="block text-xs font-bold mb-2">Perfil de Acesso</label><select id="user-profile" required disabled={pending} value={form.profile} onChange={(event) => setForm({ ...form, profile: event.target.value as Profile })} className={fieldClass}>{Object.entries(profiles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
        <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" disabled={pending} onClick={() => { setIsOpen(false); setForm({ ...emptyForm }); }}>Cancelar</Button><Button type="submit" loading={pending}>Salvar Usuário</Button></div>
      </form>
    </Modal>}
    {canWrite && <Modal isOpen={!!deleting} onClose={() => { if (!pending) setDeleting(null); }} title="Excluir Usuário">
      <p className="mb-4">Excluir o usuário {deleting?.name}? O cadastro profissional vinculado também pode ser excluído.</p>
      {formError && <p role="alert" className="mb-4 text-sm text-red-700">{formError}</p>}
      <div className="flex flex-wrap justify-end gap-3"><Button variant="outline" disabled={pending} onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="danger" loading={pending} onClick={() => void remove()}>Excluir</Button></div>
    </Modal>}
  </div>;
}
