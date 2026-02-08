
"use client"

import * as React from "react"
import { Loader2, Database, Scale, CheckCircle2 } from "lucide-react"
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

      // 1. Importar Empresas na Raiz
      REAL_COMPANIES.forEach(comp => {
        const docRef = doc(db, "companies", comp.id)
        batch.set(docRef, { ...comp, updatedAt: new Date().toISOString() }, { merge: true })
      })

      // 2. Importar Funcionários como Sub-coleção
      REAL_EMPLOYEES.forEach((emp) => {
        const docRef = doc(db, "companies", emp.companyId, "employees", emp.id)
        batch.set(docRef, { ...emp, createdAt: new Date().toISOString() })
      })

      // 3. Importar Histórico de Exames (Sub-coleção da Empresa)
      REAL_EXAMS_HISTORY.forEach((hist, i) => {
        const docRef = doc(db, "companies", hist.companyId, "examHistory", `hist_${i}`)
        batch.set(docRef, { ...hist, createdAt: new Date().toISOString() })
      })

      // 4. Importar Exemplo de Perícias (Sub-coleção da Empresa)
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
      toast({ title: "Carga Estruturada Concluída", description: "Dados organizados em sub-coleções multi-tenant." })
    } catch (e) {
      console.error(e)
      toast({ variant: "destructive", title: "Erro na Carga Real" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary uppercase">Importador de Elite 2026</h1>
        <Button className="bg-primary gap-2" onClick={handleRealBaseImport} disabled={uploading}>
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4" />}
          Carga Massiva (Sub-coleções)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Arquitetura Multi-tenant</CardTitle>
            <CardDescription>Estrutura profissional: /companies/{`{id}`}/employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Scale className="size-5 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-700 font-bold uppercase">
                As sub-coleções garantem isolamento total de dados médicos e técnicos por unidade.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desnormalização Inteligente</CardTitle>
            <CardDescription>Cargos duplicados nos funcionários para performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700 font-bold uppercase">
                Renderização instantânea de tabelas com milhares de vidas sem joins excessivos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
