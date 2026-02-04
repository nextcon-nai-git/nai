"use client"

import * as React from "react"
import { Sparkles, Send, BookOpen, Scale, ShieldCheck, Loader2, Info, SearchCheck, AlertTriangle, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { runKnowledgeAssistant, type KnowledgeOutput } from "@/ai/flows/knowledge-assistant-flow"

interface Message {
  role: 'user' | 'ai'
  content: string
  references?: string[]
  advice?: string
}

export default function KnowledgeBase() {
  const { toast } = useToast()
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'ai', content: "Olá! Sou a NAI, a Inteligência Artificial da Nextcon. Minha missão é simplificar a gestão de SST para sua equipe e clientes. Posso auditar inconsistências do eSocial, gerar contestações de NTEP ou tirar dúvidas técnicas sobre as NRs 2026. Como posso ajudar hoje?" }
  ])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim() || isLoading) return

    const userMessage = query
    setQuery("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const result = await runKnowledgeAssistant({ query: userMessage })
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: result.answer,
        references: result.references,
        advice: result.advice
      }])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na NAI",
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedSkills = [
    { label: "Auditar eSocial", icon: SearchCheck, query: "Como a NAI audita a inconsistência entre o PGR e o PCMSO?" },
    { label: "Contestar NTEP", icon: AlertTriangle, query: "Quais são os fundamentos legais para contestar um nexo epidemiológico em 2026?" },
    { label: "Validade NR-35", icon: ShieldCheck, query: "Qual a periodicidade de treinamento de NR-35 em 2026?" },
    { label: "Enriquecer Rede", icon: MapPin, query: "Como a NAI encontra endereços de clínicas parceiras automaticamente?" }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Cérebro NAI Intelligence</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">O suporte técnico definitivo para sua equipe e clientes 2026.</p>
        </div>
        <Badge variant="outline" className="border-primary text-primary px-4 py-1.5 font-bold bg-white">
          <ShieldCheck className="size-3 mr-2" /> BASE LEGAL ATUALIZADA 2026
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 flex flex-col h-[650px] card-shadow border-none overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <Sparkles className="size-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-headline">NAI - Nextcon AI Assistant</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-tighter">Motor Gemini 2.0 Flash ativo.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                        : 'bg-muted/50 border rounded-tl-none text-primary'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      
                      {msg.references && msg.references.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {msg.references.map((ref, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[9px] font-black uppercase bg-primary/10 text-primary border-none">
                              {ref}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {msg.advice && (
                        <div className="mt-4 p-3 bg-accent/10 rounded-xl border border-accent/20">
                          <p className="text-[10px] font-black text-primary uppercase flex items-center gap-1 mb-1">
                            <Info className="size-3 text-primary" /> Insight Estratégico Nextcon:
                          </p>
                          <p className="text-xs italic text-primary/80">{msg.advice}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none animate-pulse flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary/60">A NAI está processando...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSend} className="p-4 border-t bg-muted/10 flex gap-2">
              <Input 
                placeholder="Pergunte sobre eSocial, NRs ou Contestações..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 bg-white text-sm"
                disabled={isLoading}
              />
              <Button type="submit" className="h-12 w-12 p-0 bg-primary" disabled={isLoading || !query}>
                <Send className="size-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <BookOpen className="size-3" /> Habilidades da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedSkills.map((skill) => {
                const SkillIcon = skill.icon;
                return (
                  <button 
                    key={skill.label}
                    onClick={() => setQuery(skill.query)}
                    className="w-full text-left p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-primary/10 group shadow-sm bg-white/40"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <SkillIcon className="size-3 text-primary/40 group-hover:text-primary" />
                      <span className="text-[10px] font-black uppercase text-primary/60 group-hover:text-primary tracking-tighter">
                        {skill.label}
                      </span>
                    </div>
                    <p className="text-[10px] leading-tight text-muted-foreground group-hover:text-primary/80 line-clamp-2 italic">
                      "{skill.query}"
                    </p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase flex items-center gap-2 tracking-widest">
                <Scale className="size-3 text-accent" /> Salvaguarda Legal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] leading-relaxed opacity-80 italic">
                A NAI utiliza modelos LLM treinados na base normativa brasileira 2026. Todas as respostas de auditoria e contestação devem ser validadas pelo corpo técnico ou jurídico antes da transmissão final.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
