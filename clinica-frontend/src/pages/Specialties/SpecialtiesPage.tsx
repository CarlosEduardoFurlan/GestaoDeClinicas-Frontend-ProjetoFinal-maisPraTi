import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

interface SpecialtyItem {
  id: number;
  name: string;
  description: string;
}

const INITIAL_SPECIALTIES: SpecialtyItem[] = [
  {
    id: 1,
    name: "Cardiologia",
    description: "Diagnóstico e tratamento de doenças que acometem o coração bem como os outros componentes do sistema circulatório.",
  },
  {
    id: 2,
    name: "Clínica Geral",
    description: "Acompanhamento geral preventivo, diagnóstico precoce e triagem de patologias comuns de adultos.",
  },
  {
    id: 3,
    name: "Pediatria",
    description: "Especialidade médica dedicada à assistência a crianças e adolescentes nos seus diversos aspectos.",
  },
  {
    id: 4,
    name: "Ortopedia",
    description: "Cuidado e tratamento de lesões, traumas e doenças congênitas do sistema locomotor e esquelético.",
  },
  {
    id: 5,
    name: "Dermatologia",
    description: "Diagnóstico, prevenção e tratamento de doenças relacionadas à pele, pelos, mucosas, cabelo e unhas.",
  },
  {
    id: 6,
    name: "Ginecologia e Obstetrícia",
    description: "Saúde integral da mulher, acompanhamento reprodutivo, pré-natal, parto e pós-parto imediato.",
  },
];

export function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>(INITIAL_SPECIALTIES);
  const [searchTerm, setSearchTerm] = useState("");

  const { success, error, warning } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<SpecialtyItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const filteredSpecialties = specialties.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingSpecialty(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SpecialtyItem) => {
    setEditingSpecialty(item);
    setFormData({ name: item.name, description: item.description });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const item = specialties.find((s) => s.id === id);
    setSpecialties((prev) => prev.filter((s) => s.id !== id));
    warning("Especialidade removida", `A especialidade "${item?.name || ''}" foi excluída.`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error("Campo obrigatório", "Por favor, informe o nome da especialidade médica.");
      return;
    }

    if (editingSpecialty) {
      setSpecialties((prev) =>
        prev.map((item) =>
          item.id === editingSpecialty.id
            ? { ...item, name: formData.name, description: formData.description }
            : item
        )
      );
      success("Especialidade atualizada", `Alterações em "${formData.name}" salvas com sucesso.`);
    } else {
      const newItem: SpecialtyItem = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
      };
      setSpecialties((prev) => [...prev, newItem]);
      success("Especialidade cadastrada", `A especialidade "${formData.name}" foi criada com sucesso.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Especialidades Médicas
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gerenciamento de especialidades cadastradas no sistema.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenNew}
          className="rounded-xl px-6 font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Especialidade
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Filter Area */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar especialidade por nome ou descrição..."
              className="w-full bg-[#f4f7fb] border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-1/4">
                  Nome da Especialidade
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-3/5">
                  Descrição do Escopo Clínico
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSpecialties.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                    Nenhuma especialidade encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredSpecialties.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 align-middle">
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span className="text-sm font-medium text-slate-600 leading-relaxed">
                        {item.description}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                          title="Editar Especialidade"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                          title="Excluir Especialidade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 font-medium">
            Exibindo 1 a {filteredSpecialties.length} de {specialties.length} registros
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <button
              disabled
              className="p-1 text-slate-300 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Página 1 de 1</span>
            <button
              disabled
              className="p-1 text-slate-300 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar Especialidade - Conforme Print */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[480px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {editingSpecialty ? "Editar Especialidade" : "Nova Especialidade"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Cadastre uma nova especialidade médica no sistema
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
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Cardiologia, Pediatria..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Descrição
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição das áreas de atuação e escopo clínico..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0052cc] hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer shadow-sm"
                >
                  {editingSpecialty ? "Salvar Especialidade" : "Cadastrar Especialidade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
