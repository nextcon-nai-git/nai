
"use client"

import * as React from "react"
import { 
  Stethoscope, 
  Clock, 
  Calendar, 
  Users, 
  Activity, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Plus, 
  ArrowRight,
  Sparkles,
  ClipboardList,
  Building2,
  HardHat,
  HeartPulse
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function AmbulatoryManagement() {
  const scale = [
    { week: "1", role: "Técnico A", seg: "Trabalha", ter: "Folga", qua: "Trabalha", qui: "Folga", sex: "Trabalha", sab: "Folga" },
    { week: "1", role: "Técnico B", seg: "Folga", ter: "Trabalha", qua: "Folga", qui: "Trabalha", sex: "Folga", sab: "Trabalha" },
    { week: "2", role: "Técnico A", seg: "Folga", ter: "Trabalha", qua: "Folga", qui: "Trabalha", sex: "Folga", sab: "Trabalha" },
    { week: "2", role: "Técnico B", seg: "Trabalha", ter: "Folga", qua: "Trabalha", qui: "Folga", sex: "Trabalha", sab: "Folga" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge className="bg-primary text-white font-black uppercase text-[8px] tracking-[0.3em] mb-3">GESTÃO DE AMBULATÓRIO</Badge>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Obra Atmosphere</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
            <Building2 className="size-3" /> Dall Empreendimentos | Praia Brava, Itajaí/SC
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-primary text-primary font-black uppercase text-[10px] gap-2">
            <FileText className="size-4" /> Relatório Semanal
          </Button>
          <Button className="gradient-nextcon text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">
            <Plus className="size-4" /> Novo Atendimento
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-none bg-white rounded-[2rem] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue-600"><Clock className="size-6" /></div>
            <div>
              <h3 className="text-lg font-black text-primary uppercase">Cronograma</h3>
              <p className="text-xs text-slate-400 font-medium">Seg a Sex: 07h-19h (12x36h)</p>
              <p className="text-xs text-slate-400 font-medium">Sábado: 07h-13h</p>
            </div>
          </div>
          <Badge variant="outline" className="mt-4 border-emerald-100 text-emerald-700 bg-emerald-50 text-[8px] font-black uppercase w-fit px-2">Escala Ativa</Badge>
        </Card>

        <Card className="card-shadow border-none bg-white rounded-[2rem] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 bg-orange-50 rounded-xl w-fit text-orange-600"><ShieldCheck className="size-6" /></div>
            <div>
              <h3 className="text-lg font-black text-primary uppercase">Foco Técnico</h3>
              <p className="text-xs text-slate-400 font-medium">Prevenção & Primeiros Socorros</p>
              <p className="text-xs text-slate-400 font-medium">Controle de Absenteísmo</p>
            </div>
          </div>
          <Badge variant="outline" className="mt-4 border-blue-100 text-blue-700 bg-blue-50 text-[8px] font-black uppercase w-fit px-2">Protocolo Dall</Badge>
        </Card>

        <Card className="bg-[#090e24] text-white border-none rounded-[2rem] p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Activity className="size-20" /></div>
          <div className="space-y-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-xl w-fit text-accent"><Sparkles className="size-6" /></div>
            <div>
              <h3 className="text-lg font-black uppercase">Diferenciais NAI</h3>
              <p className="text-xs text-white/60 font-medium italic">"Prontuário Digital em Tempo Real e DDS in loco."</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50 border-b p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-primary uppercase">Escala Operacional (Modelo Quinzena)</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Alternância técnica para cobertura 100% da obra.</CardDescription>
            </div>
            <Badge className="bg-primary text-white font-black uppercase text-[10px] h-8 px-4">Semana 01 & 02</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 text-[9px] font-black uppercase">Semana</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Profissional</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Seg</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Ter</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Qua</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Qui</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Sex</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center pr-8">Sáb (07-13h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scale.map((item, i) => (
                <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <Badge variant="secondary" className="font-black text-[10px]">{item.week}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-black text-[10px]">{item.role.split(' ')[1]}</div>
                      <span className="font-bold text-primary text-xs uppercase">{item.role}</span>
                    </div>
                  </TableCell>
                  <StatusCell status={item.seg} />
                  <StatusCell status={item.ter} />
                  <StatusCell status={item.qua} />
                  <StatusCell status={item.qui} />
                  <StatusCell status={item.sex} />
                  <StatusCell status={item.sab} isSpecial />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex gap-6 items-start">
          <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20"><ClipboardList className="size-6" /></div>
          <div className="space-y-2">
            <h4 className="text-sm font-black text-primary uppercase">Nota Operacional</h4>
            <p className="text-xs text-primary/70 leading-relaxed font-medium italic">
              "O técnico que assume o sábado é responsável pelo fechamento dos relatórios semanais e checklist de insumos para a reposição da Nextcon na segunda-feira."
            </p>
          </div>
        </div>
        <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex gap-6 items-start">
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20"><HeartPulse className="size-6" /></div>
          <div className="space-y-2">
            <h4 className="text-sm font-black text-emerald-900 uppercase">Gestão de Crise</h4>
            <p className="text-xs text-emerald-700/70 leading-relaxed font-medium">
              Protocolo de remoção e primeiros socorros em plena conformidade com as normas da Dall Empreendimentos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCell({ status, isSpecial }: { status: string, isSpecial?: boolean }) {
  const isWork = status === 'Trabalha';
  return (
    <TableCell className={cn("text-center py-5", isSpecial && "pr-8")}>
      <Badge className={cn(
        "text-[8px] font-black uppercase border-none px-2 h-5",
        isWork ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
      )}>
        {status}
      </Badge>
    </TableCell>
  )
}
