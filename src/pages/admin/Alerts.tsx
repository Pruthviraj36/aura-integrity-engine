import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { students } from "@/lib/mock-data";
import { AlertTriangle, Mail, MessageSquare, Phone } from "lucide-react";

const redZoneStudents = students.filter(s => s.attendance < 75).sort((a, b) => a.attendance - b.attendance);

export default function ShortageAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" /> Shortage Escalation
        </h1>
        <p className="text-sm text-muted-foreground">{redZoneStudents.length} students below the 75% attendance threshold</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redZoneStudents.map(s => {
                const severity = s.attendance < 60 ? "critical" : s.attendance < 70 ? "warning" : "caution";
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.id}</p>
                    </TableCell>
                    <TableCell className="text-sm">{s.department} • Sem {s.semester}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-bold text-destructive">{s.attendance}%</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        severity === "critical" ? "bg-destructive/15 text-destructive" :
                        severity === "warning" ? "bg-warning/15 text-warning" :
                        "bg-info/15 text-info"
                      }`}>
                        {severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">{s.parentPhone}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{s.parentEmail}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7"><Mail className="h-3 w-3" /></Button>
                        <Button variant="outline" size="icon" className="h-7 w-7"><MessageSquare className="h-3 w-3" /></Button>
                        <Button variant="outline" size="icon" className="h-7 w-7"><Phone className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
