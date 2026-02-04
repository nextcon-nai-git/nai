
"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Building2,
  Loader2,
  CheckCircle2,
  FileText,
  Plus,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { riskMitigationPlanGenerator } from "@/ai/flows/risk-mitigation-plan-generator"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"

export default function RiskInventoryPGR() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  const [selectedRisk, setSelectedRisk] = React.useState<any>(null)
  const [mitigationPlan, setMitigationPlan] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isAddingRisk, setIsAddingRisk] = React.useState(false)

  // Form State para Novo Risco
  const [newRisk, setNewRisk] = React.useState({
    hazard: "",
    role: "",
    environment: "",
    level: "Tolerável (PR4)",
    recommendation: "",
    esocialStatus: "Pendente"
  })

  // Busca Empresas
  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  // Busca Riscos Reais do Firestore
  const risksQuery = useMemoFirebase(() => {
    if (!db || !user || selectedCompanyId === "all") return null
    return query(
      collection(db, "clients", user.uid, "managedCompanies", selectedCompanyId, "risks"),
      orderBy("hazard", "asc")
    )
  }, [db, user, selectedCompanyId])
  const { data: firestoreRisks, isLoading: loadingRisks } = useCollection(risksQuery)

  const handleAddRisk = () => {
    if (!user || !db || selectedCompanyId === "all") {
      toast({ variant: "destructive", title: "Selecione uma Empresa", description: "É necessário filtrar uma empresa para adicionar riscos." })
      return
    }

    const colRef = collection(db, "clients", user.uid, "managedCompanies", selectedCompanyId, "risks")
    addDocumentNonBlocking(colRef, {
      ...newRisk,
      createdAt: new Date().toISOString()
    })

    toast({ title: "Risco Cadastrado", description: "O agente de risco foi adicionado ao inventário PGR." })
    setIsAddingRisk(false)
    setNewRisk({ hazard: "", role: "", environment: "", level: "Tolerável (PR4)", recommendation: "", esocialStatus: "Pendente" })
  }

  const handleDeleteRisk = (riskId: string) => {
    if (!user || !db || selectedCompanyId === "all") return
    const docRef = doc(db, "clients", user.uid, "managedCompanies", selectedCompanyId, "risks", riskId)
    deleteDoc(docRef)
    toast({ title: "Risco Removido" })
  }

  const generatePlan = async (risk: any) => {
    setIsGenerating(true)
    setSelectedRisk(risk)
    setMitigationPlan(null)
    try {
      const result = await riskMitigationPlanGenerator({
        identifiedRisks: `${risk.hazard}. Contexto normativo 2026.`,
        environment: risk.environment
      })
      setMitigationPlan(result.mitigationPlan)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na NAI",
        description: "Não foi possível obter recomendações da IA agora."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-[#090e24] tracking-tight">Inventário de Riscos (PGR)</h1>
          <p className="text-muted-foreground">Mapeamento de perigos, riscos e controles para o eSocial.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="h-11 bg-white border-[#090e24]/20 shadow-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#090e24]" />
                  <SelectValue placeholder="Selecione o Cliente" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Ver Todos (Visão Geral)</SelectItem>
                {companies?.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isAddingRisk} onOpenChange={setIsAddingRisk}>
            <DialogTrigger asChild>
              <Button className="bg-[#090e24] h-11 px-6 font-bold shadow-lg shadow-[#090e24]/20 gap-2" disabled={selectedCompanyId === "all"}>
                <Plus className="size-4" /> Novo Risco
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-white border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">Mapear Novo Risco</DialogTitle>
                <DialogDescription>Insira os detalhes do agente identificado no local de trabalho.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Agente / Perigo</label>
                  <Input value={newRisk.hazard} onChange={e => setNewRisk({...newRisk, hazard: e.target.value})} placeholder="Ex: Ruído Contínuo 85dB" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Setor/Ambiente</label>
                    <Input value={newRisk.environment} onChange={e => setNewRisk({...newRisk, environment: e.target.value})} placeholder="Ex: Produção" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cargo/GES</label>
                    <Input value={newRisk.role} onChange={e => setNewRisk({...newRisk, role: e.target.value})} placeholder="Ex: Operador" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classificação de Risco (PR)</label>
                  <Select value={newRisk.level} onValueChange={v => setNewRisk({...newRisk, level: v})}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Crítico (PR1)">Crítico (PR1)</SelectItem>
                      <SelectItem value="Alto (PR2)">Alto (PR2)</SelectItem>
                      <SelectItem value="Médio (PR3)">Médio (PR3)</SelectItem>
                      <SelectItem value="Tolerável (PR4)">Tolerável (PR4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recomendação / Controle</label>
                  <Input value={newRisk.recommendation} onChange={e => setNewRisk({...newRisk, recommendation: e.target.value})} placeholder="Ex: Uso de protetor auricular" />
                </div>
                <Button className="w-full bg-[#090e24] h-14 font-black uppercase tracking-widest mt-4" onClick={handleAddRisk}>Salvar no Inventário</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="card-shadow border-none overflow-hidden bg-white">
        <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-[#090e24]">Inventário por Setor / GES</CardTitle>
            <CardDescription>Riscos mapeados para o eSocial (S-2240) em 2026.</CardDescription>
          </div>
          <Badge className="bg-emerald-600 text-white border-none gap-1">
            <ShieldCheck className="size-3" /> {firestoreRisks?.length || 0} Registros Reais
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold">Setor / GES</TableHead>
                <TableHead className="font-bold">Agente de Risco</TableHead>
                <TableHead className="font-bold text-center">Nível (PR)</TableHead>
                <TableHead className="font-bold">Controle eSocial</TableHead>
                <TableHead className="text-right font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRisks ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 opacity-50 italic">Carregando inventário...</TableCell>
                </TableRow>
              ) : firestoreRisks && firestoreRisks.length > 0 ? firestoreRisks.map((risk) => (
                <TableRow key={risk.id} className="hover:bg-gray-50 transition-colors group">
                  <TableCell>
                    <div>
                      <p className="font-bold text-[#090e24]">{risk.environment}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{risk.role}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="text-xs font-medium">{risk.hazard}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "border-none text-white text-[10px] font-black",
                      risk.level?.includes('Crítico') ? 'bg-red-600' : 'bg-emerald-600'
                    )}>
                      {risk.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] leading-tight text-muted-foreground">{risk.recommendation}</p>
                      <Badge variant="outline" className="w-fit text-[8px] py-0 px-1.5 text-emerald-600 border-emerald-200">
                        {risk.esocialStatus || 'S-2240 Validado'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-[#090e24] hover:bg-[#090e24] hover:text-white transition-all"
                        onClick={() => generatePlan(risk)}
                        title="NAI Consultoria"
                      >
                        <Zap className="size-4 fill-current" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-400 hover:bg-red-50"
                        onClick={() => handleDeleteRisk(risk.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 opacity-40">
                    <ShieldAlert className="size-12 mx-auto mb-4 text-[#090e24]" />
                    <p className="font-bold uppercase tracking-widest text-xs">Inventário Vazio</p>
                    <p className="text-[10px] mt-1">Selecione uma empresa e adicione riscos para começar.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(selectedRisk || isGenerating) && (
        <Card className="border-none bg-[#090e24] text-white overflow-hidden shadow-2xl mt-8 animate-in slide-in-from-bottom-4">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f59e0b]/20 rounded-2xl">
                <Zap className="size-6 text-[#f59e0b]" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Refinamento Inteligente NAI</CardTitle>
                <CardDescription className="text-white/60 font-medium">Mitigação avançada para: {selectedRisk?.environment}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-10 animate-spin text-[#f59e0b]" />
                <p className="text-sm font-black uppercase tracking-widest text-[#f59e0b]/80">Consultando Base de Conhecimento...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 whitespace-pre-wrap leading-relaxed text-sm font-body shadow-inner">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSelectedRisk(null)}>Fechar</Button>
                  <Button variant="secondary" className="gap-2 font-bold px-8 shadow-xl shadow-black/40">
                    <CheckCircle2 className="size-4" /> Validar PGR
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
