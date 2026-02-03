
"use client"

import * as React from "react"
import { Upload, FileText, CheckCircle2, AlertTriangle, X, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, collection, writeBatch } from "firebase/firestore"

export default function DataImport() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
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

  // Simulação de semente de dados real vinculada ao UID do usuário
  const seedDemoData = async () => {
    if (!user || !db) return

    setUploading(true)
    try {
      const batch = writeBatch(db)
      
      // Criar documento do cliente
      const clientRef = doc(db, "clients", user.uid)
      batch.set(clientRef, {
        id: user.uid,
        name: "Empresa Demonstração Nextcon",
        cnpj: "12.345.678/0001-90",
        address: "Av. Paulista, 1000 - SP",
        contactEmail: user.email
      })

      // Criar alguns funcionários
      const employees = [
        { id: "emp1", name: "João Silva", jobRole: "Soldador", admissionDate: "10/01/2023" },
        { id: "emp2", name: "Maria Oliveira", jobRole: "Engenheira de Segurança", admissionDate: "15/03/2022" },
        { id: "emp3", name: "Carlos Santos", jobRole: "Auxiliar Administrativo", admissionDate: "05/06/2024" }
      ]

      employees.forEach(emp => {
        const empRef = doc(db, "clients", user.uid, "employees", emp.id)
        batch.set(empRef, { ...emp, clientId: user.uid })
      })

      await batch.commit()

      toast({
        title: "Dados Gerados!",
        description: "Dados de demonstração foram vinculados ao seu perfil com sucesso."
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Erro ao inicializar",
        description: "Verifique suas regras de segurança no Firestore."
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary">Importação de Dados</h1>
        <p className="text-muted-foreground">Povoar as coleções do sistema rapidamente através de arquivos CSV ou dados de demonstração.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="card-shadow border-none hover:bg-primary/5 transition-colors cursor-pointer group p-6" onClick={seedDemoData}>
           <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Database className="size-8" />
              </div>
              <div>
                <h3 className="font-bold">Inicializar Dados de Teste</h3>
                <p className="text-sm text-muted-foreground">Clique aqui para criar uma estrutura básica para o seu UID ({user?.uid.substring(0,8)}...)</p>
              </div>
              <Button variant="outline" disabled={uploading} className="w-full">
                {uploading ? "Gerando..." : "Gerar Estrutura Demo"}
              </Button>
           </div>
        </Card>

        <Card className="card-shadow border-none p-6">
           <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full bg-secondary/20 text-primary">
                <FileText className="size-8" />
              </div>
              <div>
                <h3 className="font-bold">Modelos CSV</h3>
                <p className="text-sm text-muted-foreground">Baixe os templates para importar seus próprios dados.</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="link" size="sm" className="flex-1">Clientes.csv</Button>
                <Button variant="link" size="sm" className="flex-1">Funcionarios.csv</Button>
              </div>
           </div>
        </Card>
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
                  disabled={uploading}
                >
                  {uploading ? "Processando..." : "Importar Dados Agora"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
