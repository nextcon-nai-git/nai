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
  
  const [aiLoading, setAiLoading] = React.useState(false)
  const [aiResult, setAiResult] = React.useState<OrcamentoOutput | null>(null)
  const [aiForm, setAiForm] = React.useState({
    nomeEmpresa: "",
    funcionarios: "",
    grauDeRisco: "1",
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
        createdAt: new Date().toISOString()
      }
      const colRef = collection(db, "companies", profile.companyId || "leads", "proposals")
      await addDocumentNonBlocking(colRef, proposalData)
      toast({ title: "Proposta Salva!", description: "Seu orçamento foi registrado no sistema." })
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
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none text-blue-900">Portal Comercial NAI</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
            <Sparkles className="size-3 text-accent" /> Automação de Propostas Técnicas e Comerciais.
          </p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4">TABELA 2026 ATIVA</Badge>
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
                </CardHeader>
                <CardContent className="p-6">
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
                <CardHeader className="border-b border-white/5 pb-6">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                    <ShoppingCart className="size-4" /> Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-end mb-6">
                    <p className="text-[10px] font-black uppercase text-white/40">Investimento Total:</p>
                    <h2 className="text-3xl font-black text-accent">{totalValueManual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                  </div>
                  <Button onClick={() => handleSaveProposal('manual')} disabled={totalValueManual === 0 || isSaving} className="w-full h-16 bg-accent text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl gap-3">
                    {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5" />}
                    Salvar Orçamento
                  </Button>
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
                  <div className="p-3 bg-white/10 rounded-2xl"><Brain className="size-8 text-accent" /></div>
                  <CardTitle className="text-xl font-headline font-black uppercase">Gerador de Orçamentos NAI</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Nome da Empresa</label>
                    <Input value={aiForm.nomeEmpresa} onChange={e => setAiForm({...aiForm, nomeEmpresa: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" placeholder="Ex: Construtora Alfa" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Qtd. Funcionários</label>
                    <Input type="number" value={aiForm.funcionarios} onChange={e => setAiForm({...aiForm, funcionarios: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Grau de Risco (CNAE)</label>
                  <select value={aiForm.grauDeRisco} onChange={e => setAiForm({...aiForm, grauDeRisco: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold">
                    <option value="1">1 - Baixo (Escritórios)</option>
                    <option value="2">2 - Médio (Comércio/Serviços)</option>
                    <option value="3">3 - Alto (Indústria Leve/Hospitais)</option>
                    <option value="4">4 - Muito Alto (Construção/Mineração)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">O que eles precisam?</label>
                  <Textarea value={aiForm.necessidades} onChange={e => setAiForm({...aiForm, necessidades: e.target.value})} placeholder="Ex: Abrimos uma filial e precisamos regularizar a documentação dos pedreiros..." className="min-h-[120px] bg-slate-50 border-none rounded-2xl p-4" />
                </div>
                <Button onClick={handleCallNai} disabled={aiLoading} className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                  {aiLoading ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5 text-accent" />}
                  {aiLoading ? "A NAI está calculando..." : "Gerar Orçamento IA"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {aiResult ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <Card className="card-shadow border-none bg-blue-50/50 rounded-[2rem] p-6 border-2 border-blue-100">
                    <p className="text-sm italic text-blue-900 font-medium">"{aiResult.mensagemIntrodutoria}"</p>
                  </Card>
                  <div className="space-y-4">
                    {aiResult.servicosRecomendados.map((svc, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 mb-1">{svc.categoria}</Badge>
                          <h4 className="font-bold text-primary">{svc.nomeServico}</h4>
                          <p className="text-[10px] text-muted-foreground italic mt-1">{svc.justificativaLegal}</p>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border font-black text-primary">
                          {svc.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl border text-center">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Total Avulso</p>
                      <p className="text-2xl font-black text-primary">{aiResult.valorTotalAvulso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                    {aiResult.valorTotalMensal && (
                      <div className="bg-primary p-6 rounded-2xl text-center text-white">
                        <p className="text-[9px] font-black uppercase opacity-50 mb-1">Gestão Mensal</p>
                        <p className="text-2xl font-black text-accent">{aiResult.valorTotalMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex gap-3">
                    <HelpCircle className="size-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-800 font-medium"><strong>Dica NAI:</strong> {aiResult.dicaDaNai}</p>
                  </div>
                  <Button onClick={() => handleSaveProposal('ai')} disabled={isSaving} className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] rounded-xl shadow-lg">Confirmar Proposta NAI</Button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20 p-20 border-2 border-dashed rounded-[3rem]">
                  <Brain className="size-24 text-primary" />
                  <p className="text-sm font-bold uppercase">Aguardando Dados para Análise</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}