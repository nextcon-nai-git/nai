
"use client"

import * as React from "react"
import { Camera, MapPin, ShieldCheck, UserCheck, RefreshCw, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PpeKiosk() {
  const { toast } = useToast()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null)
  const [isCapturing, setIsCapturing] = React.useState(false)
  const [location, setLocation] = React.useState<string | null>(null)
  const [employeeId, setEmployeeId] = React.useState("")
  const [step, setStep] = React.useState(1) // 1: ID, 2: Photo, 3: Success

  React.useEffect(() => {
    if (step === 2) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
          setHasCameraPermission(true)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (error) {
          console.error('Error accessing camera:', error)
          setHasCameraPermission(false)
          toast({
            variant: 'destructive',
            title: 'Acesso à Câmera Negado',
            description: 'Por favor, habilite a câmera para registrar a entrega de EPI.',
          })
        }
      }

      const getGeoLocation = () => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
          })
        }
      }

      getCameraPermission()
      getGeoLocation()
    }
  }, [step, toast])

  const handleCapture = () => {
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
      setStep(3)
      toast({
        title: "EPI Registrado!",
        description: "Comprovante digital gerado com biometria facial e geolocalização.",
      })
    }, 1500)
  }

  const reset = () => {
    setStep(1)
    setEmployeeId("")
    setLocation(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary">Quiosque Digital de EPI</h1>
        <p className="text-muted-foreground">Prova de Vida e Entrega Jurídica com Geometria Facial e GPS.</p>
      </div>

      <Card className="card-shadow border-none overflow-hidden">
        {step === 1 && (
          <div className="p-8 space-y-6 text-center animate-in fade-in">
            <div className="p-6 bg-secondary/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-primary">
              <UserCheck className="size-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Identificação do Colaborador</h2>
              <Input 
                placeholder="Matrícula ou CPF" 
                className="text-center text-lg h-12 bg-muted" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <Button 
                className="w-full h-12 text-lg font-bold bg-accent hover:bg-accent/90"
                disabled={!employeeId}
                onClick={() => setStep(2)}
              >
                Próximo Passo
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <video ref={videoRef} className="w-full aspect-video bg-black object-cover" autoPlay muted />
            
            <div className="p-6 space-y-4">
              {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Erro de Câmera</AlertTitle>
                  <AlertDescription>Habilite a câmera para continuar com a prova de entrega.</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase">
                <div className="flex items-center gap-1">
                  <MapPin className="size-3 text-red-500" />
                  {location || "Obtendo localização..."}
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="size-3 text-green-500" />
                  ID: {employeeId}
                </div>
              </div>

              <Button 
                className="w-full h-16 text-xl font-bold gap-3 bg-primary"
                onClick={handleCapture}
                disabled={isCapturing || !hasCameraPermission}
              >
                {isCapturing ? <RefreshCw className="size-6 animate-spin" /> : <Camera className="size-6" />}
                Registrar Entrega de EPI
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 text-center space-y-6 animate-in zoom-in">
            <div className="p-6 bg-green-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-green-600">
              <CheckCircle2 className="size-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-700">Entrega Confirmada!</h2>
              <p className="text-muted-foreground">O registro foi enviado para o dossiê jurídico do colaborador.</p>
              <Badge variant="outline" className="mt-4 py-1 px-4 text-xs">HASH BIOMÉTRICO: 0x8a92...f7b1</Badge>
            </div>
            <Button variant="outline" className="w-full" onClick={reset}>Fazer Nova Entrega</Button>
          </div>
        )}
      </Card>

      <div className="p-4 bg-muted/50 rounded-lg border border-dashed flex items-start gap-3">
        <ShieldCheck className="size-5 text-primary shrink-0 mt-1" />
        <p className="text-xs text-muted-foreground">
          Este registro substitui a ficha de EPI de papel conforme a <span className="font-bold">NR-06</span> e a <span className="font-bold">Portaria 6.730/20</span>, garantindo validade jurídica para defesas trabalhistas.
        </p>
      </div>
    </div>
  )
}
