
"use client"

import * as React from "react"
import { Calendar as CalendarIcon, HeartPulse, Clock, FileWarning, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const upcomingExams = [
  { id: 1, name: "João Silva", type: "Periodic", date: "2024-05-15", status: "Pending", result: "N/A" },
  { id: 2, name: "Maria Oliveira", type: "Return to Work", date: "2024-05-18", status: "Scheduled", result: "N/A" },
  { id: 3, name: "Carlos Santos", type: "Admission", date: "2024-05-10", status: "Overdue", result: "Inapt" },
  { id: 4, name: "Ana Costa", type: "Periodic", date: "2024-05-22", status: "Scheduled", result: "N/A" },
]

export default function HealthControl() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Health Control (PCMSO)</h1>
          <p className="text-muted-foreground">NR-07 Medical surveillance and occupational health.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Clock className="size-4" /> History</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2"><HeartPulse className="size-4" /> New ASO</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Exams Calendar</CardTitle>
            <CardDescription>Scheduled occupational health exams</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <CardDescription>Critical exam status and results requiring action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <FileWarning className="size-6 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-900">Critical: Inapt Employee Found</p>
                  <p className="text-xs text-red-700">Carlos Santos has been marked as Inapt for current duties. Immediate review required.</p>
                </div>
                <Button variant="outline" size="sm" className="bg-white">Review Case</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.type}</TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={exam.status === 'Overdue' ? 'destructive' : 'secondary'}
                          className={exam.status === 'Scheduled' ? 'bg-primary text-white' : ''}
                        >
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-none">
        <CardHeader>
          <CardTitle className="text-lg">Historical Health Trends</CardTitle>
          <CardDescription>Suggesting adjustments based on medical history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <p className="text-xs font-bold text-primary uppercase mb-2">PCMSO Suggestion</p>
              <p className="text-sm text-primary/80">Reduce periodic exam interval for "Welder" role from 12 to 6 months due to increasing fume sensitivity reports.</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-xs font-bold text-accent uppercase mb-2">Attendance Score</p>
              <p className="text-sm text-accent/80">98.5% of exams completed within the legal timeframe this quarter. Trending upwards.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs font-bold text-green-700 uppercase mb-2">Cost Savings</p>
              <p className="text-sm text-green-600">Proactive health monitoring has reduced sick-leave related legal claims by 12% year-over-year.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
