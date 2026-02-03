
"use client"

import * as React from "react"
import { 
  Users, 
  AlertTriangle, 
  Calendar, 
  TrendingDown, 
  Leaf, 
  ShieldCheck, 
  Heart 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts"
import { Progress } from "@/components/ui/progress"

const stats = [
  { label: "Colaboradores Ativos", value: "1.248", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Exames Pendentes", value: "42", change: "-5%", icon: Calendar, color: "text-accent" },
  { label: "Docs. Vencendo", value: "8", change: "+2", icon: AlertTriangle, color: "text-red-500" },
  { label: "Taxa de Acidentes", value: "0,12", change: "-18%", icon: TrendingDown, color: "text-green-500" },
]

const chartData = [
  { name: "Jan", acidentes: 4, exames: 120 },
  { name: "Fev", acidentes: 3, exames: 150 },
  { name: "Mar", acidentes: 2, exames: 180 },
  { name: "Abr", acidentes: 5, exames: 130 },
  { name: "Mai", acidentes: 1, exames: 210 },
  { name: "Jun", acidentes: 0, exames: 190 },
]

const esgData = [
  { name: "Ambiental", value: 85, color: "#10b981" },
  { name: "Social", value: 92, color: "#00356B" },
  { name: "Governança", value: 78, color: "#F77F00" },
]

export default function Dashboard() {
  const memoStats = React.useMemo(() => stats, []);
  const memoEsgData = React.useMemo(() => esgData, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary">Visão Geral Operacional</h1>
        <p className="text-muted-foreground">Bem-vindo de volta, aqui está o resumo do dia no SST.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memoStats.map((stat) => (
          <Card key={stat.label} className="card-shadow border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-primary'}`}>
                    {stat.change} <span className="text-muted-foreground">desde o mês passado</span>
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-secondary/20 ${stat.color}`}>
                  <stat.icon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Tendência de Acidentes e Exames</CardTitle>
            <CardDescription>Comparação mensal de desempenho de saúde</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="exames" name="Exames" fill="#00356B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="acidentes" name="Acidentes" fill="#F77F00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Scorecard ESG</CardTitle>
              <CardDescription>Sustentabilidade e Impacto</CardDescription>
            </div>
            <PieChart width={60} height={60}>
              <Pie
                data={[{ value: 100 }]}
                innerRadius={20}
                outerRadius={25}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#f0f0f0" />
              </Pie>
            </PieChart>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-xl">
              <span className="text-4xl font-bold text-primary">85</span>
              <span className="text-sm font-medium text-primary/70">Rating Geral ESG</span>
            </div>
            
            <div className="space-y-4">
              {memoEsgData.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      {item.name === 'Ambiental' && <Leaf className="size-3 text-green-500" />}
                      {item.name === 'Social' && <Heart className="size-3 text-primary" />}
                      {item.name === 'Governança' && <ShieldCheck className="size-3 text-accent" />}
                      {item.name}
                    </span>
                    <span>{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
