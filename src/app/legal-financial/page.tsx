
"use client"

import * as React from "react"
import { Scale, Calculator, TrendingDown, Landmark, FileText, Loader2, Gavel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

export default function LegalFinancial() {
  const { user } = useUser()
  const db = useFirestore()
  const [fapValue, setFapValue] = React.useState([0.74])
  const [payroll, setPayroll] = React.useState(150000)

  // Busca perícias reais do Firestore
  const expertisesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "clients", user.uid, "legalExpertises"),
      orderBy("date", "desc")
    )
  }, [db, user])

  const { data: expertises, isLoading: loadingExpertises } = useCollection(expertisesQuery)

  const potentialSavings = (payroll * 0.02 * (1 - fapValue[0])).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Jurídico e Financeiro</h1>
          <p className="text-muted-foreground">Monitoramento de RAT/FAP e gestão de perícias judiciais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow border-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="size-5 text-accent" />
              <CardTitle className="text-lg">Calculadora de Economia FAP</CardTitle>
            </div>
            <CardDescription>Simule reduções de impostos baseadas no desempenho de segurança.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium uppercase font-black text-[10px] text-muted-foreground">Folha de Pagamento Estimada (Mensal)</label>
                <span className="text-sm font-bold">R$ {payroll.toLocaleString('pt-BR')}</span>
              </div>
              <Input 
                type="number" 
                value={payroll} 
                onChange={(e) => setPayroll(Number(e.target.value))}
                className="bg-muted border-none h-12 text-lg font-bold"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium uppercase font-black text-[10px] text-muted-foreground">Multiplicador FAP Alvo</label>
                <span className="text-sm font-bold text-primary">{fapValue[0].toFixed(2)}</span>
              </div>
              <Slider 
                value={fapValue} 
                onValueChange={setFapValue} 
                max={2} 
                min={0.5} 
                step={0.01} 
              />
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                <span>Bônus (0.50)</span>
                <span>Malus (2.00)</span>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 flex flex-col items-center gap-2 shadow-inner">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Economia Tributária Anual</p>
              <h2 className="text-4xl font-headline font-bold text-primary">{potentialSavings}</h2>
              <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 uppercase">
                <TrendingDown className="size-3" /> Potencial de Redução Direta
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              <CardTitle className="text-lg font-headline font-bold">Processos e Perícias Ativas</CardTitle>
            </div>
            <CardDescription>Monitoramento centralizado de perícias médicas e técnicas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[10px] text-muted-foreground uppercase font-black">Casos Monitorados</p>
                <p className="text-2xl font-bold text-primary">{expertises?.length || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-[10px] text-green-700 uppercase font-black">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
            </div>

            <div className="space-y-3">
              {loadingExpertises ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Buscando processos...</p>
                </div>
              ) : expertises && expertises.length > 0 ? (
                expertises.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary text-white rounded-lg shadow-sm group-hover:bg-accent transition-colors">
                        <Gavel className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">Proc. {item.caseNumber}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">
                          {item.type} • {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '---'}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={item.status === 'Concluído' ? 'secondary' : 'outline'}
                      className={item.status === 'Agendado' ? 'bg-amber-100 text-amber-700 border-none' : ''}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2 border-2 border-dashed rounded-xl opacity-50">
                   <Landmark className="size-8 mx-auto text-muted-foreground" />
                   <p className="text-xs font-bold uppercase">Nenhuma perícia cadastrada</p>
                   <p className="text-[10px]">Use o Módulo de Importação para carregar dados reais.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t mt-auto">
              <Button className="w-full gap-2 font-bold h-12 shadow-lg shadow-primary/10">
                <FileText className="size-4" /> Gerar Relatório Jurídico
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
