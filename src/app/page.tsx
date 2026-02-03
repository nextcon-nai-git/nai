
"use client"

import * as React from "react"
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle,
  Scale,
  Calculator,
  ArrowUpRight,
  BarChart3
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
    label: "ROI Total Acumulado", 
    value: "R$ 452.800", 
    change: "+15%", 
    trend: "up",
    icon: DollarSign, 
    color: "text-green-500",
    description: "Economia em multas e tributos"
  },
  { 
    label: "Fator FAP Atual", 
    value: "0,74", 
    change: "-0.05", 
    trend: "down",
    icon: TrendingDown, 
    color: "text-primary",
    description: "Multiplicador de bonificação"
  },
  { 
    label: "Passivo Jurídico Evitado", 
    value: "R$ 1.2M", 
    change: "+22%", 
    trend: "up",
    icon: Scale, 
    color: "text-accent",
    description: "Bloqueio de Nexo Técnico"
  },
  { 
    label: "Compliance eSocial", 
    value: "98.5%", 
    change: "Estável", 
    trend: "neutral",
    icon: ShieldCheck, 
    color: "text-blue-500",
    description: "Eventos S-2240 e S-2220"
  },
]

const fapTrendData = [
  { name: "2020", fap: 1.20, economia: 50000 },
  { name: "2021", fap: 1.10, economia: 75000 },
  { name: "2022", fap: 0.95, economia: 120000 },
  { name: "2023", fap: 0.82, economia: 180000 },
  { name: "2024", fap: 0.74, economia: 245000 },
]

const sectorRiskData = [
  { sector: "Produção", stress: 45, absenteeism: 12 },
  { sector: "Logística", stress: 68, absenteeism: 25 },
  { sector: "Vendas", stress: 82, absenteeism: 18 },
  { sector: "Adm", stress: 30, absenteeism: 5 },
]

export default function CFODashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Estratégico */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">Dashboard CFO</h1>
          <p className="text-muted-foreground text-lg">Inteligência Financeira e Gestão de Riscos Estratégicos - Nextcon</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="size-4" /> Relatório Executivo
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2">
            <Calculator className="size-4" /> Simular Novo FAP
          </Button>
        </div>
      </div>

      {/* Cards de Métricas de Alto Impacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.label} className="card-shadow border-none overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full ${metric.color.replace('text', 'bg')}`} />
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                  <h3 className="text-3xl font-bold tracking-tighter">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/5 transition-colors ${metric.color}`}>
                  <metric.icon className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={metric.trend === 'down' ? 'secondary' : 'outline'} className="font-bold">
                  {metric.change}
                </Badge>
                <span className="text-[10px] text-muted-foreground leading-none">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Projeção FAP */}
        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-headline">Projeção e Performance FAP</CardTitle>
                <CardDescription>Redução progressiva da alíquota RAT através de gestão preventiva</CardDescription>
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
                    name="Índice FAP"
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
                  <p className="text-sm font-bold">ROI Estimado 2024</p>
                  <p className="text-xs text-muted-foreground">Baseado em redução de acidentalidade</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">R$ 245.000,00</p>
                <p className="text-[10px] font-bold text-green-600 uppercase">Economia Direta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculator & Termômetro Psicossocial */}
        <div className="space-y-8">
          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="size-5" /> ROI Sentinel AI
              </CardTitle>
              <CardDescription className="text-white/70">Cálculo de economia preditiva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Multas Evitadas (Audit)</span>
                  <span className="font-bold">R$ 84k</span>
                </div>
                <Progress value={85} className="h-1.5 bg-white/20" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Claims Jurídicos Bloqueados</span>
                  <span className="font-bold">R$ 320k</span>
                </div>
                <Progress value={92} className="h-1.5 bg-white/20" />
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60 mb-1">TOTAL SALVO NO TRIMESTRE</p>
                <h2 className="text-4xl font-bold tracking-tighter">R$ 404k</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader>
              <CardTitle className="text-lg">Radar de Risco Oculto</CardTitle>
              <CardDescription>Correlação Stress x Absenteísmo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorRiskData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="sector" type="category" axisLine={false} tickLine={false} width={80} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="stress" name="Nível de Stress" fill="#F77F00" radius={[0, 4, 4, 0]} barSize={12} />
                    <Bar dataKey="absenteeism" name="Absenteísmo" fill="#00356B" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-900 leading-tight">
                  <span className="font-bold">Alerta:</span> O setor de <span className="font-bold">Vendas</span> apresenta stress {'>'}80%. Risco de Burnout identificado no PGR.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
