
"use client"

import * as React from "react"
import { 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Scale,
  Calculator,
  ArrowUpRight,
  BarChart3,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const financialMetrics = [
  { 
    label: "Economia Total (ROI)", 
    value: "R$ 452.800", 
    change: "+15%", 
    trend: "up",
    icon: DollarSign, 
    color: "text-green-500",
    description: "Multas e tributos evitados"
  },
  { 
    label: "Fator FAP Atual", 
    value: "0,74", 
    change: "-0.05", 
    trend: "down",
    icon: TrendingDown, 
    color: "text-primary",
    description: "Bônus de desempenho"
  },
  { 
    label: "Passivo Jurídico Bloqueado", 
    value: "R$ 1.2M", 
    change: "+22%", 
    trend: "up",
    icon: Scale, 
    color: "text-accent",
    description: "Nexo Técnico detectado"
  },
  { 
    label: "Índice de Compliance", 
    value: "98.5%", 
    change: "Estável", 
    trend: "neutral",
    icon: ShieldCheck, 
    color: "text-blue-500",
    description: "Eventos eSocial (S-2240)"
  },
]

const fapTrendData = [
  { name: "2021", fap: 1.10, economia: 75000 },
  { name: "2022", fap: 0.95, economia: 120000 },
  { name: "2023", fap: 0.82, economia: 180000 },
  { name: "2024", fap: 0.74, economia: 245000 },
]

export default function CFODashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">Dashboard CFO</h1>
          <p className="text-muted-foreground text-lg">Inteligência Financeira e Gestão de Riscos Estratégicos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="size-4" /> Relatório Executivo
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2">
            <Calculator className="size-4" /> Simular RAT/FAP
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.label} className="card-shadow border-none overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full ${metric.color.replace('text', 'bg')}`} />
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                  <h3 className="text-2xl font-bold tracking-tighter">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/5 transition-colors ${metric.color}`}>
                  <metric.icon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={metric.trend === 'down' ? 'secondary' : 'outline'} className="font-bold text-[10px]">
                  {metric.change}
                </Badge>
                <span className="text-[10px] text-muted-foreground leading-none">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-headline font-bold">Projeção FAP & Economia RAT</CardTitle>
                <CardDescription>Retorno financeiro por redução de acidentalidade e gestão de nexo.</CardDescription>
              </div>
              <TrendingDown className="size-8 text-green-500 opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fapTrendData}>
                  <defs>
                    <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00356B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#00356B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="economia" 
                    stroke="#00356B" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEconomia)" 
                    name="Economia Gerada (R$)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fap" 
                    stroke="#F77F00" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: "#F77F00", strokeWidth: 2, stroke: "#fff" }}
                    name="Fator FAP"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <ArrowUpRight className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">ROI Sentinel AI</p>
                  <p className="text-xs text-muted-foreground">Previsão de redução tributária 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">R$ 245.000,00</p>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Salvaguarda Direta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="size-5 text-accent" /> Calculadora de ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Passivo Jurídico Evitado</span>
                  <span className="font-bold">R$ 320k</span>
                </div>
                <Progress value={92} className="h-1.5 bg-white/20" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Redução de FAP (Tax)</span>
                  <span className="font-bold">R$ 84k</span>
                </div>
                <Progress value={85} className="h-1.5 bg-white/20" />
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60 mb-1 tracking-widest uppercase">ECONOMIA NO TRIMESTRE</p>
                <h2 className="text-4xl font-bold tracking-tighter">R$ 404k</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader>
              <CardTitle className="text-lg">Radar de Riscos eSocial</CardTitle>
              <CardDescription>Gaps de conformidade detectados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="size-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-900 leading-tight">12 Riscos sem ASO</p>
                  <p className="text-[10px] text-red-700">Multa potencial eSocial: R$ 48.000</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <AlertCircle className="size-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-orange-900 leading-tight">5 NTEP não contestados</p>
                  <p className="text-[10px] text-orange-700">Risco de aumento de FAP para 2025.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
