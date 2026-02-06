
"use client"

import * as React from "react"
import { 
  MapPin, 
  Search, 
  Building2, 
  Sparkles, 
  Loader2, 
  Map as MapIcon,
  Navigation,
  Globe,
  ExternalLink,
  Phone,
  Link as LinkIcon,
  Stethoscope,
  Zap,
  Trash2,
  Image as ImageIcon,
  Camera
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useStorage } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { enrichProviderData } from "@/ai/flows/enrich-provider-flow"
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { uploadCompanyLogo } from "@/lib/storage-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClientMapPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [selectedCompany, setSelectedCompany] = React.useState<any>(null)
  const [isResolving, setIsResolving] = React.useState(false)
  const [isBulkResolving, setIsBulkResolving] = React.useState(false)
  const [bulkProgress, setBulkProgress] = React.useState(0)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])

  const { data: companies, isLoading } = useCollection(companiesQuery)

  const filteredCompanies = React.useMemo(() => {
    if (!companies) return []
    return companies.filter(c => 
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [companies, searchTerm])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedCompany || !user || !db || !storage) return

    setIsUploadingLogo(true)
    try {
      const url = await uploadCompanyLogo(storage, db, file, user.uid, selectedCompany.id)
      setSelectedCompany({ ...selectedCompany, logoUrl: url })
      toast({ title: "Logo Atualizada", description: "A logo da empresa foi salva com sucesso." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Upload", description: error.message })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleEnrichData = async (company: any) => {
    if (!user || !db) return
    setIsResolving(true)
    try {
      const result = await enrichProviderData({
        name: company.name,
        city: company.city || "Curitiba"
      })
      
      const companyRef = doc(db, "clients", user.uid, "managedCompanies", company.id)
      const updateData = {
        address: result.formatted_address || company.address,
        phone: result.international_phone_number || company.phone,
        website: result.website || company.website,
        dataEnriched: true,
        updatedAt: new Date().toISOString()
      }
      
      updateDocumentNonBlocking(companyRef, updateData)
      setSelectedCompany({ ...company, ...updateData })
      toast({ title: "Dados Enriquecidos pela NAI" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro na NAI", description: error.message })
    } finally {
      setIsResolving(false)
    }
  }

  const mapUrl = React.useMemo(() => {
    if (!selectedCompany?.address) return null
    return `https://www.google.com/maps?q=${encodeURIComponent(selectedCompany.address)}&output=embed`
  }, [selectedCompany])

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Clientes & Logos</h1>
          <p className="text-muted-foreground">Administre sua base de clientes, logos e endereços.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        <Card className="lg:col-span-1 flex flex-col card-shadow border-none overflow-hidden">
          <CardHeader className="bg-muted/30 border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar cliente..." 
                className="pl-9 h-10 text-xs bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y">
              {isLoading ? (
                <div className="p-10 text-center text-xs text-muted-foreground">Carregando...</div>
              ) : filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`w-full text-left p-4 hover:bg-primary/5 transition-colors group ${selectedCompany?.id === company.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-lg border bg-white">
                      <AvatarImage src={company.logoUrl} />
                      <AvatarFallback className="text-[10px] bg-muted">{company.name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-primary truncate">{company.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black">{company.city || "Cidade N/I"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-shadow border-none overflow-hidden relative flex flex-col">
          {selectedCompany ? (
            <>
              <div className="absolute top-4 left-4 z-10 space-y-2">
                <div className="bg-white p-5 rounded-2xl shadow-2xl border border-primary/10 max-w-sm animate-in slide-in-from-left-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative group shrink-0">
                      <Avatar className="size-16 rounded-2xl border-2 border-primary/10 shadow-sm bg-muted overflow-hidden">
                        <AvatarImage src={selectedCompany.logoUrl} />
                        <AvatarFallback><ImageIcon className="size-6 opacity-20" /></AvatarFallback>
                      </Avatar>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                        {isUploadingLogo ? <Loader2 className="size-5 text-white animate-spin" /> : <Camera className="size-5 text-white" />}
                      </label>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm font-bold text-primary truncate">{selectedCompany.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-2">{selectedCompany.cnpj}</p>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[8px] h-4 uppercase">
                        {selectedCompany.segment}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-dashed">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-3 text-primary mt-0.5" />
                      <p className="text-[11px] leading-tight text-primary/80 font-medium">
                        {selectedCompany.address || "Endereço não localizado"}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-[10px] h-8 gap-1"
                        onClick={() => handleEnrichData(selectedCompany)}
                        disabled={isResolving}
                      >
                        {isResolving ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3 text-[#f59e0b]" />}
                        Validar IA
                      </Button>
                      <Button variant="default" size="sm" className="flex-1 text-[10px] h-8 bg-primary" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCompany.address || selectedCompany.name)}`} target="_blank">
                          <ExternalLink className="size-3 mr-1" /> Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-muted/20">
                {selectedCompany.address ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl!}
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">
                    Aguardando localização via IA...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-muted/10 text-center space-y-4">
              <MapIcon className="size-20 text-primary opacity-5" />
              <div>
                <p className="text-lg font-bold text-primary opacity-40 uppercase tracking-widest">Selecione um Cliente</p>
                <p className="text-sm text-muted-foreground">Escolha uma empresa para gerenciar dados e logo.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
