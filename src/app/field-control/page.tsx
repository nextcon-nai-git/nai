
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
  Video, 
  Clock, 
  Truck, 
  Sparkles, 
  Search, 
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  HardHat,
  Gauge
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export default function FieldControlPage() {
  const functionalities = [
    { 
      title: "Ordem de Serviço & Agendamento", 
      desc: "Gestão 100% digital de vistorias e medições com execução offline em locais remotos ou subsolos.", 
      icon: ClipboardCheck 
    },
    { 
      title: "Geofencing & Check-in Real-time", 
      desc: "Rastreamento por GPS com trava de segurança: a atividade só inicia dentro de 300m do local da auditoria.", 
      icon: MapPin 
    },
    { 
      title: "Apps Gestor & Colaborador", 
      desc: "Interfaces distintas para controle tático no escritório e coleta de dados sem papel em campo.", 
      icon: Smartphone 
    },
    { 
      title: "Formulários de Medição", 
      desc: "Checklists customizados para ruído, calor, químicos e NRs com geração automática de laudos técnicos.", 
      icon: FileText 
    },
    { 
      title: "Transparência & Clientes", 
      desc: "Compartilhamento de localização em tempo real e envio imediato de relatórios com evidências digitais.", 
      icon: Users 
    },
    { 
      title: "Recorrência Automática", 
      desc: "Plano de atividades preventivas e vistorias periódicas agendadas automaticamente pelo sistema.", 
      icon: Clock 
    },
  ]

  const modules = [
    { title: "Gestão de Equipamentos", desc: "Controle de calibração e histórico de uso de decibelímetros, dosímetros e outros instrumentos.", icon: Gauge },
    { title: "Alta Resolução Fotográfica", desc: "Módulo forense para captura de detalhes minuciosos em inspeções de máquinas e estruturas.", icon: Camera },
    { title: "Evidência Audiovisual", desc: "Anexo de vídeos técnicos para comprovação de conformidade e dinâmicas de risco.", icon: Video },
    { title: "SLA & Prazos Críticos", desc: "Controle rígido de Acordos de Nível de Serviço para auditorias contratuais e periciais.", icon: ShieldCheck },
    { title: "Gestão de Frotas", desc: "Monitoramento de quilometragem e disponibilidade de veículos das equipes de engenharia.", icon: Truck },
    { title: "Otimizador NAI de Rotas", desc: "Inteligência Artificial que define trajetos baseada em trânsito e economia de combustível.", icon: Zap },
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-[#090e24] text-white p-12 lg:p-20 shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <HardHat className="size-64 text-accent" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge className="bg-accent text-primary font-black uppercase text-[10px] tracking-[0.3em] px-4 py-1.5 border-none">
            Field Control - Operações Externas 2026
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-black font-headline tracking-tighter leading-none uppercase">
            Controle de Equipes <br /> <span className="text-accent">em Campo</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-xl font-medium">
            A solução definitiva para o controle rigoroso de equipes de medição, auditoria técnica e vistorias de campo. Garanta a integridade dos dados e a conformidade normativa em tempo real.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="h-16 px-10 bg-accent text-primary hover:bg-accent/90 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-accent/20">
              Ativar Gestão de Campo
            </Button>
            <Button variant="outline" className="h-16 px-10 border-white/20 text-white hover:bg-white/5 rounded-2xl font-black uppercase text-xs tracking-widest">
              Ver Demo Mobile
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 border-b border-slate-100 -mx-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex gap-8">
            {["Funcionalidades", "Módulos", "Segmentos", "Preços", "FAQ"].map((item) => (
              <button 
                key={item} 
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4 text-primary font-black uppercase text-[10px] tracking-widest">
            <Sparkles className="size-4 text-accent" /> NAI Intelligence Ativa
          </div>
        </div>
      </div>

      {/* Main Features */}
      <section id="funcionalidades" className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-headline">Motor de Produtividade Externa</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Recursos avançados para gestão de auditorias e medições.</p>
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

      {/* Additional Modules */}
      <section id="módulos" className="bg-slate-50 rounded-[3rem] p-12 lg:p-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-headline">Módulos Especializados</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Expanda o poder da sua equipe de engenharia e perícia.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, i) => (
            <div key={i} className="flex gap-5 group">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 h-fit">
                <mod.icon className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-primary uppercase tracking-tight">{mod.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Segmentos Atendidos */}
      <section id="segmentos" className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-headline">Segmentos Atendidos</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Flexibilidade para todos os nichos de serviços externos.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            "Engenharia de Segurança", "Medições Ambientais", "Manutenção Elétrica", "Vistoria Predial", 
            "Auditoria de NRs", "Climatização", "Automação Industrial", "Instalações Solares", 
            "Telecomunicações", "Segurança Eletrônica"
          ].map((seg) => (
            <div key={seg} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 className="size-4 text-accent" />
              <span className="text-[10px] font-black uppercase text-primary tracking-tighter leading-tight">{seg}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10 border-t">
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-primary uppercase font-headline leading-tight">Dúvidas Técnicas</h2>
          <p className="text-slate-500 font-medium">Saiba como o Field Control garante a precisão das suas medições e a transparência operacional.</p>
          <div className="pt-6">
            <Button variant="outline" className="h-14 px-8 rounded-2xl gap-3 font-black uppercase text-[10px] tracking-widest">
              Falar com Engenheiro de Suporte
            </Button>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="offline" className="border-b border-slate-100 py-2">
            <AccordionTrigger className="text-sm font-black text-primary uppercase hover:no-underline">Funciona sem internet?</AccordionTrigger>
            <AccordionContent className="text-sm text-slate-500 leading-relaxed font-medium pt-2">
              Sim. A equipe de campo pode preencher checklists e coletar medições offline. Os dados são sincronizados automaticamente assim que houver conexão.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="gps" className="border-b border-slate-100 py-2">
            <AccordionTrigger className="text-sm font-black text-primary uppercase hover:no-underline">Como funciona a trava de localização?</AccordionTrigger>
            <AccordionContent className="text-sm text-slate-500 leading-relaxed font-medium pt-2">
              O sistema utiliza Geofencing. O Check-in só é liberado se o técnico estiver dentro do raio configurado (padrão 300m) do endereço da Ordem de Serviço.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="equipments" className="border-b border-slate-100 py-2">
            <AccordionTrigger className="text-sm font-black text-primary uppercase hover:no-underline">Posso controlar calibração de instrumentos?</AccordionTrigger>
            <AccordionContent className="text-sm text-slate-500 leading-relaxed font-medium pt-2">
              Sim. O módulo de equipamentos permite cadastrar certificados de calibração e gera alertas de vencimento, bloqueando o uso do aparelho se estiver fora do prazo.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer Contact */}
      <section className="bg-primary text-white rounded-[3rem] p-12 lg:p-20 flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070')] bg-cover" />
        <div className="space-y-4 relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black uppercase font-headline tracking-tighter">Pronto para digitalizar sua operação de campo?</h2>
          <p className="text-white/60 font-medium">Elimine o papel, reduza custos logísticos e garanta 100% de conformidade técnica em suas auditorias.</p>
        </div>
        <Button className="h-16 px-12 bg-accent text-primary font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl relative z-10 hover:scale-105 transition-transform">
          Solicitar Demonstração Técnica
        </Button>
      </section>
    </div>
  )
}
