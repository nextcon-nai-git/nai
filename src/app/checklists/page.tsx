"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  CheckCircle2, 
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
  FileText,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"

const CHECKLIST_CATALOG = [
  { id: "nr10", category: "Normativo", title: "NR-10 - Eletricidade", icon: Zap, color: "text-amber-500" },
  { id: "nr18", category: "Obras", title: "Check-List Obras (PCMAT)", icon: Construction, color: "text-orange-600" },
  { id: "cipa", category: "Normativo", title: "05 - CIPA / SESMT", icon: ShieldCheck, color: "text-blue-600" },
  { id: "epi", category: "Operacional", title: "06 - EPIs (Inspeção)", icon: HardHat, color: "text-emerald-600" },
  { id: "amb", category: "Saúde", title: "Checklist - Ambulância", icon: Truck, color: "text-red-600" },
  { id: "rss", category: "Saúde", title: "Resíduos de Saúde (RSS)", icon: Trash2, color: "text-purple-600" },
]

const ERGO_METHODS = [
  { id: "rula", name: "RULA", desc: "Membros Superiores" },
  { id: "reba", name: "REBA", desc: "Corpo Inteiro" },
  { id: "niosh", name: "NIOSH", desc: "Levantamento de Cargas" },
  { id: "ocra", name: "OCRA", desc: "Movimentos Repetitivos" },
]

type BodyPart = {
  id: string
  label: string
  level: 0 | 1 | 2 | 3 | 4
  path: string
}

const INITIAL_BODY_PARTS: BodyPart[] = [
  { id: "head", label: "Cabeça", level: 0, path: "M50,5c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S54.4,5,50,5z" },
  { id: "neck", label: "Pescoço", level: 0, path: "M46,21h8v4h-8V21z" },
  { id: "shoulder_l", label: "Ombro Esquerdo", level: 0, path: "M46,25c-4,0-10,2-14,6s-4,8-4,8l6,2l2-10L46,25z" },
  { id: "shoulder_r", label: "Ombro Direito", level: 0, path: "M54,25c4,0,10,2,14,6s4,8,4,8l-6,2l-2-10L54,25z" },
  { id: "back_upper", label: "Coluna Superior", level: 0, path: "M46,25h8v15h-8V25z" },
  { id: "back_mid", label: "Coluna Média", level: 0, path: "M46,40h8v15h-8V40z" },
  { id: "back_lower", label: "Coluna Lombar", level: 0, path: "M46,55h8v15h-8V55z" },
  { id: "arm_l_upper", label: "Braço Esquerdo", level: 0, path: "M32,31l-3,15l5,1l3-16L32,31z" },
  { id: "arm_r_upper", label: "Braço Direito", level: 0, path: "M68,31l3,15l-5,1l-3-16L68,31z" },
  { id: "arm_l_lower", label: "Antebraço Esquerdo", level: 0, path: "M29,46l-2,15l4,1l2-15L29,46z" },
  { id: "arm_r_lower", label: "Antebraço Direito", level: 0, path: "M71,46l2,15l-4,1l-2-15L71,46z" },
  { id: "wrist_l", label: "Punho Esquerdo", level: 0, path: "M27,61l-1,8l4,1l1-8L27,61z" },
  { id: "wrist_r", label: "Punho Direito", level: 0, path: "M73,61l1,8l-4,1l-1-8L73,61z" },
  { id: "hip_l", label: "Quadril Esquerdo", level: 0, path: "M40,70c-3,0-6,2-6,6s2,8,2,8h10V70H40z" },
  { id: "hip_r", label: "Quadril Direito", level: 0, path: "M60,70c3,0,6,2,6,6s-2,8-2,8H54V70H60z" },
  { id: "thigh_l", label: "Coxa Esquerda", level: 0, path: "M36,84l-2,25l10,2l2-27L36,84z" },
  { id: "thigh_r", label: "Coxa Direita", level: 0, path: "M64,84l2,25l-10,2l-2-27L64,84z" },
  { id: "knee_l", label: "Joelho Esquerdo", level: 0, path: "M34,109l-1,8l10,1l1-9L34,109z" },
  { id: "knee_r", label: "Joelho Direito", level: 0, path: "M66,109l1,8l-10,1l-1-9L66,109z" },
  { id: "leg_l", label: "Perna Esquerda", level: 0, path: "M33,117l-2,25l9,1l2-26L33,117z" },
  { id: "leg_r", label: "Perna Direita", level: 0, path: "M67,117l2,25l-9,1l-2-26L67,117z" },
  { id: "foot_l", label: "Pé Esquerdo", level: 0, path: "M31,142l-2,10l12,2l1-12L31,142z" },
  { id: "foot_r", label: "Pé Direito", level: 0, path: "M69,142l2,10l-12,2l-1-12L69,142z" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedChecklist, setSelectedChecklist] = React.useState<string | null>(null)
  const [bodyParts, setBodyParts] = React.useState<BodyPart[]>(INITIAL_BODY_PARTS)
  const [isSaving, setIsSaving] = React.useState(false)

  const handlePartClick = (id: string) => {
    setBodyParts(prev => prev.map(part => {
      if (part.id === id) {
        const nextLevel = ((part.level + 1) % 5) as 0 | 1 | 2 | 3 | 4
        return { ...part, level: nextLevel }
      }
      return part
    }))
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "fill-yellow-400 stroke-yellow-600"
      case 2: return "fill-orange-400 stroke-orange-600"
      case 3: return "fill-red-500 stroke-red-700"
      case 4: return "fill-purple-700 stroke-purple-900"
      default: return "fill-slate-100 stroke-slate-300"
    }
  }

  const handleSaveCorlett = async () => {
    if (!user || !db) return
    setIsSaving(true)
    try {
      const reportData = {
        userId: user.uid,
        type: "CORLETT_DIAGRAM",
        data: bodyParts.filter(p => p.level > 0),
        createdAt: new Date().toISOString(),
      }
      await addDoc(collection(db, "clients", user.uid, "checklists"), reportData)
      toast({ title: "Relato Salvo!", description: "Dados enviados para análise do SESMT." })
      setSelectedChecklist(null)
      setBodyParts(INITIAL_BODY_PARTS)
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar" })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredCatalog = CHECKLIST_CATALOG.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedChecklist === "ergo") {
    return (
      <div className="space-y-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedChecklist(null)} className="h-10 w-10 p-0 rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary uppercase">Mapeamento de Corlett</h1>
            <p className="text-xs text-muted-foreground">Avaliação ergonômica via Mapa de Intensidade de Dor.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b text-center">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Activity className="size-4 text-primary" /> Avatar Anatômico 2026
              </CardTitle>
              <CardDescription>Toque nas regiões para indicar fadiga ou desconforto.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10 relative">
              <svg width="380" height="580" viewBox="0 0 100 160" className="drop-shadow-2xl">
                {/* Silhueta Base Humana Estilizada */}
                <path 
                  d="M50,2c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S55,2,50,2z M45,20h10v5h-10V20z M45,25c-5,0-12,3-16,8s-5,10-5,10l7,3l3-13l11,0l3,13l7-3c0,0-1-5-5-10s-11-8-16-8z" 
                  className="fill-slate-50 stroke-slate-200 stroke-[0.5]"
                />
                {/* Zonas Interativas */}
                {bodyParts.map((part) => (
                  <path
                    key={part.id}
                    d={part.path}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:brightness-90 stroke-[0.8]",
                      getLevelColor(part.level)
                    )}
                    onClick={() => handlePartClick(part.id)}
                  >
                    <title>{part.label}</title>
                  </path>
                ))}
              </svg>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4 w-full">
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} className="flex items-center gap-2">
                    <div className={cn("size-4 rounded-md border shadow-sm", getLevelColor(l as any))} />
                    <span className="text-[10px] font-black uppercase opacity-60">
                      {l === 0 ? 'Nenhuma' : l === 1 ? 'Leve' : l === 2 ? 'Média' : l === 3 ? 'Forte' : 'Extrema'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-shadow border-none bg-[#090e24] text-white">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-accent">Áreas Identificadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                  {bodyParts.filter(p => p.level > 0).map(p => (
                    <div key={p.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center animate-in slide-in-from-right-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{p.label}</span>
                        <span className="text-[9px] uppercase font-black text-white/40">Intensidade: {p.level}</span>
                      </div>
                      <Badge className={cn("text-[9px] font-black border-none", getLevelColor(p.level).replace('fill-', 'bg-'))}>
                        Relatado
                      </Badge>
                    </div>
                  ))}
                  {bodyParts.filter(p => p.level > 0).length === 0 && (
                    <p className="text-center py-10 text-[10px] uppercase font-bold opacity-30 italic">Nenhuma área selecionada</p>
                  )}
                </div>
                <Button 
                  className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-black uppercase tracking-widest h-14 shadow-lg shadow-accent/20"
                  onClick={handleSaveCorlett}
                  disabled={isSaving || bodyParts.filter(p => p.level > 0).length === 0}
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save className="size-5 mr-2" />}
                  Finalizar Avaliação
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Hub de Operações & Checklists</h1>
          <p className="text-muted-foreground">Gestão unificada de inspeções, PGR e análises ergonômicas.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[800px] grid-cols-4 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2 text-xs font-bold">
            <ClipboardCheck className="size-4" /> Catálogo
          </TabsTrigger>
          <TabsTrigger value="pgr" className="rounded-lg gap-2 text-xs font-bold">
            <ShieldAlert className="size-4" /> Inventário PGR
          </TabsTrigger>
          <TabsTrigger value="ergo" className="rounded-lg gap-2 text-xs font-bold">
            <Brain className="size-4" /> Ergonomia Lab
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 text-xs font-bold">
            <Activity className="size-4" /> Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por NR, Tipo ou Nome do Checklist..." 
              className="pl-10 h-12 bg-white border-muted shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-pointer group bg-white"
                  onClick={() => setSelectedChecklist(item.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-muted/50 ${item.color} group-hover:bg-primary group-hover:text-white transition-all shadow-inner`}>
                        <Icon className="size-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-50">{item.category}</p>
                        <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="pgr" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-primary uppercase">Inventário de Riscos (NR-01)</h3>
            <Button className="bg-primary gap-2"><Plus className="size-4" /> Novo Risco</Button>
          </div>
          <Card className="card-shadow border-none h-64 flex flex-col items-center justify-center opacity-40 italic bg-white border-dashed border-2">
            <ShieldAlert className="size-12 mb-2 text-primary" />
            <p className="text-sm font-medium">Use o botão 'Novo Risco' para popular seu inventário PGR.</p>
          </Card>
        </TabsContent>

        <TabsContent value="ergo" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 card-shadow border-none bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary uppercase">Laboratório de Ergonomia (NR-17)</CardTitle>
                <CardDescription>Selecione o método para iniciar a análise técnica do posto de trabalho.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className="p-6 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group flex items-center gap-6"
                  onClick={() => setSelectedChecklist("ergo")}
                >
                  <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-lg">
                    <Activity size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-indigo-900 text-xl">Diagrama de Corlett</h4>
                    <p className="text-sm text-indigo-700/70 font-medium italic">Ferramenta anatômica para relato de dor e fadiga muscular (Manequim Digital).</p>
                  </div>
                  <ArrowRight className="size-6 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ERGO_METHODS.map((m) => (
                    <div key={m.id} className="p-4 border rounded-2xl hover:bg-muted/30 transition-all cursor-pointer group">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-black text-primary text-xl">{m.name}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{m.desc}</p>
                        </div>
                        <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <Activity size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow border-none bg-[#090e24] text-white">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase text-accent tracking-widest">Resumo Ergonômico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Análises Realizadas</p>
                  <p className="text-2xl font-black">14</p>
                </div>
                <Button className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-bold uppercase text-[10px] h-12">
                  Emitir Laudo Ergonômico (AET)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="card-shadow border-none h-64 flex items-center justify-center opacity-40 italic bg-white border-dashed border-2">
            <p className="text-sm font-medium">Nenhum registro preenchido recentemente.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
