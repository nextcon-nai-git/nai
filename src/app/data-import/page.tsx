
"use client"

import * as React from "react"
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Loader2, 
  Building2, 
  Users, 
  Stethoscope, 
  Gavel,
  FileUp,
  X,
  HeartPulse,
  UserCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch, setDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"

type ImportType = 'companies' | 'employees' | 'suppliers' | 'expertises' | 'exams'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [pastedData, setPastedData] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const setupMyProfile = async () => {
    if (!user || !db) return
    setUploading(true)
    
    let name = "Usuário Nextcon"
    let role = "Consultor"

    if (user.email?.includes('relacionamento')) { name = "Pablo"; role = "Comercial" }
    if (user.email?.includes('sso')) { name = "Kelly"; role = "Admin" }
    if (user.email?.includes('nextcon@')) { name = "Rodrigo Silva"; role = "Consultor HSE" }

    try {
      const batch = writeBatch(db)

      // 1. Perfil da Agência
      batch.set(doc(db, "clients", user.uid), {
        id: user.uid,
        name,
        role,
        email: user.email,
        company: "Nextcon SST",
        updatedAt: new Date().toISOString()
      }, { merge: true })

      // 2. Registro da própria Nextcon como Cliente
      batch.set(doc(db, "clients", user.uid, "managedCompanies", "44337647000189"), {
        id: "44337647000189",
        name: "NXC SST EMPRESARIAL LTDA NEXTCON",
        cnpj: "44.337.647/0001-89",
        sector: "Consultoria SST",
        city: "Curitiba - PR",
        pgrExpiry: "2026-08-13",
        contactEmail: "nextcon@nextconsaude.com.br",
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await batch.commit()

      toast({
        title: "Setup Concluído",
        description: `Bem-vindo, ${name}! Seu perfil e a empresa Nextcon foram cadastrados.`
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao configurar perfil" })
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv") || file.type === "text/plain")) {
      readFile(file)
    } else {
      toast({
        variant: "destructive",
        title: "Arquivo Inválido",
        description: "Por favor, arraste apenas arquivos CSV ou TXT."
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setPastedData(content)
      toast({
        title: "Arquivo Carregado",
        description: `O arquivo ${file.name} foi lido com sucesso.`
      })
    }
    reader.readAsText(file)
  }

  const processImport = async () => {
    if (!user || !db || !pastedData) return
    setUploading(true)

    try {
      const lines = pastedData.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("O arquivo deve conter o cabeçalho e pelo menos uma linha de dados.")

      const firstLine = lines[0]
      const separator = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') ? ';' : ',')
      const headers = firstLine.split(separator).map(h => h.trim().toLowerCase())
      
      const batch = writeBatch(db)
      let count = 0

      const dataRows = lines.slice(1)
      
      dataRows.forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 1) return

        const data: any = { 
          updatedAt: new Date().toISOString(),
          agencyId: user.uid
        }
        
        headers.forEach((header, i) => {
          const val = values[i]
          if (!val) return

          if (activeTab === 'companies') {
            if (header.includes('nome') || header.includes('razão') || header.includes('empresa')) data.name = val
            if (header.includes('setor')) data.sector = val
            if (header.includes('email')) data.contactEmail = val
            if (header.includes('cnpj')) data.cnpj = val.replace(/[^\w]/gi, '')
            if (header === 'id' || header === 'código') data.id = val
            if (!data.id) data.id = data.cnpj || `comp_${index}_${Date.now()}`
          }
          
          if (activeTab === 'employees') {
            if (header === 'nome' || header === 'colaborador' || header === 'funcionário' || header === 'nome do colaborador') {
              data.name = val
            }
            if (header.includes('cargo') || header.includes('função')) data.jobRole = val
            if (header.includes('admissão') || header.includes('data admissao')) data.admissionDate = val
            if (header === 'empresa' || header === 'unidade' || header === 'empresa cliente' || header === 'cliente') {
              data.companyId = val
            }
            if (header.includes('id_colaborador') || header.includes('matrícula') || header === 'id' || header === 'registro') {
              data.id = val
            }
          }

          if (activeTab === 'suppliers') {
            if (header.includes('nome') || header.includes('clínica') || header.includes('fornecedor')) data.name = val
            if (header.includes('serviço') || header.includes('tipo')) data.serviceType = val
            if (header.includes('cidade')) data.city = val
            if (header.includes('cnpj')) data.cnpj = val.replace(/[^\w]/gi, '')
            if (header === 'id') data.id = val
          }

          if (activeTab === 'expertises') {
            if (header.includes('processo') || header.includes('número')) data.caseNumber = val
            if (header.includes('tipo')) data.type = val
            if (header.includes('data')) data.date = val
            if (header.includes('status')) data.status = val
            if (header.includes('empresa')) data.companyId = val
            if (header === 'id') data.id = val
          }

          if (activeTab === 'exams') {
            if (header.includes('colaborador') || header === 'id_colaborador') data.employeeId = val
            if (header.includes('tipo') || header === 'tipo_exame') data.type = val
            if (header.includes('data_realizacao') || header.includes('realização') || header === 'data') data.date = val
            if (header.includes('data_validade') || header.includes('validade')) data.validity = val
            if (header.includes('apto_inapto') || header.includes('resultado')) data.result = val
            if (header.includes('status')) data.status = val
            if (header.includes('médico') || header.includes('medico')) data.doctor = val
            if (header.includes('id_evento') || header === 'id') data.id = val
          }
        })

        if (!data.id) {
          if (activeTab === 'companies' && data.cnpj) data.id = data.cnpj
          else if (activeTab === 'expertises' && data.caseNumber) data.id = data.caseNumber.replace(/[^\w]/gi, '')
          else data.id = `import_${activeTab}_${index}_${Date.now()}`
        }

        if (!data.name && data.id && activeTab !== 'exams' && activeTab !== 'expertises') {
           data.name = "Registro Importado " + data.id
        }

        const collectionPath = 
          activeTab === 'companies' ? "managedCompanies" : 
          activeTab === 'employees' ? "employees" : 
          activeTab === 'suppliers' ? "suppliers" : 
          activeTab === 'expertises' ? "legalExpertises" : "medicalExams"

        const docRef = doc(db, "clients", user.uid, collectionPath, data.id)
        batch.set(docRef, data, { merge: true })
        count++
      })

      await batch.commit()
      toast({
        title: "Importação Finalizada",
        description: `${count} registros salvos no sistema.`
      })
      setPastedData("")
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Processamento", description: error.message })
    } finally {
      setUploading(false)
    }
  }

  const getPlaceholder = () => {
    switch(activeTab) {
      case 'companies': return "Nome da Empresa, CNPJ, Setor\nMetalúrgica Silva, 12.345.678/0001-99, Industrial"
      case 'employees': return "Nome, Cargo, Matrícula, Admissão, Empresa\nJoão Silva, Soldador, 12345, 10/05/2023, Metalúrgica Silva"
      case 'suppliers': return "Nome, Especialidade, Cidade\nClínica Saúde, Audiometria, São Paulo"
      case 'expertises': return "Processo, Tipo, Data, Status, Empresa\n4829/2024, Insalubridade, 2024-05-20, Agendado, Metalúrgica Silva"
      case 'exams': return "ID_Evento, ID_Colaborador, Tipo_Exame, Data_Realizacao, Status\nEXA100, COL1001, Admissional, 14/01/2026, Concluído"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Centro de Importação de Dados</h1>
          <p className="text-muted-foreground">Gerencie sua agência e alimente a base de dados.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-accent text-accent" onClick={setupMyProfile} disabled={uploading}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <UserCircle className="size-4" />}
            Configurar Meu Perfil e Nextcon
          </Button>
          <input type="file" id="file-upload" className="hidden" accept=".csv,.txt" onChange={handleFileSelect} />
          <Button variant="outline" className="gap-2" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileUp className="size-4" /> Selecionar Arquivo
            </label>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="companies" className="rounded-lg">
            <Building2 className="size-4 mr-2" /> 1. Empresas
          </TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg">
            <Users className="size-4 mr-2" /> 2. Colaboradores
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="rounded-lg">
            <Stethoscope className="size-4 mr-2" /> 3. Fornecedores
          </TabsTrigger>
          <TabsTrigger value="expertises" className="rounded-lg">
            <Gavel className="size-4 mr-2" /> 4. Perícias
          </TabsTrigger>
          <TabsTrigger value="exams" className="rounded-lg">
            <HeartPulse className="size-4 mr-2" /> 5. Exames
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6 card-shadow border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                  {activeTab === 'expertises' ? <Gavel /> : activeTab === 'exams' ? <HeartPulse /> : <Upload />}
                </div>
                <div>
                  <CardTitle className="text-xl">Importar {activeTab === 'expertises' ? 'Perícias' : activeTab === 'exams' ? 'Exames' : 'Dados'}</CardTitle>
                  <CardDescription>Processamento de CSV e colagens do Excel.</CardDescription>
                </div>
              </div>
              {pastedData && (
                <Button variant="ghost" size="sm" onClick={() => setPastedData("")}>
                  <X className="size-4 mr-1" /> Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative transition-all duration-300 rounded-xl border-2 border-dashed p-1",
                isDragging ? "border-accent bg-accent/5" : "border-muted bg-muted/20"
              )}
            >
              <Textarea 
                placeholder={getPlaceholder()}
                className="min-h-[400px] font-mono text-xs bg-transparent border-none focus-visible:ring-0 p-6"
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button 
                className="bg-primary px-10 h-12 font-bold" 
                disabled={!pastedData || uploading}
                onClick={processImport}
              >
                {uploading ? <Loader2 className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
                Confirmar e Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
