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
  Briefcase,
  Brain,
  Zap,
  HelpCircle,
  Gavel
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { generateNaiQuote, type OrcamentoOutput } from "@/ai/flows/nai-quote-flow"

export default function QuoteSimulator() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState("ai")
  const [selectedServices, setSelectedServices] = React.useState<Record<string, number>>({})
  const [isSaving, setIsSaving] = React.useState(false)
  
  // Estados para o Agente AI
  const [aiLoading, setAiLoading] = React.useState(false)
  const [aiResult, setAiResult] = React.useState<OrcamentoOutput | null>(null)
  const [aiForm, setAiForm] = React.useState({
    nomeEmpresa: "",
    funcionarios: 10,
    grauDeRisco: 3,
    necessidades: ""
  })

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

  const totalItems = Object.keys(selectedServices).length

  async function handleCallNai() {
    if (!aiForm.nomeEmpresa || !aiForm.necessidades) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Informe o nome da empresa e o que ela precisa." })
      return
    }
    setAiLoading(true)
    setAiResult(null)
    try {
      const result = await generateNaiQuote({
        nomeEmpresa: aiForm.nomeEmpresa,
        quantidadeFuncionarios: Number(aiForm.funcionarios),
        grauDeRisco: Number(aiForm.grauDeRisco),
        necessidades: aiForm.necessidades
      })
      setAiResult(result)
      toast({ title: "Análise Concluída", description: "A NAI montou sua recomendação técnica." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na NAI", description: "Não consegui processar o orçamento agora." })
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSaveProposal(source: 'manual' | 'ai') {
    if (!db || !profile) return
    
    setIsSaving(true)
    try {
      const proposalData = {
        userId: user?.uid,
        userName: profile.name,
        companyId: profile.companyId || "LEAD_EXTERNO",
        source,
        data: source === 'manual' ? selectedServices : aiResult,
        totalValue: source === 'manual' ? totalValueManual : (aiResult?.valorTotalAvulso || 0),
        status: "PENDENTE",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      }

      const colRef = collection(db, "companies", profile.companyId || "leads", "proposals")
      await addDocumentNonBlocking(colRef, proposalData)

      toast({
        title: "Proposta Enviada!",
        description: "Seu orçamento foi registrado no sistema comercial."
      })
      if (source === 'manual') setSelectedServices({})
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
            <Sparkles className="size-3 text-accent" /> Escolha entre orçamentação manual ou consultoria por IA.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4 flex items-center">
            TABELA 2026 ATIVA
          </Badge>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-2 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="ai" className="rounded-lg gap-2 text-xs font-bold">
            <Brain className="size-4" /> Consultoria NAI (IA)
          </TabsTrigger>
          <TabsTrigger value="manual" className="rounded-lg gap-2 text-xs font-bold">
            <Calculator className="size-4" /> Simulador Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-8">
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
                          {totalValueManual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </h2>
                        <p className="text-[8px] font-bold text-white/20 uppercase mt-1">SST 2026 Compliance Ready</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleSaveProposal('manual')}
                      disabled={totalItems === 0 || isSaving}
                      className="w-full h-16 bg-accent text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl hover:opacity-90 transition-all gap-3"
                    >
                      {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5" />}
                      Gerar Proposta PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Brain className="size-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline font-black uppercase tracking-tight">Consultoria NAI</CardTitle>
                    <CardDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">A IA monta o orçamento estratégico para você.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome da Unidade/Empresa</label>
                    <Input 
                      value={aiForm.nomeEmpresa}
                      onChange={e => setAiForm({...aiForm, nomeEmpresa: e.target.value})}
                      className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase shadow-inner" 
                      placeholder="Ex: Padaria do João"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Qtd. Funcionários</label>
                    <Input 
                      type="number"
                      value={aiForm.funcionarios}
                      onChange={e => setAiForm({...aiForm, funcionarios: Number(e.target.value)})}
                      className="h-12 bg-slate-50 border-none rounded-xl font-bold shadow-inner" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Grau de Risco (CNAE)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(risk => (
                      <button
                        key={risk}
                        onClick={() => setAiForm({...aiForm, grauDeRisco: risk})}
                        className={cn(
                          "flex-1 h-12 rounded-xl font-black text-xs transition-all",
                          aiForm.grauDeRisco === risk 
                            ? "bg-primary text-white shadow-lg scale-105" 
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        Risco {risk}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">O que você precisa?</label>
                  <Textarea 
                    value={aiForm.necessidades}
                    onChange={e => setAiForm({...aiForm, necessidades: e.target.value})}
                    placeholder="Ex: Preciso de tudo para estar em dia com o eSocial. Temos muito ruído no local."
                    className="min-h-[120px] bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus-visible:ring-primary/10 shadow-inner"
                  />
                </div>

                <Button 
                  onClick={handleCallNai}
                  disabled={aiLoading}
                  className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                >
                  {aiLoading ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5 text-accent" />}
                  Solicitar Análise Inteligente
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {aiResult ? (
                <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden animate-in slide-in-from-right-4">
                  <CardHeader className="bg-accent/10 border-b pb-6">
                    <CardTitle className="text-sm font-black text-primary uppercase flex items-center gap-2">
                      <Sparkles className="size-4 text-accent" /> Diagnóstico NAI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs italic text-primary/80 leading-relaxed font-medium">"{aiResult.mensagemIntrodutoria}"</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Serviços Recomendados:</p>
                      {aiResult.servicosRecomendados.map((svc, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-black text-primary uppercase">{svc.nomeServico}</span>
                            <span className="text-xs font-bold text-accent">{svc.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            <Gavel className="size-2.5" /> {svc.justificativaLegal}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-400">Total Investimento:</span>
                        <span className="text-2xl font-black text-primary">
                          {aiResult.valorTotalAvulso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                        <HelpCircle className="size-5 text-blue-600 shrink-0" />
                        <p className="text-[10px] text-blue-800 font-bold leading-relaxed italic">"Dica NAI: {aiResult.dicaDaNai}"</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleSaveProposal('ai')}
                      disabled={isSaving}
                      className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] rounded-xl shadow-lg"
                    >
                      {isSaving ? <Loader2 className="size-4 animate-spin" /> : "Confirmar Proposta NAI"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20 p-20 border-2 border-dashed rounded-[3rem]">
                  <Brain className="size-24 text-primary" />
                  <div>
                    <p className="text-xl font-black uppercase text-primary tracking-widest">Aguardando Análise</p>
                    <p className="text-sm">Preencha os dados ao lado para a NAI trabalhar.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
