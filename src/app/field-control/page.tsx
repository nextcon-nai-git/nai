
"use client"

import * as React from "react"
import { 
  MapPin, 
  ClipboardCheck, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  Users, 
  FileText, 
  Camera, 
  Clock, 
  HardHat,
  Gauge,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  MoreVertical,
  Signal,
  Map as MapIcon,
  RefreshCw,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, doc, collectionGroup } from "firebase/firestore"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Painel Operacional Field Control 2026
 * Gestão de ordens de serviço, geofencing e calibração de instrumentos.
 */

export default function FieldControlOperational() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("activities")
  const [isCheckinLoading, setIsCheckinLoading] = React.useState(false)
  const [currentLocation, setCurrentLocation] = React.useState<{lat: number, lng: number} | null>(null)

  // Busca atividades de campo reais do Firestore
  const activitiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collectionGroup(db, "tasks"), orderBy("createdAt", "desc"))
  }, [db])
  const { data: tasks, isLoading: loadingActivities } = useCollection(activitiesQuery)

  const fieldTasks = tasks?.filter(t => ['pgr', 'ltcat', 'iot_check'].includes(t.type)) || []

  // Equipamentos simulados (Em produção seriam uma coleção 'assets')
  const equipments = [
    { id: "DEC-001", name: "Decibelímetro Digital", brand: "Instrutherm", lastCal: "2025-01-10", nextCal: "2026-01-10", status: "expired" },
    { id: "DOS-042", name: "Dosímetro de Ruído", brand: "Bruel & Kjaer", lastCal: "2025-06-15", nextCal: "2026-06-15", status: "ok" },
    { id: "TERM-012", name: "Termômetro de Globo", brand: "Quest", lastCal: "2025-08-20", nextCal: "2026-08-20", status: "ok" },
  ]

  const handleCheckin = () => {
    setIsCheckinLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          setIsCheckinLoading(false)
          toast({
            title: "Check-in Realizado!",
            description: `Coordenadas validadas: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          })
        },
        (error) => {
          setIsCheckinLoading(false)
          toast({
            variant: "destructive",
            title: "Erro de Localização",
            description: "Não foi possível validar sua posição. Verifique as permissões do navegador.",
          })
        }
      )
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Field Control Center</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest flex items-center gap-2">
            <Signal className="size-3 text-accent animate-pulse" /> Gestão de Engenharia e Medições Externas 2026.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-primary text-primary font-bold uppercase text-[10px] gap-2">
            <MapIcon className="size-4" /> Mapa de Técnicos
          </Button>
          <Button className="gradient-nextcon text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2">
            <Plus className="size-4" /> Nova Ordem de Serviço
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Atividades Hoje" value={fieldTasks.length} icon={ClipboardCheck} color="text-blue-600" bg="bg-blue-50" />
        <KpiCard label="Técnicos Online" value="04" icon={Users} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard label="Calibrações Pendentes" value="01" icon={Gauge} color="text-red-600" bg="bg-red-50" />
        <KpiCard label="SLA de Atendimento" value="98.2%" icon={ShieldCheck} color="text-primary" bg="bg-primary/5" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="activities" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6">
            <Clock className="size-4" /> Agenda de Campo
          </TabsTrigger>
          <TabsTrigger value="equipments" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6">
            <Gauge className="size-4" /> Equipamentos
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6">
            <Users className="size-4" /> Equipe Técnica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Intervenções Técnicas</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Controle de Vistorias e Medições Ambientais.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <Input placeholder="Buscar OS..." className="pl-9 h-10 w-64 bg-white border-none shadow-inner text-xs" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Status / OS</TableHead>
                    <TableHead>Unidade Cliente</TableHead>
                    <TableHead>Técnico Responsável</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right pr-8">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingActivities ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="size-8 animate-spin mx-auto opacity-20" /></TableCell></TableRow>
                  ) : fieldTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-2 rounded-full animate-pulse",
                            task.status === 'doing' ? 'bg-emerald-500' : 'bg-slate-300'
                          )} />
                          <div>
                            <p className="font-black text-xs text-primary uppercase">{task.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">OS: {task.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold text-slate-600">{task.companyName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">T</div>
                          <span className="text-[11px] font-bold">Eng. Responsável</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-black gap-1 border-primary/10">
                          <MapPin className="size-2.5 text-accent" /> {currentLocation ? "Validado" : "Aguardando"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-[9px] font-black uppercase border-accent text-accent"
                            onClick={handleCheckin}
                            disabled={isCheckinLoading}
                          >
                            {isCheckinLoading ? <Loader2 className="size-3 animate-spin" /> : "Validar GPS"}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="h-8 text-[9px] font-black uppercase bg-primary">Lançar Dados</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl rounded-[2rem] border-none shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-headline font-black text-primary uppercase">Medição Técnica de Campo</DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-accent">Protocolo de Medição NR-09/NR-15</DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Agente de Risco</label>
                                  <Select defaultValue="ruido">
                                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ruido">Ruído Contínuo/Intermitente</SelectItem>
                                      <SelectItem value="calor">Calor (IBUTG)</SelectItem>
                                      <SelectItem value="quimico">Vapores Orgânicos</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Intensidade Medida</label>
                                  <Input placeholder="Ex: 85 dB(A)" className="h-12 bg-slate-50 border-none rounded-xl font-bold" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Equipamento Utilizado</label>
                                  <Select>
                                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl"><SelectValue placeholder="Selecione o instrumento..." /></SelectTrigger>
                                    <SelectContent>
                                      {equipments.map(e => <SelectItem key={e.id} value={e.id}>{e.name} ({e.id})</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-2">
                                  <CheckCircle2 className="size-5 text-accent" /> Protocolar Medição
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipments" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-primary/5 border-b py-6 px-8">
                <CardTitle className="text-lg font-black text-primary uppercase">Inventário de Instrumentos</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Controle de Calibração RBC/Inmetro.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                    <TableRow>
                      <TableHead className="pl-8">Equipamento</TableHead>
                      <TableHead>Última Cal.</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipments.map((eq) => (
                      <TableRow key={eq.id}>
                        <TableCell className="pl-8">
                          <p className="font-bold text-xs text-primary">{eq.name}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase">ID: {eq.id} | {eq.brand}</p>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{new Date(eq.lastCal).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-xs font-black">{new Date(eq.nextCal).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase border-none px-3",
                            eq.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          )}>
                            {eq.status === 'ok' ? 'Calibrado' : 'Vencido'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><RefreshCw className="size-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#090e24] text-white border-none p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Gauge className="size-48 text-accent" /></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                      <AlertTriangle className="size-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight font-headline">Compliance Gate</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed font-medium">
                    "O sistema bloqueia automaticamente o lançamento de medições se o instrumento selecionado estiver com o certificado de calibração vencido."
                  </p>
                  <Button variant="outline" className="w-full h-14 border-white/10 text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-2xl">
                    Ver Certificados em Nuvem
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-8">
          <Card className="card-shadow border-none h-96 flex items-center justify-center bg-white text-muted-foreground italic rounded-[2.5rem]">
            <div className="text-center space-y-4 opacity-30">
              <Users className="size-16 mx-auto" />
              <p className="font-black uppercase text-sm tracking-widest">Monitor de Campo em Tempo Real</p>
              <p className="text-xs">Integração com Google Maps para visualização de rotas em tempo real.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function KpiCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl group hover:ring-2 ring-primary/5 transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", bg, color)}>
            <Icon className="size-5" />
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-primary leading-none">{value}</h3>
      </CardContent>
    </Card>
  )
}
