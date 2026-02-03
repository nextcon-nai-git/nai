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
  AlertCircle,
  Zap,
  TrendingUp,
  Award
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Legend
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
    color: "bg-blue-600/10 text-blue-600",
    description: "Multas e tributos evitados"
  },
  { 
    label: "Fator FAP Atual", 
    value: "0,74", 
    change: "-0.05", 
    trend: "down",
    icon: TrendingDown, 
    color: "bg-emerald-600/10 text-emerald-600",
    description: "Bônus de desempenho"
  },
  { 
    label: "Passivo Jurídico Bloqueado", 
    value: "R$ 1.2M", 
    change: "+22%", 
    trend: "up",
    icon: Scale, 
    color: "bg-amber-600/10 text-amber-600",
    description: "Nexo Técnico detectado"
  },
  { 
    label: "Índice de Compliance", 
    value: "98.5%", 
    change: "Estável", 
    trend: "neutral",
    icon: ShieldCheck, 
    color: "bg-indigo-600/10 text-indigo-600",
    description: "Eventos eSocial 2026"
  },
]

const fapTrendData = [
  { name: "2023", fap: 0.82, economia: 180000 },
  { name: "2024", fap: 0.74, economia: 245000 },
  { name: "2025", fap: 0.68, economia: 310000 },
  { name: "2026", fap: 0.62, economia: 452800 },
]

const riskRadarData = [
  { subject: 'Físico', A: 120, B: 110, fullMark: 150 },
  { subject: 'Químico', A: 98, B: 130, fullMark: 150 },
  { subject: 'Biológico', A: 86, B: 130, fullMark: 150 },
  { subject: 'Ergonômico', A: 99, B: 100, fullMark: 150 },
  { subject: 'Acidente', A: 85, B: 90, fullMark: 150 },
  { subject: 'Psicossocial', A: 65, B: 85, fullMark: 150 },
]

export default function CFODashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-accent text-primary font-black uppercase text-[10px] tracking-widest px-3">Estratégico 2026</Badge>
          </div>
          <h1 className="text-4xl font-headline font-black text-primary tracking-tight">Dashboard CFO</h1>
          <p className="text-muted-foreground font-medium">Inteligência Financeira NAI para tomada de decisão.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary hover:text-white transition-all">
            <BarChart3 className="size-4" /> Exportar Relatório
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-xl shadow-primary/20">
            <Calculator className="size-4" /> Simular RAT/FAP
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.label} className="card-shadow border-none overflow-hidden hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">{metric.label}</p>
                  <h3 className="text-3xl font-bold tracking-tighter text-primary">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${metric.color}`}>
                  <metric.icon className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="font-bold text-[10px] py-0 px-2 bg-muted">
                  {metric.trend === 'up' && <TrendingUp className="size-3 mr-1 text-blue-600" />}
                  {metric.trend === 'down' && <TrendingDown className="size-3 mr-1 text-emerald-600" />}
                  {metric.change}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-medium">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">ROI & Projeção RAT 2026</CardTitle>
              <CardDescription>Impacto financeiro da redução de acidentalidade.</CardDescription>
            </div>
            <Award className="size-8 text-accent opacity-30" />
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fapTrendData}>
                  <defs>
                    <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#090e24" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#090e24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] font-bold" />
                  <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="economia" 
                    stroke="#090e24" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorEconomia)" 
                    name="Economia Gerada (R$)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fap" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                    name="Fator FAP"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 p-6 bg-primary rounded-2xl flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <ArrowUpRight className="size-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Salvaguarda Direta NAI</p>
                  <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Previsão 2026 acumulada</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">R$ 452.800,00</p>
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] leading-none">ROI Estimado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline font-bold text-primary">Mapa de Exposição</CardTitle>
              <CardDescription>Distribuição de riscos ativos.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" className="text-[10px] font-bold text-primary" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} className="hidden" />
                  <Radar
                    name="Status Atual"
                    dataKey="A"
                    stroke="#090e24"
                    fill="#090e24"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Nível Ideal"
                    dataKey="B"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="size-20" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-headline">
                <Zap className="size-5 text-accent" /> Insights NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <p className="text-[10px] font-black text-accent mb-2 uppercase tracking-widest">Alerta eSocial 2026</p>
                <p className="text-xs leading-relaxed text-white/80">Sua taxa de acidentalidade está 15% abaixo da média do setor. Manter este ritmo garante bônus FAP de 0,50.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <p className="text-[10px] font-black text-white/60 mb-2 uppercase tracking-widest">Previsão Jurídica</p>
                <p className="text-xs leading-relaxed text-white/80">A NAI bloqueou potenciais R$ 1.2M em nexos técnicos automáticos através de defesas fundamentadas.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}