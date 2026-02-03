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
  Zap
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
    color: "text-blue-900",
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
    color: "text-black",
    description: "Nexo Técnico detectado"
  },
  { 
    label: "Índice de Compliance", 
    value: "98.5%", 
    change: "Estável", 
    trend: "neutral",
    icon: ShieldCheck, 
    color: "text-blue-800",
    description: "Eventos eSocial (S-2240)"
  },
]

const fapTrendData = [
  { name: "2021", fap: 1.10, economia: 75000 },
  { name: "2022", fap: 0.95, economia: 120000 },
  { name: "2023", fap: 0.82, economia: 180000 },
  { name: "2024", fap: 0.74, economia: 245000 },
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
          <Button className="bg-black hover:bg-black/90 text-white gap-2 shadow-lg shadow-black/20">
            <Calculator className="size-4" /> Simular RAT/FAP
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.label} className="card-shadow border-none overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-primary`} />
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                  <h3 className="text-3xl font-bold tracking-tighter text-primary">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl bg-muted group-hover:bg-primary/5 transition-colors ${metric.color}`}>
                  <metric.icon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={metric.trend === 'down' ? 'secondary' : 'outline'} className="font-bold text-[10px] py-0 px-2">
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
                <CardTitle className="text-xl font-headline font-bold text-primary">Projeção FAP & Economia RAT</CardTitle>
                <CardDescription>Retorno financeiro por redução de acidentalidade e gestão de nexo.</CardDescription>
              </div>
              <TrendingDown className="size-8 text-black opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
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
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
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
                    stroke="#000000" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: "#000000", strokeWidth: 2, stroke: "#fff" }}
                    name="Fator FAP"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-2xl flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/10 rounded-full">
                  <ArrowUpRight className="size-5 text-black" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">ROI Sentinel AI</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Previsão de redução tributária 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">R$ 245.000,00</p>
                <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-none">Salvaguarda Direta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold text-primary">Radar de Exposição 360º</CardTitle>
              <CardDescription>Distribuição de riscos ativos na planta.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskRadarData}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis dataKey="subject" className="text-[10px] font-bold text-primary" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} className="hidden" />
                  <Radar
                    name="Atual"
                    dataKey="A"
                    stroke="#090e24"
                    fill="#090e24"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Ideal"
                    dataKey="B"
                    stroke="#000000"
                    fill="#000000"
                    fillOpacity={0.3}
                  />
                  <Legend iconType="circle" />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="size-5 text-white" /> Insights de Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <p className="text-[10px] font-black text-white/80 mb-1 uppercase tracking-widest">Alerta Tributário</p>
                <p className="text-xs leading-relaxed">Sua taxa de acidentalidade em 2024 está 12% abaixo da média do CNAE. Potencial bônus FAP de 0,50 para 2025.</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <p className="text-[10px] font-black text-white/80 mb-1 uppercase tracking-widest">Compliance eSocial</p>
                <p className="text-xs leading-relaxed">Todos os eventos S-2240 do mês foram validados pela IA sem inconsistências de EPI.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
