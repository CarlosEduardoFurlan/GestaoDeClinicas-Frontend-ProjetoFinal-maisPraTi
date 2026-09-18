import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarPlus, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

type Status = "Reservado" | "Cancelado" | "Disponível";

interface Appointment {
  id: string;
  day: number; // 0 to 4 (Mon to Fri)
  time: string; // "08:00", "09:00", etc.
  endTime: string;
  patientName: string;
  doctorName: string;
  status: Status;
  dateStr?: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  // SEG 21 (0)
  { id: "1", day: 0, time: "08:00", endTime: "08:45", patientName: "Mariana Costa", doctorName: "Dr. Ricardo Alves", status: "Reservado", dateStr: "10/21/2024" },
  { id: "2", day: 0, time: "10:00", endTime: "10:30", patientName: "Thiago Oliveira", doctorName: "Dr. Arthur Guimarães", status: "Reservado", dateStr: "10/21/2024" },
  { id: "3", day: 0, time: "14:00", endTime: "14:30", patientName: "Larissa Prado", doctorName: "Dra. Camila Nogueira", status: "Reservado", dateStr: "10/21/2024" },
  { id: "4", day: 0, time: "16:00", endTime: "16:45", patientName: "Eduardo Nolasco", doctorName: "Dr. Ricardo Alves", status: "Reservado", dateStr: "10/21/2024" },
  // TER 22 (1)
  { id: "5", day: 1, time: "09:00", endTime: "09:45", patientName: "Beatriz Mendes", doctorName: "Dr. Ricardo Alves", status: "Cancelado", dateStr: "10/22/2024" },
  { id: "6", day: 1, time: "11:00", endTime: "11:30", patientName: "Helena Barreto", doctorName: "Dra. Camila Nogueira", status: "Reservado", dateStr: "10/22/2024" },
  { id: "7", day: 1, time: "14:00", endTime: "14:45", patientName: "Roberto Fontes", doctorName: "Dr. Ricardo Alves", status: "Reservado", dateStr: "10/22/2024" },
  { id: "8", day: 1, time: "17:00", endTime: "17:45", patientName: "Gustavo Lima", doctorName: "Dr. Arthur Guimarães", status: "Reservado", dateStr: "10/22/2024" },
  // QUA 23 (2)
  { id: "9", day: 2, time: "08:00", endTime: "08:30", patientName: "Lucas Silveira", doctorName: "Dra. Camila Nogueira", status: "Reservado", dateStr: "10/23/2024" },
  { id: "10", day: 2, time: "10:00", endTime: "10:30", patientName: "Gabriel Zanin", doctorName: "Dr. Ricardo Alves", status: "Cancelado", dateStr: "10/23/2024" },
  { id: "11", day: 2, time: "12:00", endTime: "12:30", patientName: "Sofia Montenegro", doctorName: "Dr. Ricardo Alves", status: "Reservado", dateStr: "10/23/2024" },
  { id: "12", day: 2, time: "16:00", endTime: "16:30", patientName: "Carla Peixoto", doctorName: "Dra. Camila Nogueira", status: "Reservado", dateStr: "10/23/2024" },
  // QUI 24 (3)
  { id: "13", day: 3, time: "09:00", endTime: "09:30", patientName: "Fernando Henrique Ramos", doctorName: "Dr. Arthur Guimarães", status: "Reservado", dateStr: "10/24/2024" },
  { id: "14", day: 3, time: "10:00", endTime: "10:45", patientName: "Clara Vasconcelos", doctorName: "Dr. Ricardo Alves", status: "Reservado", dateStr: "10/24/2024" },
  { id: "15", day: 3, time: "14:00", endTime: "14:30", patientName: "Patricia Lins", doctorName: "Dra. Camila Nogueira", status: "Reservado", dateStr: "10/24/2024" },
  { id: "16", day: 3, time: "15:00", endTime: "15:30", patientName: "Otávio Guimarães", doctorName: "Dr. Arthur Guimarães", status: "Reservado", dateStr: "10/24/2024" },
  { id: "17", day: 3, time: "16:00", endTime: "16:45", patientName: "Vinicius Rocha", doctorName: "Dr. Ricardo Alves", status: "Cancelado", dateStr: "10/24/2024" },
  // SEX 25 (4)
  { id: "18", day: 4, time: "09:00", endTime: "09:45", patientName: "Juliana Paes Correia", doctorName: "Dra. Camila Nogueira", status: "Reservado", dateStr: "10/25/2024" },
  { id: "19", day: 4, time: "11:00", endTime: "11:45", patientName: "Marcos Andrade", doctorName: "Dr. Arthur Guimarães", status: "Reservado", dateStr: "10/25/2024" },
  { id: "20", day: 4, time: "12:00", endTime: "12:40", patientName: "Diego Sanches", doctorName: "Dr. Arthur Guimarães", status: "Cancelado", dateStr: "10/25/2024" },
  { id: "21", day: 4, time: "15:00", endTime: "15:45", patientName: "Tatiana Albuquerque", doctorName: "Dr. Ricardo Alves", status: "Reservado", dateStr: "10/25/2024" },
];

const AVAILABLE_PATIENTS = [
  "Mariana Costa Silveira",
  "Carlos Eduardo Nogueira",
  "Beatriz Lima dos Santos",
  "Gabriel Henrique Prado",
  "Helena Furtado Alencar",
  "Rodrigo de Souza Antunes",
  "Amanda Vilela",
  "Lucas Silveira",
  "Sofia Montenegro",
  "Thiago Oliveira",
  "Fernando Henrique Ramos",
  "Juliana Paes Correia"
];

const AVAILABLE_PROFESSIONALS = [
  "Dr. Ricardo Alves - Cardiologia",
  "Dra. Camila Nogueira - Clínica Geral",
  "Dr. Arthur Guimarães - Ortopedia",
  "Dra. Juliana Mendes - Pediatria",
  "Dra. Beatriz Vascor - Dermatologia",
  "Dra. Luiza Santana - Ginecologia e Obstetrícia"
];

const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const DAYS = [
  { name: "SEG", date: "21", fullDate: "10/21/2024" },
  { name: "TER", date: "22", fullDate: "10/22/2024" },
  { name: "QUA", date: "23", fullDate: "10/23/2024" },
  { name: "QUI (HOJE)", date: "24", fullDate: "10/24/2024", isToday: true },
  { name: "SEX", date: "25", fullDate: "10/25/2024" },
];

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [view, setView] = useState<"Dia" | "Semana">("Semana");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient: "",
    professional: "",
    date: "10/24/2024",
    time: "08:00",
    status: "Agendada",
  });

  const { success, warning, info, error } = useToast();

  const getAppointment = (dayIndex: number, time: string) => {
    return appointments.find((apt) => apt.day === dayIndex && apt.time === time);
  };

  const handleSlotClick = (dayIndex: number, hour: string) => {
    const existing = getAppointment(dayIndex, hour);
    if (existing) {
      if (existing.status === "Reservado") {
        setAppointments((prev) =>
          prev.map((a) => (a.id === existing.id ? { ...a, status: "Cancelado" } : a))
        );
        warning("Agendamento alterado", `Consulta de ${existing.patientName} foi marcada como Cancelada.`);
      } else {
        setAppointments((prev) =>
          prev.map((a) => (a.id === existing.id ? { ...a, status: "Reservado" } : a))
        );
        success("Agendamento reativado", `Consulta de ${existing.patientName} foi reativada.`);
      }
    } else {
      const selectedDay = DAYS[dayIndex];
      setFormData({
        patient: "",
        professional: "",
        date: selectedDay ? selectedDay.fullDate : "10/24/2024",
        time: hour,
        status: "Agendada",
      });
      setIsModalOpen(true);
    }
  };

  const handleOpenNewAppointment = () => {
    setFormData({
      patient: "",
      professional: "",
      date: "10/24/2024",
      time: "08:00",
      status: "Agendada",
    });
    setIsModalOpen(true);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient.trim()) {
      error("Atenção", "Por favor, selecione ou informe o paciente.");
      return;
    }
    if (!formData.professional.trim()) {
      error("Atenção", "Por favor, selecione o profissional responsável.");
      return;
    }

    let dayIndex = 3; // Default 24th Oct (Thursday)
    if (formData.date.includes("21")) dayIndex = 0;
    else if (formData.date.includes("22")) dayIndex = 1;
    else if (formData.date.includes("23")) dayIndex = 2;
    else if (formData.date.includes("24")) dayIndex = 3;
    else if (formData.date.includes("25")) dayIndex = 4;

    const hourPrefix = formData.time.split(":")[0] || "08";
    const cleanDoctorName = formData.professional.split(" - ")[0];

    const newApt: Appointment = {
      id: Date.now().toString(),
      day: dayIndex,
      time: formData.time.length === 5 ? formData.time : `${formData.time}:00`,
      endTime: `${hourPrefix}:45`,
      patientName: formData.patient,
      doctorName: cleanDoctorName,
      status: formData.status === "Cancelada" ? "Cancelado" : "Reservado",
      dateStr: formData.date
    };

    setAppointments((prev) => [...prev, newApt]);
    success("Consulta agendada!", `Agendamento criado para ${formData.patient} com ${cleanDoctorName} às ${formData.time}.`);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agenda de Consultas</h1>
          <p className="text-slate-500 mt-1 font-medium">Controle de horários e agendamentos dos profissionais</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenNewAppointment}
          className="rounded-xl px-6 font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Button>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white rounded-[1.25rem] p-4 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === "Dia" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => {
                setView("Dia");
                info("Visualização diária", "Exibindo agenda em modo detalhado de dia.");
              }}
            >
              Dia
            </button>
            <button 
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === "Semana" ? "bg-blue-100/50 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => {
                setView("Semana");
                info("Visualização semanal", "Exibindo visão semanal completa da agenda.");
              }}
            >
              Semana
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => info("Navegação de Agenda", "Semana anterior")}
              className="p-1.5 hover:bg-slate-50 rounded-md border border-slate-200 text-slate-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => info("Navegação de Agenda", "Posicionado no dia de hoje.")}
              className="px-3 py-1.5 hover:bg-slate-50 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 transition-colors"
            >
              Hoje
            </button>
            <button 
              onClick={() => info("Navegação de Agenda", "Próxima semana")}
              className="p-1.5 hover:bg-slate-50 rounded-md border border-slate-200 text-slate-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center text-slate-900 font-bold gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Semana de 21 a 25 de Outubro de 2024
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Profissional:</span>
          <select 
            onChange={(e) => info("Filtro de médico", `Agenda filtrada para: ${e.target.value}`)}
            className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[200px]"
          >
            <option>Todos os Profissionais</option>
            <option>Dr. Ricardo Alves</option>
            <option>Dra. Camila Nogueira</option>
            <option>Dr. Arthur Guimarães</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="min-w-[900px]">
          {/* Grid Header */}
          <div className="grid grid-cols-6 border-b border-slate-100">
            <div className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center flex items-end justify-center pb-6">
              Horário
            </div>
            {DAYS.map((day, i) => (
              <div key={i} className={`p-4 flex flex-col items-center justify-center gap-1 ${day.isToday ? 'bg-blue-50/50' : ''}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${day.isToday ? 'text-primary' : 'text-slate-500'}`}>
                  {day.name}
                </span>
                <span className={`text-xl font-extrabold ${day.isToday ? 'text-primary' : 'text-slate-900'}`}>
                  {day.date}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="flex flex-col">
            {HOURS.map((hour, rowIdx) => (
              <div key={hour} className="grid grid-cols-6 border-b border-slate-100 last:border-b-0 min-h-[100px]">
                {/* Time Column */}
                <div className="p-4 flex items-start justify-center border-r border-slate-100">
                  <span className="text-sm font-semibold text-slate-500 mt-1">{hour}</span>
                </div>

                {/* Days Columns */}
                {DAYS.map((day, colIdx) => {
                  const appointment = getAppointment(colIdx, hour);
                  
                  return (
                    <div 
                      key={`${colIdx}-${rowIdx}`} 
                      onClick={() => handleSlotClick(colIdx, hour)}
                      className={`border-r border-slate-100 last:border-r-0 p-2 relative group hover:bg-slate-50 transition-colors cursor-pointer ${day.isToday ? 'bg-blue-50/20' : ''}`}
                    >
                      {appointment ? (
                        <div className={`h-full flex flex-col justify-between p-3 rounded-xl border ${appointment.status === 'Reservado' ? 'bg-white border-blue-200' : 'bg-white border-red-200'} shadow-sm relative overflow-hidden`}>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${appointment.status === 'Reservado' ? 'bg-primary' : 'bg-red-500'}`}></div>
                          <div className="pl-1">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[11px] font-bold text-slate-500">
                                {appointment.time} — {appointment.endTime}
                              </span>
                              <span className={`text-[11px] font-bold ${appointment.status === 'Reservado' ? 'text-primary' : 'text-red-500'}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold text-slate-900 leading-tight">
                                {appointment.patientName}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 line-clamp-1">
                                {appointment.doctorName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-1 rounded-md">+ Agendar</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
          <span className="text-sm font-bold text-slate-700">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <span className="text-sm font-medium text-slate-500">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span className="text-sm font-bold text-slate-700">Cancelado</span>
        </div>
      </div>

      {/* Modal Novo Agendamento - Conforme Print */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[480px] p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-xs">
                  <CalendarPlus className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    Novo Agendamento
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Preencha os dados do agendamento clínico
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              {/* Paciente */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Paciente
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="patients-list"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    placeholder="Selecione ou busque o paciente..."
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/80 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                  <datalist id="patients-list">
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
                <select
                  value={formData.professional}
                  onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
                  required
                  className="w-full bg-[#f1f5fb] border border-blue-100/80 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all cursor-pointer"
                >
                  <option value="" disabled>Selecione o profissional...</option>
                  {AVAILABLE_PROFESSIONALS.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
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
                    className="w-full bg-[#f1f5fb] border border-blue-100/80 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all"
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
                    placeholder="08:00"
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/80 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#f1f5fb] border border-blue-100/80 focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              {/* Buttons: Cancelar & Agendar Consulta */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-bold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all cursor-pointer"
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
