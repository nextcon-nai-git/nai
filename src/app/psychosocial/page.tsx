
"use client"

import * as React from "react"
import { Activity, Thermometer, Info, AlertCircle, TrendingUp, Brain, ShieldCheck, Heart, UserWarning } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Termômetro de Burnout & Riscos Psicossociais
 * Ferramenta analítica para gestão de saúde mental ocupacional.
 */

const sectors = [
  { name: "Operacional (Nativa)", stress: 85, mood: "Crítico", trend: "+12%", color: "bg-red-500", lives: 42 },
  { name: "Engenharia (TimeNow)", stress: 42, mood: "Estável", trend: "-5%", color: "bg-green-500", lives: 18 },
  { name: "Logística", stress: 68, mood: "Alerta", trend: "+2%", color: "bg-orange-500", lives: 25 },
  { name: "Administrativo", stress: 25, mood: "Excelente", trend: "-1%", color: "bg-blue-500", lives: 12 },
]

export default function PsychosocialThermometer() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Termômetro Psicossocial</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> Monitoramento de Saúde Mental e Clima Organizacional 2026.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-4 h-10 flex items-center">
            RESPOSTAS: 1.402 (Semana)
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-muted/30 border-b pb-8">
            <CardTitle className="text-lg font-black text-primary uppercase">Mapa de Risco por Setor</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Correlação entre Turnover, Absenteísmo e Stress Reportado.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {sectors.map((sector) => (
              <div key={sector.name} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-sm font-black text-primary uppercase tracking-tight">{sector.name}</span>
                    <div className="flex gap-2">
                      <Badge className={cn("text-[8px] font-black uppercase border-none text-white", sector.color)}>
                        {sector.mood}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{sector.lives} Vidas sob análise</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-primary">{sector.stress}%</span>
                    <span className={cn(
                      "block text-[9px] font-black uppercase tracking-tighter",
                      sector.trend.includes('+') ? 'text-red-500' : 'text-green-500'
                    )}>
                      {sector.trend} vs mês ant.
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={cn("h-full transition-all duration-1000", sector.color)}
                    style={{ width: `${sector.stress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Brain className="size-32 text-accent" /></div>
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                <Activity className="size-4" /> Insight Preditivo NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm leading-relaxed italic text-white/80">
                  "Identificamos correlação de <span className="font-bold text-accent">0.82</span> entre o stress operacional e o absenteísmo por lombalgia na unidade Nativa."
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Ação Corretiva Recomendada:</p>
                <div className="flex gap-3 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <ShieldCheck className="size-5 text-accent shrink-0" />
                  <p className="text-[11px] font-medium leading-tight">Implementar Ginástica Laboral com foco em Pausa Ativa de 15min e suporte ergonômico.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Índice de Resiliência Geral</p>
            <div className="relative size-40">
              <svg className="size-full" viewBox="0 0 100 100">
                <circle className="text-slate-100 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                <circle className="text-primary stroke-current" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="75" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-primary leading-none">72%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Global</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Satisfação</p>
                <p className="text-sm font-black text-primary">8.4/10</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Turnover</p>
                <p className="text-sm font-black text-red-500">2.1%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4 items-start">
          <div className="p-3 bg-primary text-white rounded-xl shadow-lg">
            <Heart className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-primary uppercase tracking-tight mb-1">Privacidade Garantida</h4>
            <p className="text-xs text-primary/70 leading-relaxed font-medium">
              Todas as pulse surveys são 100% anônimas. Os dados são agrupados apenas em setores com mais de 5 colaboradores para proteger a identidade individual.
            </p>
          </div>
        </div>
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex gap-4 items-start">
          <div className="p-3 bg-accent text-primary rounded-xl shadow-lg">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight mb-1">Impacto no FAP</h4>
            <p className="text-xs text-emerald-700/70 leading-relaxed font-medium">
              Reduzir o risco psicossocial reduz diretamente o absenteísmo médico, o que impacta na queda do índice Malus do FAP e gera economia tributária real.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
