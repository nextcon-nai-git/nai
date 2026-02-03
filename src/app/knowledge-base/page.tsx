"use client"

import * as React from "react"
import { Sparkles, Send, BookOpen, Scale, ShieldCheck, Loader2, Info } from "lucide-react"
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
    { role: 'ai', content: "Olá! Sou o Sentinel AI da Nextcon. Posso tirar qualquer dúvida sobre as NRs ou legislação de SST. Como posso ajudar sua agência hoje?" }
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
        title: "Erro no Assistente",
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Assistente de Normas</h1>
          <p className="text-muted-foreground">Consultoria técnica imediata sobre NRs e legislação via IA.</p>
        </div>
        <Badge variant="outline" className="border-primary text-primary px-4 py-1.5 font-bold bg-white">
          <ShieldCheck className="size-3 mr-2" /> BASE LEGAL ATUALIZADA 2024
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3 flex flex-col h-[600px] card-shadow border-none overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <Sparkles className="size-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Sentinel AI Consultant</CardTitle>
                <CardDescription>Respostas baseadas nas 38 NRs e Decretos Previdenciários.</CardDescription>
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
                        ? 'bg-primary text-white rounded-tr-none' 
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
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-widest">Consultando NRs...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSend} className="p-4 border-t bg-muted/10 flex gap-2">
              <Input 
                placeholder="Ex: Qual a validade do treinamento de NR-35?" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 bg-white"
                disabled={isLoading}
              />
              <Button type="submit" className="h-12 w-12 p-0" disabled={isLoading || !query}>
                <Send className="size-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <BookOpen className="size-4" /> Temas Sugeridos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Prazos do eSocial S-2240",
                "Mudanças na NR-01 (PGR)",
                "CNAE vs Grau de Risco",
                "NTEP em auxílio-doença"
              ].map((topic) => (
                <button 
                  key={topic}
                  onClick={() => setQuery(topic)}
                  className="w-full text-left p-2 text-xs hover:bg-white rounded-lg transition-colors border border-transparent hover:border-primary/10 font-medium text-primary/70"
                >
                  • {topic}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
                <Scale className="size-4 text-accent" /> Validade Jurídica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] leading-relaxed opacity-80">
                O Sentinel AI utiliza modelos LLM de última geração treinados na base normativa brasileira. No entanto, sempre valide decisões críticas com o corpo técnico ou jurídico da agência.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
