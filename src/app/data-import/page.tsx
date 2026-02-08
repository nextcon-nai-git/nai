
"use client"

import * as React from "react"
import { Loader2, Database, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch, collection } from "firebase/firestore"
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

      // 3. Importar Histórico (Auditores)
      REAL_EXAMS_HISTORY.forEach((hist, i) => {
        const docRef = doc(db, "companies", hist.companyId, "examHistory", `hist_${i}`)
        batch.set(docRef, { ...hist, createdAt: new Date().toISOString() })
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

      <Card>
        <CardHeader>
          <CardTitle>Arquitetura de Dados</CardTitle>
          <CardDescription>O sistema utiliza o padrão /companies/{`{id}`}/employees para isolamento total.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
            <Scale className="size-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700 font-bold uppercase">
              As sub-coleções garantem que os dados médicos e de engenharia sejam acessados apenas por usuários autorizados, respeitando o multi-tenancy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
