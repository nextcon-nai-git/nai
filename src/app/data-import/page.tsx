
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
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, writeBatch } from "firebase/firestore"

type ImportType = 'companies' | 'employees' | 'exams'

export default function UnifiedImportCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState<ImportType>('companies')
  const [pastedData, setPastedData] = React.useState("")
  const [uploading, setUploading] = React.useState(false)

  const setupProfileByRole = async (targetRole: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'EMPLOYEE') => {
    if (!user || !db) return
    setUploading(true)
    
    let name = user.email?.split('@')[0] || "Usuário"

    try {
      const batch = writeBatch(db)

      // Perfil do Usuário Logado
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

  const processImport = async () => {
    if (!user || !db || !pastedData) return
    setUploading(true)

    try {
      const lines = pastedData.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) throw new Error("O arquivo deve conter o cabeçalho e pelo menos uma linha de dados.")

      const separator = lines[0].includes(';') ? ';' : ','
      const headers = lines[0].split(separator).map(h => h.trim().toLowerCase())
      
      const batch = writeBatch(db)
      let count = 0

      lines.slice(1).forEach((line, index) => {
        const values = line.split(separator).map(v => v.trim())
        if (values.length < 1) return

        const data: any = { updatedAt: new Date().toISOString() }
        headers.forEach((header, i) => {
          if (values[i]) data[header] = values[i]
        })

        // Caminho Multi-Tenant: clientes/{adminUid}/colecao
        const collectionPath = 
          activeTab === 'companies' ? `clients/${user.uid}/managedCompanies` : 
          activeTab === 'employees' ? `clients/${user.uid}/employees` : 
          `clients/${user.uid}/sst_events`;

        const docId = data.id || data.cnpj || `import_${index}_${Date.now()}`
        const docRef = doc(db, collectionPath, docId)
        batch.set(docRef, data, { merge: true })
        count++
      })

      await batch.commit()
      toast({ title: "Importação Finalizada", description: `${count} registros importados para seu ambiente.` })
      setPastedData("")
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Processamento", description: error.message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-[#090e24] tracking-tight">Arquitetura NAI SST 2026</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Alternar Perfis e Importar Dados</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-[#090e24] text-[#090e24] hover:bg-[#090e24] hover:text-white" onClick={() => setupProfileByRole('SUPER_ADMIN')} disabled={uploading}>
            <ShieldAlert className="size-4" /> SUPER ADMIN
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#090e24]" onClick={() => setupProfileByRole('CLIENT_ADMIN')} disabled={uploading}>
            <Building2 className="size-4" /> CLIENT ADMIN
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white" onClick={() => setupProfileByRole('EMPLOYEE')} disabled={uploading}>
            <UserCheck className="size-4" /> EMPLOYEE
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="companies" className="rounded-lg gap-2">
            <Building2 className="size-4" /> Empresas
          </TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg gap-2">
            <Users className="size-4" /> Funcionários
          </TabsTrigger>
          <TabsTrigger value="exams" className="rounded-lg gap-2">
            <Zap className="size-4" /> Eventos SST
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6 card-shadow border-none bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                  <Upload />
                </div>
                <div>
                  <CardTitle className="text-xl">Importador em Lote</CardTitle>
                  <CardDescription>Cole dados CSV para popular seu ambiente exclusivo.</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Cole aqui seus dados (Cabeçalho;Dado1;Dado2)..."
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
                Confirmar Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
