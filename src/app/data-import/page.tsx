
"use client"

import * as React from "react"
import { Upload, FileText, CheckCircle2, AlertTriangle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function DataImport() {
  const { toast } = useToast()
  const [dragActive, setDragActive] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
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

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setFile(null)
      toast({
        title: "Importação Concluída",
        description: "Seus dados foram processados e sincronizados com sucesso."
      })
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary">Importação de Dados CSV</h1>
        <p className="text-muted-foreground">Povoar as coleções do sistema rapidamente através de arquivos CSV padrão.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { title: "Clientes.csv", desc: "Dados cadastrais das empresas" },
          { title: "Funcionarios.csv", desc: "Lista de colaboradores e cargos" },
          { title: "Risks.csv", desc: "Inventário de riscos NR-01" }
        ].map((tpl) => (
          <Card key={tpl.title} className="card-shadow border-none hover:bg-primary/5 transition-colors cursor-pointer group">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-secondary/10 text-primary group-hover:scale-110 transition-transform">
                <FileText className="size-5" />
              </div>
              <p className="text-sm font-bold">{tpl.title}</p>
              <p className="text-xs text-muted-foreground">{tpl.desc}</p>
              <Button variant="link" size="sm" className="text-accent h-auto p-0 font-bold">Baixar Modelo</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card 
        className={`card-shadow border-2 border-dashed transition-all ${dragActive ? 'border-accent bg-accent/5' : 'border-muted'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            {!file ? (
              <>
                <div className="p-6 rounded-full bg-muted text-muted-foreground">
                  <Upload className="size-12" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-headline font-bold">Arraste e solte seu arquivo aqui</p>
                  <p className="text-sm text-muted-foreground">ou clique para procurar no seu computador</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload" 
                  accept=".csv"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">Selecionar Arquivo CSV</label>
                </Button>
              </>
            ) : (
              <div className="w-full max-w-sm space-y-6">
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
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-bold"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Processando..." : "Importar Dados Agora"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <p className="text-xs text-primary/80">As coleções são atualizadas em tempo real. Todas as sessões ativas verão os novos dados imediatamente.</p>
        </div>
        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
          <AlertTriangle className="size-5 text-accent shrink-0" />
          <p className="text-xs text-accent/80">Registros duplicados são identificados por CPF ou CNPJ. Registros existentes serão atualizados se houver correspondência.</p>
        </div>
      </div>
    </div>
  )
}
