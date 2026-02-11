
"use client"

import * as React from "react"
import { 
  Calculator, 
  ShoppingCart, 
  ChevronRight, 
  Plus, 
  Minus, 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  Building2,
  DollarSign,
  Briefcase
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc, collection, addDoc } from "firebase/firestore"
import { SST_CATALOG, SSTService } from "@/lib/services-data"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function QuoteSimulator() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
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

  const totalValue = React.useMemo(() => {
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

  const totalItems = Object.keys(selectedServices).length

  async function handleSaveProposal() {
    if (totalItems === 0 || !db || !profile) return
    
    setIsSaving(true)
    try {
      const proposalData = {
        userId: user?.uid,
        userName: profile.name,
        companyId: profile.companyId || "LEAD_EXTERNO",
        services: selectedServices,
        totalValue,
        status: "PENDENTE",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 dias
      }

      const colRef = collection(db, "companies", profile.companyId || "leads", "proposals")
      await addDocumentNonBlocking(colRef, proposalData)

      toast({
        title: "Proposta Enviada!",
        description: "Seu orçamento foi registrado. Nosso time entrará em contato."
      })
      setSelectedServices({})
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
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Simulador Comercial NAI</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
            <Sparkles className="size-3 text-accent" /> Configure sua solução de SST personalizada em segundos.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4 flex items-center">
            TABELA 2026 ATIVA
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-6">
              <CardTitle className="text-lg font-black text-primary uppercase">Catálogo de Serviços</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Selecione os itens para compor seu plano anual ou laudos avulsos.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="multiple" className="w-full">
                {SST_CATALOG.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className="border-b last:border-none">
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-3 bg-slate-50 rounded-2xl text-primary">
                          <Briefcase className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-primary uppercase text-sm">{category.title}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Serviços Especializados</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-3 px-2">
                        {category.services.map((svc) => (
                          <div key={svc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                            <div className="flex-1 min-w-0 mr-4">
                              <p className="font-black text-xs text-primary uppercase leading-tight">{svc.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{svc.description}</p>
                              <p className="text-[9px] font-black text-accent mt-1 uppercase">
                                {svc.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {svc.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border">
                              <button 
                                onClick={() => handleUpdateQty(svc.id, -1)}
                                className="size-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="text-sm font-black w-8 text-center text-primary">
                                {selectedServices[svc.id] || 0}
                              </span>
                              <button 
                                onClick={() => handleUpdateQty(svc.id, 1)}
                                className="size-8 rounded-lg bg-primary text-white flex items-center justify-center transition-transform active:scale-95"
                              >
                                <Plus className="size-4" />
                              </button>
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
            <div className="absolute top-0 right-0 p-6 opacity-10"><ShoppingCart className="size-32 text-accent" /></div>
            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                <Calculator className="size-4" /> Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                {totalItems > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {SST_CATALOG.flatMap(c => c.services).filter(s => selectedServices[s.id]).map(svc => (
                      <div key={svc.id} className="flex justify-between items-center text-[11px] font-bold border-b border-white/5 pb-2">
                        <div className="flex-1 min-w-0">
                          <p className="uppercase text-white truncate">{svc.name}</p>
                          <p className="text-white/40">{selectedServices[svc.id]}x {svc.unit}</p>
                        </div>
                        <span className="text-accent ml-2">
                          {(svc.basePrice * selectedServices[svc.id]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center opacity-30">
                    <p className="text-xs font-bold uppercase italic">Nenhum serviço selecionado</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-6">
                  <p className="text-[10px] font-black uppercase text-white/40">Investimento Total:</p>
                  <div className="text-right">
                    <h2 className="text-3xl font-black text-accent leading-none">
                      {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h2>
                    <p className="text-[8px] font-bold text-white/20 uppercase mt-1">SST 2026 Compliance Ready</p>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProposal}
                  disabled={totalItems === 0 || isSaving}
                  className="w-full h-16 bg-accent text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl hover:opacity-90 transition-all gap-3"
                >
                  {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5" />}
                  Gerar Proposta NAI
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 p-6 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="size-4 text-accent" />
              </div>
              <p className="text-[9px] text-white/40 leading-relaxed font-medium italic">
                * Valores base sujeitos a análise técnica do grau de risco e CNAE da unidade.
              </p>
            </CardFooter>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2rem] p-8 flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Building2 className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-primary uppercase mb-1">Faturamento Facilitado</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Sua unidade possui contrato global? O faturamento será integrado automaticamente via API Santander/Itaú.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
