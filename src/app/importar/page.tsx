
"use client"

import * as React from "react"
import { Database, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Sparkles, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import Link from "next/link"

const CLIENTES_DATA = [
  { id: "75805895000130", nome: "COMPANHIA CAMPOLARGUENSE DE ENERGIA COCEL", cidade: "Campo Largo", cnpjOriginal: "75.805.895/0001-30" },
  { id: "76492701001129", nome: "BRITANIA ELETRODOMESTICOS SA", cidade: "Joinville", cnpjOriginal: "76.492.701/0011-29" },
  { id: "76492701000742", nome: "BRITANIA ELETRODOMESTICOS SA", cidade: "Joinville", cnpjOriginal: "76.492.701/0007-42" },
  { id: "51633820000151", nome: "NATIVA EMPREENDIMENTOS", cidade: "Guaratuba", cnpjOriginal: "51.633.820/0001-51" },
  { id: "27051495000134", nome: "ROOFSERVICE SERVICOS TECNICOS LTDA", cidade: "Cotia", cnpjOriginal: "27.051.495/0001-34" },
  { id: "92816560000137", nome: "BANCO REGIONAL DE DESENVOLVIMENTO DO EXTREMO SUL", cidade: "Porto Alegre", cnpjOriginal: "92.816.560/0001-37" },
  { id: "14736446001246", nome: "CIS CENTRO INTEGRADO EM SAUDE", cidade: "Rio Branco do Sul", cnpjOriginal: "14.736.446/0012-46" },
  { id: "49949604000178", nome: "BIAVATTI ATUBA", cidade: "Pinhais", cnpjOriginal: "49.949.604/0001-78" },
  { id: "06113329000145", nome: "SUL CABEAMENTO INSTALACOES ELETRICAS E TECNOLOGICAS LTDA", cidade: "Canoas", cnpjOriginal: "06.113.329/0001-45" },
  { id: "33719485002170", nome: "CAIXA DE ASSISTENCIA DOS FUNCIONARIOS DO BANCO DO BRASIL", cidade: "Curitiba", cnpjOriginal: "33.719.485/0021-70" },
  { id: "01208413000129", nome: "TIME NOW ENGENHARIA S/A", cidade: "Vitória", cnpjOriginal: "01.208.413/0001-29" },
  { id: "22697661000150", nome: "PR-MAX SERVICOS INDUSTRIAIS LTDA", cidade: "Palmeira", cnpjOriginal: "22.697.661/0001-50" },
  { id: "13419654000104", nome: "INCORPORADORA GRAN-PARA LTDA", cidade: "Curitiba", cnpjOriginal: "13.419.654/0001-04" },
  { id: "90400888000142", nome: "Banco SANTANDER", cidade: "Não informada", cnpjOriginal: "90.400.888/0001-42" },
  { id: "58280956000174", nome: "MLS PRESTADORA DE SERVIÇOS LTDA", cidade: "Colombo", cnpjOriginal: "58.280.956/0001-74" },
  { id: "06175128000172", nome: "Premcell - Consultoria em Telecomunicacoes Ltda", cidade: "Bauru", cnpjOriginal: "06.175.128/0001-72" },
  { id: "12825178000150", nome: "MOPAR ENGENHARIA", cidade: "Fortaleza", cnpjOriginal: "12.825.178/0001-50" },
  { id: "39676438000120", nome: "CLINICA BIAVATTI LTDA-BACACHERI", cidade: "Curitiba", cnpjOriginal: "39.676.438/0001-20" },
  { id: "32137571000169", nome: "ESCOLA ESSENCIAL DE VIRTUDES LTDA", cidade: "Curitiba", cnpjOriginal: "32.137.571/0001-69" },
  { id: "52793197000167", nome: "NOXI QUIMICA LTDA", cidade: "Tiete", cnpjOriginal: "52.793.197/0001-67" },
  { id: "45573971000169", nome: "BIAVATTI FRANCHISING", cidade: "Curitiba", cnpjOriginal: "45.573.971/0001-69" },
  { id: "81707465000189", nome: "CONSTRUFAM ENGENHARIA E EMPREENDIMENTOS LTDA", cidade: "São José dos Pinhais", cnpjOriginal: "81.707.465/0001-89" },
  { id: "32267778000158", nome: "LVALLE ENGENHARIA LTDA", cidade: "Bady Bassitt", cnpjOriginal: "32.267.778/0001-58" },
  { id: "48865462000106", nome: "TIMENOW GESTAO DE OBRAS LTDA", cidade: "Vitória", cnpjOriginal: "48.865.462/0001-06" },
  { id: "05801908000118", nome: "CENTRAL TURBOS PARANA - COMERCIO", cidade: "Curitiba", cnpjOriginal: "05.801.908/0001-18" },
  { id: "45822496000117", nome: "CLINICA BIAVATTI SAO JOSE DOS PINHAIS LTDA", cidade: "São José dos Pinhais", cnpjOriginal: "45.822.496/0001-17" },
  { id: "10948651005040", nome: "SPRINGER CARRIER LTDA", cidade: "Curitiba", cnpjOriginal: "10.948.651/0050-40" }
];

export default function ImportarPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState("")

  async function handleImport() {
    setLoading(true)
    setStatus("Iniciando injeção na base multi-tenant...")
    
    let sucesso = 0
    
    for (const cliente of CLIENTES_DATA) {
      try {
        // Direcionamos para 'companies' para alimentar o sistema real
        const docRef = doc(db, "companies", cliente.id)
        
        await setDoc(docRef, {
          name: cliente.nome,
          city: cliente.cidade,
          cnpj: cliente.cnpjOriginal,
          active: true,
          risk_degree: 3, // Padrão inicial
          updatedAt: serverTimestamp(),
          importedAt: serverTimestamp()
        }, { merge: true })
        
        sucesso++
        const currentProgress = (sucesso / CLIENTES_DATA.length) * 100
        setProgress(currentProgress)
        setStatus(`Sincronizando: ${sucesso}/${CLIENTES_DATA.length} empresas...`)
      } catch (error) {
        console.error("Erro na carga:", cliente.nome, error)
        toast({
          variant: "destructive",
          title: "Falha na Importação",
          description: `Erro ao salvar ${cliente.nome}. Verifique as regras de segurança.`
        })
        setLoading(false)
        return
      }
    }
    
    setStatus(`✅ Carga finalizada: ${sucesso} clientes ativos no ecossistema.`)
    setLoading(false)
    toast({
      title: "Base de Dados Atualizada",
      description: "As 27 unidades estratégicas agora estão disponíveis para gestão SESMT."
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <Card className="max-w-xl w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="size-32 text-accent" /></div>
          <div className="relative z-10 space-y-2">
            <Link href="/data-import">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white -ml-2 mb-4 gap-2">
                <ArrowLeft className="size-4" /> Voltar
              </Button>
            </Link>
            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
              <Database className="size-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">Carga Massiva 2026</CardTitle>
            <CardDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Injeção de 27 Unidades Estratégicas no Firestore</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="size-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                <Building2 className="size-6" />
              </div>
              <div>
                <p className="text-sm font-black text-primary uppercase">Destino: Coleção 'companies'</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Integridade multi-tenant validada</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                <span>Progresso da Operação</span>
                <span className="text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-slate-100" />
            </div>

            {status && (
              <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex items-center gap-3 text-primary">
                {loading ? <Loader2 className="size-4 animate-spin text-accent" /> : <CheckCircle2 className="size-4 text-accent" />}
                <span className="text-xs font-bold italic">"{status}"</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-10 bg-slate-50 flex flex-col gap-4">
          <Button 
            onClick={handleImport} 
            disabled={loading}
            className="w-full h-16 bg-primary text-white hover:bg-primary/90 text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 gap-3"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="size-5 animate-spin" /> Sincronizando...
              </div>
            ) : (
              <>
                <Database className="size-5 text-accent" /> Iniciar Injeção de Dados
              </>
            )}
          </Button>
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tighter">
            Esta operação substituirá dados existentes com os mesmos CNPJs na coleção raiz.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
