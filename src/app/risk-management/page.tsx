
"use client"

import * as React from "react"
import { ShieldAlert, Zap, Search, Info, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { riskMitigationPlanGenerator } from "@/ai/flows/risk-mitigation-plan-generator"
import { useToast } from "@/hooks/use-toast"

const risks = [
  { id: 1, role: "Welder", hazard: "Fumes & UV", probability: 3, severity: 4, level: "High", environment: "Metal Workshop" },
  { id: 2, role: "Warehouse Op", hazard: "Ergonomics", probability: 4, severity: 2, level: "Medium", environment: "Logistics Hub" },
  { id: 3, role: "Admin", hazard: "Repetitive Strain", probability: 2, severity: 1, level: "Low", environment: "Office" },
  { id: 4, role: "Driver", hazard: "Vibration", probability: 3, severity: 3, level: "Medium", environment: "Heavy Transport" },
]

export default function RiskManagement() {
  const [selectedRisk, setSelectedRisk] = React.useState<typeof risks[0] | null>(null)
  const [mitigationPlan, setMitigationPlan] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const generatePlan = async (risk: typeof risks[0]) => {
    setIsLoading(true)
    setSelectedRisk(risk)
    try {
      const result = await riskMitigationPlanGenerator({
        identifiedRisks: `${risk.hazard} - Impact level ${risk.level}`,
        environment: risk.environment
      })
      setMitigationPlan(result.mitigationPlan)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating plan",
        description: "Could not fetch AI recommendations at this time."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Risk Management (PGR)</h1>
          <p className="text-muted-foreground">NR-01 compliant risk matrix and mitigation strategy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Filter by job role..." className="w-64" />
          <Button variant="outline" size="icon"><Search className="size-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Inventory of Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Role</TableHead>
                  <TableHead>Hazard Identified</TableHead>
                  <TableHead className="text-center">Prob.</TableHead>
                  <TableHead className="text-center">Sev.</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium">{risk.role}</TableCell>
                    <TableCell>{risk.hazard}</TableCell>
                    <TableCell className="text-center">{risk.probability}</TableCell>
                    <TableCell className="text-center">{risk.severity}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={risk.level === 'High' ? 'destructive' : risk.level === 'Medium' ? 'default' : 'secondary'}
                        className={risk.level === 'Medium' ? 'bg-accent hover:bg-accent/90' : ''}
                      >
                        {risk.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-primary gap-2"
                        onClick={() => generatePlan(risk)}
                      >
                        <Zap className="size-3 fill-current" />
                        AI Plan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Risk Matrix</CardTitle>
            <CardDescription>Probability vs Severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1 aspect-square w-full">
              {Array.from({ length: 25 }).map((_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const intensity = (4-row) + col;
                let bgClass = "bg-green-100";
                if (intensity > 6) bgClass = "bg-red-500";
                else if (intensity > 4) bgClass = "bg-orange-400";
                else if (intensity > 2) bgClass = "bg-yellow-300";

                return (
                  <div 
                    key={i} 
                    className={`${bgClass} rounded-sm flex items-center justify-center text-[8px] font-bold text-black/40`}
                  >
                    {intensity}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {(selectedRisk || isLoading) && (
        <Card className="card-shadow border-none gradient-primary text-white overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-accent animate-pulse" />
              <CardTitle className="text-lg">AI Mitigation Strategy: {selectedRisk?.role}</CardTitle>
            </div>
            <CardDescription className="text-white/70">Best practices for {selectedRisk?.hazard} in {selectedRisk?.environment}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-8 animate-spin text-accent" />
                <p className="text-sm">Analyzing work environment and regulatory standards...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-700">
                <div className="bg-white/10 p-4 rounded-lg border border-white/20 whitespace-pre-wrap leading-relaxed text-sm">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <CheckCircle2 className="size-3" /> Save to PGR
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
