
"use client"

import * as React from "react"
import { Database, Loader2, CheckCircle2, ShieldCheck, Scale, Gavel, Zap, ArrowLeft, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/firebase"
import { doc, writeBatch } from "firebase/firestore"
import Link from "next/link"

const NORMAS = [
  {
    id: "medicina_cfm",
    categoria: "Médico",
    orgao: "CFM",
    norma_principal: "Resolução CFM 2.318/2022",
    foco_defesa: "Autonomia do assistente vs. Auditoria",
    gatilhos: ["cirurgia", "internacao", "opme"],
    texto_legal_padrao: "É vedado ao médico auditor interferir na autonomia técnica do médico assistente sem justificativa clínica robusta (Art. X da Res. 2.318)."
  },
  {
    id: "enfermagem_cofen",
    categoria: "Enfermeiro",
    orgao: "COFEN",
    norma_principal: "Resolução COFEN 662/2021",
    foco_defesa: "Auditoria de prontuários e custos hospitalares",
    gatilhos: ["taxas_hospitalares", "materiais_descartaveis", "diarias"],
    texto_legal_padrao: "A auditoria de enfermagem é atividade privativa do enfermeiro, sendo vedada a glosa técnica por profissional de outra categoria."
  },
  {
    id: "fisioterapia_coffito",
    categoria: "Fisioterapeuta",
    orgao: "COFFITO",
    norma_principal: "Resolução COFFITO 466/2016",
    foco_defesa: "Perícia e diagnóstico funcional",
    gatilhos: ["reabilitacao", "pilates", "fisioterapia_motora"],
    texto_legal_padrao: "O diagnóstico fisioterapêutico e a prescrição de sessões são prerrogativas do fisioterapeuta (Res. 466)."
  },
  {
    id: "psicologia_cfp",
    categoria: "Psicólogo",
    orgao: "CFP",
    norma_principal: "Resolução CFP 06/2019",
    foco_defesa: "Regras para elaboração de documentos/laudos",
    gatilhos: ["psicoterapia", "aba", "neuropsicologia"],
    texto_legal_padrao: "O documento psicológico deve seguir rigorosamente a estrutura técnica da Resolução 06/2019, sob pena de nulidade da negativa."
  },
  {
    id: "servico_social_cfess",
    categoria: "Assistente Social",
    orgao: "CFESS",
    norma_principal: "Resolução CFESS 493/2006",
    foco_defesa: "Sigilo e perícia social (Home Care)",
    gatilhos: ["home_care", "internacao_social", "desospitalizacao"],
    texto_legal_padrao: "A avaliação das condições de habitabilidade para Home Care é competência do Assistente Social, não sendo passível de negativa administrativa simples."
  },
  {
    id: "fonoaudiologia_cffa",
    categoria: "Fonoaudiólogo",
    orgao: "CFFa",
    norma_principal: "Resolução CFFa 472/2015",
    foco_defesa: "Auditoria em fonoaudiologia",
    gatilhos: ["tea", "disfagia", "audiometria"],
    texto_legal_padrao: "A auditoria em fonoaudiologia exige paridade técnica, conforme Resolução CFFa 472."
  }
];

const JURISPRUDENCIA = [
  {
    id: "tema_1069_stj",
    titulo: "Tema 1069 STJ - Rol Taxativo",
    aplicacao: "Negativas de cobertura por ausência no Rol da ANS",
    argumento_automatico: "Apesar do Rol Taxativo, existem exceções para terapias multidisciplinares conforme entendimento do STJ (Tema 1069).",
    anexar_em: ["tea", "doencas_raras"]
  },
  {
    id: "rn_424_ans",
    titulo: "RN 424 ANS - Junta Médica",
    aplicacao: "Divergência técnica de procedimentos e OPME",
    argumento_automatico: "Em caso de divergência, é obrigatória a instauração de Junta Médica/Odontológica, sendo vedada a negativa unilateral.",
    anexar_em: ["opme", "cirurgia_complexa"]
  }
];

const REGRAS_GLOSA = [
  {
    id: "confronto_opme",
    descricao: "Validação de valor de OPME",
    logica: "SE (parecer_junta == 'similar_nacional') E (conta_hospitalar == 'material_importado') ENTÃO GLOSAR_DIFERENCA"
  },
  {
    id: "confronto_home_care",
    descricao: "Validação de Diárias",
    logica: "SE (laudo_social == 'sem_condicao_tecnica') E (conta == 'cobrança_diaria') ENTÃO GLOSAR_TOTAL"
  }
];

export default function AuditSetupPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState("")

  async function handleSetup() {
    setLoading(true)
    setStatus("Iniciando injeção de inteligência técnica...")
    
    try {
      const batch = writeBatch(db)
      
      // 1. Normas
      NORMAS.forEach(norma => {
        const ref = doc(db, "config_normas_profissionais", norma.id)
        batch.set(ref, norma)
      })
      
      // 2. Jurisprudencia
      JURISPRUDENCIA.forEach(jur => {
        const ref = doc(db, "config_jurisprudencia", jur.id)
        batch.set(ref, jur)
      })

      // 3. Glosas
      REGRAS_GLOSA.forEach(regra => {
        const ref = doc(db, "config_glosa_reversa", regra.id)
        batch.set(ref, regra)
      })

      await batch.commit()
      setProgress(100)
      setStatus("Base Legal 2026 configurada com sucesso!")
      
      toast({
        title: "Ecossistema de Auditoria Ativado",
        description: "Normas, Jurisprudência e Regras de Glosa integradas ao motor NAI."
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Erro na Configuração",
        description: "Verifique sua conexão ou permissões de administrador."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <Card className="max-w-xl w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="size-32 text-accent" /></div>
          <div className="relative z-10 space-y-2">
            <Link href="/agency/cloud-infra">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white -ml-2 mb-4 gap-2">
                <ArrowLeft className="size-4" /> Voltar
              </Button>
            </Link>
            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
              <ShieldCheck className="size-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">Setup Auditoria 2026</CardTitle>
            <CardDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Injeção de Normas, Jurisprudência e Regras de Glosa</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-10 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Scale className="size-6 text-primary" />
              <span className="text-[8px] font-black uppercase text-center">Normas</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Gavel className="size-6 text-primary" />
              <span className="text-[8px] font-black uppercase text-center">Teses</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Zap className="size-6 text-primary" />
              <span className="text-[8px] font-black uppercase text-center">Glosas</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              <span>Integridade do Ecossistema</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-100" />
          </div>

          {status && (
            <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex items-center gap-3 text-primary">
              {loading ? <Loader2 className="size-4 animate-spin text-accent" /> : <CheckCircle2 className="size-4 text-accent" />}
              <span className="text-xs font-bold italic">"{status}"</span>
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
                <Database className="size-5 text-accent" /> Popular Ecossistema Técnico
              </>
            )}
          </Button>
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tighter">
            Esta operação provisiona as bases legais para o motor de IA da plataforma NextCon.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
