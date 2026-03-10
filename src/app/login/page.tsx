'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, Building2, UserCircle, HeartPulse, Sparkles, ChevronRight, LayoutDashboard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { NextconLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

type LoginMode = 'ADMIN' | 'CLIENT';

export default function LoginPage() {
  const [mode, setMode] = React.useState<LoginMode>('CLIENT');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('2025');
  const [loading, setLoading] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // Facilita o teste inicial
  React.useEffect(() => {
    if (mode === 'ADMIN') setEmail('nextcon@nextconsaude.com.br');
    else setEmail('engenharia@nativaempreendimentos.com.br');
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;

      const isAdmin = mode === 'ADMIN';
      
      // Sincronização com IDs reais da base REAL_COMPANIES para conformidade Multi-tenant
      const nativaId = "51633820000151";
      const timeNowId = "01208413000129";

      const userRef = doc(db, "users", loggedUser.uid);
      await setDoc(userRef, {
        id: loggedUser.uid,
        email: loggedUser.email,
        name: isAdmin ? "Eng. Felipe Coneglian Della Bianca" : (email.includes('nativa') ? "GESTOR NATIVA" : "GESTOR TIME NOW"),
        role: isAdmin ? 'SUPER_ADMIN' : 'CLIENT_ADMIN',
        companyId: isAdmin ? "" : (email.includes('nativa') ? nativaId : timeNowId),
        updatedAt: serverTimestamp()
      }, { merge: true });

      router.push('/');
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Falha no Acesso',
        description: 'Credenciais inválidas para este portal.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Lado Esquerdo - Branding Dinâmico */}
      <div className={cn(
        "hidden lg:flex lg:w-3/5 flex-col items-center justify-center p-12 relative overflow-hidden transition-colors duration-700",
        mode === 'ADMIN' ? "bg-[#001F3F]" : "bg-primary"
      )}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center grayscale" />
        </div>
        
        <div className="relative z-10 text-center max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white/10 backdrop-blur-xl p-14 rounded-[4rem] border border-white/20 shadow-2xl inline-block mb-6 ring-1 ring-white/10">
            <NextconLogo className="h-32 w-auto text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-white font-headline tracking-tighter leading-none uppercase">
              {mode === 'ADMIN' ? 'Backoffice' : 'Client Hub'}
            </h2>
            <p className="text-accent text-xl font-bold tracking-[0.4em] uppercase">
              {mode === 'ADMIN' ? 'Gestão Estratégica NAI' : 'Sua Unidade Conectada'}
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-12 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">
          <Globe className="size-4" /> NextCon Intelligence 2026
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50/30">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4 text-center lg:text-left">
            <Badge className={cn(
              "px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest border-none shadow-sm mb-4",
              mode === 'ADMIN' ? "bg-primary text-white" : "bg-accent text-primary"
            )}>
              {mode === 'ADMIN' ? 'Acesso Restrito Equipe Nextcon' : 'Acesso Restrito ao Cliente'}
            </Badge>
            <h1 className="text-4xl font-black text-primary font-headline tracking-tight uppercase leading-none">
              Bem-vindo ao <br /> <span className="text-accent">Portal NAI</span>
            </h1>
          </div>

          {/* Seletor de Modo */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setMode('CLIENT')}
              className={cn(
                "flex items-center justify-center gap-3 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                mode === 'CLIENT' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <UserCircle className="size-4" /> Sou Cliente
            </button>
            <button
              onClick={() => setMode('ADMIN')}
              className={cn(
                "flex items-center justify-center gap-3 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                mode === 'ADMIN' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <ShieldAlert className="size-4" /> Time Nextcon
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-primary/10 font-bold shadow-inner"
                    placeholder="ex@empresa.com.br"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-primary/10 font-bold shadow-inner"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full h-16 text-white text-sm font-black uppercase tracking-widest transition-all rounded-2xl shadow-2xl gap-3",
                mode === 'ADMIN' ? "bg-primary shadow-primary/20" : "bg-accent text-primary shadow-accent/20"
              )} 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center animate-bounce">
                    <span className="font-black text-lg">N</span>
                  </div>
                  Autenticando...
                </div>
              ) : (
                <>
                  {mode === 'ADMIN' ? <ShieldAlert className="size-5" /> : <LayoutDashboard className="size-5" />}
                  Entrar no {mode === 'ADMIN' ? 'Backoffice' : 'Portal'}
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-6">
            <a 
              href="https://www.nextconsaude.com.br/nai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              © 2026 NextCon Inteligência NAI em SST • www.nextconsaude.com.br/nai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
