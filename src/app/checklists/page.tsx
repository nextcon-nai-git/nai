
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
  // Cabeça e Pescoço
  { id: "head", label: "Cabeça", level: 0, path: "M50,2c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S54.4,2,50,2z" },
  { id: "neck", label: "Pescoço", level: 0, path: "M46,18h8v4h-8V18z" },
  
  // Ombros
  { id: "shoulder_l", label: "Ombro Esquerdo", level: 0, path: "M42,22c-4,0-10,2-14,6s-2,10-2,10l6,2l4-14L42,22z" },
  { id: "shoulder_r", label: "Ombro Direito", level: 0, path: "M58,22c4,0,10,2,14,6s2,10,2,10l-6,2l-4-14L58,22z" },
  
  // Tronco e Coluna
  { id: "back_upper", label: "Coluna Cervical/Superior", level: 0, path: "M44,22h12v15h-12V22z" },
  { id: "back_mid", label: "Coluna Torácica/Média", level: 0, path: "M44,37h12v15h-12V37z" },
  { id: "back_lower", label: "Coluna Lombar", level: 0, path: "M44,52h12v15h-12V52z" },
  
  // Membros Superiores - Esquerdo
  { id: "arm_l_upper", label: "Braço Esquerdo", level: 0, path: "M28,38l-4,15l6,1l4-16L28,38z" },
  { id: "arm_l_lower", label: "Antebraço Esquerdo", level: 0, path: "M24,53l-2,15l6,1l2-16L24,53z" },
  { id: "wrist_l", label: "Punho Esquerdo", level: 0, path: "M22,68l-1,8l6,1l1-9L22,68z" },
  
  // Membros Superiores - Direito
  { id: "arm_r_upper", label: "Braço Direito", level: 0, path: "M72,38l4,15l-6,1l-4-16L72,38z" },
  { id: "arm_r_lower", label: "Antebraço Direito", level: 0, path: "M76,53l2,15l-6,1l-2-16L76,53z" },
  { id: "wrist_r", label: "Punho Direito", level: 0, path: "M78,68l1,8l-6,1l-1-9L78,68z" },
  
  // Quadril e Coxas (Corrigido para Simetria)
  { id: "hip_l", label: "Quadril Esquerdo", level: 0, path: "M44,67H38c-3,0-10,2-10,10s2,10,2,10h14V67z" },
  { id: "hip_r", label: "Quadril Direito", level: 0, path: "M56,67H62c3,0,10,2,10,10s-2,10-2,10H56V67z" },
  { id: "thigh_l", label: "Coxa Esquerda", level: 0, path: "M32,87l-2,25l12,2l2-27L32,87z" },
  { id: "thigh_r", label: "Coxa Direita", level: 0, path: "M68,87l2,25l-12,2l-2-27L68,87z" },
  
  // Joelhos
  { id: "knee_l", label: "Joelho Esquerdo", level: 0, path: "M30,112l-1,8l12,1l1-9L30,112z" },
  { id: "knee_r", label: "Joelho Direito", level: 0, path: "M70,112l1,8l-12,1l-1-9L70,112z" },
  
  // Pernas e Pés
  { id: "leg_l", label: "Perna Esquerda", level: 0, path: "M29,120l-2,20l10,1l2-21L29,120z" },
  { id: "leg_r", label: "Perna Direita", level: 0, path: "M71,120l2,20l-10,1l-2-21L71,120z" },
  { id: "foot_l", label: "Pé Esquerdo", level: 0, path: "M27,140l-4,10l14,2l2-12L27,140z" },
  { id: "foot_r", label: "Pé Direito", level: 0, path: "M73,140l4,10l-14,2l-2-12L73,140z" },
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
      toast({ title: "Avaliação Salva!", description: "Os dados de desconforto foram enviados para análise." })
      setSelectedChecklist(null)
      setBodyParts(INITIAL_BODY_PARTS)
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar relatório" })
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
          <Button variant="ghost" onClick={() => setSelectedChecklist(null)} className="h-10 w-10 p-0 rounded-full bg-white shadow-sm border">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary uppercase">Diagrama de Corlett - 2026</h1>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Avaliação Osteomuscular por Segmento Corporal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b text-center py-4">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-primary">
                <Activity className="size-4" /> Mapa de Intensidade
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase">Toque na região afetada para registrar o nível de desconforto.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-12 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 to-white">
              <div className="relative group">
                <svg width="400" height="600" viewBox="0 0 100 160" className="drop-shadow-2xl filter saturate-[0.8] hover:saturate-100 transition-all duration-500">
                  <ellipse cx="50" cy="155" rx="30" ry="5" fill="black" fillOpacity="0.05" />
                  
                  {bodyParts.map((part) => (
                    <path
                      key={part.id}
                      d={part.path}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:brightness-110 stroke-[0.5] shadow-sm",
                        getLevelColor(part.level)
                      )}
                      onClick={() => handlePartClick(part.id)}
                    >
                      <title>{part.label} - Nível {part.level}</title>
                    </path>
                  ))}
                </svg>
              </div>
              
              <div className="mt-12 flex flex-wrap justify-center gap-6 w-full max-w-md">
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} className="flex flex-col items-center gap-1">
                    <div className={cn("size-6 rounded-lg border-2 shadow-sm transition-transform hover:scale-110", getLevelColor(l as any))} />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">
                      {l === 0 ? 'Zero' : l === 1 ? 'Leve' : l === 2 ? 'Médio' : l === 3 ? 'Forte' : 'Extremo'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-shadow border-none bg-[#090e24] text-white">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                  <Brain className="size-4" /> Áreas Relatadas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="min-h-[300px] max-h-[450px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {bodyParts.filter(p => p.level > 0).map(p => (
                    <div key={p.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center animate-in slide-in-from-right-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-wide">{p.label}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={cn("size-2 rounded-full", getLevelColor(p.level).replace('fill-', 'bg-'))} />
                          <span className="text-[10px] font-bold text-white/50">Intensidade: {p.level}</span>
                        </div>
                      </div>
                      <Badge className={cn("text-[9px] font-black border-none px-2 py-1", getLevelColor(p.level).replace('fill-', 'bg-'))}>
                        Fadiga
                      </Badge>
                    </div>
                  ))}
                  {bodyParts.filter(p => p.level > 0).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
                      <Activity className="size-12 animate-pulse" />
                      <p className="text-[10px] uppercase font-black tracking-widest">Nenhuma região<br/>selecionada no avatar</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <Button 
                    className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-black uppercase tracking-[0.2em] h-14 shadow-xl shadow-accent/20 transition-all active:scale-95"
                    onClick={handleSaveCorlett}
                    disabled={isSaving || bodyParts.filter(p => p.level > 0).length === 0}
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save className="size-5 mr-2" />}
                    Confirmar Relato
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex gap-2">
                <AlertCircle className="size-4 text-blue-600 shrink-0" />
                <p className="text-[9px] text-blue-700 font-bold uppercase leading-tight">
                  Os dados registrados no Diagrama de Corlett são fundamentais para o Plano de Ação Ergonômico da NR-17.
                </p>
              </div>
            </div>
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
                  className="p-8 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer group flex items-center gap-8 shadow-sm hover:shadow-xl"
                  onClick={() => setSelectedChecklist("ergo")}
                >
                  <div className="p-5 bg-indigo-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Activity size={40} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-indigo-900 text-2xl tracking-tight">Diagrama de Corlett</h4>
                    <p className="text-sm text-indigo-700/70 font-medium italic mt-1">Mapa anatômico interativo para relato de dor e fadiga ocupacional (Avatar 2026).</p>
                  </div>
                  <ArrowRight className="size-8 text-indigo-400 group-hover:translate-x-2 transition-transform" />
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
                <Button className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-bold uppercase text-[10px] h-12 shadow-lg shadow-accent/10">
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
