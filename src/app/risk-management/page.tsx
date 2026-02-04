
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
  Trash2,
  HardHat,
  ChevronRight
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
          <h1 className="text-3xl font-headline font-black text-[#090e24] tracking-tight uppercase">Segurança Ocupacional (PGR)</h1>
          <p className="text-muted-foreground">Mapeamento de perigos, inspeções e controles operacionais.</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-shadow border-none overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-[#090e24]">Inventário de Riscos (NR-01)</CardTitle>
              <CardDescription>Riscos mapeados para o eSocial (S-2240) em 2026.</CardDescription>
            </div>
            <Dialog open={isAddingRisk} onOpenChange={setIsAddingRisk}>
              <DialogTrigger asChild>
                <Button className="bg-[#090e24] h-10 px-4 font-bold gap-2" disabled={selectedCompanyId === "all"}>
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
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold">Setor / GES</TableHead>
                  <TableHead className="font-bold">Agente</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="text-right font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRisks ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 opacity-50 italic">Carregando...</TableCell>
                  </TableRow>
                ) : firestoreRisks && firestoreRisks.length > 0 ? firestoreRisks.map((risk) => (
                  <TableRow key={risk.id} className="hover:bg-gray-50 transition-colors group">
                    <TableCell>
                      <div>
                        <p className="font-bold text-[#090e24]">{risk.environment}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black">{risk.role}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium text-[#090e24]">{risk.hazard}</p>
                      <p className="text-[9px] text-muted-foreground">{risk.recommendation}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "border-none text-white text-[10px] font-black px-2 py-0.5",
                        risk.level?.includes('Crítico') ? 'bg-red-600' : 'bg-emerald-600'
                      )}>
                        {risk.level?.includes('Crítico') ? 'CRÍTICO' : 'CONTROLADO'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="text-[#090e24]" onClick={() => generatePlan(risk)}>
                          <Zap className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-400" onClick={() => handleDeleteRisk(risk.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-32 opacity-40">
                      <ShieldAlert className="size-12 mx-auto mb-4 text-[#090e24]" />
                      <p className="font-bold uppercase tracking-widest text-xs">Inventário Vazio</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-sm font-black text-primary uppercase tracking-widest">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/ppe-kiosk" className="p-4 border rounded-2xl flex flex-col items-center gap-3 hover:bg-blue-50 transition-all group">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <HardHat size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-center leading-tight">Entrega de EPI</span>
                </Link>
                <Link href="/checklists" className="p-4 border rounded-2xl flex flex-col items-center gap-3 hover:bg-amber-50 transition-all group">
                  <div className="p-3 bg-amber-100 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-center leading-tight">Novo Checklist</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-[#090e24] text-white">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-[#f59e0b]">Status da Unidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-60">PGR Vigente</span>
                <Badge className="bg-emerald-600 text-white">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-60">Última Inspeção</span>
                <span className="text-xs font-bold">12/05/2025</span>
              </div>
              <Button className="w-full bg-[#f59e0b] text-[#090e24] font-black uppercase text-[10px] tracking-widest h-10">
                Emitir Relatório PGR <ChevronRight className="size-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {(selectedRisk || isGenerating) && (
        <Card className="border-none bg-[#090e24] text-white overflow-hidden shadow-2xl mt-8 animate-in slide-in-from-bottom-4">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f59e0b]/20 rounded-2xl">
                <Zap className="size-6 text-[#f59e0b]" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Consultoria NAI - Mitigação</CardTitle>
                <CardDescription className="text-white/60 font-medium">Análise avançada para: {selectedRisk?.hazard}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-10 animate-spin text-[#f59e0b]" />
                <p className="text-sm font-black uppercase tracking-widest text-[#f59e0b]/80">Aguardando recomendações da IA...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 whitespace-pre-wrap leading-relaxed text-sm font-body shadow-inner">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSelectedRisk(null)}>Fechar</Button>
                  <Button variant="secondary" className="gap-2 font-bold px-8">
                    <CheckCircle2 className="size-4" /> Validar Ação
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
