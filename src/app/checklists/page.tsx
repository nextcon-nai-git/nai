
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
  AlertCircle
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
  { id: "ergo", category: "Ergonomia", title: "Diagrama Corlett", icon: Activity, color: "text-indigo-600" },
]

type BodyPart = {
  id: string
  label: string
  level: 0 | 1 | 2 | 3 | 4 // 0: Nenhum, 1: Leve, 2: Médio, 3: Forte, 4: Extremo
  path: string
}

const INITIAL_BODY_PARTS: BodyPart[] = [
  { id: "neck", label: "Pescoço", level: 0, path: "M50 15 L45 20 L55 20 Z" },
  { id: "shoulder_l", label: "Ombro Esquerdo", level: 0, path: "M35 25 L45 22 L45 30 L35 30 Z" },
  { id: "shoulder_r", label: "Ombro Direito", level: 0, path: "M55 22 L65 25 L65 30 L55 30 Z" },
  { id: "back_upper", label: "Coluna Superior", level: 0, path: "M45 30 L55 30 L55 45 L45 45 Z" },
  { id: "back_mid", label: "Coluna Média", level: 0, path: "M45 45 L55 45 L55 60 L45 60 Z" },
  { id: "back_lower", label: "Coluna Lombar", level: 0, path: "M45 60 L55 60 L55 75 L45 75 Z" },
  { id: "arm_l", label: "Braço Esquerdo", level: 0, path: "M30 35 L35 30 L35 50 L30 55 Z" },
  { id: "arm_r", label: "Braço Direito", level: 0, path: "M65 35 L70 30 L70 55 L65 50 Z" },
  { id: "wrist_l", label: "Punho/Mão Esq", level: 0, path: "M25 60 L30 55 L30 65 L25 70 Z" },
  { id: "wrist_r", label: "Punho/Mão Dir", level: 0, path: "M70 55 L75 60 L75 70 L70 65 Z" },
  { id: "hip", label: "Quadril", level: 0, path: "M40 75 L60 75 L60 85 L40 85 Z" },
  { id: "knee_l", label: "Joelho Esquerdo", level: 0, path: "M40 110 L48 110 L48 120 L40 120 Z" },
  { id: "knee_r", label: "Joelho Direito", level: 0, path: "M52 110 L60 110 L60 120 L52 120 Z" },
  { id: "foot_l", label: "Tornozelo/Pé Esq", level: 0, path: "M38 140 L48 140 L48 150 L35 155 Z" },
  { id: "foot_r", label: "Tornozelo/Pé Dir", level: 0, path: "M52 140 L62 140 L65 155 L52 150 Z" },
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
      default: return "fill-slate-200 stroke-slate-400"
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
      toast({ title: "Diagrama Salvo", description: "O relatório de fadiga foi enviado ao SESMT." })
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
            <h1 className="text-2xl font-headline font-bold text-primary uppercase">Diagrama de Corlett</h1>
            <p className="text-xs text-muted-foreground">Relato de desconforto osteomuscular (Manequim Interativo).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Mapa de Sensibilidade
              </CardTitle>
              <CardDescription>Clique nas partes do corpo para indicar o nível de dor (0 a 4).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10 relative">
              {/* Manequim Humano SVG */}
              <svg width="300" height="500" viewBox="0 0 100 160" className="drop-shadow-2xl">
                {/* Silhueta Base */}
                <path d="M50 10 C40 10 40 25 50 25 C60 25 60 10 50 10 Z" className="fill-slate-100 stroke-slate-300" /> {/* Cabeça */}
                <rect x="40" y="25" width="20" height="60" rx="10" className="fill-slate-100 stroke-slate-300" /> {/* Tronco */}
                
                {/* Partes Interativas */}
                {bodyParts.map((part) => (
                  <path
                    key={part.id}
                    d={part.path}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:brightness-90 stroke-2",
                      getLevelColor(part.level)
                    )}
                    onClick={() => handlePartClick(part.id)}
                  >
                    <title>{part.label}</title>
                  </path>
                ))}
              </svg>

              <div className="mt-8 grid grid-cols-5 gap-2 w-full max-w-xs">
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} className="flex flex-col items-center gap-1">
                    <div className={cn("size-4 rounded-full", getLevelColor(l as any))} />
                    <span className="text-[8px] font-bold uppercase">{l === 0 ? 'Nenhum' : l}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-shadow border-none bg-[#090e24] text-white">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-accent">Resumo do Relato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="divide-y divide-white/10">
                  {bodyParts.filter(p => p.level > 0).map(p => (
                    <div key={p.id} className="py-2 flex justify-between items-center">
                      <span className="text-xs font-medium">{p.label}</span>
                      <Badge className={cn("text-[9px] font-black", getLevelColor(p.level))}>
                        Nível {p.level}
                      </Badge>
                    </div>
                  ))}
                  {bodyParts.filter(p => p.level > 0).length === 0 && (
                    <p className="py-4 text-xs italic text-white/40 text-center">Nenhuma dor relatada ainda.</p>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-black uppercase tracking-widest h-12"
                  onClick={handleSaveCorlett}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save className="size-4 mr-2" />}
                  Enviar Relatório
                </Button>
              </CardContent>
            </Card>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
              <AlertCircle className="size-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-700 leading-tight">
                <strong>Importante:</strong> Este diagrama ajuda a identificar precocemente riscos ergonômicos na sua função. Caso a dor seja aguda, procure o ambulatório imediatamente.
              </p>
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
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Biblioteca de Checklists</h1>
          <p className="text-muted-foreground">Formulários técnicos e inspeções normativas 2026.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="catalog" className="rounded-lg gap-2">
            <ClipboardCheck className="size-4" /> Catálogo
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2">
            <Activity className="size-4" /> Realizados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por NR, Tipo ou Nome do Checklist..." 
              className="pl-10 h-12 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <Card 
                key={item.id} 
                className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-pointer group"
                onClick={() => setSelectedChecklist(item.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-muted/50 ${item.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                      <item.icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{item.category}</p>
                      <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                    </div>
                    <Button variant="ghost" size="icon">
                      <CheckCircle2 className="size-4 opacity-20 group-hover:opacity-100" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="card-shadow border-none h-64 flex items-center justify-center opacity-40 italic">
            <p>Nenhum checklist preenchido recentemente.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
