
"use client";

import * as React from "react";
import { ShieldPlus, CircleDollarSign, HardHat, Sparkles, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PITCH_DATA = {
  avatar: {
    nome: "NAI",
    titulo: "Inteligência Nextcon",
    saudacao: "Olá. Sou a NAI. Não contrate um software, contrate um escudo. Veja por quê 👇"
  },
  pilares: [
    {
      id: 1,
      icon: ShieldPlus,
      titulo: "Saúde: A Super-Junta Jurídica",
      resumo: "Proteção contra liminares de alto custo (TEA/NIPs).",
      texto: "Sabe aquelas liminares caríssimas de terapias e procedimentos? A NAI cruza normas dos conselhos e jurisprudência do STJ em tempo real para gerar contestações jurídicas robustas e automáticas."
    },
    {
      id: 2,
      icon: CircleDollarSign,
      titulo: "Financeiro: Glosa Reversa Automática",
      resumo: "Bloqueio de cobranças indevidas em contas hospitalares.",
      texto: "Você sabia que até 70% das contas hospitalares podem conter erros? Nossa IA audita o faturamento contra o laudo técnico antes da autorização. O dinheiro indevido nem chega a sair do seu caixa."
    },
    {
      id: 3,
      icon: HardHat,
      titulo: "SST 2026: Firewall Físico e Digital",
      resumo: "Integração com catracas e bloqueio de multas do eSocial.",
      texto: "O eSocial em 2026 cruza dados na velocidade da luz. Nossa inteligência integra com suas catracas físicas e bloqueia funcionários inaptos ou sem treinamento direto na porta de entrada, evitando a multa antes do fato ocorrer."
    }
  ]
};

export function NaiSalesPitch() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-5 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10">
        <div className="relative shrink-0">
          <div className="size-16 rounded-[1.5rem] bg-[#090e24] flex items-center justify-center text-white font-black text-3xl shadow-xl border-2 border-[#00f2ff]/20">
            N
          </div>
          <div className="absolute -bottom-1 -right-1 size-5 bg-accent rounded-full border-2 border-white flex items-center justify-center">
            <Zap className="size-3 text-primary fill-current" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-black text-primary uppercase tracking-tight leading-none">{PITCH_DATA.avatar.nome}</h4>
          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">{PITCH_DATA.avatar.titulo}</p>
          <p className="text-xs italic text-slate-500 mt-2 leading-relaxed">"{PITCH_DATA.avatar.saudacao}"</p>
        </div>
      </div>

      <div className="space-y-4">
        {PITCH_DATA.pilares.map((pilar) => (
          <Card key={pilar.id} className="border-none shadow-sm bg-white hover:ring-2 ring-[#00f2ff]/20 transition-all group rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors h-fit shadow-inner">
                  <pilar.icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-black text-primary uppercase text-xs tracking-tight">{pilar.titulo}</h5>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-tight">{pilar.resumo}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto transition-all duration-500 overflow-hidden">
                    {pilar.texto}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-[#090e24] rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
          <Sparkles className="size-20 text-[#00f2ff]" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">Blindagem Total 2026</p>
          <h3 className="text-sm font-bold leading-tight">Termine seu orçamento e blinde sua operação hoje mesmo.</h3>
          <ChevronRight className="size-5 text-accent animate-bounce mt-2" />
        </div>
      </div>
    </div>
  );
}
