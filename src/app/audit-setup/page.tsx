"use client"

import * as React from "react"
import { Database, Loader2, CheckCircle2, ShieldCheck, FolderTree, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useStorage } from "@/firebase"
import { doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { ref, uploadString } from "firebase/storage"
import { firebaseConfig } from "@/firebase/config"
import { REAL_COMPANIES, REAL_PROVIDERS } from "@/lib/real-data"
import Link from "next/link"

export default function AuditSetupPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const storage = useStorage()
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState("")

  async function handleSetup() {
    if (!db || !storage) return
    setLoading(true)
    setStatus("Iniciando provisionamento do Ecossistema Nextcon...")
    
    try {
      const batch = writeBatch(db)
      const now = new Date().toISOString()
      
      // 1. Provisionar Empresas
      setStatus("Sincronizando 27 Unidades Estratégicas...")
      REAL_COMPANIES.forEach(comp => {
        batch.set(doc(db, "companies", comp.id), { 
          ...comp, 
          updatedAt: now,
          active: true 
        }, { merge: true })
      })
      setProgress(30)

      // 2. Provisionar Prestadores com Vínculos Multi-tenant (servedCompanies)
      setStatus("Provisionando Prestadores e Vínculos de Sigilo...")
      REAL_PROVIDERS.forEach((provider, index) => {
        // Distribui empresas entre os prestadores para o demo
        // Os 5 primeiros pegam Britânia e Nativa, os outros pegam BRDE e TimeNow
        const servedCompanies = index < 5 ? ["76492701001129", "51633820000151"] : ["92816560000137", "48865462000106"];
        
        batch.set(doc(db, "users", provider.id), { 
          ...provider, 
          updatedAt: now,
          active: true,
          servedCompanies: servedCompanies,
          status: "PROVISIONED"
        }, { merge: true })
      })
      setProgress(60)

      // 3. Provisionamento de Pastas Storage
      setStatus("Provisionando Árvore de Pastas Multi-tenant...")
      const targetCompanies = REAL_COMPANIES.slice(0, 5);
      const clientFolders = ["docs_legais", "sst_nrs/nr01_pgr", "sst_nrs/nr07_pcmso", "saude_gestao/afastados"];

      for (const comp of targetCompanies) {
        for (const folder of clientFolders) {
          await uploadString(ref(storage, `clientes/${comp.id}/${folder}/.keep`), "");
        }
      }

      await batch.commit()
      setProgress(100)
      setStatus("✅ Ecossistema e Sigilo Multi-tenant ativados!")
      
      toast({
        title: "Setup Concluído",
        description: "Regras de sigilo e vínculos de prestadores ativados."
      })
    } catch (error) {
      console.error(error)
      toast({ variant: "destructive", title: "Erro no Setup" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <Card className="max-w-2xl w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck className="size-48 text-accent" /></div>
          <div className="relative z-10 space-y-2">
            <Link href="/data-import">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white -ml-2 mb-4 gap-2">
                <ArrowLeft className="size-4" /> Voltar
              </Button>
            </Link>
            <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">Ativar Vínculos de Sigilo</CardTitle>
            <CardDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Configuração Multi-tenant: Prestador vê apenas seus clientes.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-10 space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              <span>Sincronização de Permissões</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-100" />
          </div>

          {status && (
            <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl flex items-center gap-4 text-primary">
              {loading ? <Loader2 className="size-5 animate-spin text-accent" /> : <CheckCircle2 className="size-5 text-accent" />}
              <span className="text-xs font-bold italic leading-tight">"{status}"</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-10 bg-slate-50">
          <Button 
            onClick={handleSetup} 
            disabled={loading}
            className="w-full h-16 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl gap-3"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Database className="size-5 text-accent" />}
            Ativar Blindagem de Fornecedores
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}