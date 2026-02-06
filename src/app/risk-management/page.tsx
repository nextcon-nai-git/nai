
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
  Brain,
  Sparkles,
  FileDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"

export default function RiskInventoryPGR() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState("inventory")

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Engenharia & Segurança</h1>
          <p className="text-muted-foreground">Gestão de PGR, PCMAT e Matriz de Riscos 2026.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary text-primary h-11">
            <FileDown className="size-4" /> Exportar Inventário
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2 h-11 px-6 font-bold shadow-lg shadow-accent/20">
            <Plus className="size-4" /> Novo Risco
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-2 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="inventory" className="rounded-lg gap-2 text-xs font-bold">
            <ShieldAlert className="size-4" /> Inventário PGR
          </Badge>
          <TabsTrigger value="heatmap" className="rounded-lg gap-2 text-xs font-bold">
            <Activity className="size-4" /> Matriz de Calor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 card-shadow border-none bg-white">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg font-headline font-bold text-primary">Riscos Identificados</CardTitle>
                <CardDescription>Mapeamento de GHEs e exposições ocupacionais.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-center py-32 opacity-30">
                  <ShieldAlert className="size-16 mx-auto mb-4" />
                  <p className="font-bold uppercase tracking-widest text-sm">Seu inventário está vazio</p>
                  <p className="text-xs mt-1">Importe um PGR na aba 'Hub de Checklists' para análise automática.</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="card-shadow border-none gradient-primary text-white">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
                    <Sparkles className="size-3 text-accent" /> Auditoria NAI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[11px] leading-relaxed opacity-80">
                    A IA NAI está monitorando as atualizações da NR-01. Mantenha seu inventário sincronizado com o eSocial S-2240.
                  </p>
                  <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-[10px] font-bold">
                    STATUS: 100% CONFORME
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-6">
          <Card className="card-shadow border-none h-96 flex items-center justify-center bg-white text-muted-foreground italic">
            Visualização de Matriz de Probabilidade x Severidade em construção.
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
