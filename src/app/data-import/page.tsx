
"use client"

import * as React from "react"
import { Loader2, Database, Scale, CheckCircle2, LayoutGrid, AlertCircle, FileSpreadsheet, Sparkles, Zap } from "lucide-react"
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
          <h1 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Carga de Elite 2026</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Importação massiva para Multiapp, Contas e Operações.</p>
        </div>
        <Button 
          className="h-16 px-10 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 gap-3 font-black uppercase text-xs tracking-widest" 
          onClick={handleRealBaseImport} 
          disabled={uploading}
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <Database className="size-5 text-accent" />}
          Sincronizar Base Global
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
              <FileSpreadsheet className="size-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-black text-primary uppercase">Estratégia de Importação</CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60">Dicas para organização de planilhas.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex gap-3">
              <div className="size-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0"><Sparkles className="size-3" /></div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Inclua o <strong>Nome do Cliente</strong> ao lado do CNPJ para facilitar a conferência visual no motor multiapp.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="size-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Zap className="size-3" /></div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Utilize <strong>Cores nos Lançamentos</strong> para identificar prioridades de fluxo de caixa (Entradas/Saídas).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-emerald-500/10 transition-all">
          <CardHeader className="bg-emerald-50 pb-8">
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
              <Layers className="size-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-black text-emerald-900 uppercase">Multiapp & CNPJs</CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60">Sincronização de múltiplos CNPJs.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-emerald-700/70 leading-relaxed font-medium italic">
              "A sincronização de clientes, produtos e fornecedores é automática entre empresas do mesmo grupo, com segregação de contas bancárias por segurança."
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-8">
            <div className="p-3 bg-white/10 rounded-2xl w-fit shadow-sm mb-4">
              <AlertCircle className="size-6 text-accent" />
            </div>
            <CardTitle className="text-xl font-black uppercase">Segurança Bancária</CardTitle>
            <CardDescription className="text-xs font-bold uppercase text-white/40">Remessa Santander & API.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase text-accent mb-1">Tipo de Remessa:</p>
              <p className="text-xs font-medium opacity-70">240 e 102 (Cobrança Simples sem Protesto)</p>
            </div>
            <p className="text-[10px] text-white/30 font-bold uppercase italic leading-relaxed">
              * Verifique seu Código de Convênio no Santander antes de gerar remessas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
