
"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Loader2, 
  Search,
  Zap,
  ShieldCheck,
  Stethoscope,
  HardHat,
  Construction,
  Truck,
  Trash2,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const CHECKLIST_CATALOG = [
  { id: "nr10", category: "Normativo", title: "NR-10 - Eletricidade", icon: Zap, color: "text-amber-500" },
  { id: "nr18", category: "Obras", title: "Check-List Obras (PCMAT)", icon: Construction, color: "text-orange-600" },
  { id: "cipa", category: "Normativo", title: "05 - CIPA / SESMT", icon: ShieldCheck, color: "text-blue-600" },
  { id: "epi", category: "Operacional", title: "06 - EPIs (Inspeção)", icon: HardHat, color: "text-emerald-600" },
  { id: "amb", category: "Saúde", title: "Checklist - Ambulância", icon: Truck, color: "text-red-600" },
  { id: "rss", category: "Saúde", title: "Resíduos de Saúde (RSS)", icon: Trash2, color: "text-purple-600" },
  { id: "ergo", category: "Ergonomia", title: "Diagrama Corlett", icon: Activity, color: "text-indigo-600" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("catalog")

  const filteredCatalog = CHECKLIST_CATALOG.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Biblioteca de Checklists</h1>
          <p className="text-muted-foreground">Formulários técnicos e inspeções normativas 2026.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="catalog" className="rounded-lg gap-2">
            <ClipboardCheck className="size-4" /> Catálogo
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2">
            <Activity className="size-4" /> Realizados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por NR, Tipo ou Nome do Checklist..." 
              className="pl-10 h-12 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <Card key={item.id} className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-muted/50 ${item.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                      <item.icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{item.category}</p>
                      <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                    </div>
                    <Button variant="ghost" size="icon">
                      <CheckCircle2 className="size-4 opacity-20 group-hover:opacity-100" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="card-shadow border-none h-64 flex items-center justify-center opacity-40 italic">
            <p>Nenhum checklist preenchido recentemente.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
