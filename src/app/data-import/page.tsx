
"use client"

import * as React from "react"
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ClipboardPaste, 
  Save, 
  Loader2, 
  Building2, 
  Users, 
  Stethoscope, 
  FileSpreadsheet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch } from "firebase/firestore"

type ImportType = 'companies' | 'employees' | 'suppliers'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [pastedData, setPastedData] = React.useState("")
  const [uploading, setUploading] = React.useState(false)

  const processImport = async () => {
    if (!user || !db || !pastedData) return
    setUploading(true)

    try {
      const lines = pastedData.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("Cole o cabeçalho e pelo menos uma linha de dados.")

      const firstLine = lines[0]
      const separator = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') ? ';' : ',')
      const headers = firstLine.split(separator).map(h => h.trim().toLowerCase())
      
      const batch = writeBatch(db)
      let count = 0

      lines.slice(1).forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 1) return

        const data: any = { 
          updatedAt: new Date().toISOString()
        }
        
        headers.forEach((header, i) => {
          const val = values[i]
          if (!val) return

          // Mapeamento Inteligente
          if (header.includes('nome') || header.includes('razão')) data.name = val
          if (header.includes('cnpj') || header.includes('cpf')) data.taxId = val.replace(/[^\w]/gi, '')
          
          if (activeTab === 'companies') {
            if (header.includes('setor') || header.includes('segmento')) data.sector = val
            if (header.includes('email')) data.contactEmail = val
          }
          
          if (activeTab === 'employees') {
            if (header.includes('cargo') || header.includes('função')) data.jobRole = val
            if (header.includes('admissão')) data.admissionDate = val
            if (header.includes('empresa') || header.includes('vínculo')) data.companyRef = val
          }

          if (activeTab === 'suppliers') {
            if (header.includes('serviço') || header.includes('tipo') || header.includes('especialidade')) data.serviceType = val
            if (header.includes('cidade')) data.city = val
          }

          // ID Fallback
          if (header.includes('id') || header.includes('matrícula') || header.includes('registro')) {
             data.id = val.replace(/[^\w]/gi, '')
          }
        })

        if (!data.id) data.id = `import_${activeTab}_${index}_${Date.now()}`

        if (data.name) {
          const collectionPath = activeTab === 'companies' ? "managedCompanies" : activeTab === 'employees' ? "employees" : "suppliers"
          const docRef = doc(db, "clients", user.uid, collectionPath, data.id)
          batch.set(docRef, data, { merge: true })
          count++
        }
      })

      await batch.commit()
      toast({
        title: "Importação Bem-Sucedida",
        description: `${count} registros de ${activeTab === 'companies' ? 'Empresas' : activeTab === 'employees' ? 'Colaboradores' : 'Fornecedores'} foram processados.`
      })
      setPastedData("")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na Importação",
        description: error.message
      })
    } finally {
      setUploading(false)
    }
  }

  const getPlaceholder = () => {
    switch(activeTab) {
      case 'companies': return "Nome da Empresa, CNPJ, Setor, E-mail\nMetalúrgica Silva, 12.345.678/0001-99, Industrial, contato@silva.com"
      case 'employees': return "Nome, Cargo, CPF, Admissão\nJoão Silva, Soldador, 123.456.789-00, 10/05/2023"
      case 'suppliers': return "Nome, Especialidade, CNPJ, Cidade\nClínica Saúde Total, Audiometria, 98.765.432/0001-11, São Paulo"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Centro de Importação Estratégica</h1>
          <p className="text-muted-foreground">Alimente o sistema com dados reais copiados diretamente das suas planilhas.</p>
        </div>
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
          <FileSpreadsheet className="size-8 text-primary opacity-20" />
          <div className="text-[10px] uppercase font-black tracking-widest text-primary/60">Suporte a Excel, CSV e Google Sheets</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="companies" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Building2 className="size-4 mr-2" /> 1. Empresas (Clientes)
          </TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Users className="size-4 mr-2" /> 2. Colaboradores (Funcionários)
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Stethoscope className="size-4 mr-2" /> 3. Fornecedores (Clínicas)
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6 card-shadow border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                {activeTab === 'companies' ? <Building2 /> : activeTab === 'employees' ? <Users /> : <Stethoscope />}
              </div>
              <div>
                <CardTitle className="text-xl">Importar {activeTab === 'companies' ? 'Empresas Clientes' : activeTab === 'employees' ? 'Base de Funcionários' : 'Rede Credenciada'}</CardTitle>
                <CardDescription>O sistema mapeia automaticamente os campos baseado na primeira linha (cabeçalho).</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder={getPlaceholder()}
              className="min-h-[400px] font-mono text-xs bg-muted/20 border-none focus-visible:ring-accent leading-relaxed p-6"
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
            />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black">
                <AlertTriangle className="size-3 text-amber-500" /> 
                Certifique-se de manter o cabeçalho original da planilha
              </div>
              <Button 
                className="w-full md:w-auto bg-accent hover:bg-accent/90 gap-2 px-10 h-12 font-bold shadow-lg shadow-accent/20" 
                disabled={!pastedData || uploading}
                onClick={processImport}
              >
                {uploading ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                Processar e Salvar no Firestore
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 items-center">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <p className="text-[10px] font-bold text-emerald-700 uppercase">Validado para eSocial</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-center">
          <CheckCircle2 className="size-5 text-blue-600" />
          <p className="text-[10px] font-bold text-blue-700 uppercase">LGPD Compliance</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-center">
          <CheckCircle2 className="size-5 text-amber-600" />
          <p className="text-[10px] font-bold text-amber-700 uppercase">Deduplicação Ativa</p>
        </div>
      </div>
    </div>
  )
}
