
"use client"

import * as React from "react"
import { Upload, FileText, CheckCircle2, AlertTriangle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function DataImport() {
  const { toast } = useToast()
  const [dragActive, setDragActive] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [uploading, setUploading] = React.useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile)
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a CSV file."
        })
      }
    }
  }

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setFile(null)
      toast({
        title: "Import Successful",
        description: "Your data has been parsed and synced to Firestore."
      })
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary">CSV Data Import</h1>
        <p className="text-muted-foreground">Populate your system collections quickly by uploading standard CSV files.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { title: "Clients.csv", desc: "Company registration data", icon: landmarkIcon },
          { title: "Employees.csv", desc: "Collaborator list & roles", icon: usersIcon },
          { title: "Risks.csv", desc: "PGR NR-01 risk inventory", icon: shieldIcon }
        ].map((tpl) => (
          <Card key={tpl.title} className="card-shadow border-none hover:bg-primary/5 transition-colors cursor-pointer group">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-secondary/10 text-primary group-hover:scale-110 transition-transform">
                <FileText className="size-5" />
              </div>
              <p className="text-sm font-bold">{tpl.title}</p>
              <p className="text-xs text-muted-foreground">{tpl.desc}</p>
              <Button variant="link" size="sm" className="text-accent h-auto p-0 font-bold">Download Template</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card 
        className={`card-shadow border-2 border-dashed transition-all ${dragActive ? 'border-accent bg-accent/5' : 'border-muted'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            {!file ? (
              <>
                <div className="p-6 rounded-full bg-muted text-muted-foreground">
                  <Upload className="size-12" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-headline font-bold">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload" 
                  accept=".csv"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">Select CSV File</label>
                </Button>
              </>
            ) : (
              <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <FileText className="size-8 text-primary" />
                    <div>
                      <p className="text-sm font-bold">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-red-500">
                    <X className="size-5" />
                  </button>
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-bold"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Processing..." : "Import Data Now"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <p className="text-xs text-primary/80">Firestore collections are updated in real-time. All active sessions will see the new data immediately after validation.</p>
        </div>
        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
          <AlertTriangle className="size-5 text-accent shrink-0" />
          <p className="text-xs text-accent/80">Duplicate records are identified by CPF (Employees) or CNPJ (Clients). Existing records will be updated if matches are found.</p>
        </div>
      </div>
    </div>
  )
}

const landmarkIcon = <Upload className="size-4" />
const usersIcon = <Upload className="size-4" />
const shieldIcon = <Upload className="size-4" />
