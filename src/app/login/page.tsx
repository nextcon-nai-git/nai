'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, UserCircle, Globe, Stethoscope, LayoutDashboard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { NextconLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

type LoginMode = 'ADMIN' | 'CLIENT' | 'PROVIDER';

export default function LoginPage() {
  const [mode, setMode] = React.useState<LoginMode>('CLIENT');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Regra de Ouro: nextcon@nextconsaude.com.br deve usar o modo ADMIN
    if (email.toLowerCase() === 'nextcon@nextconsaude.com.br' && mode !== 'ADMIN') {
      toast({
        variant: 'destructive',
        title: 'Modo Incorreto',
        description: 'E-mails corporativos Nextcon devem acessar via guia "Time Nextcon".',
      });
      return;
    }

    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;

      const userRef = doc(db, "users", loggedUser.uid);
      const userSnap = await getDoc(userRef);

      // Sincroniza Perfil no Firestore
      if (!userSnap.exists() || !userSnap.data()?.name) {
        const emailName = loggedUser.email?.split('@')[0]
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ') || 'Gestor';

        let role = 'CLIENT_ADMIN';
        if (email.toLowerCase() === 'nextcon@nextconsaude.com.br') {
          role = 'SUPER_ADMIN'; // Força Super Admin para o e-mail oficial
        } else if (mode === 'ADMIN') {
          role = 'SUPER_ADMIN';
        } else if (mode === 'PROVIDER') {
          role = 'PROVIDER';
        }

        await setDoc(userRef, {
          id: loggedUser.uid,
          email: loggedUser.email,
          name: emailName,
          role: role,
          companyId: "",
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      router.push('/');
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Falha no Acesso',
        description: 'Credenciais inválidas. Verifique os dados e tente novamente.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      <div className={cn(
        "hidden lg:flex lg:w-3/5 flex-col items-center justify-center p-12 relative overflow-hidden transition-colors duration-700",
        mode === 'ADMIN' ? "bg-[#001F3F]" : mode === 'PROVIDER' ? "bg-slate-800" : "bg-primary"
      )}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center grayscale" />
        </div>
        
        <div className="relative z-10 text-center max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white/10 backdrop-blur-xl p-14 rounded-[4rem] border border-white/20 shadow-2xl inline-block mb-6 ring-1 ring-white/10">
            <NextconLogo className="h-32 w-auto text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-white font-headline tracking-tighter leading-none uppercase text-center w-full">
              NAI - Nextcon AI
            </h2>
            <p className="text-accent text-xl font-bold tracking-[0.4em] uppercase">
              Inteligência em SST 2026
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-12 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">
          <Globe className="size-4" /> NAI - Nextcon AI 2026
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50/30">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4 text-center lg:text-left">
            <Badge className={cn(
              "px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest border-none shadow-sm mb-4",
              mode === 'ADMIN' ? "bg-primary text-white" : mode === 'PROVIDER' ? "bg-slate-700 text-white" : "bg-accent text-primary"
            )}>
              {mode === 'ADMIN' ? 'Acesso Restrito Nextcon' : mode === 'PROVIDER' ? 'Acesso Prestador Segurança' : 'Acesso Restrito ao Cliente'}
            </Badge>
            <h1 className="text-4xl font-black text-primary font-headline tracking-tight uppercase leading-none">
              Bem-vindo ao <br /> <span className="text-accent">NAI - Nextcon AI</span>
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setMode('CLIENT')}
              className={cn(
                "flex flex-col items-center justify-center gap-1 h-16 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all",
                mode === 'CLIENT' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <UserCircle className="size-4" /> Sou Cliente
            </button>
            <button
              onClick={() => setMode('PROVIDER')}
              className={cn(
                "flex flex-col items-center justify-center gap-1 h-16 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all",
                mode === 'PROVIDER' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Stethoscope className="size-4" /> Sou Prestador
            </button>
            <button
              onClick={() => setMode('ADMIN')}
              className={cn(
                "flex flex-col items-center justify-center gap-1 h-16 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all",
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
                    placeholder="usuario@nextconsaude.com.br"
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
                    placeholder="Sua senha"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full h-16 text-white text-sm font-black uppercase tracking-widest transition-all rounded-2xl shadow-2xl gap-3",
                mode === 'ADMIN' ? "bg-primary shadow-primary/20" : mode === 'PROVIDER' ? "bg-slate-800 shadow-slate-800/20" : "bg-accent shadow-accent/20"
              )} 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin" />
                  Autenticando...
                </div>
              ) : (
                <>
                  {mode === 'ADMIN' ? <ShieldAlert className="size-5" /> : mode === 'PROVIDER' ? <HeartPulse className="size-5" /> : <LayoutDashboard className="size-5" />}
                  Entrar no Portal
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-6">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              © 2026 Nextcon Inteligência NAI em SST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
