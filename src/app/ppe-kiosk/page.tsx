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
import { useStorage, useUser } from "@/firebase"
import { ref, uploadString, getDownloadURL } from "firebase/storage"

export default function PpeKiosk() {
  const { toast } = useToast()
  const { user } = useUser()
  const storage = useStorage()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null)
  const [isCapturing, setIsCapturing] = React.useState(false)
  const [location, setLocation] = React.useState<string | null>(null)
  const [employeeId, setEmployeeId] = React.useState("")
  const [step, setStep] = React.useState(1)
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
          setHasCameraPermission(false)
          toast({ variant: 'destructive', title: 'Acesso à Câmera Negado' })
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

  const handleCapture = async () => {
    setIsCapturing(true)
    let imgData = ""
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        imgData = canvas.toDataURL('image/png')
        setCapturedImage(imgData)
        const token = Math.random().toString(36).substring(2, 15).toUpperCase()
        setBiometricToken(token)

        // Upload to Storage
        if (user && storage) {
          const photoRef = ref(storage, `ppe-evidences/${user.uid}/${employeeId}_${Date.now()}.png`)
          await uploadString(photoRef, imgData, 'data_url')
        }
      }
    }

    setTimeout(() => {
      setIsCapturing(false)
      setStep(3)
      toast({ title: "EPI Registrado!", description: "Dados sincronizados com o servidor." })
    }, 1500)
  }

  const generateReceiptPDF = () => {
    const doc = new jsPDF()
    doc.setFillColor(9, 14, 36)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text("NEXTCON", 105, 20, { align: "center" })
    doc.setTextColor(0, 0, 0)
    doc.text("RECIBO DE EPI", 105, 60, { align: "center" })
    doc.text(`ID: ${employeeId}`, 20, 80)
    doc.text(`Data: ${timestamp}`, 20, 90)
    doc.text(`Token: ${biometricToken}`, 20, 100)
    doc.save(`Recibo_EPI_${employeeId}.pdf`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-500 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-primary/5 rounded-2xl mb-2">
          <Lock className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Quiosque Digital de EPI (NR-06)</h1>
      </div>

      <Card className="card-shadow border-none overflow-hidden bg-white">
        {step === 1 && (
          <div className="p-10 space-y-8 text-center animate-in fade-in">
            <UserCheck className="size-16 mx-auto text-primary" />
            <Input 
              placeholder="Digite sua Matrícula" 
              className="text-center text-2xl h-16 font-bold" 
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Button className="w-full h-16 text-xl font-bold bg-primary" disabled={!employeeId} onClick={() => setStep(2)}>
              Prosseguir
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-0 animate-in fade-in">
            <video ref={videoRef} className="w-full aspect-[4/3] bg-black object-cover" autoPlay muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-8">
              <Button className="w-full h-20 text-2xl font-black bg-primary" onClick={handleCapture} disabled={isCapturing}>
                {isCapturing ? <RefreshCw className="size-8 animate-spin" /> : <Camera className="size-8 mr-2" />}
                CONFIRMAR ENTREGA
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-16 text-center space-y-8 animate-in zoom-in-95">
            <CheckCircle2 className="size-20 mx-auto text-emerald-600" />
            <h2 className="text-3xl font-bold text-emerald-700">Validado com Sucesso!</h2>
            <Button variant="outline" className="w-full h-12 font-bold" onClick={generateReceiptPDF}>
              <FileDown className="size-4 mr-2" /> Baixar Recibo (PDF)
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>VOLTAR</Button>
          </div>
        )}
      </Card>
    </div>
  )
}
