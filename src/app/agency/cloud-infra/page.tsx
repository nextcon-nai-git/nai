"use client"

import * as React from "react"
import { Cloud, Terminal, ShieldCheck, Zap, RefreshCw, ExternalLink, HardDrive, Cpu, Network, Lock, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { firebaseConfig } from "@/firebase/config"

export default function CloudInfraPage() {
  const [isSyncing, setIsSyncing] = React.useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 2000)
  }

  const commands = [
    { cmd: "gcloud init", desc: "Inicializa e configura o Google Cloud SDK no seu terminal local." },
    { cmd: "firebase login", desc: "Autentica sua máquina com a conta do Firebase Console." },
    { cmd: "npm run build", desc: "Gera o build otimizado da Nextcon Platform para produção." },
    { cmd: "firebase deploy", desc: "Envia as regras de segurança e o hosting para a nuvem." },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Infraestrutura Cloud</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Painel de controle de implantação e serviços Google Cloud.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-primary text-primary font-bold uppercase text-[10px] gap-2" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={isSyncing ? "size-4 animate-spin" : "size-4"} /> 
            {isSyncing ? "Sincronizando..." : "Verificar Status"}
          </Button>
          <Button className="gradient-nextcon text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2">
            <Zap className="size-4" /> Deploy Produção
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden border-2 border-emerald-100/50">
            <CardHeader className="bg-emerald-50 border-b pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <Globe className="size-5 text-emerald-600" /> Domínio de Produção
                </CardTitle>
                <Badge className="bg-emerald-600 text-white font-black uppercase text-[8px] px-2 h-5">Ativo e Estável</Badge>
              </div>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/60">Endpoint oficial para clientes e parceiros.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Endereço Principal</p>
                  <h3 className="text-xl font-bold text-primary">www.nextconsaude.com.br/nai</h3>
                </div>
                <Button className="bg-primary text-white font-black uppercase text-[10px] rounded-xl h-12 px-8 shadow-xl" asChild>
                  <a href="https://www.nextconsaude.com.br/nai" target="_blank" rel="noopener noreferrer">
                    Acessar Produção <ExternalLink className="size-3 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-6">
              <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <Terminal className="size-5 text-accent" /> CLI Quick Reference
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Comandos essenciais para o time de engenharia de software.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {commands.map((c, i) => (
                  <div key={i} className="group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-primary/20 transition-all">
                      <div className="space-y-1">
                        <code className="text-sm font-black text-primary bg-primary/5 px-2 py-1 rounded-md">{c.cmd}</code>
                        <p className="text-[11px] text-muted-foreground font-medium">{c.desc}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-primary/40 group-hover:text-primary">Copiar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#090e24] text-white border-none p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Cloud className="size-32 text-accent" /></div>
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                <Lock className="size-4" /> Segurança de Nuvem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black uppercase text-white/40 mb-2">Project ID</p>
                  <p className="text-sm font-bold font-mono text-accent">{firebaseConfig.projectId}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black uppercase text-white/40 mb-2">App Hosting Status</p>
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-xs font-bold">STABLE_PRODUCTION</p>
                  </div>
                </div>
              </div>
              <Button className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] rounded-2xl shadow-xl hover:opacity-90 transition-all" asChild>
                <a href="https://console.firebase.google.com/" target="_blank">
                  Ir para o Console <ExternalLink className="size-3 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center gap-4">
            <div className="size-16 bg-primary/5 rounded-full flex items-center justify-center">
              <Network className="size-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-primary uppercase">Pipeline CD/CI</h4>
              <p className="text-xs text-muted-foreground italic">"Monitorando mudanças no repositório para gatilho automático de deploy para o novo domínio."</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
