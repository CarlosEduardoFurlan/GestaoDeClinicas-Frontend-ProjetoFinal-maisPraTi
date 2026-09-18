import React, { createContext, useContext, useState } from "react";

// Initial Mock Data
const INITIAL_PATIENTS = [
  { id: 1, name: "Maria Oliveira Silva", cpf: "111.222.333-44", phone: "(11) 99999-1111", lastVisit: "10/08/2026", status: "Ativo" },
  { id: 2, name: "Carlos Eduardo Costa", cpf: "222.333.444-55", phone: "(11) 98888-2222", lastVisit: "05/09/2026", status: "Ativo" },
  { id: 3, name: "Ana Beatriz Santos", cpf: "333.444.555-66", phone: "(11) 97777-3333", lastVisit: "15/07/2026", status: "Inativo" },
  { id: 4, name: "João Pedro Mendes", cpf: "444.555.666-77", phone: "(11) 96666-4444", lastVisit: "01/09/2026", status: "Ativo" },
  { id: 5, name: "Fernanda Lima", cpf: "555.666.777-88", phone: "(11) 95555-5555", lastVisit: "22/08/2026", status: "Pendente" },
  { id: 6, name: "Ricardo Almeida", cpf: "666.777.888-99", phone: "(11) 94444-6666", lastVisit: "11/06/2026", status: "Inativo" },
  { id: 7, name: "Camila Rocha", cpf: "777.888.999-00", phone: "(11) 93333-7777", lastVisit: "09/09/2026", status: "Ativo" },
];

const INITIAL_APPOINTMENTS = [
  { id: 1, time: "09:00", duration: "30min", patient: "Maria Silva", type: "Retorno", status: "Confirmado", doctor: "Dr. João Carlos" },
  { id: 2, time: "09:30", duration: "30min", patient: "João Oliveira", type: "Primeira Consulta", status: "Em Atendimento", doctor: "Dra. Ana Paula" },
  { id: 3, time: "10:00", duration: "60min", patient: "Ana Beatriz", type: "Exame", status: "Aguardando", doctor: "Dr. João Carlos" },
  { id: 4, time: "14:00", duration: "45min", patient: "Carlos Santos", type: "Primeira Consulta", status: "Cancelado", doctor: "Dra. Ana Paula" },
  { id: 5, time: "15:30", duration: "30min", patient: "Fernanda Costa", type: "Retorno", status: "Confirmado", doctor: "Dr. João Carlos" },
];

interface AppContextType {
  patients: any[];
  addPatient: (patient: any) => void;
  updatePatient: (id: number, data: any) => void;
  appointments: any[];
  addAppointment: (appointment: any) => void;
  updateAppointment: (id: number, data: any) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const addPatient = (patient: any) => {
    setPatients((prev) => [...prev, { ...patient, id: prev.length + 1 }]);
  };

  const updatePatient = (id: number, data: any) => {
    setPatients((prev) => prev.map((pat) => (pat.id === id ? { ...pat, ...data } : pat)));
  };

  const addAppointment = (appointment: any) => {
    setAppointments((prev) => [...prev, { ...appointment, id: prev.length + 1 }]);
  };

  const updateAppointment = (id: number, data: any) => {
    setAppointments((prev) => prev.map((app) => (app.id === id ? { ...app, ...data } : app)));
  };

  return (
    <AppContext.Provider value={{ patients, addPatient, updatePatient, appointments, addAppointment, updateAppointment }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
