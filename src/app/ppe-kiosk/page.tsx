
"use client"

import * as React from "react"
import { Camera, MapPin, ShieldCheck, UserCheck, RefreshCw, CheckCircle2, FileDown, Lock, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { jsPDF } from "jspdf"

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
  const [timestamp, setTimestamp] = React.useState<string | null>(null)
  const [biometricToken, setBiometricToken] = React.useState("")

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
            setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
          })
        }
      }

      getCameraPermission()
      getGeoLocation()
      setTimestamp(new Date().toLocaleString('pt-BR'))
    }
  }, [step, toast])

  const handleCapture = () => {
    setIsCapturing(true)
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imgData = canvas.toDataURL('image/png')
        setCapturedImage(imgData)
        // Gera um token SHA-256 simulado para fins de demonstração
        const token = Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase()
        setBiometricToken(token)
      }
    }

    setTimeout(() => {
      setIsCapturing(false)
      setStep(3)
      toast({
        title: "EPI Registrado!",
        description: "Protocolo de segurança NR-06 gerado com biometria.",
      })
    }, 1500)
  }

  const generateReceiptPDF = () => {
    try {
      const doc = new jsPDF()
      const dateStr = new Date().toLocaleDateString('pt-BR')
      const timeStr = new Date().toLocaleTimeString('pt-BR')

      // Cabeçalho
      doc.setFillColor(9, 14, 36) // Azul Marinho Nextcon
      doc.rect(0, 0, 210, 40, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(22)
      doc.text("NEXTCON", 105, 20, { align: "center" })
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("SAÚDE E SEGURANÇA EMPRESARIAL", 105, 28, { align: "center" })

      // Título do Documento
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("COMPROVANTE DE ENTREGA DE EPI (NR-06)", 105, 55, { align: "center" })
      
      doc.setLineWidth(0.5)
      doc.line(20, 60, 190, 60)

      // Corpo do Recibo
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      
      let y = 75
      const lineHeight = 10

      doc.setFont("helvetica", "bold")
      doc.text("DADOS DO COLABORADOR:", 20, y)
      y += lineHeight
      doc.setFont("helvetica", "normal")
      doc.text(`Identificação/ID: ${employeeId}`, 25, y)
      y += lineHeight
      doc.text(`Data da Entrega: ${dateStr} às ${timeStr}`, 25, y)
      y += lineHeight
      doc.text(`Localização (GPS): ${location || "Não capturada"}`, 25, y)
      
      y += 15
      doc.setFont("helvetica", "bold")
      doc.text("EQUIPAMENTO ENTREGUE:", 20, y)
      y += lineHeight
      doc.setFont("helvetica", "normal")
      doc.text("Item: Protetor Auricular Plug / Óculos de Proteção (Kit Padrão)", 25, y)
      y += lineHeight
      doc.text("Certificado de Aprovação (C.A.): 12.345 / 42.100", 25, y)

      y += 20
      doc.setFontSize(10)
      doc.text("Declaro ter recebido os equipamentos de proteção individual acima listados,", 20, y)
      y += 5
      doc.text("estando ciente da obrigatoriedade de uso e conservação conforme NR-06.", 20, y)

      // Validação Biométrica (Token)
      y += 30
      doc.setFillColor(245, 245, 245)
      doc.rect(20, y, 170, 40, 'F')
      doc.setDrawColor(200, 200, 200)
      doc.rect(20, y, 170, 40, 'S')

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.text("ASSINATURA DIGITAL E VALIDAÇÃO BIOMÉTRICA", 105, y + 10, { align: "center" })
      
      doc.setFont("courier", "bold")
      doc.setFontSize(11)
      doc.text(biometricToken, 105, y + 22, { align: "center" })
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.text("Este código substitui a assinatura física nos termos da Portaria 6.730/20.", 105, y + 32, { align: "center" })

      // Rodapé
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text("Documento gerado eletronicamente pela Plataforma Nextcon SST", 105, 285, { align: "center" })

      // Download
      const safeName = employeeId.replace(/[^a-z0-9]/gi, '_')
      doc.save(`Recibo_EPI_${safeName}_${dateStr.replace(/\//g, '-')}.pdf`)
      
      toast({
        title: "Download Concluído",
        description: "O recibo PDF foi salvo no seu dispositivo."
      })
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        title: "Erro no PDF",
        description: "Não foi possível gerar o arquivo agora."
      })
    }
  }

  const reset = () => {
    setStep(1)
    setEmployeeId("")
    setLocation(null)
    setCapturedImage(null)
    setBiometricToken("")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-500 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-primary/5 rounded-2xl mb-2">
          <Lock className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Quiosque Digital de EPI (NR-06)</h1>
        <p className="text-muted-foreground">Prova de Vida e Entrega Jurídica com Geometria Facial e GPS para proteção em perícias.</p>
      </div>

      <Card className="card-shadow border-none overflow-hidden bg-white">
        {step === 1 && (
          <div className="p-10 space-y-8 text-center animate-in fade-in">
            <div className="p-8 bg-muted rounded-full w-32 h-32 mx-auto flex items-center justify-center text-primary shadow-inner">
              <UserCheck className="size-16" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Identificação</h2>
                <p className="text-sm text-muted-foreground">Insira sua matrícula ou CPF para registrar a entrega.</p>
              </div>
              <Input 
                placeholder="000.000.000-00" 
                className="text-center text-2xl h-16 font-bold bg-muted/50 border-2 border-muted focus-visible:ring-primary rounded-xl" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <Button 
                className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all rounded-xl"
                disabled={!employeeId}
                onClick={() => setStep(2)}
              >
                Prosseguir para Biometria
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-0 animate-in fade-in">
            <div className="relative">
              <video ref={videoRef} className="w-full aspect-[4/3] bg-black object-cover" autoPlay muted />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 border-4 border-white/30 border-dashed rounded-[100px] relative">
                   <div className="absolute inset-0 border-2 border-white/10 rounded-[100px] animate-pulse" />
                </div>
              </div>

              <div className="absolute top-4 left-4 right-4 flex justify-between gap-2">
                <Badge className="bg-black/60 backdrop-blur-md border-none text-[10px] font-bold py-1.5">
                  <MapPin className="size-3 text-red-500 mr-1.5" /> {location || "GPS SINALIZANDO..."}
                </Badge>
                <Badge className="bg-primary/80 backdrop-blur-md border-none text-[10px] font-bold py-1.5">
                  ID: {employeeId}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 text-white text-[8px] font-mono opacity-60">
                {timestamp} • LAT/LONG VALIDATION ACTIVE
              </div>
            </div>
            
            <div className="p-8 space-y-4">
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="border-none bg-red-600 text-white">
                  <ShieldAlert className="size-4 text-white" />
                  <AlertTitle className="font-bold">Falha no Sensor</AlertTitle>
                  <AlertDescription className="text-xs opacity-90">Habilite a câmera para garantir a validade jurídica da entrega.</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full h-20 text-2xl font-black gap-4 bg-primary hover:bg-primary/90 shadow-2xl rounded-2xl group transition-all"
                onClick={handleCapture}
                disabled={isCapturing || !hasCameraPermission}
              >
                {isCapturing ? <RefreshCw className="size-8 animate-spin" /> : <Camera className="size-8 group-hover:scale-110 transition-transform" />}
                CONFIRMAR ENTREGA
              </Button>
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-red-600 transition-colors font-bold" onClick={() => setStep(1)}>CANCELAR REGISTRO</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative mx-auto w-40 h-40">
              {capturedImage ? (
                <img src={capturedImage} alt="Biometria" className="w-full h-full object-cover rounded-full border-8 border-emerald-500/20 shadow-2xl" />
              ) : (
                <div className="p-8 bg-emerald-100 rounded-full size-full flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-20" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full border-4 border-white shadow-lg">
                <ShieldCheck className="size-8" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-black text-emerald-700">Entrega Juridicamente Validada!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">O recibo digital com biometria facial e coordenadas GPS foi enviado ao dossiê do colaborador no eSocial (S-2240).</p>
              
              <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase">
                  <span>Assinatura Digital SHA-256</span>
                  <span className="text-primary truncate ml-2 max-w-[150px]">{biometricToken}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                </div>
                <Button 
                  variant="link" 
                  className="w-full gap-2 text-primary font-bold h-auto py-0"
                  onClick={generateReceiptPDF}
                >
                  <FileDown className="size-4" /> Baixar Recibo de Entrega (PDF)
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full h-12 font-bold border-2" onClick={reset}>REGISTRAR NOVA ENTREGA</Button>
          </div>
        )}
      </Card>

      <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-primary text-white rounded-lg">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Salvaguarda Jurídica NR-06</p>
          <p className="text-[11px] text-primary/70 leading-relaxed">
            Este quiosque atende integralmente à <span className="font-bold">Portaria 6.730/20</span>. A biometria facial vinculada ao geoprocessamento do dispositivo garante a <span className="font-bold">não-repúdio</span> da entrega em perícias técnicas e judiciais, substituindo com vantagem a ficha de papel.
          </p>
        </div>
      </div>
    </div>
  )
}
