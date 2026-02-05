"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Save, 
  Loader2, 
  Search,
  Zap,
  ShieldCheck,
  HardHat,
  Construction,
  Truck,
  Trash2,
  Activity,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  Brain,
  Plus,
  ArrowRight,
  Ban,
  Users,
  HeartPulse,
  Building2,
  Biohazard,
  Settings2,
  Box,
  Flame,
  Skull,
  AlertTriangle,
  Accessibility,
  Bomb,
  Fuel,
  Sun,
  Mountain,
  FireExtinguisher,
  Bath,
  Recycle,
  Megaphone,
  Gavel,
  Ship,
  Anchor,
  Sprout,
  Stethoscope,
  Hammer,
  ArrowUpCircle,
  Beef,
  Droplets,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, query, orderBy, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Geral", title: "NR-01 - Gerenciamento de Riscos (GRO/PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr03", category: "Administrativo", title: "NR-03 - Embargo e Interdição", icon: Ban, color: "text-red-700" },
  { id: "nr04", category: "SESMT", title: "NR-04 - Dimensionamento do SESMT", icon: Users, color: "text-blue-600" },
  { id: "nr05", category: "CIPA", title: "NR-05 - Comissão Interna (CIPA)", icon: ShieldCheck, color: "text-emerald-600" },
  { id: "nr06", category: "EPI", title: "NR-06 - Equipamentos de Proteção (EPI)", icon: HardHat, color: "text-amber-600" },
  { id: "nr07", category: "Saúde", title: "NR-07 - Controle Médico (PCMSO)", icon: HeartPulse, color: "text-rose-600" },
  { id: "nr08", category: "Estrutural", title: "NR-08 - Edificações", icon: Building2, color: "text-slate-600" },
  { id: "nr09", category: "Riscos", title: "NR-09 - Agentes Físicos, Químicos e Biológicos", icon: Biohazard, color: "text-purple-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Zap, color: "text-yellow-500" },
  { id: "nr11", category: "Logística", title: "NR-11 - Movimentação de Materiais", icon: Truck, color: "text-blue-500" },
  { id: "nr12", category: "Máquinas", title: "NR-12 - Máquinas e Equipamentos", icon: Settings2, color: "text-indigo-600" },
  { id: "nr13", category: "Pressão", title: "NR-13 - Caldeiras e Vasos de Pressão", icon: Box, color: "text-cyan-600" },
  { id: "nr14", category: "Fornos", title: "NR-14 - Fornos", icon: Flame, color: "text-orange-700" },
  { id: "nr15", category: "Insalubridade", title: "NR-15 - Atividades Insalubres", icon: Skull, color: "text-gray-700" },
  { id: "nr16", category: "Periculosidade", title: "NR-16 - Atividades Perigosas", icon: AlertTriangle, color: "text-orange-600" },
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Ergonomia", icon: Accessibility, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Indústria da Construção", icon: Construction, color: "text-orange-600" },
  { id: "nr19", category: "Explosivos", title: "NR-19 - Explosivos", icon: Bomb, color: "text-red-800" },
  { id: "nr20", category: "Inflamáveis", title: "NR-20 - Inflamáveis e Combustíveis", icon: Fuel, color: "text-amber-700" },
  { id: "nr21", category: "Trabalho Externo", title: "NR-21 - Trabalho a Céu Aberto", icon: Sun, color: "text-orange-400" },
  { id: "nr22", category: "Mineração", title: "NR-22 - Segurança na Mineração", icon: Mountain, color: "text-stone-600" },
  { id: "nr23", category: "Incêndio", title: "NR-23 - Proteção Contra Incêndios", icon: FireExtinguisher, color: "text-red-600" },
  { id: "nr24", category: "Conforto", title: "NR-24 - Condições Sanitárias e Conforto", icon: Bath, color: "text-blue-400" },
  { id: "nr25", category: "Resíduos", title: "NR-25 - Resíduos Industriais", icon: Recycle, color: "text-emerald-700" },
  { id: "nr26", category: "Sinalização", title: "NR-26 - Sinalização de Segurança", icon: Megaphone, color: "text-yellow-600" },
  { id: "nr28", category: "Fiscalização", title: "NR-28 - Fiscalização e Penalidades", icon: Gavel, color: "text-slate-800" },
  { id: "nr29", category: "Portuário", title: "NR-29 - Trabalho Portuário", icon: Ship, color: "text-blue-800" },
  { id: "nr30", category: "Aquaviário", title: "NR-30 - Trabalho Aquaviário", icon: Anchor, color: "text-sky-700" },
  { id: "nr31", category: "Rural", title: "NR-31 - Trabalho Rural e Pesca", icon: Sprout, color: "text-green-600" },
  { id: "nr32", category: "Saúde", title: "NR-32 - Serviços de Saúde", icon: Stethoscope, color: "text-blue-600" },
  { id: "nr33", category: "Confinado", title: "NR-33 - Espaços Confinados", icon: Box, color: "text-orange-800" },
  { id: "nr34", category: "Naval", title: "NR-34 - Construção e Reparação Naval", icon: Hammer, color: "text-slate-700" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
  { id: "nr36", category: "Frigoríficos", title: "NR-36 - Abate e Processamento de Carnes", icon: Beef, color: "text-red-500" },
  { id: "nr37", category: "Petróleo", title: "NR-37 - Plataformas de Petróleo", icon: Droplets, color: "text-blue-900" },
  { id: "nr38", category: "Limpeza Urbana", title: "NR-38 - Limpeza Urbana e Resíduos", icon: Trash2, color: "text-emerald-600" },
]

const NR_ITEMS: Record<string, string[]> = {
  nr01: ["Existe PGR implementado?", "O inventário de riscos está atualizado?", "O plano de ação contempla medidas de prevenção?", "Há participação dos trabalhadores na identificação de perigos?"],
  nr03: ["Há situação de risco grave e iminente?", "As atividades foram paralisadas em caso de risco extremo?", "O laudo técnico fundamenta a interdição?"],
  nr04: ["O SESMT está dimensionado conforme o Quadro II?", "Há registro do SESMT no Ministério do Trabalho?", "Os profissionais possuem a formação exigida?"],
  nr05: ["A CIPA foi constituída conforme o Quadro I?", "Houve treinamento para os membros da CIPA?", "A SIPAT foi realizada no último ano?", "As reuniões mensais estão em dia?"],
  nr06: ["Os EPIs fornecidos possuem CA válido?", "Há registro de entrega dos EPIs aos trabalhadores?", "Os EPIs são adequados ao risco da atividade?", "Há treinamento sobre o uso correto do EPI?"],
  nr07: ["O PCMSO está atualizado e implementado?", "Os ASOs estão dentro do prazo de validade?", "Há exames complementares específicos para os riscos?", "O Relatório Analítico anual foi gerado?"],
  nr08: ["Os pisos apresentam resistência a cargas?", "As escadas possuem corrimão e rodapé?", "Há proteção contra quedas em aberturas no piso?", "A iluminação natural e artificial é adequada?"],
  nr09: ["Há monitoramento de agentes físicos (ruído, calor)?", "Há monitoramento de agentes químicos no ambiente?", "As metodologias de avaliação seguem a NHO/Fundacentro?", "As medidas de controle são revisadas periodicamente?"],
  nr10: ["O Prontuário de Instalações Elétricas (PIE) existe?", "Os trabalhadores possuem treinamento de NR-10?", "Há proteção contra contatos diretos e indiretos?", "As ferramentas manuais possuem isolamento adequado?"],
  nr11: ["Os equipamentos de elevação possuem indicação de carga?", "Os operadores de empilhadeira possuem cartão de identificação?", "Há áreas de circulação desobstruídas?", "As pilhas de materiais estão estáveis?"],
  nr12: ["As máquinas possuem proteção em zonas de perigo?", "Há dispositivos de parada de emergência acessíveis?", "Os manuais estão disponíveis em português?", "Há inventário de máquinas e equipamentos atualizado?"],
  nr13: ["As caldeiras possuem placa de identificação?", "Há relatório de inspeção de segurança recente?", "O operador possui treinamento específico?", "As válvulas de segurança estão calibradas?"],
  nr14: ["Os fornos possuem isolamento térmico eficiente?", "Há proteção contra calor radiante para os trabalhadores?", "As escadas e plataformas de acesso estão seguras?", "Há sinalização de segurança em áreas quentes?"],
  nr15: ["Há laudo de insalubridade atualizado?", "Os limites de tolerância são respeitados?", "Há pagamento de adicional conforme o grau (10, 20 ou 40%)?", "As medidas de controle neutralizam o agente?"],
  nr16: ["Há laudo de periculosidade atualizado?", "As áreas de risco estão delimitadas?", "Há pagamento do adicional de 30%?", "Os trabalhadores possuem treinamento para a área de risco?"],
  nr18: ["Há PCMAT implementado (para obras > 20 trab)?", "As áreas de vivência seguem os padrões de higiene?", "Há proteções coletivas contra queda em todo o perímetro?", "Os andaimes possuem guarda-corpo e rodapé?"],
  nr19: ["Os depósitos de explosivos são sinalizados?", "Há plano de emergência em caso de acidente?", "As distâncias de segurança são respeitadas?", "Há controle rigoroso de acesso e saída de materiais?"],
  nr20: ["Há prontuário da instalação disponível?", "Os tanques possuem bacia de contenção?", "Os trabalhadores possuem treinamento específico (Básico/Interm)?", "Há inspeção periódica de tubulações e mangueiras?"],
  nr21: ["Há abrigo contra intempéries?", "Há fornecimento de água potável fresca?", "Há condições de higiene para refeições no campo?", "Há proteção contra animais peçonhentos?"],
  nr22: ["Há plano de lavra atualizado?", "Há monitoramento de gases em minas subterrâneas?", "Há sistemas de ventilação eficientes?", "Há saídas de emergência desobstruídas?"],
  nr23: ["Os extintores estão carregados e sinalizados?", "As saídas de emergência abrem para fora?", "Há brigada de incêndio treinada e ativa?", "Há iluminação de emergência testada mensalmente?"],
  nr24: ["As instalações sanitárias são limpas e adequadas?", "Há armários individuais com chave no vestiário?", "O refeitório possui condições de higiene e conforto?", "Há local para aquecimento de refeições?"],
  nr25: ["Há plano de gerenciamento de resíduos industriais?", "Os resíduos perigosos são armazenados em local seguro?", "Há destinação final adequada e comprovada?", "Os trabalhadores usam EPIs para manuseio de resíduos?"],
  nr26: ["Há sinalização visual de perigo nas máquinas?", "As tubulações estão pintadas conforme o padrão?", "Há rótulos nos produtos químicos armazenados?", "A sinalização é compreensível para todos os trabalhadores?"],
  nr28: ["As notificações de fiscalização foram atendidas?", "Há controle de multas e prazos de regularização?", "Os documentos solicitados estão prontos para exibição?"],
  nr29: ["Há plano de controle de emergência no porto?", "As redes de proteção em escadas de portaló estão íntegras?", "Há coletes salva-vidas disponíveis?", "Há sinalização de carga suspensa?"],
  nr30: ["Há serviço de saúde a bordo?", "Há estoque de medicamentos e materiais de primeiros socorros?", "Os botes de salvamento são testados periodicamente?", "Há treinamento de abandono de embarcação?"],
  nr31: ["Há áreas de vivência no campo (sanitário/refeitório)?", "Os agrotóxicos são armazenados em local isolado?", "As máquinas agrícolas possuem proteção em partes móveis?", "Há EPIs adequados para o manejo de animais?"],
  nr32: ["Há plano de prevenção de riscos com perfurocortantes?", "Os recipientes de descarte estão em locais seguros?", "Há esquema vacinal atualizado para os trabalhadores?", "Há segregação correta de resíduos biológicos?"],
  nr33: ["Há PET (Permissão de Entrada e Trabalho) preenchida?", "Há vigia treinado na entrada do espaço?", "Há medição de gases antes e durante o trabalho?", "Há equipamentos de resgate prontos no local?"],
  nr34: ["Há plano de inspeção e manutenção de equipamentos navais?", "As atividades de soldagem seguem padrões de segurança?", "Há proteção contra quedas em conveses e docas?", "Há controle de exposição a fumos metálicos?"],
  nr35: ["Os trabalhadores possuem treinamento de NR-35?", "Há pontos de ancoragem certificados?", "O cinto de segurança é do tipo paraquedista?", "Há Análise de Risco (AR) para atividades acima de 2m?"],
  nr36: ["Há rodízio de atividades para prevenir LER/DORT?", "A temperatura ambiente é controlada?", "As facas e ferramentas de corte possuem proteção?", "Há fornecimento de luvas de malha de aço?"],
  nr37: ["Há plano de gestão de integridade da plataforma?", "Há treinamento de escape via baleeira?", "Há monitoramento de gases e vapores orgânicos?", "Há sistema de comunicação de emergência redundante?"],
  nr38: ["Os veículos de coleta possuem estribos seguros?", "Os coletores usam uniformes refletivos?", "Há treinamento para manuseio de resíduos perigosos?", "Há fornecimento regular de água e protetor solar?"],
}

type BodyPart = {
  id: string
  label: string
  level: 0 | 1 | 2 | 3 | 4
  path: string
}

const INITIAL_BODY_PARTS: BodyPart[] = [
  { id: "head", label: "Cabeça", level: 0, path: "M50,5c-4,0-7,3-7,7s3,7,7,7s7-3,7-7S54,5,50,5z" },
  { id: "neck", label: "Pescoço", level: 0, path: "M46,19h8v4h-8V19z" },
  { id: "shoulder_l", label: "Ombro Esquerdo", level: 0, path: "M42,23c-5,0-12,2-16,7s-3,12-3,12l7,2l5-16L42,23z" },
  { id: "shoulder_r", label: "Ombro Direito", level: 0, path: "M58,23c5,0,12,2,16,7s3,12,3,12l-7,2l-5-16L58,23z" },
  { id: "back_upper", label: "Cervical", level: 0, path: "M44,23h12v15h-12V23z" },
  { id: "back_mid", label: "Torácica", level: 0, path: "M44,38h12v15h-12V38z" },
  { id: "back_lower", label: "Lombar", level: 0, path: "M44,53h12v15h-12V53z" },
  { id: "arm_l_upper", label: "Braço Esquerdo", level: 0, path: "M26,42l-5,18l7,1l5-19L26,42z" },
  { id: "arm_l_lower", label: "Antebraço Esquerdo", level: 0, path: "M21,60l-3,18l7,1l3-19L21,60z" },
  { id: "wrist_l", label: "Punho Esquerdo", level: 0, path: "M18,78l-1,10l7,1l1-11L18,78z" },
  { id: "arm_r_upper", label: "Braço Direito", level: 0, path: "M74,42l5,18l-7,1l-5-19L74,42z" },
  { id: "arm_r_lower", label: "Antebraço Direito", level: 0, path: "M79,60l3,18l-7,1l-3-19L79,60z" },
  { id: "wrist_r", label: "Punho Direito", level: 0, path: "M82,78l1,10l-7,1l-1-11L82,78z" },
  { id: "hip_l", label: "Quadril Esquerdo", level: 0, path: "M44,68H36c-4,0-10,3-10,12s3,12,3,12h15V68z" },
  { id: "hip_r", label: "Quadril Direito", level: 0, path: "M56,68H64c4,0,10,3,10,12s-3,12-3,12H56V68z" },
  { id: "thigh_l", label: "Coxa Esquerda", level: 0, path: "M30,92l-3,30l14,2l3-32L30,92z" },
  { id: "thigh_r", label: "Coxa Direita", level: 0, path: "M70,92l3,30l-14,2l-3-32L70,92z" },
  { id: "knee_l", label: "Joelho Esquerdo", level: 0, path: "M27,122l-1,10l14,1l1-11L27,122z" },
  { id: "knee_r", label: "Joelho Direito", level: 0, path: "M73,122l1,10l-14,1l-1-11L73,122z" },
  { id: "leg_l", label: "Perna Esquerda", level: 0, path: "M26,132l-3,25l12,1l3-26L26,132z" },
  { id: "leg_r", label: "Perna Direita", level: 0, path: "M74,132l3,25l-12,1l-3-26L74,132z" },
  { id: "foot_l", label: "Pé Esquerdo", level: 0, path: "M23,157l-5,12l16,2l3-14L23,157z" },
  { id: "foot_r", label: "Pé Direito", level: 0, path: "M77,157l5,12l-16,2l-3-14L77,157z" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedChecklistId, setSelectedChecklistId] = React.useState<string | null>(null)
  const [ergoTool, setErgoTool] = React.useState<string | null>(null)
  const [bodyParts, setBodyParts] = React.useState<BodyPart[]>(INITIAL_BODY_PARTS)
  const [isSaving, setIsSaving] = React.useState(false)
  const [formResponses, setFormResponses] = React.useState<Record<string, string>>({})

  const handlePartClick = (id: string) => {
    setBodyParts(prev => prev.map(part => {
      if (part.id === id) {
        const nextLevel = ((part.level + 1) % 5) as 0 | 1 | 2 | 3 | 4
        return { ...part, level: nextLevel }
      }
      return part
    }))
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "fill-yellow-400 stroke-yellow-600"
      case 2: return "fill-orange-400 stroke-orange-600"
      case 3: return "fill-red-500 stroke-red-700"
      case 4: return "fill-purple-700 stroke-purple-900"
      default: return "fill-slate-100 stroke-slate-300"
    }
  }

  const handleSaveCorlett = async () => {
    if (!user || !db) return
    setIsSaving(true)
    try {
      const reportData = {
        userId: user.uid,
        type: "CORLETT_DIAGRAM",
        data: bodyParts.filter(p => p.level > 0),
        createdAt: new Date().toISOString(),
      }
      await addDoc(collection(db, "clients", user.uid, "checklists"), reportData)
      toast({ title: "Avaliação Salva!", description: "Os dados de desconforto foram enviados para análise." })
      setErgoTool(null)
      setBodyParts(INITIAL_BODY_PARTS)
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar relatório" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNRChecklist = async () => {
    if (!user || !db || !selectedChecklistId) return
    setIsSaving(true)
    try {
      const checklist = CHECKLIST_CATALOG.find(c => c.id === selectedChecklistId)
      const reportData = {
        userId: user.uid,
        type: "NR_AUDIT",
        nr: selectedChecklistId,
        nrTitle: checklist?.title,
        responses: formResponses,
        createdAt: new Date().toISOString(),
      }
      await addDoc(collection(db, "clients", user.uid, "checklists"), reportData)
      toast({ title: "Inspeção Registrada!", description: `Checklist da ${checklist?.title} foi salvo com sucesso.` })
      setSelectedChecklistId(null)
      setFormResponses({})
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar inspeção" })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredCatalog = CHECKLIST_CATALOG.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedNR = CHECKLIST_CATALOG.find(c => c.id === selectedChecklistId)
  const nrItems = selectedChecklistId ? NR_ITEMS[selectedChecklistId] : []

  // Renderização da NR-17 (Laboratório de Ergonomia)
  if (selectedChecklistId === "nr17") {
    if (ergoTool === "corlett") {
      return (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setErgoTool(null)} className="h-10 w-10 p-0 rounded-full bg-white shadow-sm border">
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-headline font-bold text-primary uppercase">Diagrama de Corlett - 2026</h1>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Avaliação Osteomuscular por Segmento Corporal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 card-shadow border-none bg-white overflow-hidden">
              <CardHeader className="bg-muted/30 border-b text-center py-4">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-primary">
                  <Activity className="size-4" /> Mapa de Intensidade
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase">Toque na região afetada para registrar o nível de desconforto.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-12 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 to-white">
                <div className="relative group">
                  <svg width="400" height="600" viewBox="0 0 100 180" className="drop-shadow-2xl filter saturate-[0.8] hover:saturate-100 transition-all duration-500">
                    <ellipse cx="50" cy="175" rx="35" ry="6" fill="black" fillOpacity="0.05" />
                    
                    {bodyParts.map((part) => (
                      <path
                        key={part.id}
                        d={part.path}
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:brightness-110 stroke-[0.5] shadow-sm",
                          getLevelColor(part.level)
                        )}
                        onClick={() => handlePartClick(part.id)}
                      >
                        <title>{part.label} - Nível {part.level}</title>
                      </path>
                    ))}
                  </svg>
                </div>
                
                <div className="mt-12 flex flex-wrap justify-center gap-6 w-full max-w-md">
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className="flex flex-col items-center gap-1">
                      <div className={cn("size-6 rounded-lg border-2 shadow-sm transition-transform hover:scale-110", getLevelColor(l as any))} />
                      <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">
                        {l === 0 ? 'Zero' : l === 1 ? 'Leve' : l === 2 ? 'Médio' : l === 3 ? 'Forte' : 'Extremo'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="card-shadow border-none bg-[#090e24] text-white">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                    <Brain className="size-4" /> Áreas Relatadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="min-h-[300px] max-h-[450px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {bodyParts.filter(p => p.level > 0).map(p => (
                      <div key={p.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center animate-in slide-in-from-right-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase tracking-wide">{p.label}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={cn("size-2 rounded-full", getLevelColor(p.level).replace('fill-', 'bg-').replace(' stroke-', ' border-'))} />
                            <span className="text-[10px] font-bold text-white/50">Intensidade: {p.level}</span>
                          </div>
                        </div>
                        <Badge className={cn("text-[9px] font-black border-none px-2 py-1", getLevelColor(p.level).replace('fill-', 'bg-').split(' ')[0])}>
                          Fadiga
                        </Badge>
                      </div>
                    ))}
                    {bodyParts.filter(p => p.level > 0).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
                        <Activity className="size-12 animate-pulse" />
                        <p className="text-[10px] uppercase font-black tracking-widest">Nenhuma região<br/>selecionada no avatar</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <Button 
                      className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-black uppercase tracking-[0.2em] h-14 shadow-xl shadow-accent/20 transition-all active:scale-95"
                      onClick={handleSaveCorlett}
                      disabled={isSaving || bodyParts.filter(p => p.level > 0).length === 0}
                    >
                      {isSaving ? <Loader2 className="animate-spin" /> : <Save className="size-5 mr-2" />}
                      Confirmar Relato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedChecklistId(null)} className="h-10 w-10 p-0 rounded-full bg-white shadow-sm border">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary uppercase">Laboratório de Ergonomia (NR-17)</h1>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Análise Ergonômica do Trabalho (AET)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 card-shadow border-none bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary uppercase">Métodos Técnicos de Avaliação</CardTitle>
              <CardDescription>Selecione uma ferramenta para iniciar o estudo do posto de trabalho.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="p-8 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer group flex items-center gap-8 shadow-sm hover:shadow-xl"
                onClick={() => setErgoTool("corlett")}
              >
                <div className="p-5 bg-indigo-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Activity size={40} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-indigo-900 text-2xl tracking-tight">Diagrama de Corlett</h4>
                  <p className="text-sm text-indigo-700/70 font-medium italic mt-1">Mapa anatômico interativo para relato de dor e fadiga ocupacional (Avatar 2026).</p>
                </div>
                <ArrowRight className="size-8 text-indigo-400 group-hover:translate-x-2 transition-transform" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "rula", name: "RULA", desc: "Membros Superiores" },
                  { id: "reba", name: "REBA", desc: "Corpo Inteiro" },
                  { id: "niosh", name: "NIOSH", desc: "Levantamento de Cargas" },
                  { id: "ocra", name: "OCRA", desc: "Movimentos Repetitivos" },
                ].map((m) => (
                  <div key={m.id} className="p-4 border rounded-2xl hover:bg-muted/30 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-primary text-xl">{m.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">{m.desc}</p>
                      </div>
                      <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                        <Activity size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-shadow border-none bg-[#090e24] text-white">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase text-accent tracking-widest">Status NR-17</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Análises Realizadas</p>
                  <p className="text-2xl font-black">14</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-[10px] uppercase font-black text-accent mb-1">AET em dia</p>
                  <p className="text-sm font-medium">A última atualização do laudo foi há 12 dias.</p>
                </div>
                <Button className="w-full bg-accent text-[#090e24] hover:bg-accent/90 font-black uppercase text-[10px] h-12">
                  Emitir Relatório AET
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Renderização do Checklist Padrão das NRs
  if (selectedChecklistId) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedChecklistId(null)} className="h-10 w-10 p-0 rounded-full bg-white shadow-sm border">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary uppercase">{selectedNR?.title}</h1>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Auditoria Técnica de Campo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                <ClipboardCheck className="size-4" /> Itens de Verificação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {nrItems.map((item, index) => (
                  <div key={index} className="p-6 space-y-4 hover:bg-muted/5 transition-colors">
                    <p className="text-sm font-bold text-primary leading-relaxed">{item}</p>
                    <RadioGroup 
                      onValueChange={(val) => setFormResponses(prev => ({ ...prev, [index]: val }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="C" id={`c-${index}`} className="text-emerald-600 border-emerald-200" />
                        <Label htmlFor={`c-${index}`} className="text-[10px] font-black uppercase text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Conforme
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NC" id={`nc-${index}`} className="text-red-600 border-red-200" />
                        <Label htmlFor={`nc-${index}`} className="text-[10px] font-black uppercase text-red-700 flex items-center gap-1">
                          <XCircle className="size-3" /> Não Conforme
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NA" id={`na-${index}`} className="text-slate-400 border-slate-200" />
                        <Label htmlFor={`na-${index}`} className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                          <MinusCircle className="size-3" /> N/A
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-shadow border-none bg-primary text-white">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase text-accent tracking-widest">Resumo da Inspeção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-[8px] uppercase opacity-50">Respondidos</p>
                    <p className="text-xl font-black">{Object.keys(formResponses).length} / {nrItems.length}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-[8px] uppercase opacity-50">Não Conformes</p>
                    <p className="text-xl font-black text-red-400">{Object.values(formResponses).filter(v => v === 'NC').length}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-accent text-primary hover:bg-accent/90 font-black uppercase h-12 shadow-lg"
                  onClick={handleSaveNRChecklist}
                  disabled={isSaving || Object.keys(formResponses).length === 0}
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save className="size-4 mr-2" />}
                  Salvar Inspeção
                </Button>
              </CardContent>
            </Card>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
              <Info className="size-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-700 font-bold uppercase leading-tight">
                Certifique-se de que todas as evidências fotográficas foram coletadas para os itens marcados como 'Não Conforme'.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Hub de Operações & Checklists</h1>
          <p className="text-muted-foreground">Gestão unificada de inspeções técnicas e conformidade normativa.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2 text-xs font-bold">
            <ClipboardCheck className="size-4" /> Catálogo NRs
          </TabsTrigger>
          <TabsTrigger value="pgr" className="rounded-lg gap-2 text-xs font-bold">
            <ShieldAlert className="size-4" /> Inventário PGR
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 text-xs font-bold">
            <Activity className="size-4" /> Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por número da NR (ex: 35), Tipo ou Nome..." 
              className="pl-10 h-12 bg-white border-muted shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-pointer group bg-white"
                  onClick={() => setSelectedChecklistId(item.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-muted/50 ${item.color} group-hover:bg-primary group-hover:text-white transition-all shadow-inner`}>
                        <Icon className="size-6" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-50">{item.category}</p>
                        <h3 className="text-sm font-bold text-primary truncate">{item.title}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="pgr" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-primary uppercase">Inventário de Riscos (NR-01)</h3>
            <Button className="bg-primary gap-2"><Plus className="size-4" /> Novo Risco</Button>
          </div>
          <Card className="card-shadow border-none h-64 flex flex-col items-center justify-center opacity-40 italic bg-white border-dashed border-2">
            <ShieldAlert className="size-12 mb-2 text-primary" />
            <p className="text-sm font-medium">Use o botão 'Novo Risco' para popular seu inventário PGR.</p>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="card-shadow border-none h-64 flex items-center justify-center opacity-40 italic bg-white border-dashed border-2">
            <p className="text-sm font-medium">Nenhum registro preenchido recentemente.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
