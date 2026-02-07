"use client"

import * as React from "react"
import { 
  Loader2, 
  Database,
  Scale,
  Stethoscope
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch, collection, getDocs } from "firebase/firestore"
import { REAL_EMPLOYEES, REAL_COMPANIES, REAL_EXAMS_HISTORY, REAL_EXAMS } from "@/lib/real-data"

type ImportType = 'companies' | 'employees' | 'expertises' | 'exams' | 'history'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [uploading, setUploading] = React.useState(false)

  const setupProfileByRole = async (targetRole: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'EMPLOYEE' | 'PROVIDER') => {
    if (!user || !db) return
    setUploading(true)
    
    try {
      const batch = writeBatch(db)
      batch.set(doc(db, "users", user.uid), {
        id: user.uid,
        name: "Gestor NextCon",
        role: targetRole,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      await batch.commit()
      toast({ title: "Papel Atualizado", description: `Ambiente configurado para ${targetRole}.` })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao configurar perfil" })
    } finally {
      setUploading(false)
    }
  }

  const handleRealBaseImport = async () => {
    if (!user || !db) return
    setUploading(true)
    
    try {
      // 1. Limpar e Importar Empresas
      const compBatch = writeBatch(db)
      REAL_COMPANIES.forEach(comp => {
        const docRef = doc(db, "clients", user.uid, "managedCompanies", comp.id)
        compBatch.set(docRef, { ...comp, status: "ACTIVE", updatedAt: new Date().toISOString() }, { merge: true })
      })
      await compBatch.commit()

      // 2. Importar Colaboradores
      const empBatch = writeBatch(db)
      REAL_EMPLOYEES.forEach((emp) => {
        const docRef = doc(db, "clients", user.uid, "employees", emp.id)
        empBatch.set(docRef, { ...emp, status: "ACTIVE", createdAt: new Date().toISOString() })
      })
      await empBatch.commit()

      // 3. Importar Histórico de Exames (A LINHA QUE VINCULA TUDO)
      const histBatch = writeBatch(db)
      REAL_EXAMS_HISTORY.forEach((hist, i) => {
        const docRef = doc(db, "clients", user.uid, "examHistory", `hist_${i}`)
        histBatch.set(docRef, { ...hist, createdAt: new Date().toISOString() })
      })
      await histBatch.commit()

      toast({
        title: "Carga Massiva Concluída",
        description: `Base de ${REAL_COMPANIES.length} empresas, ${REAL_EMPLOYEES.length} funcionários e ${REAL_EXAMS_HISTORY.length} exames vinculada.`
      })
    } catch (e) {
      console.error(e)
      toast({ variant: "destructive", title: "Erro na Carga Real" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-[#002d9c] tracking-tight uppercase">Arquitetura Segmentada 2026</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Adapte o sistema por vertical de negócio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-[#002d9c] text-[#002d9c]" onClick={() => setupProfileByRole('SUPER_ADMIN')}>SUPER ADMIN</Button>
          <Button variant="outline" size="sm" className="gap-2 border-[#00b4ff] text-[#00b4ff]" onClick={() => setupProfileByRole('CLIENT_ADMIN')}>CLIENT ADMIN</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
          <TabsList className="grid w-full md:w-[800px] grid-cols-5 bg-muted/50 p-1 rounded-xl h-14">
            <TabsTrigger value="companies" className="rounded-lg gap-2">Empresas</TabsTrigger>
            <TabsTrigger value="employees" className="rounded-lg gap-2">Colaboradores</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg gap-2">Histórico Exames</TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg gap-2">Catálogo NRs</TabsTrigger>
          </TabsList>
          
          <Button className="bg-[#002d9c] text-white hover:bg-[#002d9c]/90 gap-2 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl" onClick={handleRealBaseImport} disabled={uploading}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4 text-[#00b4ff]" />}
            Carga Real (Completa)
          </Button>
        </div>

        <Card className="mt-6 border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle>Importador Jurídico & Operacional</CardTitle>
            <CardDescription>Gerencie dados dinâmicos e histórico de envios eSocial.</CardDescription>
          </CardHeader>
          <CardContent>
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="text-sm font-black uppercase tracking-widest animate-pulse">NAI Processando Base Técnica Real...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                  <Scale className="size-5 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-700 font-bold uppercase leading-tight">
                    O sistema vinculou automaticamente {REAL_EXAMS_HISTORY.length} registros de exames às empresas Construfam, Gula, Promatec e outras.
                  </p>
                </div>
                
                {activeTab === 'history' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {REAL_EXAMS_HISTORY.map((hist, i) => (
                      <div key={i} className="p-3 bg-muted/20 rounded-lg flex flex-col gap-1 border">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-[#002d9c] uppercase">{hist.companyName}</span>
                          <span className="text-[9px] font-bold text-muted-foreground">{hist.date}</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary truncate">{hist.employeeName}</span>
                        <div className="flex gap-1">
                          <span className={`text-[8px] px-1 rounded ${hist.aso === 'OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>ASO: {hist.aso}</span>
                          <span className={`text-[8px] px-1 rounded ${hist.s2220 === 'OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>S2220: {hist.s2220}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Textarea placeholder="Cole CSV aqui para carga manual..." className="min-h-[200px] font-mono text-xs bg-muted/20" />
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
