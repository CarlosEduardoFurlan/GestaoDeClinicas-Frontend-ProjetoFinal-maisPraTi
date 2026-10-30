import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { LoadingContent } from '../../components/ui/Loading/LoadingContent';
import { Modal } from '../../components/overlay/Modal/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { SpecialtyService } from '../../services/specialty.service';
import { errorDescription } from '../../lib/api-error';
import type { SpecialtyResponse } from '../../types';

interface SpecialtyForm { name: string; description: string }

export function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<SpecialtyResponse | null>(null);
  const [deleting, setDeleting] = useState<SpecialtyResponse | null>(null);
  const [form, setForm] = useState<SpecialtyForm>({ name: '', description: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const mutation = useRef<AbortController | null>(null);
  const { hasRole } = useAuth();
  const canWrite = hasRole(['ADMIN']);
  const { success, error } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    void SpecialtyService.getAll(controller.signal).then((data) => {
      if (!controller.signal.aborted) setSpecialties(data);
    }).catch((cause: unknown) => {
      if (!controller.signal.aborted) setLoadError(errorDescription(cause));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [retry]);

  useEffect(() => () => mutation.current?.abort(), []);

  const filtered = specialties.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openForm = (item: SpecialtyResponse | null) => {
    if (!canWrite || pending) return;
    setEditing(item);
    setForm({ name: item?.name ?? '', description: item?.description ?? '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canWrite || mutation.current) return;
    const name = form.name.trim();
    if (!name || name.length > 50) {
      setFormError('Informe um nome com até 50 caracteres.');
      return;
    }
    const controller = new AbortController();
    mutation.current = controller;
    setPending(true);
    setFormError(null);
    try {
      const request = { name, description: form.description.trim() || null };
      const saved = editing
        ? await SpecialtyService.update(editing.id, request, controller.signal)
        : await SpecialtyService.create(request, controller.signal);
      if (controller.signal.aborted) return;
      setSpecialties((previous) => editing
        ? previous.map((item) => item.id === saved.id ? saved : item)
        : [...previous, saved]);
      success(editing ? 'Especialidade atualizada' : 'Especialidade cadastrada', saved.name);
      setIsModalOpen(false);
    } catch (cause) {
      if (!controller.signal.aborted) {
        const message = errorDescription(cause);
        setFormError(message);
        error('Não foi possível salvar', message);
      }
    } finally {
      mutation.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  };

  const handleDelete = async () => {
    if (!canWrite || !deleting || mutation.current) return;
    const controller = new AbortController();
    mutation.current = controller;
    setPending(true);
    setFormError(null);
    try {
      await SpecialtyService.delete(deleting.id, controller.signal);
      if (controller.signal.aborted) return;
      setSpecialties((previous) => previous.filter((item) => item.id !== deleting.id));
      success('Especialidade excluída', deleting.name);
      setDeleting(null);
    } catch (cause) {
      if (!controller.signal.aborted) {
        const message = errorDescription(cause);
        setFormError(message);
        error('Não foi possível excluir', message);
      }
    } finally {
      mutation.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Especialidades Médicas</h1>
          <p className="text-slate-500 mt-1 font-medium">Gerenciamento de especialidades cadastradas no sistema.</p>
        </div>
        {canWrite && <Button onClick={() => openForm(null)} disabled={loading || !!loadError || pending} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Nova Especialidade</Button>}
      </div>

      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" aria-label="Buscar especialidade" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar especialidade por nome ou descrição..." className="w-full bg-slate-50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <LoadingContent loading={loading} error={loadError} label="Carregando especialidades..." errorFallback={<div className="p-6 space-y-3"><p role="alert" className="text-red-700">{loadError}</p><Button variant="outline" onClick={() => setRetry((value) => value + 1)}>Tentar novamente</Button></div>}><>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nome da Especialidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Descrição do Escopo Clínico</th>
                  {canWrite && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>}
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? <tr><td colSpan={canWrite ? 3 : 2} className="px-6 py-10 text-center text-slate-500">
                    {specialties.length === 0 ? 'Nenhuma especialidade cadastrada.' : 'Nenhuma especialidade encontrada com os filtros aplicados.'}
                  </td></tr> : filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">{item.description ?? '—'}</td>
                    {canWrite && <td className="px-6 py-5 text-right"><div className="flex justify-end gap-2">
                      <button type="button" disabled={loading || pending} onClick={() => openForm(item)} aria-label={`Editar ${item.name}`} title="Editar Especialidade" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button type="button" disabled={loading || pending} onClick={() => { setFormError(null); setDeleting(item); }} aria-label={`Excluir ${item.name}`} title="Excluir Especialidade" className="p-2 text-slate-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div></td>}
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 text-sm text-slate-500">Exibindo {filtered.length} de {specialties.length} registros</div>
          </></LoadingContent>
      </div>

      {canWrite && <Modal isOpen={isModalOpen} onClose={() => { if (!pending) setIsModalOpen(false); }} title={editing ? 'Editar Especialidade' : 'Nova Especialidade'}>
        <form onSubmit={handleSave} className="space-y-4" aria-busy={pending}>
          <div><label htmlFor="specialty-name" className="block text-xs font-bold mb-2">Nome</label>
            <input id="specialty-name" required maxLength={50} disabled={pending} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" />
          </div>
          <div><label htmlFor="specialty-description" className="block text-xs font-bold mb-2">Descrição</label>
            <textarea id="specialty-description" rows={4} disabled={pending} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" />
          </div>
          {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
          <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" disabled={pending} onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit" loading={pending}>{editing ? 'Salvar Especialidade' : 'Cadastrar Especialidade'}</Button></div>
        </form>
      </Modal>}

      {canWrite && <Modal isOpen={!!deleting} onClose={() => { if (!pending) setDeleting(null); }} title="Excluir Especialidade">
        <p className="mb-4">Excluir a especialidade {deleting?.name}?</p>
        {formError && <p role="alert" className="mb-4 text-sm text-red-700">{formError}</p>}
        <div className="flex flex-wrap justify-end gap-3"><Button variant="outline" disabled={pending} onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="danger" loading={pending} onClick={() => void handleDelete()}>Excluir</Button></div>
      </Modal>}
    </div>
  );
}
