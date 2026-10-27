import { FormField } from './FormField';
import type { AddressRequest, AddressResponse } from '../../types';

export interface AddressFormState { address: string; number: string; complement: string; district: string; city: string; uf: string; zipCode: string }
export const emptyAddress = (): AddressFormState => ({ address: '', number: '', complement: '', district: '', city: '', uf: '', zipCode: '' });
export function addressFormFrom(address: AddressResponse | null): AddressFormState {
  return address ? { ...address, number: String(address.number), complement: address.complement ?? '' } : emptyAddress();
}
export function addressPayload(form: AddressFormState): AddressRequest {
  const number = Number(form.number);
  if (!form.number.trim() || !Number.isInteger(number) || number < -2147483648 || number > 2147483647) throw new Error('Informe um número de endereço inteiro válido.');
  return { address: form.address.trim(), number, complement: form.complement.trim() || null, district: form.district.trim(), city: form.city.trim(), uf: form.uf.trim(), zipCode: form.zipCode.trim() };
}
export function AddressFields({ value, onChange, disabled, prefix }: { value: AddressFormState; onChange: (value: AddressFormState) => void; disabled: boolean; prefix: string }) {
  const change = (field: keyof AddressFormState, content: string) => onChange({ ...value, [field]: content });
  return <fieldset disabled={disabled} className="space-y-4 border-t border-slate-100 pt-4">
    <legend className="text-sm font-bold text-slate-900">Endereço</legend>
    <FormField id={`${prefix}-address`} label="Logradouro" required maxLength={150} value={value.address} onChange={(event) => change('address', event.target.value)} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FormField id={`${prefix}-number`} label="Número" type="number" step={1} min={-2147483648} max={2147483647} required value={value.number} onChange={(event) => change('number', event.target.value)} /><FormField id={`${prefix}-complement`} label="Complemento" maxLength={20} value={value.complement} onChange={(event) => change('complement', event.target.value)} /></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FormField id={`${prefix}-district`} label="Bairro" required maxLength={50} value={value.district} onChange={(event) => change('district', event.target.value)} /><FormField id={`${prefix}-city`} label="Cidade" required maxLength={100} value={value.city} onChange={(event) => change('city', event.target.value)} /></div>
    <div className="grid grid-cols-2 gap-4"><FormField id={`${prefix}-uf`} label="UF" required maxLength={2} value={value.uf} onChange={(event) => change('uf', event.target.value)} /><FormField id={`${prefix}-zipCode`} label="CEP" required maxLength={9} value={value.zipCode} onChange={(event) => change('zipCode', event.target.value)} /></div>
  </fieldset>;
}
