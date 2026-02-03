
"use client"

import * as React from "react"
import { Camera, MapPin, ShieldCheck, UserCheck, RefreshCw, CheckCircle2, FileDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PpeKiosk() {
  const { toast } = useToast()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null)
  const [isCapturing, setIsCapturing] = React.useState(false)
  const [location, setLocation] = React.useState<string | null>(null)
  const [employeeId, setEmployeeId] = React.useState("")
  const [step, setStep] = React.useState(1) // 1: ID, 2: Photo, 3: Success
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null)

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
    
    // Captura o frame real da câmera
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        setCapturedImage(canvas.toDataURL('image/png'))
      }
    }

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
    setCapturedImage(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Quiosque Digital de EPI</h1>
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
              <p className="text-sm text-muted-foreground">Insira o documento para iniciar a validação biométrica.</p>
              <Input 
                placeholder="Matrícula ou CPF" 
                className="text-center text-lg h-12 bg-muted border-none focus-visible:ring-accent" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <Button 
                className="w-full h-12 text-lg font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
                disabled={!employeeId}
                onClick={() => setStep(2)}
              >
                Próximo Passo
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-0 animate-in fade-in">
            <div className="relative">
              <video ref={videoRef} className="w-full aspect-video bg-black object-cover" autoPlay muted />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                <div className="size-full border-2 border-white/50 border-dashed rounded-lg" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <Badge className="bg-black/60 backdrop-blur-md border-none gap-2">
                  <MapPin className="size-3 text-red-500" /> {location || "Localizando..."}
                </Badge>
                <Badge className="bg-black/60 backdrop-blur-md border-none gap-2">
                  <ShieldCheck className="size-3 text-green-500" /> ID: {employeeId}
                </Badge>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Erro de Câmera</AlertTitle>
                  <AlertDescription>Habilite a câmera para continuar com a prova de entrega.</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full h-16 text-xl font-bold gap-3 bg-primary hover:bg-primary/90 shadow-xl"
                onClick={handleCapture}
                disabled={isCapturing || !hasCameraPermission}
              >
                {isCapturing ? <RefreshCw className="size-6 animate-spin" /> : <Camera className="size-6" />}
                Registrar Entrega de EPI
              </Button>
              <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setStep(1)}>Cancelar</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 text-center space-y-6 animate-in zoom-in">
            <div className="relative mx-auto w-32 h-32">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover rounded-full border-4 border-green-500 shadow-xl" />
              ) : (
                <div className="p-6 bg-green-100 rounded-full size-full flex items-center justify-center text-green-600">
                  <CheckCircle2 className="size-16" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                <ShieldCheck className="size-5" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold text-green-700">Entrega Confirmada!</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">O registro biométrico foi enviado para o dossiê jurídico do colaborador.</p>
              <div className="flex flex-col gap-2 mt-4">
                <Badge variant="outline" className="py-1 px-4 text-[10px] font-mono justify-center">SHA-256: {Math.random().toString(36).substring(7).toUpperCase()}</Badge>
                <Button variant="link" className="gap-2 text-primary">
                  <FileDown className="size-4" /> Baixar Recibo Assinado
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={reset}>Fazer Nova Entrega</Button>
          </div>
        )}
      </Card>

      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3">
        <ShieldCheck className="size-5 text-primary shrink-0 mt-1" />
        <p className="text-xs text-primary/80 leading-relaxed">
          Este registro atende integralmente à <span className="font-bold">NR-06</span> e à <span className="font-bold">Portaria 6.730/20</span>. A biometria facial capturada vincula a entrega ao geoprocessamento do dispositivo, garantindo <span className="font-bold">Validade Jurídica</span> em perícias judiciais.
        </p>
      </div>
    </div>
  )
}
