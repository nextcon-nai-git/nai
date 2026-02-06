"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Save, 
  Loader2, 
  Search,
  Zap,
  ShieldCheck,
  HardHat,
  Construction,
  Truck,
  Trash2,
  Activity,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  Brain,
  Plus,
  ArrowRight,
  Ban,
  Users,
  HeartPulse,
  Building2,
  Biohazard,
  Settings2,
  Box,
  Flame,
  Skull,
  AlertTriangle,
  Accessibility,
  Bomb,
  Fuel,
  Sun,
  Mountain,
  FireExtinguisher,
  Bath,
  Recycle,
  Megaphone,
  Gavel,
  Ship,
  Anchor,
  Sprout,
  Stethoscope,
  Hammer,
  ArrowUpCircle,
  Beef,
  Droplets,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Info,
  FileUp,
  FileText,
  Sparkles,
  ChevronRight,
  MessageSquare,
  History
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, query, orderBy, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { analyzePgrPdf, type PgrAnalysisOutput } from "@/ai/flows/pgr-analysis-flow"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Geral", title: "NR-01 - Gerenciamento de Riscos (GRO/PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr03", category: "Administrativo", title: "NR-03 - Embargo e Interdição", icon: Ban, color: "text-red-700" },
  { id: "nr04", category: "SESMT", title: "NR-04 - Dimensionamento do SESMT", icon: Users, color: "text-blue-600" },
  { id: "nr05", category: "CIPA", title: "NR-05 - Comissão Interna (CIPA)", icon: ShieldCheck, color: "text-emerald-600" },
  { id: "nr06", category: "EPI", title: "NR-06 - Equipamentos de Proteção (EPI)", icon: HardHat, color: "text-amber-600" },
  { id: "nr07", category: "Saúde", title: "NR-07 - Controle Médico (PCMSO)", icon: HeartPulse, color: "text-rose-600" },
  { id: "nr08", category: "Estrutural", title: "NR-08 - Edificações", icon: Building2, color: "text-slate-600" },
  { id: "nr09", category: "Riscos", title: "NR-09 - Agentes Físicos, Químicos e Biológicos", icon: Biohazard, color: "text-purple-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Zap, color: "text-yellow-500" },
  { id: "nr11", category: "Logística", title: "NR-11 - Movimentação de Materiais", icon: Truck, color: "text-blue-500" },
  { id: "nr12", category: "Máquinas", title: "NR-12 - Máquinas e Equipamentos", icon: Settings2, color: "text-indigo-600" },
  { id: "nr13", category: "Pressão", title: "NR-13 - Caldeiras e Vasos de Pressão", icon: Box, color: "text-cyan-600" },
  { id: "nr14", category: "Fornos", title: "NR-14 - Fornos", icon: Flame, color: "text-orange-700" },
  { id: "nr15", category: "Insalubridade", title: "NR-15 - Atividades Insalubres", icon: Skull, color: "text-gray-700" },
  { id: "nr16", category: "Periculosidade", title: "NR-16 - Atividades Perigosas", icon: AlertTriangle, color: "text-orange-600" },
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Ergonomia", icon: Accessibility, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Indústria da Construção", icon: Construction, color: "text-orange-600" },
  { id: "nr19", category: "Explosivos", title: "NR-19 - Explosivos", icon: Bomb, color: "text-red-800" },
  { id: "nr20", category: "Inflamáveis", title: "NR-20 - Inflamáveis e Combustíveis", icon: Fuel, color: "text-amber-700" },
  { id: "nr21", category: "Trabalho Externo", title: "NR-21 - Trabalho a Céu Aberto", icon: Sun, color: "text-orange-400" },
  { id: "nr22", category: "Mineração", title: "NR-22 - Segurança na Mineração", icon: Mountain, color: "text-stone-600" },
  { id: "nr23", category: "Incêndio", title: "NR-23 - Proteção Contra Incêndios", icon: FireExtinguisher, color: "text-red-600" },
  { id: "nr24", category: "Conforto", title: "NR-24 - Condições Sanitárias e Conforto", icon: Bath, color: "text-blue-400" },
  { id: "nr25", category: "Resíduos", title: "NR-25 - Resíduos Industriais", icon: Recycle, color: "text-emerald-700" },
  { id: "nr26", category: "Sinalização", title: "NR-26 - Sinalização de Segurança", icon: Megaphone, color: "text-yellow-600" },
  { id: "nr28", category: "Fiscalização", title: "NR-28 - Fiscalização e Penalidades", icon: Gavel, color: "text-slate-800" },
  { id: "nr29", category: "Portuário", title: "NR-29 - Trabalho Portuário", icon: Ship, color: "text-blue-800" },
  { id: "nr30", category: "Aquaviário", title: "NR-30 - Trabalho Aquaviário", icon: Anchor, color: "text-sky-700" },
  { id: "nr31", category: "Rural", title: "NR-31 - Trabalho Rural e Pesca", icon: Sprout, color: "text-green-600" },
  { id: "nr32", category: "Saúde", title: "NR-32 - Serviços de Saúde", icon: Stethoscope, color: "text-blue-600" },
  { id: "nr33", category: "Confinado", title: "NR-33 - Espaços Confinados", icon: Box, color: "text-orange-800" },
  { id: "nr34", category: "Naval", title: "NR-34 - Construção e Reparação Naval", icon: Hammer, color: "text-slate-700" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
  { id: "nr36", category: "Frigoríficos", title: "NR-36 - Abate e Processamento de Carnes", icon: Beef, color: "text-red-500" },
  { id: "nr37", category: "Petróleo", title: "NR-37 - Plataformas de Petróleo", icon: Droplets, color: "text-blue-900" },
  { id: "nr38", category: "Limpeza Urbana", title: "NR-38 - Limpeza Urbana e Resíduos", icon: Trash2, color: "text-emerald-600" },
]

const NR_ITEMS: Record<string, string[]> = {
  nr01: ["Existe PGR implementado?", "O inventário de riscos está atualizado?", "O plano de ação contempla medidas de prevenção?"],
  nr06: ["Os EPIs fornecidos possuem CA válido?", "Há registro de entrega assinado?", "Os EPIs são adequados ao risco?"],
  nr18: ["O PCMAT está atualizado?", "As áreas de vivência estão limpas?", "Há proteção coletiva em periferias?"],
}

type BodyPart = { id: string; label: string; level: 0 | 1 | 2 | 3 | 4; path: string }

const INITIAL_BODY_PARTS: BodyPart[] = [
  { id: "head", label: "Cabeça", level: 0, path: "M50,5c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S54.4,5,50,5z" },
  { id: "hip_l", label: "Quadril Esquerdo", level: 0, path: "M44,67 h-8 c-4,0-10,3-10,12 s3,12,3,12 h15 V67 z" },
  { id: "hip_r", label: "Quadril Direito", level: 0, path: "M56,67 h8 c4,0,10,3,10,12 s-3,12-3,12 h-15 V67 z" },
  // ... outros caminhos SVG simétricos
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedChecklistId, setSelectedChecklistId] = React.useState<string | null>(null)
  const [ergoTool, setErgoTool] = React.useState<string | null>(null)
  const [bodyParts, setBodyParts] = React.useState<BodyPart[]>(INITIAL_BODY_PARTS)
  const [isAnalyzingPgr, setIsAnalyzingPgr] = React.useState(false)
  const [pgrResult, setPgrResult] = React.useState<PgrAnalysisOutput | null>(null)
  const [formResponses, setFormResponses] = React.useState<Record<string, string>>({})

  const handlePgrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "O PDF deve ter no máximo 10MB." })
      return
    }
    setIsAnalyzingPgr(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const result = await analyzePgrPdf({ pdfDataUri: event.target?.result as string, fileName: file.name })
        setPgrResult(result)
        toast({ title: "Análise Concluída", description: "NAI processou o PGR com sucesso." })
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro na Análise", description: error.message })
    } finally { setIsAnalyzingPgr(false) }
  }

  const handleSaveNRChecklist = async () => {
    if (!user || !db || !selectedChecklistId) return
    try {
      await addDoc(collection(db, "clients", user.uid, "checklists"), {
        userId: user.uid, type: "NR_AUDIT", nr: selectedChecklistId, responses: formResponses, createdAt: new Date().toISOString()
      })
      toast({ title: "Inspeção Salva!" })
      setSelectedChecklistId(null)
    } catch (e) { toast({ variant: "destructive", title: "Erro ao salvar" }) }
  }

  if (selectedChecklistId === "nr17") {
    // Interface Ergo Lab aqui
    return (
      <div className="space-y-6 animate-in fade-in">
        <Button variant="ghost" onClick={() => setSelectedChecklistId(null)}><ArrowLeft className="mr-2" /> Voltar</Button>
        <h1 className="text-2xl font-bold">Laboratório de Ergonomia (NR-17)</h1>
        {/* ... ferramentas ergo ... */}
      </div>
    )
  }

  if (selectedChecklistId) {
    const nrItems = NR_ITEMS[selectedChecklistId] || ["Item padrão de conformidade 01", "Item padrão de conformidade 02"]
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4">
        <Button variant="ghost" onClick={() => setSelectedChecklistId(null)}><ArrowLeft className="mr-2" /> Voltar</Button>
        <Card className="border-none shadow-xl">
          <CardHeader><CardTitle>{CHECKLIST_CATALOG.find(c => c.id === selectedChecklistId)?.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {nrItems.map((item, i) => (
              <div key={i} className="p-4 border rounded-xl flex justify-between items-center">
                <span className="text-sm font-medium">{item}</span>
                <RadioGroup className="flex gap-4" onValueChange={(v) => setFormResponses(prev => ({...prev, [i]: v}))}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="C" id={`c-${i}`} /><Label htmlFor={`c-${i}`}>C</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="NC" id={`nc-${i}`} /><Label htmlFor={`nc-${i}`}>NC</Label></div>
                </RadioGroup>
              </div>
            ))}
            <Button className="w-full" onClick={handleSaveNRChecklist}>Salvar Auditoria</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Hub de Operações SST</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2">Catálogo NRs</TabsTrigger>
          <TabsTrigger value="pgr" className="rounded-lg gap-2">Análise PGR (PDF)</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKLIST_CATALOG.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.id} className="cursor-pointer hover:ring-2 ring-primary/10 transition-all" onClick={() => setSelectedChecklistId(item.id)}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl bg-muted/50", item.color)}><Icon className="size-6" /></div>
                    <div><p className="text-[9px] font-black uppercase opacity-50">{item.category}</p><h3 className="text-sm font-bold">{item.title}</h3></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="pgr" className="mt-6">
          <Card className="border-none shadow-xl">
            <CardHeader><CardTitle>Scanner PGR Inteligente</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-3xl p-12 text-center bg-muted/10 hover:bg-muted/20 relative">
                <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePgrFileUpload} />
                {isAnalyzingPgr ? <Loader2 className="animate-spin size-10 mx-auto" /> : <FileText className="size-10 mx-auto" />}
                <p className="mt-2 text-sm">Clique para importar PGR (Máx 10MB)</p>
              </div>
              {pgrResult && (
                <div className="p-4 bg-blue-50 rounded-xl space-y-4">
                  <h3 className="font-bold">{pgrResult.companyInfo.name}</h3>
                  <p className="text-sm italic">"{pgrResult.aiInsight}"</p>
                  <Button onClick={() => window.open(getWhatsAppLink("11999999999", pgrResult.aiInsight))}>Enviar ao Cliente</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
