import React, { useState } from "react";
import { Search, Calendar, CheckCircle, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Eraser, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

const AVAILABLE_PATIENTS = [
  "Carlos Eduardo Nogueira",
  "Mariana Siqueira Lima",
  "Pedro Henrique Fagundes",
  "Ana Beatriz Duarte",
  "Gabriel Souza Mattos",
  "Lucas Silveira Ramos",
  "Fernanda Albuquerque",
  "Mariana Costa Silveira",
  "Beatriz Lima dos Santos",
  "Helena Furtado Alencar"
];

const AVAILABLE_PROFESSIONALS = [
  "Dr. Ricardo Alves - Cardiologia",
  "Dra. Camila Nogueira - Clínica Geral",
  "Dr. Marcos Bittencourt - Ortopedia",
  "Dra. Juliana Mendes - Pediatria",
  "Dra. Beatriz Vasconcelos - Dermatologia",
  "Dra. Luiza Santana - Ginecologia"
];

const INITIAL_CONSULTATIONS = [
  {
    id: 1,
    time: "08:30",
    date: "24/10/2024",
    patient: "Carlos Eduardo Nogueira",
    contact: "CPF: 219.832.108-44 · (11) 98765-4321",
    doctor: "Dr. Ricardo Alves",
    specialty: "Cardiologia",
    status: "Concluída",
    statusDimmed: false
  },
  {
    id: 2,
    time: "09:15",
    date: "24/10/2024",
    patient: "Mariana Siqueira Lima",
    contact: "CPF: 342.901.442-12 · (11) 99123-8877",
    doctor: "Dra. Camila Nogueira",
    specialty: "Clínica Geral",
    status: "Em atendimento",
    statusDimmed: false
  },
  {
    id: 3,
    time: "10:00",
    date: "24/10/2024",
    patient: "Pedro Henrique Fagundes",
    contact: "CPF: 451.239.870-01 · (11) 97654-3210",
    doctor: "Dr. Marcos Bittencourt",
    specialty: "Ortopedia",
    status: "Confirmada",
    statusDimmed: false
  },
  {
    id: 4,
    time: "10:45",
    date: "24/10/2024",
    patient: "Ana Beatriz Duarte",
    contact: "CPF: 189.774.321-99 · (11) 98844-5511",
    doctor: "Dra. Juliana Mendes",
    specialty: "Pediatria",
    status: "Agendada",
    statusDimmed: false
  },
  {
    id: 5,
    time: "11:30",
    date: "24/10/2024",
    patient: "Gabriel Souza Mattos",
    contact: "CPF: 502.118.990-23 · (11) 99432-1100",
    doctor: "Dra. Beatriz Vasconcelos",
    specialty: "Dermatologia",
    status: "Agendada",
    statusDimmed: false
  },
  {
    id: 6,
    time: "14:00",
    date: "24/10/2024",
    patient: "Lucas Silveira Ramos",
    contact: "CPF: 312.445.678-00 · (11) 98112-2233",
    doctor: "Dra. Luiza Santana",
    specialty: "Ginecologia",
    status: "Cancelada",
    statusDimmed: true
  },
  {
    id: 7,
    time: "15:00",
    date: "24/10/2024",
    patient: "Fernanda Albuquerque",
    contact: "CPF: 290.887.123-45 · (11) 97234-9988",
    doctor: "Dra. Camila Nogueira",
    specialty: "Clínica Geral",
    status: "Confirmada",
    statusDimmed: false
  }
];

export function ConsultationsPage() {
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos os Status");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient: "",
    professional: "",
    date: "10/24/2024",
    time: "08:30 AM",
    status: "Agendada"
  });

  const { success, warning, info, error } = useToast();

  const filteredConsultations = consultations.filter((item) => {
    const matchesSearch =
      item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos os Status" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancelConsultation = (id: number) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Cancelada", statusDimmed: true } : c
      )
    );
    warning("Consulta cancelada", "O status do atendimento foi alterado para Cancelada.");
  };

  const handleOpenModal = () => {
    setFormData({
      patient: "",
      professional: "",
      date: "10/24/2024",
      time: "08:30 AM",
      status: "Agendada"
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient.trim()) {
      error("Atenção", "Por favor, selecione ou informe o paciente.");
      return;
    }
    if (!formData.professional.trim()) {
      error("Atenção", "Por favor, selecione o profissional.");
      return;
    }

    const cleanDoctor = formData.professional.includes(" - ")
      ? formData.professional.split(" - ")[0]
      : formData.professional;
    const cleanSpecialty = formData.professional.includes(" - ")
      ? formData.professional.split(" - ")[1]
      : "Clínica Geral";

    const cleanTime = formData.time.replace(" AM", "").replace(" PM", "");

    const newCons = {
      id: Date.now(),
      contact: "Contato registrado na recepção",
      patient: formData.patient,
      doctor: cleanDoctor,
      specialty: cleanSpecialty,
      date: formData.date,
      time: cleanTime,
      status: formData.status,
      statusDimmed: formData.status === "Cancelada"
    };

    setConsultations((prev) => [newCons, ...prev]);
    success("Consulta agendada!", `Atendimento para ${formData.patient} com ${cleanDoctor} às ${formData.time}.`);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Consultas</h1>
          <p className="text-slate-500 mt-1 font-medium">Listagem de agendamentos e atendimentos clínicos da clínica</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenModal}
          className="rounded-xl px-6 font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Total de Consultas Hoje</span>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{consultations.length}</span>
            <span className="text-sm text-slate-500 font-medium">atendimentos cadastrados</span>
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Concluídas</span>
            <CheckCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {consultations.filter(c => c.status === "Concluída").length}
            </span>
            <span className="text-sm text-slate-500 font-medium">finalizadas</span>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters Area */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                placeholder="Buscar por paciente, CPF ou médico..." 
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
            >
              <option>Todos os Status</option>
              <option>Confirmada</option>
              <option>Em atendimento</option>
              <option>Concluída</option>
              <option>Agendada</option>
              <option>Cancelada</option>
            </select>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Listagem de agendamentos
            </span>
            <button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("Todos os Status");
                info("Filtros limpos", "Exibindo todas as consultas cadastradas.");
              }}
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data & Horário</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Paciente & Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Profissional & Especialidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredConsultations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className={`px-6 py-4 align-top ${item.statusDimmed ? 'opacity-50' : ''}`}>
                    <div className="text-sm font-bold text-slate-900 leading-tight">{item.time}</div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">{item.date}</div>
                  </td>
                  <td className={`px-6 py-4 align-top ${item.statusDimmed ? 'opacity-50' : ''}`}>
                    <div className="text-sm font-bold text-slate-900 leading-tight">{item.patient}</div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">{item.contact}</div>
                  </td>
                  <td className={`px-6 py-4 align-top ${item.statusDimmed ? 'opacity-50' : ''}`}>
                    <div className="text-sm font-bold text-slate-900 leading-tight">{item.doctor}</div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">{item.specialty}</div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className={`text-sm font-bold ${
                      item.status === 'Concluída' 
                        ? 'text-emerald-600' 
                        : item.status === 'Cancelada' 
                        ? 'text-red-500' 
                        : item.status === 'Em atendimento'
                        ? 'text-blue-600'
                        : 'text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        onClick={() => info("Detalhes", `Visualizando consulta de ${item.patient}`)}
                        className="p-1.5 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors" 
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCancelConsultation(item.id)}
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors" 
                        title="Cancelar Consulta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">
            Exibindo <strong className="text-slate-900 font-bold">1-{filteredConsultations.length}</strong> de <strong className="text-slate-900 font-bold">{consultations.length}</strong> consultas
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex justify-center items-center rounded-md bg-primary text-white font-bold text-sm shadow-sm transition-colors">
              1
            </button>
          </div>
        </div>
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
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Paciente */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Paciente
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="consultations-patients"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    placeholder="Selecione ou busque o paciente..."
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <datalist id="consultations-patients">
                    {AVAILABLE_PATIENTS.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
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
                      <option key={prof} value={prof}>
                        {prof}
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
