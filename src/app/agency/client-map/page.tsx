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
  Link as LinkIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { enrichProviderData } from "@/ai/flows/enrich-provider-flow"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function ClientMapPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [selectedCompany, setSelectedCompany] = React.useState<any>(null)
  const [isResolving, setIsResolving] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])

  const { data: companies, isLoading } = useCollection(companiesQuery)

  const filteredCompanies = React.useMemo(() => {
    if (!companies) return []
    return companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [companies, searchTerm])

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
      
      toast({
        title: "Dados Enriquecidos pela NAI",
        description: `Dados de ${company.name} atualizados com sucesso.`
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na NAI",
        description: error.message
      })
    } finally {
      setIsResolving(false)
    }
  }

  const mapUrl = React.useMemo(() => {
    if (!selectedCompany?.address) return null
    const query = encodeURIComponent(selectedCompany.address)
    return `https://www.google.com/maps?q=${query}&output=embed`
  }, [selectedCompany])

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Geolocalização de Clientes & Rede</h1>
          <p className="text-muted-foreground">Visualize a presença da Nextcon e localize unidades via NAI.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        <Card className="lg:col-span-1 flex flex-col card-shadow border-none overflow-hidden">
          <CardHeader className="bg-muted/30 border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar clínica ou cliente..." 
                className="pl-9 h-10 text-xs bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y">
              {isLoading ? (
                <div className="p-10 text-center text-xs text-muted-foreground">Carregando empresas...</div>
              ) : filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`w-full text-left p-4 hover:bg-primary/5 transition-colors group ${selectedCompany?.id === company.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary truncate max-w-[180px]">{company.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{company.city || "Cidade N/I"}</p>
                    </div>
                    {company.type === 'PARTNER' ? (
                      <Badge className="bg-blue-100 text-blue-700 border-none scale-75">Parceiro</Badge>
                    ) : company.dataEnriched ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-none scale-75">IA Validado</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[8px] uppercase">Pendente</Badge>
                    )}
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
                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-primary/10 max-w-sm animate-in slide-in-from-left-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary rounded-lg text-white">
                      {selectedCompany.type === 'PARTNER' ? <Stethoscope className="size-4" /> : <Building2 className="size-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary">{selectedCompany.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{selectedCompany.type === 'PARTNER' ? 'Clínica Parceira' : selectedCompany.cnpj}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-3 text-primary mt-0.5" />
                      <p className="text-[11px] leading-tight text-primary/80 font-medium">
                        {selectedCompany.address || "Endereço não cadastrado"}
                      </p>
                    </div>
                    
                    {selectedCompany.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3 text-primary" />
                        <p className="text-[11px] font-medium text-primary/80">{selectedCompany.phone}</p>
                      </div>
                    )}

                    {selectedCompany.website && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="size-3 text-primary" />
                        <a href={selectedCompany.website} target="_blank" className="text-[11px] font-medium text-blue-600 hover:underline">
                          Website Oficial
                        </a>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-[10px] h-8 gap-1"
                        onClick={() => handleEnrichData(selectedCompany)}
                        disabled={isResolving}
                      >
                        {isResolving ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3 text-accent" />}
                        Enriquecer com IA
                      </Button>
                      <Button variant="default" size="sm" className="flex-1 text-[10px] h-8 bg-primary" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCompany.address || selectedCompany.name)}`} target="_blank">
                          <ExternalLink className="size-3 mr-1" /> Rota
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-muted/20 relative">
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
                  <div className="flex flex-col items-center justify-center h-full text-center p-10 space-y-4">
                    <div className="p-6 bg-white rounded-full shadow-inner border">
                      <Globe className="size-20 text-primary opacity-10 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">Aguardando Localização</p>
                      <p className="text-sm text-muted-foreground">Clique no botão acima para que a NAI encontre esta unidade no mapa.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-muted/10 text-center space-y-4">
              <MapIcon className="size-20 text-primary opacity-5" />
              <div>
                <p className="text-lg font-bold text-primary opacity-40 uppercase tracking-widest">Selecione um Prestador</p>
                <p className="text-sm text-muted-foreground">Escolha uma clínica na lista ao lado para visualizar os detalhes.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
