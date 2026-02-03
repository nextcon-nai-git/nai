
"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  LayoutDashboard,
  MoreVertical,
  Plus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const redFlags = [
  { id: 1, type: "CA Vencendo", client: "Metalúrgica Silva", item: "Protetor Auricular 3M", deadline: "Em 5 dias", status: "Crítico" },
  { id: 2, type: "Exame Atrasado", client: "Transportes Rapidez", item: "Audiometria - João S.", deadline: "Há 12 dias", status: "Alerta" },
  { id: 3, type: "Treinamento NR-35", client: "Construção Forte", item: "Trabalho em Altura", deadline: "Amanhã", status: "Crítico" },
]

export default function AgencyCommandCenter() {
  const columns = ["Para Fazer", "Em Andamento", "Bloqueado", "Concluído"]

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Centro de Comando Nextcon</h1>
          <p className="text-muted-foreground">Visão unificada da agência para gestão de múltiplos clientes.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="text-primary border-primary px-4 py-1.5 font-bold">
            CLIENTES ATIVOS: 24
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 card-shadow border-none bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-red-900 uppercase tracking-widest">🚨 Red Flags (Urgente)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {redFlags.map((flag) => (
              <div key={flag.id} className="p-3 bg-white rounded-lg border-l-4 border-red-500 shadow-sm space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-primary">{flag.client}</p>
                  <Badge variant="destructive" className="text-[8px] px-1.5 h-4">{flag.status}</Badge>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{flag.type}: {flag.item}</p>
                <div className="flex items-center gap-1 text-[10px] text-red-600 font-bold">
                  <Clock className="size-2" /> {flag.deadline}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-shadow border-none overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Kanban Unificado de Ações</CardTitle>
              <CardDescription>Planos de ação críticos de todas as empresas clientes.</CardDescription>
            </div>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
               <Plus className="size-5 text-primary" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[400px]">
              {columns.map((col) => (
                <div key={col} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{col}</span>
                    <Badge variant="secondary" className="text-[10px]">2</Badge>
                  </div>
                  <div className="flex-1 bg-muted/30 rounded-xl p-2 border border-dashed border-muted flex flex-col gap-2">
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-muted space-y-2 cursor-grab">
                      <div className="flex justify-between items-start">
                        <Badge className="text-[8px] bg-primary/10 text-primary border-none">PGR</Badge>
                        <MoreVertical className="size-3 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-bold leading-tight">Instalar Exaustor Bloco C</p>
                      <p className="text-[10px] text-muted-foreground">Metalúrgica Silva</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold">S-2240 Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <h2 className="text-4xl font-bold text-primary">82</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold">Envios Críticos</p>
          </CardContent>
        </Card>
        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Vencimento de PPRA/PGR</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <h2 className="text-4xl font-bold text-accent">14</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold">Nos próximos 30 dias</p>
          </CardContent>
        </Card>
        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Tickets de Suporte</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <h2 className="text-4xl font-bold text-green-600">03</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold">Aguardando Resposta</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
