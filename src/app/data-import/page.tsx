
"use client"

import * as React from "react"
import { 
  Upload, 
  Save, 
  Loader2, 
  Building2, 
  Users, 
  ShieldAlert, 
  UserCheck, 
  HeartPulse,
  DatabaseZap,
  MapPin,
  FileUp,
  CalendarDays,
  Trash2,
  Database,
  Gavel,
  Scale,
  Stethoscope
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { doc, writeBatch, collection, query, orderBy, getDocs, deleteDoc } from "firebase/firestore"
import { REAL_EMPLOYEES, REAL_COMPANIES, REAL_EXPERTISES, REAL_EXAMS } from "@/lib/real-data"

type ImportType = 'companies' | 'employees' | 'expertises' | 'exams' | 'providers'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [uploading, setUploading] = React.useState(false)

  const setupProfileByRole = async (targetRole: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'EMPLOYEE' | 'PROVIDER') => {
    if (!user || !db) return
    setUploading(true)
    
    let name = user.email?.split('@')[0] || "Usuário"
    if (name === 'nextcon') name = 'Felipe'

    try {
      const batch = writeBatch(db)

      batch.set(doc(db, "users", user.uid), {
        id: user.uid,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: targetRole,
        email: user.email,
        companyId: targetRole === 'CLIENT_ADMIN' ? "CLI037" : null,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await batch.commit()

      toast({
        title: "Papel Atualizado",
        description: `Ambiente configurado para ${targetRole}.`
      })
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
      // 1. Limpar Colaboradores
      const empRef = collection(db, "clients", user.uid, "employees")
      const empSnap = await getDocs(empRef)
      
      // 2. Limpar Perícias
      const expertRef = collection(db, "clients", user.uid, "legalExpertises")
      const expertSnap = await getDocs(expertRef)

      const clearBatch = writeBatch(db)
      empSnap.docs.forEach(d => clearBatch.delete(d.ref))
      expertSnap.docs.forEach(d => clearBatch.delete(d.ref))
      await clearBatch.commit()

      // 3. Importar Empresas
      const compBatch = writeBatch(db)
      REAL_COMPANIES.forEach(comp => {
        const docRef = doc(db, "clients", user.uid, "managedCompanies", comp.id)
        compBatch.set(docRef, {
          ...comp,
          status: "ACTIVE",
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })
      await compBatch.commit()

      // 4. Importar Colaboradores
      const empBatch = writeBatch(db)
      REAL_EMPLOYEES.forEach((emp, i) => {
        const empId = emp.id || `real_emp_${i}`
        const docRef = doc(db, "clients", user.uid, "employees", empId)
        empBatch.set(docRef, {
          ...emp,
          id: empId,
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        })
      })
      await empBatch.commit()

      // 5. Importar Perícias
      const expertBatch = writeBatch(db)
      REAL_EXPERTISES.forEach((exp) => {
        const docRef = doc(db, "clients", user.uid, "legalExpertises", exp.id)
        expertBatch.set(docRef, {
          ...exp,
          createdAt: new Date().toISOString()
        })
      })
      await expertBatch.commit()

      // 6. Importar Catálogo de Exames (Product Services)
      const examBatch = writeBatch(db)
      REAL_EXAMS.forEach((exam, i) => {
        const examId = `exam_${i.toString().padStart(3, '0')}`
        const docRef = doc(db, "product_services", examId)
        examBatch.set(docRef, {
          id: examId,
          name: exam.name,
          description: "Exame Ocupacional / Complementar",
          serviceGroupId: "OCCUPATIONAL_EXAMS",
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })
      await examBatch.commit()

      toast({
        title: "Carga Massiva Concluída",
        description: `Base real de ${REAL_COMPANIES.length} empresas, ${REAL_EMPLOYEES.length} funcionários, ${REAL_EXPERTISES.length} perícias e ${REAL_EXAMS.length} exames importada.`
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
          <h1 className="text-3xl font-headline font-bold text-[#090e24] tracking-tight">Arquitetura Segmentada 2026</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Adapte o sistema por vertical de negócio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-[#090e24] text-[#090e24]" onClick={() => setupProfileByRole('SUPER_ADMIN')}>
            SUPER ADMIN
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-[#f59e0b] text-[#f59e0b]" onClick={() => setupProfileByRole('CLIENT_ADMIN')}>
            CLIENT ADMIN (Britânia)
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
          <TabsList className="grid w-full md:w-[800px] grid-cols-5 bg-muted/50 p-1 rounded-xl h-14">
            <TabsTrigger value="companies" className="rounded-lg gap-2">Empresas</TabsTrigger>
            <TabsTrigger value="employees" className="rounded-lg gap-2">Colaboradores</TabsTrigger>
            <TabsTrigger value="expertises" className="rounded-lg gap-2">Perícias (Novas)</TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg gap-2">Catálogo Exames</TabsTrigger>
            <TabsTrigger value="providers" className="rounded-lg gap-2">Rede</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button className="bg-[#090e24] text-white hover:bg-[#090e24]/90 gap-2 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl" onClick={handleRealBaseImport} disabled={uploading}>
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4 text-[#f59e0b]" />}
              Carga Real (Completa)
            </Button>
          </div>
        </div>

        <Card className="mt-6 border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle>Importador Jurídico & Operacional</CardTitle>
            <CardDescription>Gerencie dados dinâmicos das empresas clientes e catálogo de serviços.</CardDescription>
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
                    A carga real agora inclui a Britânia SA, Construfam Engenharia, 12 perícias críticas e o catálogo completo de 41 exames ocupacionais.
                  </p>
                </div>
                
                {activeTab === 'exams' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {REAL_EXAMS.map((exam, i) => (
                      <div key={i} className="p-3 bg-muted/20 rounded-lg flex items-center gap-2 border">
                        <Stethoscope className="size-3 text-primary opacity-40" />
                        <span className="text-[10px] font-bold text-primary truncate">{exam.name}</span>
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
