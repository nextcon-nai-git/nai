
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
  CalendarDays
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useStorage } from "@/firebase"
import { doc, writeBatch, collection, query, orderBy, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { DEMO_PROVIDERS } from "@/lib/demo-providers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ImportType = 'companies' | 'employees' | 'exams' | 'providers' | 'files'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [pastedData, setPastedData] = React.useState("")
  const [uploading, setUploading] = React.useState(false)

  const [selectedCompanyId, setSelectedCompanyId] = React.useState("")
  const [selectedReportType, setSelectedReportType] = React.useState("pgr")
  const [fileToUpload, setFileToUpload] = React.useState<File | null>(null)

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])

  const { data: companies } = useCollection(companiesQuery)

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
        companyId: targetRole === 'CLIENT_ADMIN' ? "demo_construction_123" : null,
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

  const seedSegmentedCompanies = async () => {
    if (!user || !db) return
    setUploading(true)
    const segmentedClinics = [
      { id: "demo_construction_123", name: "CONSTRUTORA ALPHA", segment: "CONSTRUCTION", cnpj: "11.111.111/0001-01", city: "Curitiba" },
      { id: "demo_hospital_123", name: "HOSPITAL SANTA CRUZ", segment: "HOSPITAL", cnpj: "22.222.222/0001-02", city: "São Paulo" },
      { id: "demo_industry_123", name: "METALÚRGICA NORTE", segment: "INDUSTRY", cnpj: "33.333.333/0001-03", city: "Manaus" },
      { id: "demo_general_123", name: "MICALEX CONSULTORIA", segment: "GENERAL", cnpj: "44.444.444/0001-04", city: "Curitiba" }
    ]

    try {
      const batch = writeBatch(db)
      segmentedClinics.forEach((clinic) => {
        const docRef = doc(db, "clients", user.uid, "managedCompanies", clinic.id)
        batch.set(docRef, {
          ...clinic,
          status: "ACTIVE",
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })
      await batch.commit()
      toast({ title: "Empresas Segmentadas", description: "4 empresas de diferentes verticais foram criadas." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na Carga" })
    } finally {
      setUploading(false)
    }
  }

  const seedAgendaEvents = async () => {
    if (!user || !db || !companies || companies.length === 0) {
      toast({ variant: "destructive", title: "Carga Indisponível", description: "Primeiro importe empresas." })
      return
    }
    setUploading(true)
    try {
      const batch = writeBatch(db)
      for (let i = 0; i < 5; i++) {
        const company = companies[i % companies.length]
        const eventId = `event_${Date.now()}_${i}`
        const docRef = doc(db, "clients", user.uid, "sst_events", eventId)
        batch.set(docRef, {
          id: eventId,
          type: i % 2 === 0 ? "Inspeção NR-18" : "Exame Clínico",
          time: "09:00",
          companyName: company.name,
          location: company.city,
          date: new Date().toISOString(),
          status: "SCHEDULED"
        })
      }
      await batch.commit()
      toast({ title: "Agenda Criada", description: "Eventos reais vinculados aos seus clientes." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro" })
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
            CLIENT ADMIN
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
          <TabsList className="grid w-full md:w-[700px] grid-cols-5 bg-muted/50 p-1 rounded-xl h-14">
            <TabsTrigger value="companies" className="rounded-lg gap-2">Empresas</TabsTrigger>
            <TabsTrigger value="employees" className="rounded-lg gap-2">Vidas</TabsTrigger>
            <TabsTrigger value="providers" className="rounded-lg gap-2">Rede</TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg gap-2">Eventos</TabsTrigger>
            <TabsTrigger value="files" className="rounded-lg gap-2">Docs</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {activeTab === 'companies' && (
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 gap-2 h-14 rounded-xl font-bold" onClick={seedSegmentedCompanies}>
                <DatabaseZap className="size-5" /> Seed: Empresas por Setor
              </Button>
            )}
            {activeTab === 'exams' && (
              <Button variant="outline" className="border-primary text-primary h-14 rounded-xl font-bold" onClick={seedAgendaEvents}>
                <CalendarDays className="size-5" /> Seed: Agenda Real
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-6 border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle>Importador NEXTCON</CardTitle>
            <CardDescription>Gerencie dados dinâmicos do seu sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Cole CSV aqui..." className="min-h-[300px] font-mono text-xs bg-muted/20" />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
