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
  ChevronRight,
  FolderOpen,
  ChevronDown
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
import { cn } from "@/lib/utils"

export default function ClientMapPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [selectedCompany, setSelectedCompany] = React.useState<any>(null)
  const [isResolving, setIsResolving] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)
  const [expandedParents, setExpandedParents] = React.useState<string[]>(["CLI_TIMENOW"])

  // Busca centralizada na coleção raiz 'companies' para todos os clientes gerenciados
  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])

  const { data: companies, isLoading } = useCollection(companiesQuery)

  const toggleParent = (id: string) => {
    setExpandedParents(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const groupedCompanies = React.useMemo(() => {
    if (!companies) return { parents: [], orphans: [] }
    const term = searchTerm.toLowerCase()
    const all = companies.filter(c => (c.name || "").toLowerCase().includes(term))
    
    const parents = all.filter(c => c.isParent)
    const orphans = all.filter(c => !c.parentId && !c.isParent)
    const children = all.filter(c => c.parentId)

    return {
      parents: parents.map(p => ({
        ...p,
        children: children.filter(c => c.parentId === p.id)
      })),
      orphans
    }
  }, [companies, searchTerm])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedCompany || !user || !db || !storage) return

    setIsUploadingLogo(true)
    try {
      const url = await uploadCompanyLogo(storage, db, file, user.uid, selectedCompany.id)
      setSelectedCompany({ ...selectedCompany, logoUrl: url })
      toast({ title: "Logo Atualizada" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Upload" })
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
      
      const companyRef = doc(db, "companies", company.id)
      const updateData = {
        address: result.formatted_address || company.address,
        dataEnriched: true,
        updatedAt: new Date().toISOString()
      }
      
      updateDocumentNonBlocking(companyRef, updateData)
      setSelectedCompany({ ...company, ...updateData })
      toast({ title: "Dados Enriquecidos pela NAI" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro na NAI" })
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Mapa de Unidades & Hierarquia</h1>
          <p className="text-muted-foreground">Gestão unificada de contratos master e subunidades operacionais.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        <Card className="lg:col-span-1 flex flex-col card-shadow border-none overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar unidade..." 
                className="pl-9 h-10 text-xs bg-white border-none shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin">
            {isLoading ? (
              <div className="p-10 text-center"><Loader2 className="size-6 animate-spin mx-auto opacity-20" /></div>
            ) : (
              <div className="divide-y divide-gray-50">
                {groupedCompanies.parents.map(parent => (
                  <div key={parent.id} className="bg-white">
                    <button 
                      onClick={() => toggleParent(parent.id)}
                      className="w-full flex items-center gap-2 p-4 hover:bg-gray-50 transition-colors bg-primary/5 border-l-4 border-primary"
                    >
                      {expandedParents.includes(parent.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      <FolderOpen className="size-4 text-primary" />
                      <span className="text-xs font-black uppercase text-primary truncate">{parent.name}</span>
                    </button>
                    {expandedParents.includes(parent.id) && (
                      <div className="bg-white">
                        {parent.children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => setSelectedCompany(child)}
                            className={cn(
                              "w-full text-left pl-10 pr-4 py-3 hover:bg-accent/5 transition-all text-xs border-b border-gray-50",
                              selectedCompany?.id === child.id ? "bg-accent/10 font-bold" : ""
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className="size-1.5 rounded-full bg-accent" />
                              <span className="truncate uppercase text-[10px]">{child.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {groupedCompanies.orphans.map(company => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-gray-50 transition-all text-xs flex items-center gap-3",
                      selectedCompany?.id === company.id ? "bg-primary/5 border-l-4 border-primary" : "pl-5"
                    )}
                  >
                    <Building2 className="size-4 opacity-40" />
                    <span className="truncate uppercase">{company.name}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-shadow border-none overflow-hidden relative flex flex-col bg-muted/5">
          {selectedCompany ? (
            <>
              <div className="absolute top-4 left-4 z-10 space-y-2 w-full max-w-sm">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border border-primary/10 animate-in slide-in-from-left-4">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="relative group shrink-0">
                      <Avatar className="size-20 rounded-2xl border-4 border-white shadow-xl bg-muted overflow-hidden">
                        <AvatarImage src={selectedCompany.logoUrl} className="object-contain p-1" />
                        <AvatarFallback><ImageIcon className="size-8 opacity-20" /></AvatarFallback>
                      </Avatar>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-primary/60 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-2xl backdrop-blur-sm">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                        {isUploadingLogo ? <Loader2 className="size-6 animate-spin" /> : <Camera className="size-6" />}
                      </label>
                    </div>
                    <div className="flex-1 overflow-hidden pt-1">
                      <h3 className="text-sm font-black text-primary truncate uppercase tracking-tight mb-1">{selectedCompany.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-black mb-3">{selectedCompany.city} - {selectedCompany.state}</p>
                      <Badge className="bg-primary text-white text-[8px] h-5 border-none font-black uppercase tracking-widest px-3">
                        {selectedCompany.parentId ? "Unidade Técnica" : "Contrato Master"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-dashed">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="size-3.5 text-accent mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Endereço da Unidade</p>
                        <p className="text-[11px] leading-tight text-primary font-medium">{selectedCompany.address || "Localização não enriquecida"}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                        onClick={() => handleEnrichData(selectedCompany)}
                        disabled={isResolving}
                      >
                        {isResolving ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5 text-accent" />}
                        Validar GPS
                      </Button>
                      <Button className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary shadow-lg" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCompany.address || selectedCompany.name)}`} target="_blank">
                          <ExternalLink className="size-3.5 mr-2" /> Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                {selectedCompany.address ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1)' }}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(selectedCompany.address)}&output=embed`}
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 opacity-20">
                    <MapIcon className="size-24" />
                    <p className="text-sm font-black uppercase tracking-widest">Aguardando Coordenadas</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <FolderOpen className="size-24 text-primary opacity-5" />
              <p className="text-xl font-black text-primary opacity-40 uppercase tracking-widest font-headline italic">Selecione uma Pasta ou Unidade</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
