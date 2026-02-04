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
  Stethoscope,
  HeartPulse,
  DatabaseZap,
  MapPin
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch } from "firebase/firestore"
import { DEMO_PROVIDERS } from "@/lib/demo-providers"

type ImportType = 'companies' | 'employees' | 'exams' | 'providers'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [pastedData, setPastedData] = React.useState("")
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
        companyId: targetRole === 'SUPER_ADMIN' ? null : "comp_default_123",
        linkedEmployeeId: targetRole === 'EMPLOYEE' ? "emp_default_123" : null,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await batch.commit()

      toast({
        title: "Papel de Usuário Atualizado",
        description: `Ambiente configurado para visão de ${targetRole.replace('_', ' ')}.`
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao configurar perfil" })
    } finally {
      setUploading(false)
    }
  }

  const seedClinicsCuritiba = async () => {
    if (!user || !db) return
    setUploading(true)
    const clinics = [
      { name: "ACESSO SAÚDE (Centro)", phone: "(41) 3025-3500", address: "R. Barão do Serro Azul, 198 - Centro", city: "Curitiba" },
      { name: "APTO BRASIL", phone: "(41) 3155-9100", address: "R. Mal. Deodoro, 344 (9º andar) - Centro", city: "Curitiba" },
      { name: "AUDIOMED", phone: "(41) 3078-3651", address: "R. da Paz, 195 - Centro", city: "Curitiba" },
      { name: "CENTRO MÉD. FAZENDINHA", phone: "(41) 4042-1220", address: "Av. Cândido de Abreu, 651 - Centro Cívico", city: "Curitiba" },
      { name: "CLÍNICA ADVENTISTA", phone: "(41) 3240-2900", address: "Al. Júlia da Costa, 1447 - Bigorrilho", city: "Curitiba" },
      { name: "CLINICA MEDTEC", phone: "(41) 3779-9942", address: "R. Jaime Rodrigues da Rocha, 140 - Capão Raso", city: "Curitiba" },
      { name: "CLINICA SQV", phone: "(41) 3078-7767", address: "Al. Alípia Marques Verchai, 30 - Portão", city: "Curitiba" },
      { name: "CLINIMERCES (Matriz)", phone: "(41) 3082-8281", address: "R. Anne Frank, 1735 - Hauer", city: "Curitiba" },
      { name: "DELTA SAÚDE", phone: "(41) 3027-1914", address: "Av. Pres. Getúlio Vargas, 593 - Rebouças", city: "Curitiba" },
      { name: "IMTEP (Saúde Corporativa)", phone: "(41) 3093-7600", address: "R. Emiliano Perneta, 297 - Centro", city: "Curitiba" },
      { name: "JOY MEDICINA E SEG.", phone: "(41) 98781-6915", address: "Av. Mal. Floriano Peixoto, 1949 - Rebouças", city: "Curitiba" },
      { name: "MAXIPAS (Matriz)", phone: "(41) 3017-2200", address: "R. Monsenhor Celso, 256 - Centro", city: "Curitiba" },
      { name: "METACLIN", phone: "(41) 3088-7885", address: "R. Presidente Faria, 421 - Centro", city: "Curitiba" },
      { name: "MICALEX CONSULTORIA", phone: "(41) 3206-6194", address: "R. Nestor Victor, 985 - Água Verde", city: "Curitiba" },
      { name: "POLI MEDICINA", phone: "(41) 3021-7654", address: "R. Pedro Zagonel, 115 - Novo Mundo", city: "Curitiba" },
      { name: "SOMCAL", phone: "(41) 3060-1569", address: "Av. Brasil, 2222 - Fazenda Rio Grande", city: "Curitiba" },
      { name: "UNIMED (SOU)", phone: "0800 642 2002", address: "R. Pe. Germano Mayer, 840 - Cristo Rei", city: "Curitiba" },
      { name: "WORKING MEDICINA", phone: "(41) 3223-4577", address: "R. Mal. Deodoro, 51 - Centro", city: "Curitiba" }
    ]

    try {
      const batch = writeBatch(db)
      clinics.forEach((clinic, i) => {
        const docRef = doc(db, "clients", user.uid, "managedCompanies", `curitiba_partner_${i}`)
        batch.set(docRef, {
          ...clinic,
          cnpj: `00.000.000/0001-${i}`,
          status: "ACTIVE",
          type: "PARTNER",
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })
      await batch.commit()
      toast({ title: "Rede Curitiba Cadastrada", description: "18 clínicas parceiras foram adicionadas à base NEXTCON." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na Carga de Clínicas" })
    } finally {
      setUploading(false)
    }
  }

  const seedProviders = async () => {
    if (!user || !db) return
    setUploading(true)
    try {
      const batch = writeBatch(db)
      DEMO_PROVIDERS.forEach((provider) => {
        const docRef = doc(db, "providers", provider.legacyId)
        batch.set(docRef, {
          ...provider,
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })
      await batch.commit()
      toast({ 
        title: "Carga Inicial Concluída", 
        description: `${DEMO_PROVIDERS.length} prestadores foram importados para a base NEXTCON.` 
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na Carga Inicial" })
    } finally {
      setUploading(false)
    }
  }

  const processImport = async () => {
    if (!user || !db || !pastedData) return
    setUploading(true)

    try {
      const lines = pastedData.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("O arquivo deve conter o cabeçalho e pelo menos uma linha de dados.")

      const separator = lines[0].includes(';') ? ';' : ','
      const headers = lines[0].split(separator).map(h => h.trim())
      
      const batch = writeBatch(db)
      let count = 0

      lines.slice(1).forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 1) return

        let data: any = { updatedAt: new Date().toISOString() }

        if (activeTab === 'providers') {
          const row: any = {}
          headers.forEach((h, i) => row[h] = values[i])

          data = {
            legacyId: row["Código Original"] || row["legacyId"] || `L${index}`,
            displayName: row["Nome Completo"] || row["displayName"] || "Sem Nome",
            email: row["email"] || `prestador_${index}@nai.com.br`,
            role: "PROVIDER",
            professionalId: {
              number: row["Número do Conselho"] || "N/I",
              type: row["Conselho"] || "CRM"
            },
            status: row["Ativo"] === "Sim" || row["status"] === "ACTIVE" ? "ACTIVE" : "INACTIVE",
            permissions: {
              canIssueASO: row["ASO"] === "Sim" || row["canIssueASO"] === "true",
              canManage: row["Gere"] === "Sim" || row["canManage"] === "true",
              canExam: row["Exam"] === "Sim" || row["canExam"] === "true",
              canSchedule: row["Agen"] === "Sim" || row["canSchedule"] === "true"
            },
            updatedAt: new Date().toISOString()
          }
        } else {
          headers.forEach((header, i) => {
            if (values[i]) data[header.toLowerCase()] = values[i]
          })
        }

        const collectionPath = 
          activeTab === 'companies' ? `clients/${user.uid}/managedCompanies` : 
          activeTab === 'employees' ? `clients/${user.uid}/employees` : 
          activeTab === 'providers' ? `providers` :
          `clients/${user.uid}/sst_events`;

        const docId = data.id || data.cnpj || data.legacyId || `import_${index}_${Date.now()}`
        const docRef = doc(db, collectionPath, docId)
        batch.set(docRef, data, { merge: true })
        count++
      })

      await batch.commit()
      toast({ title: "Importação Finalizada", description: `${count} registros processados.` })
      setPastedData("")
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Processamento", description: error.message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-[#090e24] tracking-tight tracking-tighter">Arquitetura NEXTCON SST 2026</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Alternar Perfis e Importar Dados</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-[#090e24] text-[#090e24]" onClick={() => setupProfileByRole('SUPER_ADMIN')} disabled={uploading}>
            <ShieldAlert className="size-4" /> SUPER ADMIN
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-[#f59e0b] text-[#f59e0b]" onClick={() => setupProfileByRole('CLIENT_ADMIN')} disabled={uploading}>
            <Building2 className="size-4" /> CLIENT ADMIN
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-emerald-600 text-emerald-600" onClick={() => setupProfileByRole('EMPLOYEE')} disabled={uploading}>
            <UserCheck className="size-4" /> EMPLOYEE
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-blue-600 text-blue-600" onClick={() => setupProfileByRole('PROVIDER')} disabled={uploading}>
            <HeartPulse className="size-4" /> PROVIDER
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4 bg-muted/50 p-1 rounded-xl h-14">
            <TabsTrigger value="companies" className="rounded-lg gap-2">
              <Building2 className="size-4" /> Empresas
            </TabsTrigger>
            <TabsTrigger value="employees" className="rounded-lg gap-2">
              <Users className="size-4" /> Funcionários
            </TabsTrigger>
            <TabsTrigger value="providers" className="rounded-lg gap-2">
              <Stethoscope className="size-4" /> Prestadores
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg gap-2">
              <HeartPulse className="size-4" /> Eventos SST
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full md:w-auto">
            {activeTab === 'companies' && (
              <Button 
                variant="outline" 
                className="border-[#090e24] text-[#090e24] hover:bg-[#090e24]/10 gap-2 h-14 rounded-xl px-6 font-bold flex-1 md:flex-none"
                onClick={seedClinicsCuritiba}
                disabled={uploading}
              >
                <MapPin className="size-5" />
                Seed: Clínicas Curitiba
              </Button>
            )}
            {activeTab === 'providers' && (
              <Button 
                variant="outline" 
                className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10 gap-2 h-14 rounded-xl px-6 font-bold flex-1 md:flex-none"
                onClick={seedProviders}
                disabled={uploading}
              >
                <DatabaseZap className="size-5" />
                Carga Inicial: 100+ Prestadores
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-6 border-none shadow-xl bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                  <Upload />
                </div>
                <div>
                  <CardTitle className="text-xl">Importador em Lote</CardTitle>
                  <CardDescription>
                    {activeTab === 'providers' 
                      ? "Use o botão 'Carga Inicial' ou cole CSV: Código Original; Nome Completo; Ativo; ASO; Gere; Exam; Agen" 
                      : "Cole dados CSV para popular seu ambiente exclusivo."}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Cole aqui seus dados..."
              className="min-h-[350px] font-mono text-xs bg-muted/20 p-6"
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
            />
            <div className="flex justify-end pt-4 border-t">
              <Button 
                className="bg-[#090e24] px-10 h-12 font-bold" 
                disabled={!pastedData || uploading}
                onClick={processImport}
              >
                {uploading ? <Loader2 className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
                Confirmar Importação Manual
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
