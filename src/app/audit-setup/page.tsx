
"use client"

import * as React from "react"
import { Database, Loader2, CheckCircle2, ShieldCheck, Scale, Gavel, Zap, ArrowLeft, Sparkles, ShieldAlert, HardHat, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/firebase"
import { doc, writeBatch } from "firebase/firestore"
import Link from "next/link"

const NORMAS_SAUDE = [
  { id: "medicina_cfm", categoria: "Médico", orgao: "CFM", norma_principal: "Resolução CFM 2.318/2022", foco_defesa: "Autonomia do assistente vs. Auditoria", gatilhos: ["cirurgia", "internacao", "opme"], texto_legal_padrao: "É vedado ao médico auditor interferir na autonomia técnica do médico assistente sem justificativa clínica robusta (Art. X da Res. 2.318)." },
  { id: "enfermagem_cofen", categoria: "Enfermeiro", orgao: "COFEN", norma_principal: "Resolução COFEN 662/2021", foco_defesa: "Auditoria de prontuários e custos hospitalares", gatilhos: ["taxas_hospitalares", "materiais", "diarias"], texto_legal_padrao: "A auditoria de enfermagem é atividade privativa do enfermeiro, sendo vedada a glosa técnica por profissional de outra categoria." },
  { id: "fisioterapia_coffito", categoria: "Fisioterapeuta", orgao: "COFFITO", norma_principal: "Resolução COFFITO 466/2016", foco_defesa: "Perícia e diagnóstico funcional", gatilhos: ["reabilitacao", "pilates", "fisioterapia_motora"], texto_legal_padrao: "O diagnóstico fisioterapêutico e a prescrição de sessões são prerrogativas do fisioterapeuta (Res. 466)." },
  { id: "psicologia_cfp", categoria: "Psicólogo", orgao: "CFP", norma_principal: "Resolução CFP 06/2019", foco_defesa: "Regras para elaboração de documentos/laudos", gatilhos: ["psicoterapia", "aba", "neuropsicologia"], texto_legal_padrao: "O documento psicológico deve seguir rigorosamente a estrutura técnica da Resolução 06/2019, sob pena de nulidade da negativa." },
  { id: "servico_social_cfess", categoria: "Assistente Social", orgao: "CFESS", norma_principal: "Resolução CFESS 493/2006", foco_defesa: "Sigilo e perícia social", gatilhos: ["home_care", "desospitalizacao"], texto_legal_padrao: "A avaliação das condições de habitabilidade para Home Care é competência do Assistente Social, não sendo passível de negativa administrativa simples." }
];

const JURISPRUDENCIA = [
  { id: "tema_1069_stj", titulo: "Tema 1069 STJ - Rol Taxativo", aplicacao: "Terapias multidisciplinares", argumento_automatico: "Apesar do Rol Taxativo, existem exceções para terapias multidisciplinares conforme entendimento do STJ (Tema 1069)." },
  { id: "rn_424_ans", titulo: "RN 424 ANS - Junta Médica", aplicacao: "Divergência técnica de procedimentos e OPME", argumento_automatico: "Em caso de divergência, é obrigatória a instauração de Junta Médica/Odontológica, sendo vedada a negativa unilateral." }
];

const NORMAS_SST = [
  { id: "nr_01", norma: "NR-1", titulo: "Gerenciamento de Riscos", foco_fiscalizacao: "PGR e Riscos Psicossociais", acao_preventiva: "Alerta de revisão do PGR por absenteísmo (CID F)." },
  { id: "nr_07", norma: "NR-7", titulo: "PCMSO", foco_fiscalizacao: "Validade ASO", acao_preventiva: "Bloqueio de alocação com ASO vencido." },
  { id: "nr_35", norma: "NR-35", titulo: "Trabalho em Altura", foco_fiscalizacao: "EPIs e Treinamento", acao_preventiva: "Exigir bipagem QR Code e validade de treinamento." }
];

const REGRAS_SST = [
  { id: "firewall_esocial_s2240", evento: "S-2240", logica_bloqueio: "SE (ltcat == 'vencido') ENTÃO BLOQUEAR_ENVIO", mensagem_erro: "Bloqueio: LTCAT desatualizado ou inexistente." },
  { id: "bloqueio_alocacao_risco", evento: "Alocação", logica_bloqueio: "SE (treinamentos_pendentes > 0) ENTÃO BLOQUEAR_ALOCACAO", mensagem_erro: "Colaborador inapto para a função. Treinamentos pendentes." }
];

const PITCH_NAI = {
  id: "pitch_vendas_padrao",
  ativo: true,
  contexto_exibicao: "formulario_orcamento",
  avatar: {
    nome: "NAI",
    titulo: "Inteligência Nextcon",
    saudacao_inicial: "Olá. Sou a NAI. Não contrate um software, contrate um escudo. Veja por quê 👇"
  },
  pilares_venda: [
    {
      ordem: 1,
      icone: "shield_health",
      titulo: "Saúde: A Super-Junta Jurídica",
      resumo: "Proteção contra liminares de alto custo (TEA/NIPs).",
      texto_completo: "Sabe aquelas liminares caríssimas de terapias e procedimentos? A NAI cruza normas dos conselhos e jurisprudência do STJ em tempo real para gerar contestações jurídicas robustas e automáticas."
    },
    {
      ordem: 2,
      icone: "attach_money_block",
      titulo: "Financeiro: Glosa Reversa Automática",
      resumo: "Bloqueio de cobranças indevidas em contas hospitalares.",
      texto_completo: "Você sabia que até 70% das contas hospitalares podem conter erros? Nossa IA audita o faturamento contra o laudo técnico antes da autorização. O dinheiro indevido nem chega a sair do seu caixa."
    },
    {
      ordem: 3,
      icone: "security_hard_hat",
      titulo: "SST 2026: Firewall Físico e Digital",
      resumo: "Integração com catracas e bloqueio de multas do eSocial.",
      texto_completo: "O eSocial em 2026 está cruzando dados na velocidade da luz. Nossa inteligência integra com suas catracas físicas e bloqueia funcionários inaptos ou sem treinamento direto na porta de entrada, evitando a multa antes do fato ocorrer."
    }
  ],
  cta_final: "Termine seu orçamento e blinde sua operação."
};

export default function AuditSetupPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState("")

  async function handleSetup() {
    setLoading(true)
    setStatus("Iniciando injeção do Ecossistema Integrado (Saúde + SST)...")
    
    try {
      const batch = writeBatch(db)
      
      // 1. Normas de Saúde
      NORMAS_SAUDE.forEach(norma => {
        batch.set(doc(db, "config_normas_profissionais", norma.id), norma)
      })
      
      // 2. Jurisprudência
      JURISPRUDENCIA.forEach(jur => {
        batch.set(doc(db, "config_jurisprudencia", jur.id), jur)
      })

      // 3. Normas SST (NRs)
      NORMAS_SST.forEach(nr => {
        batch.set(doc(db, "config_nrs", nr.id), nr)
      })

      // 4. Regras SST (Firewall eSocial)
      REGRAS_SST.forEach(regra => {
        batch.set(doc(db, "config_regras_sst", regra.id), regra)
      })

      // 5. Ativos SST (EPIs/Instrumentos)
      batch.set(doc(db, "ativos_sst_equipamentos", "EQP-CINTO-001"), { id_equipamento: "EQP-CINTO-001", qr_code_hash: "8f4a2b9c", categoria: "EPI_Altura", tipo: "Cinto Paraquedista", ca_numero: "45678", ca_validade: "2028-12-31", status_uso: "ativo" })

      // 6. Roteiro NAI Pitch
      batch.set(doc(db, "config_nai_avatar", PITCH_NAI.id), PITCH_NAI)

      await batch.commit()
      setProgress(100)
      setStatus("Cérebro NAI 2026 configurado com sucesso!")
      
      toast({
        title: "Ecossistema Integrado Ativado",
        description: "Saúde, SST, eSocial e Ativos sincronizados ao motor NAI."
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Erro na Configuração",
        description: "Falha ao provisionar as bases técnicas."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-700 pb-20">
      <Card className="max-w-2xl w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="size-48 text-accent" /></div>
          <div className="relative z-10 space-y-2">
            <Link href="/agency/cloud-infra">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white -ml-2 mb-4 gap-2">
                <ArrowLeft className="size-4" /> Voltar
              </Button>
            </Link>
            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
              <ShieldCheck className="size-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">Setup Ecossistema 2026</CardTitle>
            <CardDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Injeção massiva de Inteligência em Saúde & Segurança</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-10 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <SetupIndicator icon={Scale} label="Saúde" />
            <SetupIndicator icon={ShieldAlert} label="NRs" />
            <SetupIndicator icon={Zap} label="eSocial" />
            <SetupIndicator icon={HardHat} label="Ativos" />
            <SetupIndicator icon={Bot} label="Pitch NAI" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              <span>Sincronização de Inteligência</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-100" />
          </div>

          {status && (
            <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl flex items-center gap-4 text-primary animate-in slide-in-from-bottom-2">
              {loading ? <Loader2 className="size-5 animate-spin text-accent" /> : <CheckCircle2 className="size-5 text-accent" />}
              <span className="text-xs font-bold italic leading-tight">"{status}"</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-10 bg-slate-50 flex flex-col gap-4">
          <Button 
            onClick={handleSetup} 
            disabled={loading}
            className="w-full h-16 bg-primary text-white hover:bg-primary/90 text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 gap-3"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="size-5 animate-spin" /> Sincronizando...
              </div>
            ) : (
              <>
                <Database className="size-5 text-accent" /> Ativar Cérebro NAI Integrado
              </>
            )}
          </Button>
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tighter">
            Esta operação provisiona as bases normativas e o roteiro de vendas NAI para o motor Gemini 2.0.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

function SetupIndicator({ icon: Icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/10 transition-colors">
      <Icon className="size-6 text-primary" />
      <span className="text-[8px] font-black uppercase text-center text-slate-500">{label}</span>
    </div>
  )
}
