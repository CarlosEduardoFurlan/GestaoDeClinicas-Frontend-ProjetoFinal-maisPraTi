import React from "react";
import { Users, Calendar, Activity } from "lucide-react";

import { Button } from "../../components/ui/Button/Button";
import { Badge } from "../../components/ui/Badge/Badge";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { Checkbox } from "../../components/ui/Checkbox/Checkbox";
import { Switch } from "../../components/ui/Switch/Switch";
import { Avatar } from "../../components/ui/Avatar/Avatar";
import { Spinner } from "../../components/ui/Spinner/Spinner";
import { Divider } from "../../components/ui/Divider/Divider";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/data-display/Card/Card";
import { StatCard } from "../../components/data-display/Card/StatCard";

export function DesignSystemPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Design System</h1>
        <p className="text-text-secondary">Catálogo visual de componentes e tokens do sistema.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ColorSwatch bg="bg-primary" name="Primary" />
          <ColorSwatch bg="bg-secondary" name="Secondary" />
          <ColorSwatch bg="bg-success" name="Success" />
          <ColorSwatch bg="bg-warning" name="Warning" />
          <ColorSwatch bg="bg-danger" name="Danger" />
          <ColorSwatch bg="bg-info" name="Info" />
          <ColorSwatch bg="bg-surface" name="Surface" />
          <ColorSwatch bg="bg-background" name="Background" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Forms & Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Input placeholder="Texto padrão..." />
            <Input placeholder="Com erro..." error="Este campo é obrigatório." />
            <Input placeholder="Desabilitado" disabled />
          </div>
          <div className="space-y-4">
            <Select>
              <option value="">Selecione uma opção...</option>
              <option value="1">Opção 1</option>
              <option value="2">Opção 2</option>
            </Select>
            <Select error="Selecione um item.">
              <option value="">Selecione uma opção...</option>
            </Select>
            <Select disabled>
              <option value="">Desabilitado</option>
            </Select>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            <Checkbox label="Aceitar termos e condições" />
            <Checkbox label="Desabilitado marcado" checked disabled />
            <div className="flex items-center gap-4">
              <Switch />
              <span className="text-sm text-text-secondary">Notificações</span>
            </div>
            <div className="flex items-center gap-4">
              <Switch checked disabled />
              <span className="text-sm text-text-muted">Desabilitado</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Badges, Avatars & Spinners</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Ativo</Badge>
            <Badge variant="warning">Pendente</Badge>
            <Badge variant="danger">Cancelado</Badge>
            <Badge variant="info">Informativo</Badge>
            <Badge variant="neutral">Neutro</Badge>
          </div>
          <Divider orientation="vertical" className="h-8" />
          <div className="flex items-center gap-4">
            <Avatar size="sm" />
            <Avatar size="md" fallback="JD" />
            <Avatar size="lg" src="https://i.pravatar.cc/150?u=1" />
          </div>
          <Divider orientation="vertical" className="h-8" />
          <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>
      </section>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Cards & Data Display</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total de Pacientes" 
            value="1.248" 
            trend="+12% em relação ao mês passado" 
            trendDirection="up"
            icon={Users} 
          />
          <StatCard 
            title="Consultas Hoje" 
            value="42" 
            trend="-3 comparado a ontem" 
            trendDirection="down"
            icon={Calendar} 
          />
          <StatCard 
            title="Taxa de Ocupação" 
            value="89%" 
            trend="Estável" 
            trendDirection="neutral"
            icon={Activity} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Gerencie as preferências da sua clínica.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Modo Manutenção</p>
                    <p className="text-sm text-text-muted">Desabilita o acesso aos pacientes.</p>
                  </div>
                  <Switch />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Notificações por SMS</p>
                    <p className="text-sm text-text-muted">Avisa os pacientes 24h antes.</p>
                  </div>
                  <Switch checked readOnly />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost">Cancelar</Button>
              <Button>Salvar alterações</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ bg, name }: { bg: string, name: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-16 w-full rounded-[var(--radius-md)] border border-border shadow-sm ${bg}`}></div>
      <span className="text-sm font-medium text-text-secondary">{name}</span>
    </div>
  );
}
