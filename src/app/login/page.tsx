
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2, Mail, Lock, AlertCircle, ExternalLink, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useAuth, useUser } from "@/firebase"
import { initiateEmailSignIn } from "@/firebase/non-blocking-login"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NextconLogo } from "@/components/ui/logo"

const SUGGESTED_USERS = [
  { email: "relacionamento@nextconsaude.com.br", name: "Pablo (Comercial)" },
  { email: "sso@nextconsaude.com.br", name: "Kelly (Admin)" },
  { email: "nextcon@nextconsaude.com.br", name: "Rodrigo (Consultor)" },
]

export default function LoginPage() {
  const [email, setEmail] = React.useState("nextcon@nextconsaude.com.br")
  const [password, setPassword] = React.useState("2025")
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    
    initiateEmailSignIn(auth, email, password, (error) => {
      setLoading(false)
      
      let message = "Falha na autenticação. Verifique seus dados."
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "E-mail ou senha incorretos. Verifique os dados ou crie o usuário no Console do Firebase."
      } else if (error.code === 'auth/too-many-requests') {
        message = "Muitas tentativas falhas. Tente novamente mais tarde."
      }

      setErrorMessage(message)
      toast({
        variant: "destructive",
        title: "Erro de Acesso",
        description: message,
      })
    })
  }

  if (isUserLoading) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-muted/30 p-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="size-16 flex items-center justify-center text-primary drop-shadow-xl">
              <NextconLogo className="size-full" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-black text-primary tracking-tighter leading-none">NEXTCON</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">Saúde Empresarial</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 text-center text-white">
          <CardTitle className="text-2xl font-bold font-headline">Acesso ao Sistema SST</CardTitle>
          <p className="text-white/70 text-xs mt-1">Plataforma Unificada Nextcon</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-6">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
              <p className="text-[10px] font-black text-blue-800 uppercase flex items-center gap-1">
                <Users className="size-3" /> Equipe Nextcon Habilitada:
              </p>
              <div className="grid grid-cols-1 gap-1">
                {SUGGESTED_USERS.map(u => (
                  <button 
                    key={u.email}
                    type="button"
                    onClick={() => setEmail(u.email)}
                    className="text-[10px] text-left hover:text-primary transition-colors text-blue-600 font-medium"
                  >
                    • {u.name}: {u.email}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="nome@nextcon.com.br"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <Button type="submit" className="w-full bg-primary py-6 text-lg font-bold" disabled={loading}>
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Acessar Plataforma"}
            </Button>
            <div className="flex flex-col items-center gap-2">
              <a 
                href="https://console.firebase.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="size-3" /> Abrir Console do Firebase
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-xs text-muted-foreground">
        © 2024 Nextcon Saúde Empresarial. Todos os direitos reservados.
      </p>
    </div>
  )
}
