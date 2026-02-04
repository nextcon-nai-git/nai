
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
  Activity,
  ArrowRight,
  Brain
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"

const ERGO_METHODS = [
  { id: "rula", name: "RULA", desc: "Membros Superiores" },
  { id: "reba", name: "REBA", desc: "Corpo Inteiro" },
  { id: "niosh", name: "NIOSH", desc: "Levantamento de Cargas" },
  { id: "ocra", name: "OCRA", desc: "Movimentos Repetitivos" },
]

export default function RiskInventoryPGR() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState("inventory")

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Engenharia & Segurança</h1>
          <p className="text-muted-foreground">Gestão de PGR, PCMAT e Laboratório de Ergonomia 2026.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-2 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="inventory" className="rounded-lg gap-2 text-xs font-bold">
            <ShieldAlert className="size-4" /> Inventário PGR
          </TabsTrigger>
          <TabsTrigger value="ergo" className="rounded-lg gap-2 text-xs font-bold">
            <Brain className="size-4" /> Ergonomia Lab
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6 space-y-6">
          {/* Conteúdo do Inventário existente aqui */}
          <Card className="card-shadow border-none h-64 flex items-center justify-center opacity-40">
            <p className="italic">Use o botão 'Novo Risco' para popular seu inventário.</p>
          </Card>
        </TabsContent>

        <TabsContent value="ergo" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 card-shadow border-none bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary uppercase">Métodos de Avaliação NR-17</CardTitle>
                <CardDescription>Selecione o método para iniciar a análise técnica do posto de trabalho.</CardDescription>
              </CardHeader>
              <CardContent>
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
                <div className="p-4 bg-accent rounded-xl text-primary">
                  <p className="text-[10px] uppercase font-black mb-1">Status NR-17</p>
                  <p className="text-sm font-bold">AET Pendente de Revisão em 3 postos.</p>
                </div>
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold uppercase text-[10px]">
                  Emitir Laudo Ergonômico
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
