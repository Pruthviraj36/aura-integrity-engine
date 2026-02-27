import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Users, Clock, Shield, Wifi, AlertTriangle, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { sessions, getCourseName, students, attendanceLogs } from "@/lib/mock-data";

export default function LiveSession() {
  const { id } = useParams();
  const session = sessions.find(s => s.id === id) || sessions[0];
  const [presentCount, setPresentCount] = useState(session.present || 42);
  const [qrTimer, setQrTimer] = useState(15);
  const [showOverride, setShowOverride] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimer(prev => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session.status === "upcoming") {
      const interval = setInterval(() => {
        setPresentCount(prev => Math.min(prev + 1, session.total));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const pct = Math.round((presentCount / session.total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getCourseName(session.courseId)}</h1>
          <p className="text-sm text-muted-foreground">{session.topic} • {session.room} • {session.date}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowOverride(!showOverride)}>
          <UserPlus className="mr-2 h-4 w-4" /> Manual Override
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* QR Code */}
        <Card className="border-border/50 lg:row-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Session QR Code</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-secondary/50 rounded-lg flex items-center justify-center border border-border/30 relative">
              <QrCode className="h-32 w-32 text-primary/60" />
              <div className="absolute bottom-3 left-3 right-3 bg-background/80 backdrop-blur rounded-md p-2 text-center">
                <p className="text-xs text-muted-foreground">Rotates in</p>
                <p className="text-2xl font-mono font-bold text-primary">{qrTimer}s</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-success" /> TOTP-encrypted • Auto-rotating
            </div>
          </CardContent>
        </Card>

        {/* Live Pulse Counter */}
        <Card className="border-border/50 col-span-1 lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Live Pulse Counter</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative h-28 w-28 shrink-0">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(222 30% 18%)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(187 100% 50%)" strokeWidth="8"
                    strokeDasharray={`${pct * 2.64} 264`} strokeLinecap="round" className="transition-all duration-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{pct}%</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-3xl font-bold">{presentCount}<span className="text-lg text-muted-foreground">/{session.total}</span></p>
                <p className="text-sm text-muted-foreground">students present</p>
                <Progress value={pct} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Indicators */}
        <Card className="border-border/50 col-span-1 lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Anti-Proxy Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-3">
              <div className="rounded-lg bg-success/10 border border-success/20 p-3 text-center">
                <Shield className="h-5 w-5 text-success mx-auto mb-1" />
                <p className="text-[10px] font-medium text-success">VPN Check</p>
                <p className="text-[10px] text-muted-foreground">0 flagged</p>
              </div>
              <div className="rounded-lg bg-success/10 border border-success/20 p-3 text-center">
                <Wifi className="h-5 w-5 text-success mx-auto mb-1" />
                <p className="text-[10px] font-medium text-success">IP Verified</p>
                <p className="text-[10px] text-muted-foreground">All campus</p>
              </div>
              <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-center">
                <AlertTriangle className="h-5 w-5 text-warning mx-auto mb-1" />
                <p className="text-[10px] font-medium text-warning">Liveness</p>
                <p className="text-[10px] text-muted-foreground">2 pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Override */}
      {showOverride && (
        <Card className="border-primary/30 border-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Manual Override — Mark Student Present</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Student ID (e.g. STU002)" />
              <Textarea placeholder="Mandatory reason for override..." className="resize-none" rows={2} />
            </div>
            <Button size="sm"><UserPlus className="mr-2 h-4 w-4" /> Override & Mark Present</Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Check-ins */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Recent Check-ins</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>GPS</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceLogs.filter(l => l.sessionId === (id || "SES002")).slice(0, 6).map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-sm">{students.find(s => s.id === log.studentId)?.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "—"}</TableCell>
                  <TableCell className="text-xs">{log.method || "—"}</TableCell>
                  <TableCell>{log.gpsValid ? <span className="text-success text-xs">✓ Valid</span> : <span className="text-destructive text-xs">✗ Invalid</span>}</TableCell>
                  <TableCell><StatusBadge status={log.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
