
"use client"

import * as React from "react"
import { Scale, Calculator, TrendingDown, Landmark, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function LegalFinancial() {
  const [fapValue, setFapValue] = React.useState([0.5])
  const [payroll, setPayroll] = React.useState(100000)

  const potentialSavings = (payroll * 0.02 * (1 - fapValue[0])).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Jurídico e Financeiro</h1>
          <p className="text-muted-foreground">Monitore taxas de RAT/FAP e passivos trabalhistas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow border-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="size-5 text-accent" />
              <CardTitle className="text-lg">Calculadora de Economia FAP</CardTitle>
            </div>
            <CardDescription>Simule reduções de impostos baseadas no desempenho de segurança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Folha de Pagamento Estimada (Mensal)</label>
                <span className="text-sm font-bold">R$ {payroll.toLocaleString('pt-BR')}</span>
              </div>
              <Input 
                type="number" 
                value={payroll} 
                onChange={(e) => setPayroll(Number(e.target.value))}
                className="bg-muted"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Multiplicador FAP Alvo</label>
                <span className="text-sm font-bold">{fapValue[0].toFixed(2)}</span>
              </div>
              <Slider 
                value={fapValue} 
                onValueChange={setFapValue} 
                max={2} 
                min={0.5} 
                step={0.01} 
              />
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                <span>Bônus (0.50)</span>
                <span>Malus (2.00)</span>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border-2 border-primary/10 flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground font-medium">Economia Tributária Anual Estimada</p>
              <h2 className="text-4xl font-headline font-bold text-primary">{potentialSavings}</h2>
              <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                <TrendingDown className="size-3" /> Potencial de 50% de Redução
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              <CardTitle className="text-lg">Processos Jurídicos e Perícias</CardTitle>
            </div>
            <Description>Status de processos por doenças ocupacionais e acidentes</Description>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase font-bold">Processos Ativos</p>
                <p className="text-2xl font-bold">14</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase font-bold">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { case: "Processo #4829 - Nível de Ruído", status: "Em curso", date: "20 Mai, 2024", type: "Audiência" },
                { case: "Processo #5102 - L.E.R.", status: "Vencido", date: "12 Abr, 2024", type: "Perícia" },
                { case: "Processo #5581 - Exposição a Poeira", status: "Agendado", date: "05 Jun, 2024", type: "Perícia" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Landmark className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.case}</p>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.date}</p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'Vencido' ? 'secondary' : 'outline'}>{item.status}</Badge>
                </div>
              ))}
            </div>

            <Button className="w-full gap-2">
              <FileText className="size-4" /> Exportar Relatório Jurídico
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Description({children}: {children: React.ReactNode}) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}
