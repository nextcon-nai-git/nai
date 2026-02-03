
"use client"

import * as React from "react"
import { Upload, FileText, CheckCircle2, AlertTriangle, X, Database, ClipboardPaste, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, collection, writeBatch } from "firebase/firestore"

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
      const lines = text.split('\n').filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("O CSV deve conter cabeçalho e pelo menos uma linha de dados.")

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const batch = writeBatch(db)

      // Criar documento do cliente se não existir
      const clientRef = doc(db, "clients", user.uid)
      batch.set(clientRef, {
        id: user.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      lines.slice(1).forEach((line, index) => {
        const values = line.split(',').map(v => v.trim())
        const data: any = { clientId: user.uid, id: `imp_${index}_${Date.now()}` }
        
        headers.forEach((header, i) => {
          // Mapeamento inteligente de campos
          if (header.includes('nome')) data.name = values[i]
          if (header.includes('cargo') || header.includes('função')) data.jobRole = values[i]
          if (header.includes('data') || header.includes('admissão')) data.admissionDate = values[i]
          if (header.includes('cpf') || header.includes('id')) data.employeeId = values[i]
        })

        if (data.name) {
          const empRef = doc(db, "clients", user.uid, "employees", data.id)
          batch.set(empRef, data)
        }
      })

      await batch.commit()
      toast({
        title: "Importação Concluída",
        description: `${lines.length - 1} registros foram processados com sucesso.`
      })
      setPastedData("")
      setFile(null)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Processamento",
        description: error.message || "Verifique o formato do seu CSV."
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

  const seedDemoData = async () => {
    if (!user || !db) return
    setUploading(true)
    try {
      const batch = writeBatch(db)
      const clientRef = doc(db, "clients", user.uid)
      batch.set(clientRef, {
        id: user.uid,
        name: "Empresa Demonstração Nextcon",
        cnpj: "12.345.678/0001-90",
        address: "Av. Paulista, 1000 - SP",
        contactEmail: user.email
      })

      const employees = [
        { id: "emp1", name: "João Silva", jobRole: "Soldador", admissionDate: "2023-01-10" },
        { id: "emp2", name: "Maria Oliveira", jobRole: "Engenheira de Segurança", admissionDate: "2022-03-15" },
        { id: "emp3", name: "Carlos Santos", jobRole: "Auxiliar Administrativo", admissionDate: "2024-06-05" }
      ]

      employees.forEach(emp => {
        const empRef = doc(db, "clients", user.uid, "employees", emp.id)
        batch.set(empRef, { ...emp, clientId: user.uid })
      })

      await batch.commit()
      toast({ title: "Dados Gerados!", description: "Estrutura demo criada com sucesso." })
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao inicializar dados." })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Importação de Dados</h1>
          <p className="text-muted-foreground text-sm">Povoar as coleções do sistema rapidamente através de CSV ou dados reais.</p>
        </div>
        <Button variant="outline" size="sm" onClick={seedDemoData} disabled={uploading} className="gap-2">
          <Database className="size-4" /> Gerar Dados Demo
        </Button>
      </div>

      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl h-12">
          <TabsTrigger value="paste" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ClipboardPaste className="size-4 mr-2" /> Colar Planilha
          </TabsTrigger>
          <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Upload className="size-4 mr-2" /> Upload de Arquivo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-6">
          <Card className="card-shadow border-none">
            <CardHeader>
              <CardTitle className="text-lg">Colar do Excel / CSV</CardTitle>
              <CardDescription>Cole o conteúdo da sua planilha abaixo. Certifique-se de que a primeira linha contém os nomes das colunas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="nome, cargo, data_admissao&#10;João Silva, Soldador, 2023-05-12&#10;Maria Santos, Tec. Segurança, 2024-01-10"
                className="min-h-[300px] font-mono text-xs bg-muted/20 border-none focus-visible:ring-accent"
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setPastedData("")} disabled={uploading}>Limpar</Button>
                <Button 
                  className="bg-accent hover:bg-accent/90 gap-2 px-8" 
                  disabled={!pastedData || uploading}
                  onClick={() => processCSV(pastedData)}
                >
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Processar e Salvar no Firestore
                </Button>
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
            <CardContent className="py-20">
              <div className="flex flex-col items-center justify-center gap-4">
                {!file ? (
                  <>
                    <div className="p-6 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/5 transition-colors">
                      <Upload className="size-12" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-headline font-bold">Arraste seu arquivo CSV</p>
                      <p className="text-sm text-muted-foreground">ou clique para selecionar do computador</p>
                    </div>
                    <input type="file" className="hidden" id="file-upload" accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">Selecionar Arquivo</label>
                    </Button>
                  </>
                ) : (
                  <div className="w-full max-w-md space-y-6">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <FileText className="size-8 text-primary" />
                        <div>
                          <p className="text-sm font-bold">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-red-500">
                        <X className="size-5" />
                      </button>
                    </div>
                    <Button className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-bold" disabled={uploading} onClick={handleFileUpload}>
                      {uploading ? <Loader2 className="size-5 animate-spin" /> : "Iniciar Importação"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
          <AlertTriangle className="size-5 text-blue-600 mt-1" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-900">Formato Esperado</p>
            <p className="text-[10px] text-blue-800 leading-tight">Use vírgulas como separador. O sistema reconhece automaticamente colunas como: nome, cargo, função, admissão e cpf.</p>
          </div>
        </div>
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="size-5 text-emerald-600 mt-1" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-900">Destino Seguro</p>
            <p className="text-[10px] text-emerald-800 leading-tight">Os dados serão salvos na sua coleção privada (/clients/{user?.uid.substring(0,6)}.../employees).</p>
          </div>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
          <Database className="size-5 text-amber-600 mt-1" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-900">Performance</p>
            <p className="text-[10px] text-amber-800 leading-tight">Para grandes volumes (mais de 500 linhas), recomendamos usar a aba de upload de arquivo.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
