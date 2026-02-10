
"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Zap, 
  FileText, 
  Filter, 
  Users, 
  Mail, 
  Calendar, 
  Package, 
  ShieldCheck, 
  MousePointer2, 
  PhoneCall, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Globe,
  Settings2,
  Headphones,
  Image as ImageIcon,
  DollarSign,
  Briefcase
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function WonflyCRM() {
  const { toast } = useToast()
  const [activeSection, setActiveSection] = React.useState("overview")

  const functionalities = [
    { title: "Gestão de Negócios", desc: "Pipelines personalizados com Kanban intuitivo 'drag and drop' e filtros de precisão.", icon: LayoutDashboard },
    { title: "Docs & Assinatura", desc: "Crie propostas e contratos com assinatura digital integrada e rastreamento de leitura.", icon: FileText },
    { title: "Sincronização 2-way", desc: "E-mails e calendários (Google/Outlook) sempre atualizados em ambas as direções.", icon: RefreshCcwIcon },
    { title: "Automação NAI", desc: "Fluxos de trabalho automáticos para atribuição de tarefas e webhooks externos.", icon: Zap },
    { title: "CRM Mobile & Web", desc: "Acesse seus leads e histórico de chamadas de qualquer lugar, com registro em tempo real.", icon: Globe },
    { title: "Insights de Performance", desc: "Dashboards customizáveis com cartões de BI para monitorar metas e produtividade.", icon: Sparkles },
  ]

  const pricing = [
    { name: "Starter", price: "R$ 149", features: ["Até 3 usuários", "Pipelines ilimitados", "Integração E-mail", "Suporte via Chat"], recommended: false },
    { name: "Professional", price: "R$ 399", features: ["Até 10 usuários", "Assinatura Digital", "Automações de Fluxo", "BI & Insights"], recommended: true },
    { name: "Enterprise", price: "Sob consulta", features: ["Usuários Ilimitados", "Integração API Omie", "SLA Dedicado", "Onboarding VIP"], recommended: false },
  ]

  const faqs = [
    { q: "O Wonfly integra com quais ferramentas?", a: "Possuímos integrações nativas com Omie, Google Workspace, Microsoft 365, Twilio e suporte a Webhooks para outros sistemas." },
    { q: "Posso importar meus dados de outro CRM?", a: "Sim, oferecemos ferramentas de importação via CSV e suporte técnico para migração de bases complexas." },
    { q: "A assinatura digital é válida juridicamente?", a: "Sim, seguimos os padrões de conformidade ICP-Brasil e normas internacionais de assinatura eletrônica." },
    { q: "Como funciona a sincronização de calendário?", a: "É bidirecional. Se você agendar no Wonfly, aparece no seu celular. Se agendar no Outlook/Gmail, o Wonfly registra o compromisso no card do cliente." },
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header / Hero */}
      <section className="relative overflow-hidden rounded-[3rem] bg-[#090e24] text-white p-12 lg:p-20 shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Sparkles className="size-64 text-accent" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge className="bg-accent text-primary font-black uppercase text-[10px] tracking-[0.3em] px-4 py-1.5 border-none">
            CRM Engine Powered by Wonfly
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-black font-headline tracking-tighter leading-none uppercase">
            Acelerador de <br /> <span className="text-accent">Vendas & Leads</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-xl font-medium">
            O Wonfly é o CRM definitivo para empresas que buscam simplicidade, inteligência e integração total. Gerencie pipelines, assine contratos e automatize sua rotina comercial em uma única tela.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="h-16 px-10 bg-accent text-primary hover:bg-accent/90 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-accent/20">
              Iniciar Teste Gratuito
            </Button>
            <Button variant="outline" className="h-16 px-10 border-white/20 text-white hover:bg-white/5 rounded-2xl font-black uppercase text-xs tracking-widest">
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Navegação Interna */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 border-b border-slate-100 -mx-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex gap-8">
            {["Funcionalidades", "Preços", "Integrações", "Galeria", "FAQ", "Suporte"].map((item) => (
              <button 
                key={item} 
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pronto para escalar?</p>
            <Button size="sm" className="bg-primary text-white h-9 rounded-xl font-black uppercase text-[9px] px-6">Assinar Agora</Button>
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-headline">Recursos de Alta Performance</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Tudo o que sua equipe precisa para bater metas todos os dias.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functionalities.map((func, i) => (
            <Card key={i} className="card-shadow border-none bg-white rounded-3xl overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
              <CardContent className="p-8 space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl w-fit text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <func.icon className="size-6" />
                </div>
                <h3 className="text-lg font-black text-primary uppercase leading-tight">{func.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{func.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Preços */}
      <section id="preços" className="space-y-10 py-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-headline">Investimento Estratégico</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Planos flexíveis para cada estágio do seu crescimento.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, i) => (
            <Card key={i} className={cn(
              "border-none shadow-xl rounded-[2.5rem] p-10 flex flex-col relative",
              plan.recommended ? "bg-primary text-white scale-105 z-10" : "bg-white text-primary"
            )}>
              {plan.recommended && (
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary font-black uppercase text-[9px] px-4 py-1 border-none shadow-lg">
                  Mais Escolhido
                </Badge>
              )}
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.price !== "Sob consulta" && <span className="text-xs opacity-60">/mês</span>}
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className={cn("size-4", plan.recommended ? "text-accent" : "text-primary")} />
                    <span className="text-sm font-medium">{feat}</span>
                  </div>
                ))}
              </div>
              <Button className={cn(
                "w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-10",
                plan.recommended ? "bg-accent text-primary hover:bg-accent/90 shadow-xl shadow-accent/20" : "bg-primary text-white"
              )}>
                Selecionar Plano
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrações */}
      <section id="integrações" className="bg-slate-50 rounded-[3rem] p-12 lg:p-20 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-primary uppercase font-headline">Ecossistema Conectado</h2>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">O Wonfly trabalha onde você já está.</p>
          </div>
          <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2">
            Ver todas as 50+ integrações <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {["Omie ERP", "Google Mail", "Outlook", "Google Calendar", "Twilio", "Zapier"].map((brand) => (
            <div key={brand} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3 group hover:shadow-md transition-all">
              <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                <Settings2 className="size-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{brand}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-headline">Experiência Visual</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Design intuitivo para focar no que importa: Fechar Negócios.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
            <img 
              src="https://picsum.photos/seed/wonfly1/800/600" 
              alt="Kanban View" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="crm dashboard"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <h4 className="font-black uppercase text-sm">Pipeline Kanban</h4>
              <p className="text-xs text-white/70">Arraste e solte seus negócios entre as etapas de venda.</p>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-8">
            <div className="relative group rounded-[2rem] overflow-hidden shadow-xl h-[184px]">
              <img 
                src="https://picsum.photos/seed/wonfly2/800/400" 
                alt="BI Reports" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                data-ai-hint="data analytics"
              />
              <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <span className="bg-white text-primary px-6 py-2 rounded-xl font-black uppercase text-[10px]">Ver Insights</span>
              </div>
            </div>
            <div className="relative group rounded-[2rem] overflow-hidden shadow-xl h-[184px]">
              <img 
                src="https://picsum.photos/seed/wonfly3/800/400" 
                alt="Document Editor" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                data-ai-hint="document contract"
              />
              <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <span className="bg-white text-primary px-6 py-2 rounded-xl font-black uppercase text-[10px]">Propostas Inteligentes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10 border-t">
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-primary uppercase font-headline leading-tight">Dúvidas Frequentes</h2>
          <p className="text-slate-500 font-medium">Tudo o que você precisa saber sobre o Wonfly CRM Engine para começar a escalar hoje mesmo.</p>
          <div className="pt-6">
            <Button variant="outline" className="h-14 px-8 rounded-2xl gap-3 font-black uppercase text-[10px] tracking-widest">
              <Headphones className="size-4" /> Falar com Especialista
            </Button>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-100 py-2">
              <AccordionTrigger className="text-sm font-black text-primary uppercase hover:no-underline hover:text-accent">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-relaxed font-medium pt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Suporte / Contact */}
      <section id="suporte" className="bg-[#003366] text-white rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row gap-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://images.unsplash.com/photo-1557426272-fc759fbb7a8d?q=80&w=2070')] bg-cover" />
        <div className="flex-1 space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase font-headline tracking-tighter">Contato & Suporte</h2>
            <p className="text-white/60 font-medium max-w-md">Precisa de uma solução customizada para sua rede de SST ou quer integrar o Wonfly ao seu ERP? Nosso time está pronto para ajudar.</p>
          </div>
          <div className="space-y-6">
            <ContactInfo icon={Mail} label="Comercial" value="vendas@wonfly.com.br" />
            <ContactInfo icon={MessageSquare} label="Suporte Técnico" value="ajuda@wonfly.com.br" />
            <ContactInfo icon={PhoneCall} label="WhatsApp Business" value="+55 (11) 99999-0000" />
          </div>
        </div>
        <Card className="flex-1 border-none bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 relative z-10">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast({ title: "Mensagem Recebida", description: "Em breve um consultor Wonfly entrará em contato." }) }}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Seu Nome</label>
              <Input placeholder="Ex: Felipe Bianca" className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent/30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">E-mail Corporativo</label>
              <Input type="email" placeholder="nome@empresa.com.br" className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent/30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Como podemos ajudar?</label>
              <Textarea placeholder="Descreva sua necessidade..." className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl focus-visible:ring-accent/30" />
            </div>
            <Button className="w-full h-16 bg-accent text-primary font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:opacity-90">
              Enviar Solicitação
            </Button>
          </form>
        </Card>
      </section>
    </div>
  )
}

function ContactInfo({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-accent">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{label}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </div>
  )
}

function RefreshCcwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}
