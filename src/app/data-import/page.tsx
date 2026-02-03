
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
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("O conteúdo deve conter um cabeçalho e pelo menos uma linha de dados.")

      const firstLine = lines[0]
      const separator = firstLine.includes(';') ? ';' : ','
      
      const headers = firstLine.split(separator).map(h => h.trim().toLowerCase())
      const batch = writeBatch(db)

      const clientRef = doc(db, "clients", user.uid)
      batch.set(clientRef, { id: user.uid }, { merge: true })

      let count = 0
      lines.slice(1).forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 1) return

        const data: any = { 
          clientId: user.uid,
          updatedAt: new Date().toISOString()
        }
        
        headers.forEach((header, i) => {
          const val = values[i]
          if (!val) return

          if (header.includes('nome')) data.name = val
          if (header.includes('cargo') || header.includes('função') || header.includes('role')) data.jobRole = val
          if (header.includes('data') || header.includes('admissão') || header.includes('entrada')) data.admissionDate = val
          if (header.includes('cpf') || header.includes('matrícula') || header.includes('id') || header.includes('registro')) {
             data.id = val.replace(/[^\w\s]/gi, '')
          }
        })

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
          <p className="text-muted-foreground text-sm">Alimente a base de funcionários do seu cliente atual.</p>
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
              <CardDescription>Cole os dados dos funcionários (Nome, Cargo, CPF) abaixo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Nome, Cargo, CPF, Admissão&#10;João Silva, Soldador, 123.456.789-00, 10/05/2023"
                className="min-h-[350px] font-mono text-xs bg-muted/20 border-none focus-visible:ring-accent leading-relaxed"
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
              />
              <div className="flex justify-end pt-4 border-t">
                  <Button 
                    className="bg-accent hover:bg-accent/90 gap-2 px-8 font-bold shadow-lg shadow-accent/20" 
                    disabled={!pastedData || uploading}
                    onClick={() => processCSV(pastedData)}
                  >
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Importar Colaboradores
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
            <CardContent className="py-24 text-center">
              <div className="flex flex-col items-center justify-center gap-6">
                {!file ? (
                  <>
                    <Upload className="size-16 text-primary/20" />
                    <input type="file" className="hidden" id="file-upload" accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                    <Button asChild variant="outline" className="h-12 px-8">
                      <label htmlFor="file-upload" className="cursor-pointer">Selecionar CSV</label>
                    </Button>
                  </>
                ) : (
                  <div className="w-full max-w-md space-y-4">
                    <p className="font-bold">{file.name}</p>
                    <Button className="w-full h-12 bg-accent" disabled={uploading} onClick={handleFileUpload}>
                      Confirmar Importação
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
