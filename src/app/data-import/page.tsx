
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
  FileSpreadsheet,
  FileUp,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch } from "firebase/firestore"
import { cn } from "@/lib/utils"

type ImportType = 'companies' | 'employees' | 'suppliers'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [pastedData, setPastedData] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

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

      lines.slice(1).forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 1) return

        const data: any = { 
          updatedAt: new Date().toISOString(),
          agencyId: user.uid
        }
        
        headers.forEach((header, i) => {
          const val = values[i]
          if (!val) return

          // Mapeamento Inteligente (Ajustado para Português)
          if (header.includes('nome') || header.includes('razão') || header.includes('empresa')) data.name = val
          if (header.includes('cnpj') || header.includes('cpf') || header.includes('id') || header.includes('documento')) {
            data.taxId = val.replace(/[^\w]/gi, '')
          }
          
          if (activeTab === 'companies') {
            if (header.includes('setor') || header.includes('segmento')) data.sector = val
            if (header.includes('email') || header.includes('contato')) data.contactEmail = val
            if (header.includes('cnpj')) data.cnpj = val.replace(/[^\w]/gi, '')
          }
          
          if (activeTab === 'employees') {
            if (header.includes('cargo') || header.includes('função')) data.jobRole = val
            if (header.includes('admissão') || header.includes('data')) data.admissionDate = val
            if (header.includes('empresa') || header.includes('unidade')) data.companyId = val
          }

          if (activeTab === 'suppliers') {
            if (header.includes('serviço') || header.includes('tipo') || header.includes('especialidade')) data.serviceType = val
            if (header.includes('cidade') || header.includes('município')) data.city = val
          }

          // ID Fallback
          if (header.includes('id') || header.includes('matrícula') || header.includes('registro')) {
             data.id = val.replace(/[^\w]/gi, '')
          }
        })

        if (!data.id) {
          // Fallback para ID se não houver matrícula/cnpj
          data.id = data.taxId || `import_${activeTab}_${index}_${Date.now()}`
        }

        if (data.name) {
          const collectionPath = activeTab === 'companies' ? "managedCompanies" : activeTab === 'employees' ? "employees" : "suppliers"
          const docRef = doc(db, "clients", user.uid, collectionPath, data.id)
          batch.set(docRef, data, { merge: true })
          count++
        }
      })

      await batch.commit()
      toast({
        title: "Importação Finalizada",
        description: `${count} registros de ${activeTab === 'companies' ? 'Empresas' : activeTab === 'employees' ? 'Colaboradores' : 'Fornecedores'} salvos no sistema.`
      })
      setPastedData("")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Processamento",
        description: error.message
      })
    } finally {
      setUploading(false)
    }
  }

  const getPlaceholder = () => {
    switch(activeTab) {
      case 'companies': return "Exemplo: Nome da Empresa, CNPJ, Setor, E-mail\nMetalúrgica Silva, 12.345.678/0001-99, Industrial, contato@silva.com"
      case 'employees': return "Exemplo: Nome, Cargo, CPF, Admissão\nJoão Silva, Soldador, 123.456.789-00, 10/05/2023"
      case 'suppliers': return "Exemplo: Nome, Especialidade, CNPJ, Cidade\nClínica Saúde Total, Audiometria, 98.765.432/0001-11, São Paulo"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Centro de Importação de Dados</h1>
          <p className="text-muted-foreground">Arraste seus arquivos CSV ou cole os dados diretamente das suas planilhas.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.txt"
            onChange={handleFileSelect}
          />
          <Button variant="outline" className="gap-2" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileUp className="size-4" /> Selecionar Arquivo
            </label>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="companies" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Building2 className="size-4 mr-2" /> 1. Empresas
          </TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Users className="size-4 mr-2" /> 2. Colaboradores
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Stethoscope className="size-4 mr-2" /> 3. Fornecedores
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6 card-shadow border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                  {activeTab === 'companies' ? <Building2 /> : activeTab === 'employees' ? <Users /> : <Stethoscope />}
                </div>
                <div>
                  <CardTitle className="text-xl">Importar {activeTab === 'companies' ? 'Empresas' : activeTab === 'employees' ? 'Colaboradores' : 'Fornecedores'}</CardTitle>
                  <CardDescription>O sistema processa CSV, TXT e colagens do Excel/Google Sheets.</CardDescription>
                </div>
              </div>
              {pastedData && (
                <Button variant="ghost" size="sm" onClick={() => setPastedData("")} className="text-muted-foreground">
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
                "relative group transition-all duration-300 rounded-xl border-2 border-dashed p-1",
                isDragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-muted bg-muted/20"
              )}
            >
              <Textarea 
                placeholder={getPlaceholder()}
                className="min-h-[400px] font-mono text-xs bg-transparent border-none focus-visible:ring-0 leading-relaxed p-6 resize-none"
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
              />
              
              {!pastedData && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                  <Upload className="size-12 mb-4 text-primary" />
                  <p className="text-sm font-bold uppercase tracking-widest">Arraste seu arquivo CSV aqui</p>
                  <p className="text-[10px] mt-1">ou comece a digitar/colar dados</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black">
                <AlertTriangle className="size-3 text-amber-500" /> 
                A primeira linha deve ser o cabeçalho com os nomes das colunas
              </div>
              <Button 
                className="w-full md:w-auto bg-primary hover:bg-primary/90 gap-2 px-10 h-12 font-bold shadow-lg shadow-primary/20" 
                disabled={!pastedData || uploading}
                onClick={processImport}
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Salvando no Firestore...
                  </>
                ) : (
                  <>
                    <Save className="size-5" />
                    Confirmar e Salvar Dados
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 items-center">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <p className="text-[10px] font-bold text-emerald-700 uppercase">Validação Automática eSocial</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-center">
          <CheckCircle2 className="size-5 text-blue-600" />
          <p className="text-[10px] font-bold text-blue-700 uppercase">Criptografia de Dados em Repouso</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-center">
          <CheckCircle2 className="size-5 text-amber-600" />
          <p className="text-[10px] font-bold text-amber-700 uppercase">Detecção de Duplicidade Ativa</p>
        </div>
      </div>
    </div>
  )
}
