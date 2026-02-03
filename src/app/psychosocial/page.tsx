
"use client"

import * as React from "react"
import { Activity, Thermometer, Info, AlertCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sectors = [
  { name: "Vendas", stress: 85, mood: "Crítico", trend: "+12%", color: "bg-red-500" },
  { name: "Produção", stress: 42, mood: "Estável", trend: "-5%", color: "bg-green-500" },
  { name: "Logística", stress: 68, mood: "Alerta", trend: "+2%", color: "bg-orange-500" },
  { name: "Adm", stress: 25, mood: "Excelente", trend: "-1%", color: "bg-blue-500" },
]

export default function PsychosocialThermometer() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Termômetro de Burnout</h1>
          <p className="text-muted-foreground">Análise psicossocial preventiva e clima organizacional baseado em pulse surveys.</p>
        </div>
        <Badge variant="outline" className="text-accent border-accent px-4 py-1 font-bold">
          TOTAL DE RESPOSTAS: 1,402 (Semana)
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Mapa de Stress por Setor</CardTitle>
            <CardDescription>Correlação entre carga horária, turnover e nível de stress reportado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {sectors.map((sector) => (
              <div key={sector.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-lg font-bold">{sector.name}</span>
                    <span className={`ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded ${sector.color} text-white`}>
                      {sector.mood}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{sector.stress}% de Stress</span>
                    <span className={`block text-[10px] ${sector.trend.includes('+') ? 'text-red-500' : 'text-green-500'} font-bold`}>
                      {sector.trend} vs mês ant.
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={sector.stress} className="h-4 bg-muted" />
                  <div 
                    className={`absolute inset-0 h-full ${sector.color} opacity-20 rounded-full`}
                    style={{ width: `${sector.stress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="size-5 text-accent" /> Insight IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">
                Identificamos uma correlação de <span className="font-bold text-accent">0.82</span> entre o stress em <span className="font-bold">Vendas</span> e o absenteísmo por lombalgia.
              </p>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20 text-xs">
                <span className="font-bold text-accent uppercase">Sugestão:</span> Implementar ginástica laboral com foco ergonômico e pausa ativa de 15min.
              </div>
              <p className="text-[10px] text-white/60">Análise baseada em 12 meses de dados históricos.</p>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Thermometer className="size-4 text-primary" /> Saúde Mental Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <div className="relative size-32">
                <svg className="size-full" viewBox="0 0 100 100">
                  <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-primary stroke-current" strokeWidth="10" strokeDasharray="180" strokeDashoffset="40" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
                  72%
                </div>
              </div>
              <p className="mt-4 text-xs font-bold text-muted-foreground uppercase">Índice de Resiliência</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
          <Info className="size-5 text-primary shrink-0" />
          <p className="text-xs text-primary/80">
            Todas as respostas são <span className="font-bold">100% anônimas</span> e criptografadas. Os dados são agrupados por setor (mínimo de 5 respostas) para proteger a identidade dos colaboradores.
          </p>
        </div>
        <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3">
          <TrendingUp className="size-5 text-green-600 shrink-0" />
          <p className="text-xs text-green-700/80">
            Ações preventivas baseadas nestes dados reduziram sinistros de saúde em <span className="font-bold">18%</span> no último semestre na unidade central.
          </p>
        </div>
      </div>
    </div>
  )
}
