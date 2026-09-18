import React, { useState } from "react";
import { 
  Search, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Plus, X, 
  Check, Calendar, ChevronDown, PlusCircle, CheckCircle2 
} from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

const SYSTEM_USERS = [
  { id: "u1", name: "Dra. Camila Nogueira", email: "camila.nogueira@clinicasys.com.br" },
  { id: "u2", name: "Dr. Ricardo Alves", email: "ricardo.alves@clinicasys.com.br" },
  { id: "u3", name: "Dra. Juliana Mendes", email: "juliana.mendes@clinicasys.com.br" },
  { id: "u4", name: "Dr. Marcos Bittencourt", email: "marcos.bittencourt@clinicasys.com.br" },
  { id: "u5", name: "Dra. Beatriz Vascor", email: "beatriz.v@clinicasys.com.br" },
  { id: "u6", name: "Dra. Luiza Santana", email: "luiza.santana@clinicasys.com.br" },
  { id: "u7", name: "Dr. Eduardo Castro", email: "eduardo.castro@clinicasys.com.br" },
  { id: "u8", name: "Dr. Roberto Santos", email: "roberto.santos@clinicasys.com.br" },
  { id: "u9", name: "Dr. Gabriel Fonseca", email: "gabriel.fonseca@clinicasys.com.br" },
  { id: "u10", name: "Dra. Larissa Ramos", email: "larissa.ramos@clinicasys.com.br" },
  { id: "u11", name: "Dr. Carlos Mendes", email: "carlos.mendes@clinicasys.com.br" },
  { id: "u12", name: "Dra. Mariana Costa", email: "mariana.costa@clinicasys.com.br" }
];

const AVAILABLE_SPECIALTIES = [
  "Cardiologia",
  "Clínica Geral",
  "Pediatria",
  "Ortopedia",
  "Dermatologia",
  "Ginecologia e Obstetrícia",
  "Neurologia",
  "Oftalmologia",
  "Psiquiatria"
];

const DAYS_OF_WEEK = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];

interface ScheduleSlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface RegisteredSchedule {
  id: string;
  days: string;
  description: string;
  timeRange: string;
}

const DEFAULT_SCHEDULES_MAP: Record<number, RegisteredSchedule[]> = {
  1: [
    { id: "s1", days: "Segundas e Quartas", description: "Disponível para consultas", timeRange: "08:00 - 14:00" },
    { id: "s2", days: "Sextas-feiras", description: "Disponível para consultas", timeRange: "13:00 - 18:00" }
  ],
  2: [
    { id: "s3", days: "Terças e Quintas", description: "Disponível para consultas", timeRange: "09:00 - 15:00" },
    { id: "s4", days: "Sábados", description: "Disponível para consultas", timeRange: "08:00 - 12:00" }
  ]
};

const INITIAL_PROFESSIONALS = [
  { id: 1, initials: "CN", name: "Dra. Camila Nogueira", email: "camila.nogueira@clinicasys.com.br", specialty: "Clínica Geral" },
  { id: 2, initials: "RA", name: "Dr. Ricardo Alves", email: "ricardo.alves@clinicasys.com.br", specialty: "Cardiologia" },
  { id: 3, initials: "JM", name: "Dra. Juliana Mendes", email: "juliana.mendes@clinicasys.com.br", specialty: "Pediatria" },
  { id: 4, initials: "MB", name: "Dr. Marcos Bittencourt", email: "marcos.bittencourt@clinicasys.com.br", specialty: "Ortopedia" },
  { id: 5, initials: "BV", name: "Dra. Beatriz Vascor", email: "beatriz.v@clinicasys.com.br", specialty: "Dermatologia" },
  { id: 6, initials: "LS", name: "Dra. Luiza Santana", email: "luiza.santana@clinicasys.com.br", specialty: "Ginecologia e Obstetrícia" },
  { id: 7, initials: "EC", name: "Dr. Eduardo Castro", email: "eduardo.castro@clinicasys.com.br", specialty: "Cardiologia" }
];

export function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState(INITIAL_PROFESSIONALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("Todas as Especialidades");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<any | null>(null);

  // Form states matching screenshot
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([
    {
      id: 1,
      dayOfWeek: "Segunda-feira",
      startTime: "08:00 AM",
      endTime: "12:00 PM",
      available: true
    }
  ]);

  // Schedule Modal states matching screenshot
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleProf, setScheduleProf] = useState<any>(INITIAL_PROFESSIONALS[0]);
  const [registeredSchedules, setRegisteredSchedules] = useState<RegisteredSchedule[]>([
    { id: "s1", days: "Segundas e Quartas", description: "Disponível para consultas", timeRange: "08:00 - 14:00" },
    { id: "s2", days: "Sextas-feiras", description: "Disponível para consultas", timeRange: "13:00 - 18:00" }
  ]);
  const [newScheduleSlot, setNewScheduleSlot] = useState({
    dayOfWeek: "Segunda-feira",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    available: true
  });

  const { success, error, warning, info } = useToast();

  const handleOpenSchedule = (prof: any) => {
    setScheduleProf(prof);
    if (DEFAULT_SCHEDULES_MAP[prof.id]) {
      setRegisteredSchedules(DEFAULT_SCHEDULES_MAP[prof.id]);
    } else {
      setRegisteredSchedules([
        { id: "s1", days: "Segundas e Quartas", description: "Disponível para consultas", timeRange: "08:00 - 14:00" },
        { id: "s2", days: "Sextas-feiras", description: "Disponível para consultas", timeRange: "13:00 - 18:00" }
      ]);
    }
    setNewScheduleSlot({
      dayOfWeek: "Segunda-feira",
      startTime: "08:00 AM",
      endTime: "12:00 PM",
      available: true
    });
    setIsScheduleModalOpen(true);
  };

  const handleAddRegisteredSlot = () => {
    if (!newScheduleSlot.dayOfWeek) {
      error("Erro", "Selecione o dia da semana.");
      return;
    }
    const newEntry: RegisteredSchedule = {
      id: `slot_${Date.now()}`,
      days: newScheduleSlot.dayOfWeek,
      description: newScheduleSlot.available ? "Disponível para consultas" : "Horário reservado",
      timeRange: `${newScheduleSlot.startTime} - ${newScheduleSlot.endTime}`
    };
    setRegisteredSchedules((prev) => [...prev, newEntry]);
    success("Faixa adicionada", `${newScheduleSlot.dayOfWeek} (${newScheduleSlot.startTime} - ${newScheduleSlot.endTime}) incluída na grade.`);
  };

  const handleRemoveRegisteredSlot = (id: string) => {
    setRegisteredSchedules((prev) => prev.filter((s) => s.id !== id));
    warning("Faixa removida", "A faixa de atendimento foi removida da grade.");
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    success(
      "Grade de atendimento salva",
      `A grade de horários de ${scheduleProf?.name || "Dra. Camila Nogueira"} foi atualizada com sucesso.`
    );
    setIsScheduleModalOpen(false);
  };

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec =
      specialtyFilter === "Todas as Especialidades" ||
      prof.specialty === specialtyFilter;
    return matchesSearch && matchesSpec;
  });

  const handleOpenNew = () => {
    setEditingProf(null);
    setSelectedUserId("");
    setSelectedSpecialty("");
    setSchedules([
      {
        id: 1,
        dayOfWeek: "Segunda-feira",
        startTime: "08:00 AM",
        endTime: "12:00 PM",
        available: true
      }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prof: any) => {
    setEditingProf(prof);
    const matchedUser = SYSTEM_USERS.find((u) => u.name === prof.name);
    setSelectedUserId(matchedUser ? matchedUser.id : "");
    setSelectedSpecialty(prof.specialty);
    setSchedules([
      {
        id: 1,
        dayOfWeek: "Segunda-feira",
        startTime: "08:00 AM",
        endTime: "12:00 PM",
        available: true
      }
    ]);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const prof = professionals.find((p) => p.id === id);
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
    warning("Profissional removido", `${prof?.name || "Profissional"} foi desvinculado do corpo clínico.`);
  };

  const handleAddSchedule = () => {
    const newId = Date.now();
    setSchedules((prev) => [
      ...prev,
      {
        id: newId,
        dayOfWeek: "Terça-feira",
        startTime: "01:00 PM",
        endTime: "05:00 PM",
        available: true
      }
    ]);
    info("Horário adicionado", "Nova faixa de atendimento incluída na grade.");
  };

  const updateSchedule = (id: number, field: keyof ScheduleSlot, value: any) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let name = "";
    let email = "";

    const user = SYSTEM_USERS.find((u) => u.id === selectedUserId);
    if (user) {
      name = user.name;
      email = user.email;
    } else if (editingProf) {
      name = editingProf.name;
      email = editingProf.email;
    }

    if (!name.trim()) {
      error("Erro de validação", "Selecione o usuário do sistema.");
      return;
    }

    if (!selectedSpecialty.trim()) {
      error("Erro de validação", "Selecione a especialidade cadastrada.");
      return;
    }

    if (editingProf) {
      setProfessionals((prev) =>
        prev.map((p) =>
          p.id === editingProf.id
            ? { ...p, name, email, specialty: selectedSpecialty }
            : p
        )
      );
      success("Profissional atualizado", `Os dados de ${name} foram atualizados com sucesso.`);
    } else {
      const getInitials = (n: string) => {
        const parts = n.trim().split(" ");
        return parts.length > 1
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : n.slice(0, 2).toUpperCase();
      };

      const newProf = {
        id: Date.now(),
        initials: getInitials(name),
        name,
        email,
        specialty: selectedSpecialty
      };

      setProfessionals((prev) => [...prev, newProf]);
      success("Profissional cadastrado", `${name} vinculado à especialidade ${selectedSpecialty}.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profissionais de Saúde</h1>
          <p className="text-slate-500 mt-1 font-medium">Corpo clínico e áreas de atuação vinculadas</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenNew}
          className="rounded-xl px-6 font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Profissional
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Filters Area */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-[450px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do profissional..."
              className="w-full bg-slate-50 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          
          <div className="w-full md:w-[250px]">
            <select 
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
            >
              <option>Todas as Especialidades</option>
              <option>Cardiologia</option>
              <option>Clínica Geral</option>
              <option>Pediatria</option>
              <option>Ortopedia</option>
              <option>Dermatologia</option>
              <option>Ginecologia e Obstetrícia</option>
            </select>
          </div>

          <div className="flex-1 flex justify-end w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={() => {
                setSearchTerm("");
                setSpecialtyFilter("Todas as Especialidades");
                info("Filtros redefinidos", "Exibindo todos os profissionais de saúde.");
              }}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profissional & E-mail</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Especialidade</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProfessionals.map((prof) => (
                <tr key={prof.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {prof.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">{prof.name}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{prof.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span className="text-sm font-medium text-slate-700">{prof.specialty}</span>
                  </td>
                  <td className="px-6 py-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      <button 
                        onClick={() => info("Detalhes", `Visualizando perfil de ${prof.name}`)}
                        className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" 
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenSchedule(prof)}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" 
                        title="Editar Grade de Atendimento"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(prof)}
                        className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors" 
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(prof.id)}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors" 
                        title="Excluir"
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span>Exibindo 1-{filteredProfessionals.length} de {professionals.length} profissionais</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-sm shadow-sm flex items-center justify-center">
              1
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar Profissional - Conforme Print */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[540px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 sm:p-7 pb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {editingProf ? "Editar Profissional" : "Novo Profissional"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Vincule o usuário à especialidade e defina a grade de atendimento
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 sm:p-7 pt-2 space-y-5">
              {/* Usuário * */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Usuário <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                    className="w-full bg-[#f0f4fa] border border-blue-100/60 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecione o usuário do sistema...</option>
                    {SYSTEM_USERS.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Usuário já cadastrado no sistema ClinicaSys
                </p>
              </div>

              {/* Especialidade * */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Especialidade <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    required
                    className="w-full bg-[#f0f4fa] border border-blue-100/60 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecione a especialidade cadastrada...</option>
                    {AVAILABLE_SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Grade de Atendimento (Schedule) Container */}
              <div className="bg-[#eef5fc] border border-blue-100/80 rounded-2xl p-5 space-y-4">
                {/* Header inside card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Grade de Atendimento (Schedule)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Disponibilidade semanal
                  </span>
                </div>

                {/* Slots */}
                <div className="space-y-3">
                  {schedules.map((slot) => (
                    <div key={slot.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Dia da semana
                        </label>
                        <select
                          value={slot.dayOfWeek}
                          onChange={(e) => updateSchedule(slot.id, "dayOfWeek", e.target.value)}
                          className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Horário inicial
                        </label>
                        <input
                          type="text"
                          value={slot.startTime}
                          onChange={(e) => updateSchedule(slot.id, "startTime", e.target.value)}
                          placeholder="08:00 AM"
                          className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Horário final
                        </label>
                        <input
                          type="text"
                          value={slot.endTime}
                          onChange={(e) => updateSchedule(slot.id, "endTime", e.target.value)}
                          placeholder="12:00 PM"
                          className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={schedules[0]?.available ?? true}
                      onChange={(e) => updateSchedule(schedules[0]?.id ?? 1, "available", e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Disponível para agendamento
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-100/60 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar horário
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {editingProf && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      handleOpenSchedule(editingProf);
                    }}
                    className="mr-auto text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    Editar Grade de Atendimento
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  {editingProf ? "Salvar Profissional" : "Cadastrar Profissional"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Grade de Atendimento - Conforme Print */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[560px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 sm:p-7 pb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  Editar Grade de Atendimento
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Configure os dias e faixas de horários de atendimento de {scheduleProf?.name || "Dra. Camila Nogueira"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Form */}
            <form onSubmit={handleSaveSchedule} className="p-6 sm:p-7 pt-2 space-y-5">
              {/* Box Adicionar Faixa de Atendimento */}
              <div className="bg-[#f0f6fe] border border-blue-100/70 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Adicionar Faixa de Atendimento
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Dia da Semana
                    </label>
                    <select
                      value={newScheduleSlot.dayOfWeek}
                      onChange={(e) =>
                        setNewScheduleSlot({ ...newScheduleSlot, dayOfWeek: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
                    >
                      <option value="Segunda-feira">Segunda-feira</option>
                      <option value="Terça-feira">Terça-feira</option>
                      <option value="Quarta-feira">Quarta-feira</option>
                      <option value="Quinta-feira">Quinta-feira</option>
                      <option value="Sexta-feira">Sexta-feira</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                      <option value="Segundas e Quartas">Segundas e Quartas</option>
                      <option value="Terças e Quintas">Terças e Quintas</option>
                      <option value="Segunda a Sexta">Segunda a Sexta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Horário Início
                    </label>
                    <input
                      type="text"
                      value={newScheduleSlot.startTime}
                      onChange={(e) =>
                        setNewScheduleSlot({ ...newScheduleSlot, startTime: e.target.value })
                      }
                      placeholder="08:00 AM"
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Horário Fim
                    </label>
                    <input
                      type="text"
                      value={newScheduleSlot.endTime}
                      onChange={(e) =>
                        setNewScheduleSlot({ ...newScheduleSlot, endTime: e.target.value })
                      }
                      placeholder="12:00 PM"
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newScheduleSlot.available}
                      onChange={(e) =>
                        setNewScheduleSlot({ ...newScheduleSlot, available: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Disponível para agendamento de consultas
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddRegisteredSlot}
                    className="bg-[#e6effc] hover:bg-blue-100 text-[#0052cc] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar novo horário
                  </button>
                </div>
              </div>

              {/* Seção Faixas Registradas na Grade */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2.5">
                  Faixas Registradas na Grade
                </label>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-0.5">
                  {registeredSchedules.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-teal-600 shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 stroke-[2.2]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {slot.days}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {slot.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-[#e8f1fd] text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs tracking-wide">
                          {slot.timeRange}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRegisteredSlot(slot.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remover faixa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {registeredSchedules.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="text-xs text-slate-400 font-medium">
                        Nenhuma faixa de horário cadastrada na grade.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Salvar Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
