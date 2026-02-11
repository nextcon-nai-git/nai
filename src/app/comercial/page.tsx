"use client"

import * as React from "react"
import { 
  Calculator, 
  ShoppingCart, 
  Plus, 
  Minus, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  Briefcase,
  Brain,
  Zap,
  HelpCircle,
  Gavel
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { SST_CATALOG } from "@/lib/services-data"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { NaiQuoteComponent } from "@/components/commercial/nai-quote-component"

export default function QuoteSimulator() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState("ai")
  const [selectedServices, setSelectedServices] = React.useState<Record<string, number>>({})
  const [isSaving, setIsSaving] = React.useState(false)

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const handleUpdateQty = (serviceId: string, delta: number) => {
    setSelectedServices(prev => {
      const current = prev[serviceId] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const { [serviceId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [serviceId]: next }
    })
  }

  const totalValueManual = React.useMemo(() => {
    let total = 0
    SST_CATALOG.forEach(cat => {
      cat.services.forEach(svc => {
        if (selectedServices[svc.id]) {
          total += svc.basePrice * selectedServices[svc.id]
        }
      })
    })
    return total
  }, [selectedServices])

  async function handleSaveManualProposal() {
    if (!db || !profile) return
    setIsSaving(true)
    try {
      const proposalData = {
        userId: user?.uid,
        userName: profile.name,
        companyId: profile.companyId || "LEAD_EXTERNO",
        source: 'manual',
        data: selectedServices,
        totalValue: totalValueManual,
        status: "PENDENTE",
        createdAt: new Date().toISOString()
      }
      const colRef = collection(db, "companies", profile.companyId || "leads", "proposals")
      await addDocumentNonBlocking(colRef, proposalData)
      toast({ title: "Proposta Salva!", description: "Seu orçamento manual foi registrado no sistema." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Portal Comercial NAI</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
            <Sparkles className="size-3 text-accent" /> Inteligência Comercial e Simulação de Investimento SST.
          </p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4">TABELA 2026 ATIVA</Badge>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-2 bg-muted/50 p-1.5 rounded-2xl h-16">
          <TabsTrigger value="ai" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Brain className="size-4" /> Consultoria NAI (IA)
          </TabsTrigger>
          <TabsTrigger value="manual" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Calculator className="size-4" /> Simulador Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-primary/5 border-b pb-6 p-8">
                  <CardTitle className="text-lg font-black text-primary uppercase">Catálogo de Serviços</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Selecione os itens para compor sua proposta técnica.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Accordion type="multiple" className="w-full">
                    {SST_CATALOG.map((category) => (
                      <AccordionItem key={category.id} value={category.id} className="border-b last:border-none">
                        <AccordionTrigger className="hover:no-underline py-6">
                          <div className="flex items-center gap-4 text-left">
                            <div className="p-3 bg-slate-50 rounded-2xl text-primary"><Briefcase className="size-5" /></div>
                            <div>
                              <h3 className="font-black text-primary uppercase text-sm">{category.title}</h3>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">Clique para expandir</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                          <div className="space-y-3 px-2">
                            {category.services.map((svc) => (
                              <div key={svc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                <div className="flex-1 min-w-0 mr-4">
                                  <p className="font-black text-xs text-primary uppercase leading-tight">{svc.name}</p>
                                  <p className="text-[9px] font-black text-accent mt-1 uppercase">
                                    {svc.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {svc.unit}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border">
                                  <button onClick={() => handleUpdateQty(svc.id, -1)} className="size-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400"><Minus className="size-4" /></button>
                                  <span className="text-sm font-black w-8 text-center text-primary">{selectedServices[svc.id] || 0}</span>
                                  <button onClick={() => handleUpdateQty(svc.id, 1)} className="size-8 rounded-lg bg-primary text-white flex items-center justify-center transition-transform active:scale-95"><Plus className="size-4" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] sticky top-24 overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6 p-8">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                    <ShoppingCart className="size-4" /> Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-end mb-6">
                    <p className="text-[10px] font-black uppercase text-white/40">Investimento Total:</p>
                    <h2 className="text-3xl font-black text-accent font-headline">{totalValueManual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                  </div>
                  <Button onClick={handleSaveManualProposal} disabled={totalValueManual === 0 || isSaving} className="w-full h-16 bg-accent text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl gap-3">
                    {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5" />}
                    Salvar Orçamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-8">
          <NaiQuoteComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
