import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit2, Plus, User, Calendar, ClipboardList, MapPin, Contact, 
  Eye, Trash2, Link, AlignLeft, Info, X, Search, ChevronDown 
} from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

const AVAILABLE_PROFESSIONALS = [
  { name: "Dr. Carlos Mendes", specialty: "Cardiologia" },
  { name: "Dr. Eduardo Arantes", specialty: "Clínica Geral" },
  { name: "Dra. Mariana Siqueira", specialty: "Dermatologia" },
  { name: "Dra. Camila Rocha", specialty: "Pediatria" },
  { name: "Dr. Fernando Henrique", specialty: "Ortopedia" }
];

export function PatientDetailsPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"pessoais" | "consultas" | "registros">("consultas");

  const [patientConsultations, setPatientConsultations] = useState([
    { id: 1, date: "24/10/2024", time: "08:30", doctor: "Dr. Carlos Mendes", specialty: "Cardiologia", status: "Concluída", dotClass: "bg-blue-600", bgClass: "bg-blue-50/50 text-slate-700" },
    { id: 2, date: "28/10/2024", time: "10:00", doctor: "Dr. Eduardo Arantes", specialty: "Clínica Geral", status: "Confirmada", dotClass: "bg-teal-500", bgClass: "bg-teal-50 text-teal-700" },
    { id: 3, date: "05/11/2024", time: "14:30", doctor: "Dra. Mariana Siqueira", specialty: "Dermatologia", status: "Agendada", dotClass: "bg-indigo-500", bgClass: "bg-indigo-50/50 text-slate-700" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient: "Mariana Costa Silveira",
    professional: "",
    date: "10/24/2024",
    time: "08:30 AM",
    status: "Agendada"
  });

  const handleOpenNewConsultation = () => {
    setFormData({
      patient: "Mariana Costa Silveira",
      professional: "",
      date: "10/24/2024",
      time: "08:30 AM",
      status: "Agendada"
    });
    setIsModalOpen(true);
  };

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.professional) {
      error("Atenção", "Por favor, selecione um profissional.");
      return;
    }

    const selectedProf = AVAILABLE_PROFESSIONALS.find(p => p.name === formData.professional);
    const specialty = selectedProf ? selectedProf.specialty : "Clínica Geral";

    let dotClass = "bg-indigo-500";
    let bgClass = "bg-indigo-50/50 text-slate-700";
    if (formData.status === "Confirmada") {
      dotClass = "bg-teal-500";
      bgClass = "bg-teal-50 text-teal-700";
    } else if (formData.status === "Concluída") {
      dotClass = "bg-blue-600";
      bgClass = "bg-blue-50/50 text-slate-700";
    } else if (formData.status === "Cancelada") {
      dotClass = "bg-rose-500";
      bgClass = "bg-rose-50 text-rose-700";
    }

    const newConsultation = {
      id: Date.now(),
      date: formData.date,
      time: formData.time,
      doctor: formData.professional,
      specialty,
      status: formData.status,
      dotClass,
      bgClass
    };

    setPatientConsultations((prev) => [newConsultation, ...prev]);
    setIsModalOpen(false);
    success("Consulta agendada", `Consulta com ${formData.professional} foi agendada para ${formData.date} às ${formData.time}.`);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Breadcrumbs */}
      <div 
        className="flex items-center text-sm font-medium text-slate-500 hover:text-primary cursor-pointer transition-colors w-fit"
        onClick={() => navigate('/patients')}
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Pacientes / <span className="text-slate-900 ml-1 font-bold">Mariana Costa Silveira</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
            MS
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mariana Costa Silveira</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium pt-1">
              <span>CPF: <strong className="text-slate-700">123.456.789-00</strong></span>
              <span>Nascimento: <strong className="text-slate-700">14/05/1990 (34 anos)</strong></span>
              <span>Telefone: <strong className="text-slate-700">(11) 98765-4321</strong></span>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              E-mail: <strong className="text-slate-700">mariana.silveira@email.com</strong>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors">
            <Edit2 className="w-4 h-4" />
            Editar Dados
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
        <button 
          onClick={() => setActiveTab('pessoais')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'pessoais' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <User className={`w-4 h-4 ${activeTab === 'pessoais' ? 'text-white' : 'text-slate-400'}`} />
          Dados Pessoais
        </button>
        <button 
          onClick={() => setActiveTab('consultas')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'consultas' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Calendar className={`w-4 h-4 ${activeTab === 'consultas' ? 'text-white' : 'text-slate-400'}`} />
          Consultas
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'consultas' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{patientConsultations.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('registros')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'registros' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <ClipboardList className={`w-4 h-4 ${activeTab === 'registros' ? 'text-white' : 'text-slate-400'}`} />
          Registros Clínicos
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'registros' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
        </button>
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        {activeTab === 'pessoais' && (
          <>
            {/* Identificação e Contato */}
            <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <Contact className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Identificação e Contato</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nome Completo</span>
                  <span className="text-sm font-bold text-slate-900">Mariana Costa Silveira</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CPF</span>
                  <span className="text-sm font-bold text-slate-900">123.456.789-00</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data de Nascimento</span>
                  <span className="text-sm font-bold text-slate-900">14/05/1990 (34 anos)</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telefone</span>
                  <span className="text-sm font-bold text-slate-900">(11) 98765-4321</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">E-mail</span>
                  <span className="text-sm font-bold text-slate-900">mariana.silveira@email.com</span>
                </div>
              </div>
            </div>

            {/* Endereço Residencial */}
            <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Endereço Residencial</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Logradouro</span>
                  <span className="text-sm font-bold text-slate-900">Rua das Flores, 420 - Apto 82</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bairro</span>
                  <span className="text-sm font-bold text-slate-900">Jardim Paulista</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CEP</span>
                  <span className="text-sm font-bold text-slate-900">01415-000</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'consultas' && (
          <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Consultas</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Histórico e agendamentos vinculados ao paciente.</p>
              </div>
              <Button 
                variant="primary" 
                onClick={handleOpenNewConsultation}
                className="rounded-xl px-5 py-2.5 font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Nova consulta
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Horário</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Profissional</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patientConsultations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {item.date}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <span className="text-sm font-bold text-slate-900">{item.time}</span>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <div className="text-sm font-bold text-slate-900 leading-tight">{item.doctor}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{item.specialty}</div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${item.bgClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${item.dotClass}`}></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          {item.status === 'Concluída' ? (
                            <button className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" title="Ver Detalhes">
                              <Eye className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" title="Editar">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors" title="Cancelar">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'registros' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Registros Clínicos</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Registros clínicos vinculados às consultas do paciente.</p>
              </div>
              <Button variant="primary" className="rounded-xl px-5 py-2.5 font-bold shadow-sm flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Novo registro clínico
              </Button>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Profissional: <span className="text-slate-900 text-sm ml-1 font-bold normal-case">Dr. Carlos Mendes</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5" />
                      Consulta: <span className="text-slate-900 text-sm ml-1 font-bold normal-case">Atendimento de 24/10/2024</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                      <Eye className="w-4 h-4" /> Visualizar
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5" /> Resumo / Observações do Atendimento
                  </span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    Paciente comparece para atendimento. Registro clínico realizado conforme avaliação durante a consulta.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Profissional: <span className="text-slate-900 text-sm ml-1 font-bold normal-case">Dr. Eduardo Arantes</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5" />
                      Consulta: <span className="text-slate-900 text-sm ml-1 font-bold normal-case">Atendimento de 12/08/2024</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                      <Eye className="w-4 h-4" /> Visualizar
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5" /> Resumo / Observações do Atendimento
                  </span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    Paciente comparece para acompanhamento clínico rotineiro. Registro clínico realizado conforme avaliação durante a consulta.
                  </p>
                </div>
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Info className="w-4 h-4 text-slate-400" />
                Exibindo 2 de 2 registros clínicos associados à paciente.
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                  Anterior
                </button>
                <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nova Consulta - Conforme Print */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[480px] p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Nova Consulta
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateConsultation} className="space-y-4">
              {/* Paciente */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Paciente
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    placeholder="Selecione ou busque o paciente..."
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Profissional */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Profissional
                </label>
                <div className="relative">
                  <select
                    value={formData.professional}
                    onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecione o profissional</option>
                    {AVAILABLE_PROFESSIONALS.map((prof) => (
                      <option key={prof.name} value={prof.name}>
                        {prof.name} ({prof.specialty})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Data e Horário em duas colunas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Data
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="10/24/2024"
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Horário
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="08:30 AM"
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="Agendada">Agendada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Em atendimento">Em atendimento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Buttons: Cancelar & Agendar Consulta */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-[#e8f1fd] hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all cursor-pointer"
                >
                  Agendar Consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
