'use client';

import * as React from 'react';
import { Clock, Activity, TrendingDown, Users, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppointmentsQueue } from '@/hooks/use-appointments-queue';
import { cn } from '@/lib/utils';

/**
 * Painel de Recepção para controle visual da fila de atendimento.
 */
export function ReceptionDashboard() {
  const { data: appointments, loading, error } = useAppointmentsQueue();

  const stats = React.useMemo(() => {
    return {
      scheduled: appointments.filter(a => a.status === 'Agendado').length,
      waiting: appointments.filter(a => a.status === 'Em Espera').length,
      completed: appointments.filter(a => a.status === 'Concluído').length,
    };
  }, [appointments]);

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 text-red-700">
        <AlertCircle className="size-6" />
        <p className="font-bold">Erro ao carregar fila: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Agendados Hoje" 
          value={stats.scheduled} 
          icon={Clock} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          label="Aguardando Triagem" 
          value={stats.waiting} 
          icon={Activity} 
          color="text-orange-600" 
          bg="bg-orange-50" 
        />
        <StatCard 
          label="Atendimentos Concluídos" 
          value={stats.completed} 
          icon={UserCheck} 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
        />
      </div>

      <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-6 px-8">
          <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
            <Users className="size-5 text-accent" /> Fila de Atendimento do Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="size-10 animate-spin text-primary opacity-20" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sincronizando Fila Clínica...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-8 text-[10px] font-black uppercase py-4">Paciente</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4">Tipo de Exame</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4">Status</TableHead>
                  <TableHead className="text-right pr-8 text-[10px] font-black uppercase py-4">Espera</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="pl-8 py-5">
                      <p className="font-bold text-sm text-primary uppercase">{appt.colaborador_nome}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/10">
                        {appt.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-black uppercase border-none px-3 h-6",
                        appt.status === 'Em Espera' ? "bg-orange-100 text-orange-700" :
                        appt.status === 'Em Atendimento' ? "bg-blue-100 text-blue-700" :
                        appt.status === 'Concluído' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      {appt.check_in_at ? (
                        <p className="text-[10px] font-mono font-bold text-slate-400">
                          Desde: {new Date(appt.check_in_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      ) : <span className="text-slate-200">--:--</span>}
                    </TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-20 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhum paciente na fila hoje</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", bg, color)}><Icon className="size-5" /></div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className={cn("text-3xl font-black leading-none", color)}>{value}</h3>
      </CardContent>
    </Card>
  );
}