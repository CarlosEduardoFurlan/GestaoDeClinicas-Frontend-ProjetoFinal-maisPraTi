import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '../../components/overlay/Modal/Modal';
import { Button } from '../../components/ui/Button/Button';
import { FormField } from '../../components/forms/FormField';
import { AddressFields, addressFormFrom, addressPayload, emptyAddress } from '../../components/forms/AddressFields';
import { PatientService } from '../../services/patient.service';
import { useToast } from '../../contexts/ToastContext';
import { errorDescription } from '../../lib/api-error';
import type { PatientResponse, PatientUpdateRequest } from '../../types';

export function PatientFormModal({ patient, onClose, onSaved }: { patient: PatientResponse | null; onClose: () => void; onSaved: (patient: PatientResponse) => void }) {
  const [form, setForm] = useState(() => ({ name: patient?.name ?? '', cpf: patient?.cpf ?? '', dateBirth: patient?.dateBirth ?? '', telephone: patient?.telephone ?? '', cellPhone: patient?.cellPhone ?? '', email: patient?.email ?? '', gender: patient?.gender ?? '', address: patient ? addressFormFrom(patient.address) : emptyAddress() }));
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);
  const { success, error } = useToast();
  useEffect(() => () => operation.current?.abort(), []);
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const maxBirth = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const change = (key: keyof Omit<typeof form, 'address'>, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (operation.current) return;
    if (!form.name.trim() || !form.cpf.trim() || !form.cellPhone.trim() || !form.dateBirth || form.dateBirth > maxBirth || form.gender.trim().length !== 1) { setFormError('Preencha os campos obrigatórios e informe uma data de nascimento no passado.'); return; }
    const controller = new AbortController(); operation.current = controller; setPending(true); setFormError(null);
    try {
      const request: PatientUpdateRequest = { name: form.name.trim(), dateBirth: form.dateBirth, telephone: form.telephone.trim() || null, cellPhone: form.cellPhone.trim(), email: form.email.trim() || null, gender: form.gender, address: addressPayload(form.address) };
      const saved = patient ? await PatientService.update(patient.id, request, controller.signal) : await PatientService.create({ ...request, cpf: form.cpf.trim() }, controller.signal);
      if (controller.signal.aborted) return;
      success(patient ? 'Paciente atualizado' : 'Paciente cadastrado', saved.name); onSaved(saved);
    } catch (cause) { if (!controller.signal.aborted) { const message = errorDescription(cause); setFormError(message); error('Não foi possível salvar paciente', message); } }
    finally { operation.current = null; if (!controller.signal.aborted) setPending(false); }
  };
  return <Modal isOpen onClose={() => { if (!pending) onClose(); }} title={patient ? 'Editar Paciente' : 'Novo Paciente'} className="max-w-2xl">
    <form onSubmit={save} aria-busy={pending} className="space-y-4">
      <fieldset disabled={pending} className="space-y-4"><legend className="text-sm font-bold mb-3">Dados pessoais e contato</legend>
        <FormField id="patient-name" label="Nome completo" required maxLength={100} value={form.name} onChange={(event) => change('name', event.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FormField id="patient-cpf" label="CPF" required readOnly={!!patient} maxLength={14} value={form.cpf} onChange={(event) => change('cpf', event.target.value)} /><FormField id="patient-birth" label="Data de nascimento" type="date" required max={maxBirth} value={form.dateBirth} onChange={(event) => change('dateBirth', event.target.value)} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FormField id="patient-telephone" label="Telefone" maxLength={20} value={form.telephone} onChange={(event) => change('telephone', event.target.value)} /><FormField id="patient-cellPhone" label="Celular" required maxLength={20} value={form.cellPhone} onChange={(event) => change('cellPhone', event.target.value)} /></div>
        <FormField id="patient-email" label="E-mail" type="email" maxLength={100} value={form.email} onChange={(event) => change('email', event.target.value)} />
        <div><label htmlFor="patient-gender" className="block text-xs font-bold mb-2">Gênero</label><select id="patient-gender" required value={form.gender} onChange={(event) => change('gender', event.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm"><option value="">Selecione</option><option value="F">Feminino</option><option value="M">Masculino</option>{form.gender && !['F', 'M'].includes(form.gender) && <option value={form.gender}>{form.gender}</option>}</select></div>
      </fieldset>
      <AddressFields prefix="patient" disabled={pending} value={form.address} onChange={(address) => setForm({ ...form, address })} />
      {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
      <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button><Button type="submit" loading={pending}>Salvar Paciente</Button></div>
    </form>
  </Modal>;
}
