import React, { useState } from "react";
import { Search, UserPlus, Edit2, X, Check, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";

interface UserItem {
  id: number;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  email: string;
  role: "Administrador" | "Profissional" | "Recepção" | "Paciente";
  linkDetail?: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 1,
    initials: "SJ",
    avatarBg: "bg-indigo-100",
    avatarColor: "text-indigo-700",
    name: "Dra. Sarah Jenkins",
    email: "sarah.jenkins@clinicasys.com.br",
    role: "Administrador",
    linkDetail: "Acesso Geral",
  },
  {
    id: 2,
    initials: "RA",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-700",
    name: "Dr. Ricardo Alves",
    email: "ricardo.alves@clinicasys.com.br",
    role: "Profissional",
    linkDetail: "Vínculo: Dr. Ricardo Alves",
  },
  {
    id: 3,
    initials: "CN",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-700",
    name: "Camila Nogueira",
    email: "camila.nogueira@clinicasys.com.br",
    role: "Profissional",
    linkDetail: "Vínculo: Camila Nogueira",
  },
  {
    id: 4,
    initials: "MD",
    avatarBg: "bg-teal-100",
    avatarColor: "text-teal-700",
    name: "Mariana Duarte",
    email: "mariana.recepcao@clinicasys.com.br",
    role: "Recepção",
  },
  {
    id: 5,
    initials: "CE",
    avatarBg: "bg-slate-200",
    avatarColor: "text-slate-700",
    name: "Carlos Eduardo Nogueira",
    email: "carlos.eduardo@email.com",
    role: "Paciente",
  },
  {
    id: 6,
    initials: "RS",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-700",
    name: "Roberto Souza",
    email: "roberto.recepcao@clinicasys.com.br",
    role: "Recepção",
  },
];

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos os Perfis");
  const [currentPage, setCurrentPage] = useState(1);

  const { success, error, info } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Profissional" as UserItem["role"],
    linkDetail: "",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "Todos os Perfis" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenNew = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "Profissional",
      linkDetail: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      linkDetail: user.linkDetail || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: UserItem) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    info("Usuário removido", `O acesso de ${user.name} foi revogado com sucesso.`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      error("Campos obrigatórios", "Por favor, preencha o nome e o e-mail do usuário.");
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                linkDetail: formData.linkDetail || undefined,
              }
            : u
        )
      );
      success("Usuário atualizado", `Os dados de ${formData.name} foram salvos com sucesso.`);
    } else {
      const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
          return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
      };

      const newUser: UserItem = {
        id: Date.now(),
        initials: getInitials(formData.name),
        avatarBg:
          formData.role === "Administrador"
            ? "bg-indigo-100"
            : formData.role === "Recepção"
            ? "bg-teal-100"
            : formData.role === "Paciente"
            ? "bg-slate-200"
            : "bg-blue-100",
        avatarColor:
          formData.role === "Administrador"
            ? "text-indigo-700"
            : formData.role === "Recepção"
            ? "text-teal-700"
            : formData.role === "Paciente"
            ? "text-slate-700"
            : "text-blue-700",
        name: formData.name,
        email: formData.email,
        role: formData.role,
        linkDetail: formData.linkDetail || undefined,
      };

      setUsers((prev) => [...prev, newUser]);
      success("Usuário criado", `Novo acesso para ${formData.name} cadastrado com sucesso.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Usuários e Acessos
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gerenciamento de contas, credenciais e perfis de acesso ao sistema
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenNew}
          className="rounded-xl px-6 font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Filters Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nome ou e-mail institucional..."
              className="w-full bg-[#f4f7fb] border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PERFIL:
            </span>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#f4f7fb] border-none rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="Todos os Perfis">Todos os Perfis</option>
                <option value="Administrador">Administrador</option>
                <option value="Profissional">Profissional</option>
                <option value="Recepção">Recepção</option>
                <option value="Paciente">Paciente</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  USUÁRIO & E-MAIL
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  PERFIL DE ACESSO & VÍNCULO
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Usuário & E-mail */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${user.avatarBg} ${user.avatarColor} flex items-center justify-center font-bold text-sm shrink-0`}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 leading-tight">
                            {user.name}
                          </div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Perfil de Acesso & Vínculo */}
                    <td className="px-6 py-4 align-middle">
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">
                          {user.role}
                        </div>
                        {user.linkDetail && (
                          <div className="text-xs font-medium text-slate-500 mt-0.5">
                            {user.linkDetail}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                          title="Editar Usuário"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Excluir Usuário"
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
            Exibindo 1-{filteredUsers.length} de {users.length} usuários registrados
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-sm transition-colors flex items-center justify-center ${
                  currentPage === pageNum
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingUser ? "Editar Usuário" : "Novo Usuário"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingUser
                    ? "Atualize as credenciais e o nível de acesso do usuário."
                    : "Cadastre um novo usuário com credenciais e perfil de acesso."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Dra. Sarah Jenkins"
                  className="w-full bg-[#f4f7fb] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Ex: sarah.jenkins@clinicasys.com.br"
                  className="w-full bg-[#f4f7fb] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Perfil de Acesso
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as UserItem["role"],
                      })
                    }
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Profissional">Profissional</option>
                    <option value="Recepção">Recepção</option>
                    <option value="Paciente">Paciente</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Vínculo / Observação
                  </label>
                  <input
                    type="text"
                    value={formData.linkDetail}
                    onChange={(e) =>
                      setFormData({ ...formData, linkDetail: e.target.value })
                    }
                    placeholder="Ex: Acesso Geral ou Vínculo"
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
