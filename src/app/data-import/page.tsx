
"use client"

import * as React from "react"
import { Loader2, Database, Scale, CheckCircle2, LayoutGrid, AlertCircle, FileSpreadsheet, Sparkles, Zap, TrendingUp, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch, collection, serverTimestamp } from "firebase/firestore"
import { REAL_EMPLOYEES, REAL_COMPANIES, REAL_EXAMS_HISTORY, DRE_2025_HISTORY, REAL_CONTRACTS } from "@/lib/real-data"

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [uploading, setUploading] = React.useState(false)
  const [uploadingDre, setUploadingDre] = React.useState(false)

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

      // 2. Importar Contratos Financeiros
      REAL_CONTRACTS.forEach(contract => {
        const docRef = doc(db, "companies", contract.companyId, "contracts", contract.id)
        batch.set(docRef, { ...contract, createdAt: now }, { merge: true })
      })

      // 3. Importar Funcionários como Sub-coleção
      REAL_EMPLOYEES.forEach((emp) => {
        const docRef = doc(db, "companies", emp.companyId, "employees", emp.id)
        batch.set(docRef, { ...emp, createdAt: now })
      })

      // 4. Importar Histórico de Exames
      REAL_EXAMS_HISTORY.forEach((hist, i) => {
        const docRef = doc(db, "companies", hist.companyId, "examHistory", `hist_${i}`)
        batch.set(docRef, { ...hist, createdAt: now })
      })

      await batch.commit()
      toast({ title: "Ecossistema Real Carregado", description: "Empresas, Contratos e Funcionários sincronizados." })
    } catch (e) {
      console.error(e)
      toast({ variant: "destructive", title: "Erro na Carga Real" })
    } finally {
      setUploading(false)
    }
  }

  const handleImportDre2025 = async () => {
    if (!user || !db) return
    setUploadingDre(true)
    
    try {
      const batch = writeBatch(db)
      const now = new Date().toISOString()

      const dreRef = doc(db, "financialStats", "DRE_2025_CONSOLIDATED")
      batch.set(dreRef, {
        year: 2025,
        data: DRE_2025_HISTORY,
        importedAt: now,
        status: "CLOSED",
        description: "DRE Consolidada Exercício 2025"
      }, { merge: true })

      await batch.commit()
      toast({ title: "DRE 2025 Importada!", description: "Dados históricos disponíveis no Dashboard Financeiro." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao importar DRE" })
    } finally {
      setUploadingDre(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Carga de Elite 2026</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Importação massiva para Multiapp, Contas e Operações.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="h-16 px-8 border-primary/20 text-primary hover:bg-primary/5 rounded-2xl gap-3 font-black uppercase text-xs tracking-widest"
            onClick={handleImportDre2025}
            disabled={uploadingDre}
          >
            {uploadingDre ? <Loader2 className="size-5 animate-spin" /> : <History className="size-5" />}
            Importar DRE 2025
          </Button>
          <Button 
            className="h-16 px-10 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 gap-3 font-black uppercase text-xs tracking-widest" 
            onClick={handleRealBaseImport} 
            disabled={uploading}
          >
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <Database className="size-5 text-accent" />}
            Sincronizar Base Global
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
              <FileSpreadsheet className="size-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-black text-primary uppercase">Contratos Importados</CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60">Status de faturamento e vigência.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex gap-3">
              <div className="size-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0"><Sparkles className="size-3" /></div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                <strong>{REAL_CONTRACTS.length} Contratos</strong> identificados na planilha mestra, incluindo BRDE, Britânia e TimeNow.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-emerald-500/10 transition-all">
          <CardHeader className="bg-emerald-50 pb-8">
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
              <TrendingUp className="size-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-black text-emerald-900 uppercase">Multiapp & CNPJs</CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60">Sincronização de múltiplos CNPJs.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-emerald-700/70 leading-relaxed font-medium italic">
              "A sincronização de clientes, produtos e fornecedores é automática entre empresas do mesmo grupo."
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
              <p className="text-[10px] font-black uppercase text-accent mb-1">Estrutura Injetada:</p>
              <p className="text-xs font-medium opacity-70">TimeNow (Master) &gt; Britânia (Unidade)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
