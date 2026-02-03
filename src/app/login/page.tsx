
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useAuth, useUser } from "@/firebase"
import { initiateEmailSignIn } from "@/firebase/non-blocking-login"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  // Preenchendo com as credenciais solicitadas para facilitar o teste
  const [email, setEmail] = React.useState("nextcon@nextconsaude.com.br")
  const [password, setPassword] = React.useState("2025")
  const [loading, setLoading] = React.useState(false)
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
    
    // Inicia o processo de login no Firebase
    initiateEmailSignIn(auth, email, password)
    
    // Feedback visual de carregamento
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  if (isUserLoading) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg">
              N
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-black text-primary tracking-tighter leading-none">NEXTCON</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">Saúde Empresarial</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md border-none card-shadow">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-headline">Acesso ao Sistema SST</CardTitle>
          <CardDescription>
            Utilize suas credenciais para gerenciar a segurança ocupacional.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <Alert className="bg-primary/5 border-primary/20 text-primary mb-4">
              <AlertCircle className="size-4" />
              <AlertDescription className="text-[10px] font-medium uppercase tracking-wider">
                Lembre-se de criar este usuário no Console do Firebase.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                E-mail
              </label>
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none">
                  Senha
                </label>
                <Button variant="link" size="sm" className="px-0 font-normal">
                  Esqueceu a senha?
                </Button>
              </div>
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
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary py-6 text-lg font-bold" disabled={loading}>
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Acessar Plataforma"}
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              Acesso restrito a colaboradores e clientes autorizados.
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
