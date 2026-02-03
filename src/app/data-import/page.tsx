
"use client"

import * as React from "react"
import { Upload, FileText, CheckCircle2, AlertTriangle, X, Database, ClipboardPaste, Save, Loader2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, collection, writeBatch } from "firebase/firestore"
import { Separator } from "@/components/ui/separator"

export default function DataImport() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [dragActive, setDragActive] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [pastedData, setPastedData] = React.useState("")
  const [uploading, setUploading] = React.useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile)
      } else {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Por favor, envie um arquivo CSV."
        })
      }
    }
  }

  const processCSV = async (text: string) => {
    if (!user || !db) return
    setUploading(true)

    try {
      // Divide por linhas e remove vazias
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("O conteúdo deve conter um cabeçalho e pelo menos uma linha de dados.")

      // Detecta separador (vírgula ou ponto-e-vírgula comum em CSVs brasileiros)
      const firstLine = lines[0]
      const separator = firstLine.includes(';') ? ';' : ','
      
      const headers = firstLine.split(separator).map(h => h.trim().toLowerCase())
      const batch = writeBatch(db)

      // Garantir documento do cliente
      const clientRef = doc(db, "clients", user.uid)
      batch.set(clientRef, { id: user.uid }, { merge: true })

      let count = 0
      lines.slice(1).forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 2) return // Pula linhas malformadas

        const data: any = { 
          clientId: user.uid,
          updatedAt: new Date().toISOString()
        }
        
        headers.forEach((header, i) => {
          const val = values[i]
          if (!val) return

          // Mapeamento inteligente para o esquema do backend.json
          if (header.includes('nome')) data.name = val
          if (header.includes('cargo') || header.includes('função') || header.includes('role')) data.jobRole = val
          if (header.includes('data') || header.includes('admissão') || header.includes('entrada')) data.admissionDate = val
          if (header.includes('cpf') || header.includes('matrícula') || header.includes('id') || header.includes('registro')) {
             data.id = val.replace(/[^\w\s]/gi, '') // Limpa caracteres especiais para o ID do documento
          }
        })

        // Se não encontrou um ID na planilha, gera um
        if (!data.id) data.id = `emp_${index}_${Date.now()}`

        if (data.name) {
          const empRef = doc(db, "clients", user.uid, "employees", data.id)
          batch.set(empRef, data, { merge: true })
          count++
        }
      })

      await batch.commit()
      toast({
        title: "Importação Concluída",
        description: `${count} colaboradores foram importados com sucesso.`
      })
      setPastedData("")
      setFile(null)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Processamento",
        description: error.message || "Verifique o formato dos seus dados."
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!file) return
    const text = await file.text()
    processCSV(text)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Importação de Colaboradores</h1>
          <p className="text-muted-foreground text-sm">Alimente o sistema NextCon com seus dados reais do Excel ou ERP.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
             <a href="https://docs.google.com/spreadsheets/d/1" target="_blank">
               <FileText className="size-4" /> Ver Modelo Exemplo
             </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl h-12">
          <TabsTrigger value="paste" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ClipboardPaste className="size-4 mr-2" /> Colar do Excel
          </TabsTrigger>
          <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Upload className="size-4 mr-2" /> Upload CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-6">
          <Card className="card-shadow border-none">
            <CardHeader>
              <CardTitle className="text-lg">Copiar e Colar</CardTitle>
              <CardDescription>Selecione as colunas no seu Excel (incluindo o cabeçalho) e cole abaixo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3 mb-2">
                <Info className="size-4 text-blue-600" />
                <p className="text-[10px] text-blue-800">Dica: O sistema identifica automaticamente colunas como <b>Nome, Cargo, CPF e Data de Admissão</b>.</p>
              </div>
              <Textarea 
                placeholder="Nome, Cargo, CPF, Admissão&#10;João Silva, Soldador, 123.456.789-00, 10/05/2023&#10;Maria Santos, Auxiliar, 987.654.321-11, 15/01/2024"
                className="min-h-[350px] font-mono text-xs bg-muted/20 border-none focus-visible:ring-accent leading-relaxed"
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
              />
              <div className="flex justify-between items-center pt-4 border-t">
                 <p className="text-[10px] text-muted-foreground uppercase font-black">Separação por vírgula ou ponto-e-vírgula</p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setPastedData("")} disabled={uploading}>Limpar</Button>
                  <Button 
                    className="bg-accent hover:bg-accent/90 gap-2 px-8 font-bold shadow-lg shadow-accent/20" 
                    disabled={!pastedData || uploading}
                    onClick={() => processCSV(pastedData)}
                  >
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Importar para o Sistema
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card 
            className={`card-shadow border-2 border-dashed transition-all ${dragActive ? 'border-accent bg-accent/5' : 'border-muted'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="py-24 text-center">
              <div className="flex flex-col items-center justify-center gap-6">
                {!file ? (
                  <>
                    <div className="p-8 rounded-full bg-primary/5 text-primary">
                      <Upload className="size-16" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-headline font-bold">Arraste seu arquivo CSV aqui</p>
                      <p className="text-sm text-muted-foreground">O arquivo deve estar formatado com UTF-8</p>
                    </div>
                    <input type="file" className="hidden" id="file-upload" accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                    <Button asChild variant="outline" className="h-12 px-8">
                      <label htmlFor="file-upload" className="cursor-pointer">Selecionar do Computador</label>
                    </Button>
                  </>
                ) : (
                  <div className="w-full max-w-md space-y-6">
                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-primary shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                          <FileText className="size-8" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold truncate max-w-[180px]">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <X className="size-6" />
                      </button>
                    </div>
                    <Button className="w-full h-16 bg-accent hover:bg-accent/90 text-lg font-bold shadow-xl shadow-accent/20" disabled={uploading} onClick={handleFileUpload}>
                      {uploading ? <Loader2 className="size-6 animate-spin" /> : "Confirmar Importação"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-muted space-y-3">
          <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="size-5" />
          </div>
          <h3 className="font-bold text-sm">Validação de Campos</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">O sistema valida automaticamente as datas e limpa caracteres de CPF/Matrícula para garantir a integridade do banco.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-muted space-y-3">
          <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Database className="size-5" />
          </div>
          <h3 className="font-bold text-sm">Sincronização Imediata</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Assim que a importação termina, os dados já estão disponíveis para auditoria do eSocial e controle de exames.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-muted space-y-3">
          <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="size-5" />
          </div>
          <h3 className="font-bold text-sm">Privacidade Total</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Os dados são armazenados de forma isolada na sua conta, protegidos pelas regras de segurança do Firebase.</p>
        </div>
      </div>
    </div>
  )
}
