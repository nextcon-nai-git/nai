"use client"

import * as React from "react"
import { 
  SearchCheck, 
  FileWarning, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  History, 
  SendHorizontal,
  Layers,
  ChevronDown,
  Mail,
  Calendar,
  Settings2,
  FileDown,
  Trash2,
  Save,
  Check,
  Filter,
  ArrowRight,
  ShieldAlert,
  Zap,
  Network
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { runEsocialAudit, type EsocialAuditOutput } from "@/ai/flows/esocial-audit-flow"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, doc, addDoc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"

export default function EsocialAudit() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("agrupador")
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [aiReport, setAiReport] = React.useState<EsocialAuditOutput | null>(null)

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const queueQuery = useMemoFirebase(() => {
    if (!db || !profile?.companyId) return null
    return query(collection(db, "companies", profile.companyId, "esocial_events_queue"), orderBy("id", "desc"))
  }, [db, profile])
  const { data: queueDocs } = useCollection(queueQuery)

  const handleSimulateEvent = async (type: string) => {
    if (!db || !profile?.companyId) return
    
    const names = ["BRUNO GADELHA", "ERICK HENRIQUE", "JOÃO BESTEL"]
    const name = names[Math.floor(Math.random() * names.length)]
    
    let firewallMessage = ""
    let status = "approved_firewall_aguardando_transmissao"
    
    if (type === "S-2240") {
      const caValido = Math.random() > 0.3
      if (!caValido) {
        status = "blocked_pelo_firewall"
        firewallMessage = "Risco de multa: Tentativa de envio com EPI sem C.A. válido."
      }
    }

    const colRef = collection(db, "companies", profile.companyId, "esocial_events_queue")
    await addDocumentNonBlocking(colRef, {
      id: `EVT-${Date.now()}`,
      eventType: type,
      employeeName: name,
      status,
      firewallMessage,
      payload: { ca_epi: type === "S-2240" ? (firewallMessage ? "" : "45678") : null },
      createdAt: new Date().toISOString()
    })

    if (status.includes('blocked')) {
      toast({ variant: "destructive", title: "NAI Firewall Ativado!", description: "Evento bloqueado por inconsistência técnica." })
    } else {
      toast({ title: "Evento na Fila", description: "Auditado via NAI API e pronto para transmissão." })
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">NAI Firewall e-Social</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Infraestrutura 2026 contra multas e inconsistências via NAI API.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleSimulateEvent("S-2240")} variant="outline" className="h-11 px-6 border-primary text-primary font-black uppercase text-[10px] gap-2">
            <Zap className="size-4" /> Validar S-2240
          </Button>
          <Button onClick={() => handleSimulateEvent("S-2220")} className="gradient-nextcon text-white h-11 px-6 rounded-xl font-black uppercase text-[10px] gap-2">
            <SendHorizontal className="size-4" /> Transmitir S-2220
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[650px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="agrupador" className="rounded-lg gap-2 text-xs font-bold">Fila NAI API</TabsTrigger>
          <TabsTrigger value="auditoria" className="rounded-lg gap-2 text-xs font-bold">Diagnóstico NAI</TabsTrigger>
          <TabsTrigger value="config" className="rounded-lg gap-2 text-xs font-bold">Configuração API</TabsTrigger>
        </TabsList>

        <TabsContent value="agrupador" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-6">
              <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <ShieldAlert className="size-5 text-accent" /> Monitoramento Firewall 2026
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Os eventos só avançam para transmissão se aprovados pela inteligência NAI.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-8">Evento</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Status Firewall</TableHead>
                    <TableHead className="pr-8">Diagnóstico NAI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queueDocs?.map((evt) => (
                    <TableRow key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="pl-8"><Badge variant="outline" className="font-mono text-primary border-primary/20">{evt.eventType}</Badge></TableCell>
                      <TableCell><p className="font-black text-xs uppercase text-primary">{evt.employeeName}</p></TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none px-3",
                          evt.status === 'blocked_pelo_firewall' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        )}>
                          {evt.status === 'blocked_pelo_firewall' ? "Bloqueado" : "Aprovado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8">
                        {evt.firewallMessage ? (
                          <p className="text-[10px] text-red-600 italic font-bold leading-tight flex items-center gap-1">
                            <AlertCircle className="size-3" /> {evt.firewallMessage}
                          </p>
                        ) : (
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Sincronização OK</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!queueDocs || queueDocs.length === 0) && (
                    <TableRow><TableCell colSpan={4} className="py-20 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhum evento pendente</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auditoria" className="mt-8">
          <Card className="card-shadow border-none bg-white p-10 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <SearchCheck className="size-16 mx-auto text-primary opacity-20" />
              <div className="space-y-2">
                <h3 className="text-xl font-black text-primary uppercase">Diagnóstico Gemini 2.0</h3>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "O motor NAI audita a consistência entre NAIGED, PGR e PCMSO, garantindo conformidade legal plena em milissegundos."
                </p>
              </div>
              <Button onClick={async () => {
                setIsAuditing(true)
                try {
                  const res = await runEsocialAudit({ sector: "Geral", riskList: ["Ruído"], examList: [] })
                  setAiReport(res)
                } finally { setIsAuditing(false) }
              }} disabled={isAuditing} className="gradient-nextcon text-white h-12 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl">
                {isAuditing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-accent" />}
                Auditar Toda a Unidade
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
