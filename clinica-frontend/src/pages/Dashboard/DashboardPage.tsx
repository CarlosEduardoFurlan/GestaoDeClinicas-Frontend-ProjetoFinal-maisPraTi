import React from "react";
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";

export function DashboardPage() {
  const appointments = [
    {
      time: "08:30",
      period: "Manhã",
      patient: "Mariana Costa Silveira",
      doctor: "Dr. Ricardo Alves",
      specialty: "Clínica Geral",
      status: "Concluída",
    },
    {
      time: "09:15",
      period: "Manhã",
      patient: "Carlos Eduardo Nogueira",
      doctor: "Dra. Camila Nogueira",
      specialty: "Pediatria",
      status: "Em atendimento",
    },
    {
      time: "10:00",
      period: "Manhã",
      patient: "Beatriz Lima",
      doctor: "Dr. Ricardo Alves",
      specialty: "Clínica Geral",
      status: "Confirmada",
    },
    {
      time: "11:00",
      period: "Manhã",
      patient: "Fernando Antunes Rocha",
      doctor: "Dra. Camila Nogueira",
      specialty: "Pediatria",
      status: "Agendada",
    },
    {
      time: "14:00",
      period: "Tarde",
      patient: "Juliana Mendes Viana",
      doctor: "Dr. Ricardo Alves",
      specialty: "Clínica Geral",
      status: "Agendada",
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-slate-200 text-slate-700 font-semibold";
      case "Em atendimento":
        return "bg-blue-100 text-primary font-semibold";
      case "Confirmada":
        return "bg-teal-100 text-teal-700 font-semibold";
      case "Agendada":
        return "bg-purple-100 text-purple-700 font-semibold";
      default:
        return "bg-slate-100 text-slate-700 font-semibold";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Visão geral dos atendimentos de hoje</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            Hoje, 24 de Outubro
          </div>
          <Button variant="primary" className="rounded-full px-6 font-semibold shadow-sm">
            + Nova Consulta
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Consultas Hoje</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">12</span>
            <span className="text-sm text-slate-500 font-medium">agendadas</span>
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Próximas Consultas</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-primary tracking-tight">4</span>
            <span className="text-sm text-slate-500 font-medium">agendadas</span>
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Total de Pacientes</span>
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">348</span>
            <span className="text-sm text-slate-500 font-medium">cadastrados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Consultas de Hoje</h2>
              <p className="text-sm text-slate-500">Listagem dos atendimentos do dia</p>
            </div>
            <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
              5 horários listados
            </div>
          </div>

          <div className="space-y-4">
            {appointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50/80 rounded-[1.25rem] border border-slate-100/50">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-12 border-r border-slate-200 pr-6">
                    <span className="text-base font-bold text-slate-900 leading-tight">{apt.time}</span>
                    <span className="text-[11px] font-bold text-primary">{apt.period}</span>
                  </div>
                  <div className="pl-2">
                    <h3 className="font-bold text-slate-900 text-base">{apt.patient}</h3>
                    <div className="flex items-center text-xs text-slate-500 mt-1 font-medium">
                      <StethoscopeIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {apt.doctor} • {apt.specialty}
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs ${getStatusStyle(apt.status)}`}>
                  {apt.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Sidebar */}
        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Esta Semana</h2>
              <p className="text-sm text-slate-500">Outubro de 2024</p>
            </div>
            <div className="flex gap-1 text-slate-400">
              <button className="p-1 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-slate-50 rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex justify-between items-center text-center mt-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500">Seg</span>
              <span className="text-sm font-bold text-slate-900">21</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500">Ter</span>
              <span className="text-sm font-bold text-slate-900">22</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500">Qua</span>
              <span className="text-sm font-bold text-slate-900">23</span>
            </div>
            <div className="flex flex-col items-center bg-primary text-white p-3 rounded-2xl shadow-md transform -translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider mb-1">QUI</span>
              <span className="text-base font-extrabold mb-1">24</span>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500">Sex</span>
              <span className="text-sm font-bold text-slate-900">25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StethoscopeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}
