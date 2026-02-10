
"use client"

import * as React from "react"
import { Loader2, Database, Scale, CheckCircle2, LayoutGrid } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch, collection, serverTimestamp } from "firebase/firestore"
import { REAL_EMPLOYEES, REAL_COMPANIES, REAL_EXAMS_HISTORY } from "@/lib/real-data"

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [uploading, setUploading] = React.useState(false)

  const handleRealBaseImport = async () => {
    if (!user || !db) return
    setUploading(true)
    
    try {
      const batch = writeBatch(db)
      const now = new Date().toISOString()

      // 1. Importar Empresas na Raiz
      REAL_COMPANIES.forEach(comp => {
        const docRef = doc(db, "companies", comp.id)
        batch.set(docRef, { ...comp, updatedAt: now }, { merge: true })
      })

      // 2. Importar Funcionários como Sub-coleção
      REAL_EMPLOYEES.forEach((emp) => {
        const docRef = doc(db, "companies", emp.companyId, "employees", emp.id)
        batch.set(docRef, { ...emp, createdAt: now })
      })

      // 3. Importar Histórico de Exames
      REAL_EXAMS_HISTORY.forEach((hist, i) => {
        const docRef = doc(db, "companies", hist.companyId, "examHistory", `hist_${i}`)
        batch.set(docRef, { ...hist, createdAt: now })
      })

      // 4. Importar Perícias Judiciais
      const periciaRef = doc(db, "companies", "CLI_BRITANIA", "legalExpertises", "EXPERT_001")
      batch.set(periciaRef, {
        id: "EXPERT_001",
        employeeName: "JOÃO BESTEL DE DEUS",
        caseNumber: "0001234-56.2025.5.09.0001",
        date: "2026-03-15",
        disease: "Lombalgia Crônica (M54.5)",
        cid: "M54.5",
        status: "Em Andamento",
        value: 45000,
        type: "Indenizatória"
      })

      // 5. Importar Casos para o Kanban (Cards Operação)
      const kanbanTasks = [
        { cid: "CLI_NATIVA", name: "NATIVA EMPREENDIMENTOS", tasks: [{ id: "T_NAT_01", title: "Treinamento NR Integrada (18, 35, 11, 12)", type: "treinamento", priority: "high", status: "doing" }] },
        { cid: "CLI_TIMENOW", name: "TIMENOW GESTÃO DE OBRAS", tasks: [{ id: "T_TIME_01", title: "Auditagem Agrupador 859 (Download XML)", type: "esocial", priority: "critical", status: "todo" }] },
        { cid: "CLI_BRITANIA", name: "BRITÂNIA ELETRODOMÉSTICOS", tasks: [{ id: "T_BRIT_01", title: "Renovação PGR 2026 - Unidade Fabril", type: "pgr", priority: "medium", status: "todo" }] },
        { cid: "CLI_GULA", name: "GULA ALIMENTOS", tasks: [{ id: "T_GULA_01", title: "Triagem Forense de Atestados (NAI Forensic)", type: "pcmso", priority: "high", status: "review" }] }
      ]

      kanbanTasks.forEach(comp => {
        comp.tasks.forEach(t => {
          const taskRef = doc(db, "companies", comp.cid, "tasks", t.id)
          batch.set(taskRef, {
            ...t,
            companyId: comp.cid,
            companyName: comp.name,
            dueDate: now,
            createdAt: now,
            ai_risk_score: 85,
            checklist: [
              { id: '1', text: 'Coletar evidências de campo', checked: true, mandatory: true },
              { id: '2', text: 'Validar com Engenheiro Responsável', checked: false, mandatory: true }
            ]
          }, { merge: true })
        })
      })

      await batch.commit()
      toast({ title: "Ecossistema Real Carregado", description: "Empresas, Funcionários e Cards de Operação sincronizados." })
    } catch (e) {
      console.error(e)
      toast({ variant: "destructive", title: "Erro na Carga Real" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Importador de Elite 2026</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Motor de sincronização massiva para base real multi-tenant.</p>
        </div>
        <Button 
          className="h-16 px-10 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 gap-3 font-black uppercase text-xs tracking-widest" 
          onClick={handleRealBaseImport} 
          disabled={uploading}
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <Database className="size-5 text-accent" />}
          Carregar Base Real (Nativa/TimeNow)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
              <Scale className="size-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-black text-primary uppercase">Multi-tenant Real</CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60">Isolamento total por unidade.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-slate-500 leading-relaxed italic">
              "As sub-coleções garantem que os dados da Nativa e da Britânia nunca se cruzem indevidamente, respeitando a LGPD e o sigilo médico."
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-emerald-50 pb-8">
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-black text-emerald-900 uppercase">Carga de Operação</CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60">Sincronização do Kanban.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-emerald-700/70 leading-relaxed font-medium">
              Importa automaticamente os cards de treinamento da Nativa e auditorias da TimeNow para o dashboard de Cards Operação.
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-8">
            <div className="p-3 bg-white/10 rounded-2xl w-fit shadow-sm mb-4">
              <LayoutGrid className="size-6 text-accent" />
            </div>
            <CardTitle className="text-xl font-black uppercase">Hierarquia 2026</CardTitle>
            <CardDescription className="text-xs font-bold uppercase text-white/40">Contratos Master vs Unidades.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase text-accent mb-1">Estrutura Injetada:</p>
              <p className="text-xs font-medium opacity-70">TimeNow (Master) &gt; Britânia (Unidade)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
