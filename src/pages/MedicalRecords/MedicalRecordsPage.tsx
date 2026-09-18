import React, { useState } from "react";
import { 
  Search, Stethoscope, Calendar, ClipboardList, Eye, X, ChevronLeft, 
  ChevronRight, FileText, Edit2, Check, ChevronDown, CalendarCheck, FilePlus, Save 
} from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

const AVAILABLE_CONSULTATIONS = [
  {
    id: "c1",
    date: "24/10/2024",
    time: "09:15",
    patientName: "Carlos Eduardo Nogueira",
    patientCpf: "219.832.108-44",
    patientAge: "48 anos",
    patientPhone: "(11) 98122-3041",
    doctorName: "Dr. Ricardo Alves",
    doctorSpecialty: "Cardiologia",
    label: "24/10/2024 09:15 - Carlos Eduardo Nogueira (Dr. Ricardo Alves - Cardiologia)"
  },
  {
    id: "c2",
    date: "24/10/2024",
    time: "08:30",
    patientName: "Beatriz Mendes Lins",
    patientCpf: "108.441.982-10",
    patientAge: "32 anos",
    patientPhone: "(11) 97412-8820",
    doctorName: "Dra. Mariana Costa",
    doctorSpecialty: "Dermatologia",
    label: "24/10/2024 08:30 - Beatriz Mendes Lins (Dra. Mariana Costa - Dermatologia)"
  },
  {
    id: "c3",
    date: "23/10/2024",
    time: "17:40",
    patientName: "Fernando Augusto Paiva",
    patientCpf: "332.190.412-05",
    patientAge: "55 anos",
    patientPhone: "(11) 99182-1200",
    doctorName: "Dr. Henrique Dias",
    doctorSpecialty: "Clínica Médica",
    label: "23/10/2024 17:40 - Fernando Augusto Paiva (Dr. Henrique Dias - Clínica Médica)"
  },
  {
    id: "c4",
    date: "23/10/2024",
    time: "15:10",
    patientName: "Helena Viana Silveira",
    patientCpf: "420.912.001-72",
    patientAge: "29 anos",
    patientPhone: "(11) 98334-9090",
    doctorName: "Dr. Ricardo Alves",
    doctorSpecialty: "Cardiologia",
    label: "23/10/2024 15:10 - Helena Viana Silveira (Dr. Ricardo Alves - Cardiologia)"
  },
  {
    id: "c5",
    date: "28/10/2024",
    time: "10:00",
    patientName: "Mariana Costa Silveira",
    patientCpf: "123.456.789-00",
    patientAge: "34 anos",
    patientPhone: "(11) 98765-4321",
    doctorName: "Dr. Eduardo Arantes",
    doctorSpecialty: "Clínica Geral",
    label: "28/10/2024 10:00 - Mariana Costa Silveira (Dr. Eduardo Arantes - Clínica Geral)"
  }
];

const INITIAL_RECORDS = [
  {
    id: 1,
    date: "24/10/2024",
    time: "09:15",
    patientName: "Carlos Eduardo Nogueira",
    patientCpf: "219.832.108-44",
    patientAge: "48 anos",
    patientPhone: "(11) 98122-3041",
    doctorName: "Dr. Ricardo Alves",
    doctorSpecialty: "Cardiologia",
    notes: "Paciente comparece para atendimento. Registro clínico realizado conforme avaliação durante a consulta."
  },
  {
    id: 2,
    date: "24/10/2024",
    time: "08:30",
    patientName: "Beatriz Mendes Lins",
    patientCpf: "108.441.982-10",
    patientAge: "32 anos",
    patientPhone: "(11) 97412-8820",
    doctorName: "Dra. Mariana Costa",
    doctorSpecialty: "Dermatologia",
    notes: "Paciente relata manchas na pele. Exame físico realizado."
  },
  {
    id: 3,
    date: "23/10/2024",
    time: "17:40",
    patientName: "Fernando Augusto Paiva",
    patientCpf: "332.190.412-05",
    patientAge: "55 anos",
    patientPhone: "(11) 99182-1200",
    doctorName: "Dr. Henrique Dias",
    doctorSpecialty: "Clínica Médica",
    notes: "Retorno para apresentar exames de sangue de rotina."
  },
  {
    id: 4,
    date: "23/10/2024",
    time: "15:10",
    patientName: "Helena Viana Silveira",
    patientCpf: "420.912.001-72",
    patientAge: "29 anos",
    patientPhone: "(11) 98334-9090",
    doctorName: "Dr. Ricardo Alves",
    doctorSpecialty: "Cardiologia",
    notes: "Avaliação pré-operatória. Paciente assintomática no momento."
  }
];

export function MedicalRecordsPage() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditNotesModalOpen, setIsEditNotesModalOpen] = useState(false);

  const { success, error, info } = useToast();

  const [selectedConsultationId, setSelectedConsultationId] = useState("c1");
  const [clinicalNotes, setClinicalNotes] = useState("");

  const [editNotes, setEditNotes] = useState("");

  const selectedRecord = records.find((r) => r.id === selectedRecordId);
  const selectedConsultation = AVAILABLE_CONSULTATIONS.find((c) => c.id === selectedConsultationId) || AVAILABLE_CONSULTATIONS[0];

  const filteredRecords = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientCpf.includes(searchTerm)
  );

  const handleOpenNew = () => {
    setSelectedConsultationId("c1");
    setClinicalNotes("");
    setIsModalOpen(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNotes.trim()) {
      error("Erro de validação", "Por favor, digite as anotações do atendimento.");
      return;
    }

    const consultation = selectedConsultation;

    const newRec = {
      id: Date.now(),
      date: consultation.date,
      time: consultation.time,
      patientName: consultation.patientName,
      patientCpf: consultation.patientCpf,
      patientAge: consultation.patientAge,
      patientPhone: consultation.patientPhone,
      doctorName: consultation.doctorName,
      doctorSpecialty: consultation.doctorSpecialty,
      notes: clinicalNotes.trim()
    };

    setRecords((prev) => [newRec, ...prev]);
    setSelectedRecordId(newRec.id);
    success("Prontuário salvo", `Registro clínico criado com sucesso para ${consultation.patientName}.`);
    setIsModalOpen(false);
    setClinicalNotes("");
  };

  const handleOpenEditNotes = () => {
    if (!selectedRecord) return;
    setEditNotes(selectedRecord.notes);
    setIsEditNotesModalOpen(true);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setRecords((prev) =>
      prev.map((r) => (r.id === selectedRecord.id ? { ...r, notes: editNotes } : r))
    );
    success("Prontuário atualizado", "Observações clínicas salvas com sucesso.");
    setIsEditNotesModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Prontuários</h1>
          <p className="text-slate-500 mt-1 font-medium">Registros e anotações clínicas dos atendimentos realizados na clínica.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenNew}
          className="rounded-xl px-6 font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-blue-700"
        >
          <FileText className="w-4 h-4" />
          Novo Prontuário
        </Button>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 tracking-wider">Buscar por Paciente ou CPF</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Carlos Eduardo ou 219.832"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 tracking-wider">Médico Responsável</label>
          <div className="relative">
            <Stethoscope className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer">
              <option>Todos os Médicos</option>
              <option>Dr. Ricardo Alves (Cardiologia)</option>
              <option>Dra. Mariana Costa (Dermatologia)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 tracking-wider">Data do Atendimento</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              defaultValue="24/10/2024"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row items-start gap-6 relative">
        
        {/* Left Column - List */}
        <div className="flex-1 w-full bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900">Registros Recentes</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">Ordenado por data decrescente</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data e Consulta</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profissional / Consulta</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecords.map((record) => {
                  const isSelected = selectedRecordId === record.id;
                  return (
                    <tr 
                      key={record.id} 
                      onClick={() => {
                        setSelectedRecordId(record.id);
                        info("Prontuário selecionado", `Exibindo prontuário de ${record.patientName}`);
                      }}
                      className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                    >
                      <td className="px-6 py-5 align-top">
                        <div className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-900'}`}>{record.date}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">{record.time}</div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="text-sm font-bold text-slate-900">{record.patientName}</div>
                        <div className="text-xs font-medium text-slate-600 mt-1">{record.patientCpf}</div>
                        <div className="text-[11px] font-medium text-slate-400 mt-0.5">{record.patientAge} • {record.patientPhone}</div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="text-sm font-bold text-slate-900">{record.doctorName}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">{record.doctorSpecialty}</div>
                      </td>
                      <td className="px-6 py-5 align-middle text-right">
                        <div className="flex justify-end">
                          <Eye className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
            <span>Mostrando 1-{filteredRecords.length} atendimentos</span>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:text-slate-900 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="font-bold text-slate-900">1</span>
              <button className="p-1 hover:text-slate-900 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Right Column - Details Card */}
        {selectedRecord && (
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">Registro de Atendimento</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedRecord.date} às {selectedRecord.time}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecordId(null)}
                className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paciente</span>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{selectedRecord.patientName}</p>
                  <p className="text-xs font-medium text-slate-500">CPF: {selectedRecord.patientCpf}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profissional Responsável</span>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{selectedRecord.doctorName}</p>
                  <p className="text-xs font-medium text-slate-500">Especialidade: {selectedRecord.doctorSpecialty}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Anotações / Observações Clínicas do Atendimento</h4>
                <div className="bg-[#f4f7fb] border border-blue-100/50 rounded-xl p-5 text-sm font-medium text-slate-700 leading-relaxed min-h-[140px]">
                  {selectedRecord.notes}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-6 pt-2 flex flex-col gap-3">
              <button 
                onClick={() => setSelectedRecordId(null)}
                className="w-full py-3 px-5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Fechar Visualização
              </button>
              <button 
                onClick={handleOpenEditNotes}
                className="w-full py-3 px-5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar Observações
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Prontuário - Conforme Print */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[620px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FilePlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    Novo Prontuário
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Registre o atendimento clínico e anotações da consulta
                  </p>
                </div>
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
            <form onSubmit={handleSaveNew} className="p-6 sm:p-7 space-y-5">
              {/* Consulta Relacionada */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Consulta Relacionada <span className="text-slate-400 font-normal">*</span>
                </label>
                <div className="relative">
                  <CalendarCheck className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedConsultationId}
                    onChange={(e) => setSelectedConsultationId(e.target.value)}
                    required
                    className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-xl pl-11 pr-10 py-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {AVAILABLE_CONSULTATIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Card Resumo Consulta Selecionada */}
              {selectedConsultation && (
                <div className="bg-[#f8faff] border border-blue-100/60 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      PACIENTE
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-1 leading-tight">
                      {selectedConsultation.patientName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      CPF: {selectedConsultation.patientCpf}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      PROFISSIONAL
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-1 leading-tight">
                      {selectedConsultation.doctorName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {selectedConsultation.doctorSpecialty}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      DATA DO ATENDIMENTO
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-1 leading-tight">
                      {selectedConsultation.date}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {selectedConsultation.time}
                    </p>
                  </div>
                </div>
              )}

              {/* Anotações / Observações Clínicas */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600 fill-blue-600/20" />
                  <span>Anotações / Observações Clínicas <span className="text-slate-400 font-normal">*</span></span>
                </label>
                <textarea
                  rows={5}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Digite as anotações e observações do atendimento..."
                  required
                  className="w-full bg-[#f1f5fb] border border-blue-100/60 focus:border-blue-400 rounded-2xl p-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all resize-none min-h-[140px]"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-[#e8f1fd] hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Observações */}
      {isEditNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Editar Observações Clínicas</h3>
              <button onClick={() => setIsEditNotesModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNotes} className="p-6 space-y-4">
              <textarea
                rows={6}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full bg-[#f4f7fb] border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 resize-none"
              />
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditNotesModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
