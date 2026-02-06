
"use client"

import * as React from "react"
import { 
  MapPin, 
  Search, 
  Building2, 
  Sparkles, 
  Loader2, 
  Map as MapIcon,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useStorage } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { enrichProviderData } from "@/ai/flows/enrich-provider-flow"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { uploadCompanyLogo } from "@/lib/storage-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClientMapPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [selectedCompany, setSelectedCompany] = React.useState<any>(null)
  const [isResolving, setIsResolving] = React.useState(false)
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
      toast({ title: "Logo Atualizada", description: `A logo de ${selectedCompany.name} foi salva com sucesso.` })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Upload", description: "Verifique as permissões de gravação." })
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
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Clientes & Identidade</h1>
          <p className="text-muted-foreground">Administre sua base de clientes, logos e endereços para laudos personalizados.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        <Card className="lg:col-span-1 flex flex-col card-shadow border-none overflow-hidden bg-white">
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
                <div className="p-10 text-center space-y-2">
                  <Loader2 className="size-6 animate-spin mx-auto text-primary/20" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Sincronizando Base...</p>
                </div>
              ) : filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`w-full text-left p-4 hover:bg-primary/5 transition-all group ${selectedCompany?.id === company.id ? 'bg-primary/5 border-l-4 border-primary shadow-inner' : 'border-l-4 border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 rounded-xl border bg-white shadow-sm">
                      <AvatarImage src={company.logoUrl} />
                      <AvatarFallback className="text-[10px] bg-muted font-bold">{company.name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-primary truncate uppercase">{company.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black">{company.city || "Cidade N/I"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-shadow border-none overflow-hidden relative flex flex-col bg-muted/5">
          {selectedCompany ? (
            <>
              <div className="absolute top-4 left-4 z-10 space-y-2 w-full max-w-sm">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border border-primary/10 animate-in slide-in-from-left-4">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="relative group shrink-0">
                      <Avatar className="size-20 rounded-2xl border-4 border-white shadow-xl bg-muted overflow-hidden transition-transform group-hover:scale-105">
                        <AvatarImage src={selectedCompany.logoUrl} className="object-contain p-1" />
                        <AvatarFallback><ImageIcon className="size-8 opacity-20" /></AvatarFallback>
                      </Avatar>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-primary/60 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-2xl backdrop-blur-sm">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                        {isUploadingLogo ? <Loader2 className="size-6 animate-spin" /> : (
                          <>
                            <Camera className="size-6 mb-1" />
                            <span className="text-[8px] font-black uppercase">Alterar</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="flex-1 overflow-hidden pt-1">
                      <h3 className="text-sm font-black text-primary truncate uppercase tracking-tight leading-none mb-1">{selectedCompany.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-black mb-3">{selectedCompany.cnpj}</p>
                      <Badge className="bg-[#090e24] text-[#f59e0b] text-[8px] h-5 border-none font-black uppercase tracking-widest px-3">
                        {selectedCompany.segment === 'INDUSTRY' ? 'Vertical Industrial' : 
                         selectedCompany.segment === 'CONSTRUCTION' ? 'Engenharia Civil' : 'Gestão Geral'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-dashed">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-primary/5 rounded-lg">
                        <MapPin className="size-3.5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Endereço Técnico</p>
                        <p className="text-[11px] leading-tight text-primary font-medium">
                          {selectedCompany.address || "Endereço não localizado via GPS"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-white"
                        onClick={() => handleEnrichData(selectedCompany)}
                        disabled={isResolving}
                      >
                        {isResolving ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5 text-[#f59e0b]" />}
                        Validar IA
                      </Button>
                      <Button variant="default" className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary shadow-lg" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCompany.address || selectedCompany.name)}`} target="_blank">
                          <ExternalLink className="size-3.5 mr-2" /> Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedCompany.dataEnriched && (
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="size-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Endereço Validado via NAI 2026</span>
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                {selectedCompany.address ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                    src={mapUrl!}
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                    <div className="p-6 bg-white rounded-full shadow-inner border border-primary/5">
                      <MapPin className="size-12 opacity-10 animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest">Coordenadas Ausentes</p>
                      <p className="text-[10px] opacity-60">Use o botão 'Validar IA' para localizar o cliente automaticamente.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                <MapIcon className="size-24 text-primary opacity-5 relative z-10" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-primary opacity-40 uppercase tracking-widest font-headline italic">Selecione uma Unidade</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Escolha uma empresa para gerenciar dados, endereços e logo personalizada.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
