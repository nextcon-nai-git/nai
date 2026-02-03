
"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Loader2, 
  User, 
  Building2,
  Calendar,
  LayoutList,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, addDoc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const COPSOQ_QUESTIONS = [
  { id: 1, category: "Carga de Trabalho", text: "A sua carga de trabalho acumula-se por ser mal distribuída?" },
  { id: 2, category: "Carga de Trabalho", text: "Com que frequência não tem tempo para completar todas as tarefas?" },
  { id: 3, category: "Ritmo", text: "Precisa trabalhar muito rapidamente?" },
  { id: 4, category: "Exigência Cognitiva", text: "O seu trabalho exige a sua atenção constante?" },
  { id: 5, category: "Exigência Cognitiva", text: "O seu trabalho exige que tome decisões difíceis?" },
  { id: 6, category: "Exigência Emocional", text: "O seu trabalho exige emocionalmente de si?" },
  { id: 7, category: "Influência", text: "Tem um elevado grau de influência no seu trabalho?" },
  { id: 8, category: "Desenvolvimento", text: "O seu trabalho exige que tenha iniciativa?" },
  { id: 9, category: "Desenvolvimento", text: "O seu trabalho permite-lhe aprender coisas novas?" },
  { id: 10, category: "Previsibilidade", text: "É informado com antecedência sobre decisões importantes/mudanças?" },
  { id: 11, category: "Clareza", text: "Recebe toda a informação de que necessita para fazer bem o seu trabalho?" },
  { id: 12, category: "Clareza", text: "Sabe exatamente quais as suas responsabilidades?" },
  { id: 13, category: "Reconhecimento", text: "O seu trabalho é reconhecido e apreciado pela gerência?" },
  { id: 14, category: "Justiça", text: "É tratado de forma justa no seu local de trabalho?" },
  { id: 15, category: "Apoio Social", text: "Com que frequência tem ajuda e apoio do seu superior imediato?" },
  { id: 16, category: "Clima", text: "Existe um bom ambiente de trabalho entre si e os seus colegas?" },
  { id: 17, category: "Liderança", text: "A chefia oferece boas oportunidades de desenvolvimento?" },
  { id: 18, category: "Liderança", text: "A chefia é boa no planejamento do trabalho?" },
  { id: 19, category: "Confiança", text: "A gerência confia nos seus funcionários para fazerem o trabalho bem?" },
  { id: 20, category: "Confiança", text: "Confia na informação que lhe é transmitida pela gerência?" },
  { id: 21, category: "Justiça", text: "Os conflitos são resolvidos de uma forma justa?" },
  { id: 22, category: "Justiça", text: "O trabalho é igualmente distribuído pelos funcionários?" },
  { id: 23, category: "Autoeficácia", text: "Sou sempre capaz de resolver problemas, se tentar o suficiente?" },
  { id: 24, category: "Significado", text: "O seu trabalho tem algum significado para si?" },
  { id: 25, category: "Significado", text: "Sente que o seu trabalho é importante?" },
  { id: 26, category: "Envolvimento", text: "Sente que os problemas do seu local de trabalho são seus também?" },
  { id: 27, category: "Satisfação", text: "Quão satisfeito está com o seu trabalho de uma forma global?" },
  { id: 28, category: "Insegurança", text: "Sente-se preocupado em ficar desempregado?" },
  { id: 29, category: "Saúde Geral", text: "Em geral, sente que a sua saúde é boa/excelente?" },
  { id: 30, category: "Vida Privada", text: "O trabalho exige muita energia afetando negativamente a vida privada?" },
  { id: 31, category: "Vida Privada", text: "O trabalho exige muito tempo afetando negativamente a vida privada?" },
  { id: 32, category: "Sintomas (Sono)", text: "Acordou várias vezes durante a noite e não conseguiu adormecer?" },
  { id: 33, category: "Burnout", text: "Sente-se fisicamente exausto?" },
  { id: 34, category: "Burnout", text: "Sente-se emocionalmente exausto?" },
  { id: 35, category: "Estresse", text: "Sente-se irritado?" },
  { id: 36, category: "Estresse", text: "Sente-se ansioso?" },
  { id: 37, category: "Estresse", text: "Sente-se triste?" },
  { id: 38, category: "Ofensa", text: "Tem sido alvo de insultos ou provocações verbais?" },
  { id: 39, category: "Assédio", text: "Tem sido exposto a assédio sexual indesejado?" },
  { id: 40, category: "Violência", text: "Tem sido exposto a ameaças de violência?" },
  { id: 41, category: "Violência", text: "Tem sido exposto a violência física?" },
]

const PGR_CHECKLIST = [
  { id: "epi", action: "Entrega de EPI", detail: "Atualizar fichas de EPI e garantir entrega.", deadline: "Imediato / Na contratação", responsible: "Admin" },
  { id: "mob", action: "Mobiliário Ergonômico", detail: "Implementar o 'Kit Ergonômico' (suporte note, apoio pé).", deadline: "Ano 2024 (Pendente)", responsible: "Compras/RH" },
  { id: "post", action: "Orientação Postural", detail: "Realizar DDS ou circular sobre postura correta (NR-17).", deadline: "Semestral", responsible: "Téc. Seg. Trabalho" },
  { id: "pausa", action: "Pausas Regulares", detail: "Monitorar se funcionários fazem pausas para andar/alongar.", deadline: "Diário", responsible: "Gestores" },
  { id: "dir", action: "Direção Defensiva", detail: "Orientação para quem utiliza veículo a trabalho (GES 02).", deadline: "Anual", responsible: "Téc. Seg. Trabalho" },
  { id: "os", action: "Ordem de Serviço (OS)", detail: "Garantir que todos assinaram a OS atualizada.", deadline: "Na admissão", responsible: "RH" },
  { id: "cop", action: "Aplicação COPSOQ", detail: "Aplicar o questionário acima para avaliar risco psicossocial.", deadline: "Sugestão: Anual", responsible: "RH / SST" },
  { id: "rev", action: "Revisão do PGR", detail: "Verificar se houve mudança de cargo ou layout.", deadline: "Bienal (Próx: 08/2026)", responsible: "Engenharia/SST" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("copsoq")
  const [selectedEmployee, setSelectedEmployee] = React.useState("")
  const [answers, setAnswers] = React.useState<Record<number, string>>({})
  const [saving, setSaving] = React.useState(false)

  // Fetch Employees
  const employeesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "employees"), orderBy("name", "asc"))
  }, [db, user])
  const { data: employees } = useCollection(employeesQuery)

  const handleSaveCopsoq = async () => {
    if (!user || !db || !selectedEmployee) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um colaborador primeiro." })
      return
    }
    
    if (Object.keys(answers).length < COPSOQ_QUESTIONS.length) {
      toast({ variant: "destructive", title: "Incompleto", description: "Responda todas as perguntas antes de salvar." })
      return
    }

    setSaving(true)
    try {
      const colRef = collection(db, "clients", user.uid, "surveys")
      const score = Object.values(answers).reduce((acc, val) => acc + parseInt(val), 0)
      
      addDocumentNonBlocking(colRef, {
        employeeId: selectedEmployee,
        date: new Date().toISOString(),
        answers,
        totalScore: score,
        type: "COPSOQ II"
      })

      toast({ title: "Pesquisa Salva", description: "O questionário COPSOQ II foi registrado com sucesso." })
      setAnswers({})
      setSelectedEmployee("")
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Checklists & Pesquisas</h1>
          <p className="text-muted-foreground">Avaliações psicossociais e monitoramento de conformidade PGR.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="copsoq" className="rounded-lg gap-2">
            <BrainCircuit className="size-4" /> COPSOQ II
          </TabsTrigger>
          <TabsTrigger value="pgr" className="rounded-lg gap-2">
            <ClipboardCheck className="size-4" /> Gestão PGR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copsoq" className="mt-6 space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BrainCircuit className="size-6 text-accent" />
                    Questionário de Riscos Psicossociais (COPSOQ II)
                  </CardTitle>
                  <CardDescription className="text-white/70">Aplicação técnica para diagnóstico de saúde mental e clima.</CardDescription>
                </div>
                <div className="w-64">
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/50">
                      <SelectValue placeholder="Selecione o Colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees?.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-muted/30 p-4 border-b flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8">
                <span className="flex-1">Pergunta / Dimensão</span>
                <div className="flex gap-8 w-[300px] justify-center text-center">
                  <span className="w-8">1</span>
                  <span className="w-8">2</span>
                  <span className="w-8">3</span>
                  <span className="w-8">4</span>
                  <span className="w-8">5</span>
                </div>
              </div>
              <div className="max-h-[600px] overflow-y-auto divide-y">
                {COPSOQ_QUESTIONS.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-4 px-8 hover:bg-muted/10 transition-colors">
                    <div className="flex-1 pr-10">
                      <p className="text-[10px] font-black text-primary/60 uppercase mb-1">{q.category}</p>
                      <p className="text-sm font-medium">{q.text}</p>
                    </div>
                    <RadioGroup 
                      className="flex gap-8 w-[300px] justify-center" 
                      value={answers[q.id]}
                      onValueChange={(val) => setAnswers(prev => ({...prev, [q.id]: val}))}
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <div key={val} className="flex items-center justify-center">
                          <RadioGroupItem value={val.toString()} id={`q${q.id}-${val}`} className="border-primary" />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted/20 border-t flex justify-between items-center">
                <div className="text-xs text-muted-foreground italic">
                  Legenda: (1) Nunca | (2) Raramente | (3) Às vezes | (4) Frequentemente | (5) Sempre
                </div>
                <Button className="bg-primary gap-2 px-8 h-12 font-bold" onClick={handleSaveCopsoq} disabled={saving}>
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Salvar Avaliação Psicossocial
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pgr" className="mt-6">
          <Card className="card-shadow border-none">
            <CardHeader className="bg-accent text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <ClipboardCheck className="size-6" />
                Checklist de Gestão: Ações do PGR
              </CardTitle>
              <CardDescription className="text-white/70">Acompanhamento administrativo de entregáveis normativos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Status</th>
                      <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Ação / Item</th>
                      <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Detalhes</th>
                      <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Prazo</th>
                      <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {PGR_CHECKLIST.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="size-6 rounded border-2 border-primary/20 flex items-center justify-center cursor-pointer hover:border-primary transition-all">
                             <CheckCircle2 className="size-4 text-primary opacity-20 hover:opacity-100" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-primary">{item.action}</td>
                        <td className="p-4 text-muted-foreground">{item.detail}</td>
                        <td className="p-4 font-medium">
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/20">
                            {item.deadline}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase">
                            {item.responsible}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-muted/10 border-t">
                <Alert className="bg-white border-primary/20">
                  <AlertCircle className="size-4 text-primary" />
                  <AlertTitle className="text-primary font-bold">Monitoramento Ativo</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">
                    Este checklist é baseado no PGR atualizado. Itens pendentes bloqueiam o selo de Compliance NAI 2026.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
