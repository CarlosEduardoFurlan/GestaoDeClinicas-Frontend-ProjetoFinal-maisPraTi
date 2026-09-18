import React from "react";
import { LayoutDashboard, Calendar, Users, Settings, Component, Stethoscope, ClipboardList, Clock } from 'lucide-react';

export interface NavItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  children?: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: "GERAL",
    items: [
      {
        label: "Dashboard",
        path: "/",
      },
      {
        label: "Agenda",
        path: "/appointments",
      },
      {
        label: "Consultas",
        path: "/consultations",
      }
    ]
  },
  {
    label: "ATENDIMENTO",
    items: [
      {
        label: "Pacientes",
        path: "/patients",
      },
      {
        label: "Prontuários",
        path: "/medical-records",
      }
    ]
  },
  {
    label: "GESTÃO CLÍNICA",
    items: [
      {
        label: "Profissionais",
        path: "/professionals",
      },
      {
        label: "Especialidades",
        path: "/specialties",
      }
    ]
  },
  {
    label: "ADMINISTRAÇÃO",
    items: [
      {
        label: "Usuários",
        path: "/users",
      }
    ]
  }
];
