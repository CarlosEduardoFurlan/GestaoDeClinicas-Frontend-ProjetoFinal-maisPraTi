import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Eye, Edit2, FileText, FilterX, X, Check } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

const INITIAL_PATIENTS = [
  {
    id: 1,
    initials: "MS",
    name: "Mariana Costa Silveira",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "mariana.silveira@email.com",
    birthdate: "05/14/1990",
    cep: "01415-000",
    street: "Rua das Flores",
    number: "420 - Apto 82",
    neighborhood: "Jardim Paulista",
    city: "São Paulo",
    state: "SP"
  },
  {
    id: 2,
    initials: "CN",
    name: "Carlos Eduardo Nogueira",
    cpf: "234.567.890-11",
    phone: "(11) 97654-3210",
    email: "carlos.nogueira@email.com",
    birthdate: "11/22/1985",
    cep: "04567-000",
    street: "Av. Brigadeiro Faria Lima",
    number: "1500",
    neighborhood: "Itaim Bibi",
    city: "São Paulo",
    state: "SP"
  },
  {
    id: 3,
    initials: "BL",
    name: "Beatriz Lima dos Santos",
    cpf: "345.678.901-22",
    phone: "(11) 96543-2109",
    email: "beatriz.santos@email.com",
    birthdate: "03/08/1995",
    cep: "22041-001",
    street: "Rua Barata Ribeiro",
    number: "300",
    neighborhood: "Copacabana",
    city: "Rio de Janeiro",
    state: "RJ"
  },
  {
    id: 4,
    initials: "GP",
    name: "Gabriel Henrique Prado",
    cpf: "456.789.012-33",
    phone: "(11) 95432-1098",
    email: "gabriel.prado@email.com",
    birthdate: "09/30/1988",
    cep: "30140-071",
    street: "Rua da Bahia",
    number: "850",
    neighborhood: "Centro",
    city: "Belo Horizonte",
    state: "MG"
  },
  {
    id: 5,
    initials: "HA",
    name: "Helena Furtado Alencar",
    cpf: "567.890.123-44",
    phone: "(11) 94321-0987",
    email: "helena.alencar@email.com",
    birthdate: "01/17/2001",
    cep: "80020-010",
    street: "Rua XV de Novembro",
    number: "120",
    neighborhood: "Centro",
    city: "Curitiba",
    state: "PR"
  },
  {
    id: 6,
    initials: "RA",
    name: "Rodrigo de Souza Antunes",
    cpf: "678.901.234-55",
    phone: "(11) 93210-9876",
    email: "rodrigo.antunes@email.com",
    birthdate: "12/04/1979",
    cep: "90010-150",
    street: "Rua dos Andradas",
    number: "540",
    neighborhood: "Centro Histórico",
    city: "Porto Alegre",
    state: "RS"
  }
];

export function PatientsPage() {
  const [patientList, setPatientList] = useState(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birthdate: "",
    phone: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const filteredPatients = patientList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm)
  );

  const handleOpenNew = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      cpf: "",
      birthdate: "",
      phone: "",
      email: "",
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient(p);
    setFormData({
      name: p.name || "",
      cpf: p.cpf || "",
      birthdate: p.birthdate || "",
      phone: p.phone || "",
      email: p.email || "",
      cep: p.cep || "",
      street: p.street || "",
      number: p.number || "",
      neighborhood: p.neighborhood || "",
      city: p.city || "",
      state: p.state || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error("Atenção", "Por favor, preencha o nome completo do paciente.");
      return;
    }
    if (!formData.cpf.trim()) {
      error("Atenção", "Por favor, preencha o CPF do paciente.");
      return;
    }

    if (editingPatient) {
      setPatientList((prev) =>
        prev.map((item) =>
          item.id === editingPatient.id ? { ...item, ...formData } : item
        )
      );
      success("Paciente atualizado", `Ficha de ${formData.name} foi atualizada com sucesso.`);
    } else {
      const getInitials = (n: string) => {
        const parts = n.trim().split(" ");
        return parts.length > 1
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : n.slice(0, 2).toUpperCase();
      };

      const newPatient = {
        id: Date.now(),
        initials: getInitials(formData.name),
        ...formData
      };

      setPatientList((prev) => [newPatient, ...prev]);
      success("Paciente cadastrado", `${formData.name} foi adicionado à base de pacientes.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pacientes</h1>
          <p className="text-slate-500 mt-1 font-medium">Cadastro e gerenciamento básico de pacientes da clínica</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenNew}
          className="rounded-xl px-6 font-semibold shadow-sm bg-primary hover:bg-blue-700"
        >
          + Novo Paciente
        </Button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between w-full max-w-[280px]">
        <div>
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase block mb-1">Total de Pacientes</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {348 + patientList.length - INITIAL_PATIENTS.length}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters Area */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-11 pr-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
              placeholder="Buscar por nome ou CPF..." 
            />
          </div>
          
          <button 
            onClick={() => {
              setSearchTerm("");
              info("Filtro limpo", "A busca por pacientes foi resetada.");
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            <FilterX className="w-4 h-4 text-slate-500" />
            Limpar Busca
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nascimento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/patients/${item.id}`)}
                >
                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {item.initials}
                      </div>
                      <span className="text-sm font-bold text-slate-900 leading-tight max-w-[160px]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="text-sm font-medium text-slate-600">{item.cpf}</span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="text-sm font-medium text-slate-600">{item.phone}</span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="text-sm font-medium text-slate-600">{item.email}</span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="text-sm font-medium text-slate-600">{item.birthdate}</span>
                  </td>
                  <td className="px-6 py-5 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      <button 
                        className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" 
                        title="Ver Detalhes"
                        onClick={(e) => { e.stopPropagation(); navigate(`/patients/${item.id}`); }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" 
                        title="Editar"
                        onClick={(e) => handleOpenEdit(item, e)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" 
                        title="Prontuário"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/medical-records");
                          info("Prontuário", `Acessando histórico clínico de ${item.name}`);
                        }}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-sm text-slate-500 font-medium">
            Mostrando <strong className="text-slate-900 font-bold">1</strong> a <strong className="text-slate-900 font-bold">{filteredPatients.length}</strong> de <strong className="text-slate-900 font-bold">{patientList.length}</strong> pacientes
          </span>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-400 text-sm font-semibold transition-colors" disabled>
              Anterior
            </button>
            <button className="w-8 h-8 flex justify-center items-center rounded-md bg-primary text-white font-bold text-sm shadow-sm transition-colors">
              1
            </button>
            <button className="px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-600 text-sm font-semibold transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar Paciente - Conforme Print */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[620px] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-7 pt-6 pb-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {editingPatient ? "Editar Paciente" : "Novo Paciente"}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  {editingPatient ? "Atualização de dados cadastrais" : "Dados cadastrais básicos"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto px-7 py-5 space-y-4 flex-1">
                {/* DADOS PESSOAIS & CONTATO */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-3">
                    DADOS PESSOAIS & CONTATO
                  </span>

                  <div className="space-y-4">
                    {/* Nome Completo */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-600">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Mariana Costa Silveira"
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    {/* CPF e Data de Nascimento */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          CPF
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          placeholder="123.456.789-00"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Data de Nascimento
                        </label>
                        <input
                          type="text"
                          value={formData.birthdate}
                          onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                          placeholder="05/14/1990"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Telefone e E-mail */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Telefone
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(11) 98765-4321"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="mariana.silveira@email.com"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ENDEREÇO */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-3">
                    ENDEREÇO
                  </span>

                  <div className="space-y-4">
                    {/* CEP e Logradouro */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 sm:col-span-4 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                          placeholder="01415-000"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>

                      <div className="col-span-12 sm:col-span-8 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Logradouro
                        </label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          placeholder="Rua das Flores"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Número / Complemento, Bairro, Cidade, UF */}
                    <div className="grid grid-cols-12 gap-3 sm:gap-3.5">
                      <div className="col-span-12 sm:col-span-4 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600 truncate">
                          Número / Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          placeholder="420 - Apto 82"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>

                      <div className="col-span-12 sm:col-span-4 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          placeholder="Jardim Paulista"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>

                      <div className="col-span-8 sm:col-span-3 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="São Paulo"
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-1 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600 text-center">
                          UF
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="SP"
                          maxLength={2}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-1.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 text-center uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="px-7 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingPatient ? "Salvar Alterações" : "Salvar Alterações"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
