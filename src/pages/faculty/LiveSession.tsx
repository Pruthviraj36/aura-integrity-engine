import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Users, Clock, Shield, Wifi, AlertTriangle, UserPlus, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsAPI, attendanceAPI } from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";

export default function LiveSession() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [qrTimer, setQrTimer] = useState(15);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideStudentId, setOverrideStudentId] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

  const { data: sessionData, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const resp = await sessionsAPI.getSession(id!);
      return resp.data.data.session;
    },
    enabled: !!id
  });

  const { data: attendanceData } = useQuery({
    queryKey: ["session", id, "attendance"],
    queryFn: async () => {
      const resp = await sessionsAPI.getSessionAttendance(id!);
      return resp.data.data.attendance;
    },
    enabled: !!id,
    refetchInterval: (data: any) => (sessionData?.status === 'completed' ? false : 5000)
  });

  const endSessionMutation = useMutation({
    mutationFn: () => sessionsAPI.updateSession(id!, { status: "completed" }),
    onSuccess: () => {
      toast.success("Session concluded successfully");
      queryClient.invalidateQueries({ queryKey: ["session", id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to end session");
    }
  });

  const generateQRMutation = useMutation({
    mutationFn: () => sessionsAPI.generateQR(id!),
    onSuccess: (data) => {
      queryClient.setQueryData(["session", id], (old: any) => ({
        ...old,
        qrCode: data.data.data.qrCode
      }));
      setQrTimer(15);
    }
  });

  const overrideMutation = useMutation({
    mutationFn: (data: any) => attendanceAPI.markAttendance(data),
    onSuccess: () => {
      toast.success("Attendance marked manually");
      queryClient.invalidateQueries({ queryKey: ["session", id, "attendance"] });
      setShowOverride(false);
      setOverrideStudentId("");
      setOverrideReason("");
    }
  });

  useEffect(() => {
    if (sessionData && !sessionData.qrCode && sessionData.status !== 'completed' && !generateQRMutation.isPending) {
      generateQRMutation.mutate();
    }
  }, [sessionData]);

  useEffect(() => {
    if (sessionData?.status === 'completed') return;

    const interval = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 1) {
          generateQRMutation.mutate();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [id, sessionData?.status]);

  if (isSessionLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const session = sessionData;
  const isCompleted = session?.status === 'completed';
  const presentCount = attendanceData?.length || 0;
  const allEnrolledStudents = session?.course?.students || [];
  const presentStudentIds = new Set(attendanceData?.map((a: any) => a.studentId) || []);
  const absentees = allEnrolledStudents.filter((s: any) => !presentStudentIds.has(s.id));
  const totalCount = allEnrolledStudents.length || 1;
  const pct = Math.round((presentCount / totalCount) * 100);

  const copyAbsenteeReport = () => {
    const dateStr = format(new Date(session?.date), "MMM dd, yyyy");
    const report = `ABSENTEE REPORT\nSubject: ${session?.course?.name}\nDate: ${dateStr}\n\nPresent: ${presentCount}\nAbsent: ${absentees.length}\n\nABSENTEES:\n${absentees.map((s: any, i: number) => `${i + 1}. ${s.fullName || s.username}`).join('\n')}`;
    navigator.clipboard.writeText(report);
    toast.success("Report copied!");
  };

  const handleManualOverride = () => {
    if (!overrideStudentId || !overrideReason) return;
    overrideMutation.mutate({
      sessionId: parseInt(id!),
      studentId: parseInt(overrideStudentId),
      status: "present",
      notes: overrideReason,
      method: "manual_override"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{session?.course?.code} — {session?.topic}</h1>
          <p className="text-sm text-slate-400 font-medium">
            {session?.date && format(new Date(session.date), "MMMM dd, yyyy")} • {session?.startTime} - {session?.endTime}
          </p>
        </div>
        <div className="flex gap-3">
          {!isCompleted && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowOverride(!showOverride)}>
                <UserPlus className="mr-2 h-4 w-4" /> Manual Override
              </Button>
              <Button variant="destructive" size="sm" onClick={() => endSessionMutation.mutate()} disabled={endSessionMutation.isPending}>
                End Session
              </Button>
            </>
          )}
          {isCompleted && (
            <Button variant="outline" size="sm" onClick={copyAbsenteeReport} className="border-emerald-500 text-emerald-500">
              <RefreshCw className="mr-2 h-4 w-4" /> Copy Export
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm lg:row-span-2">
          <CardHeader className="pb-3 px-6 border-b border-white/5">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{isCompleted ? "Session Statistics" : "Secure Attendance QR"}</span>
              <span className={isCompleted ? "text-emerald-500" : "text-primary"}>
                {isCompleted ? "Concluded" : "Live"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center relative h-full">
            {!isCompleted ? (
              <div className="space-y-6">
                <div className="aspect-square bg-white rounded-xl flex items-center justify-center border border-slate-200">
                  {session?.qrCode ? (
                    <QRCodeSVG
                      value={`${window.location.hostname === "localhost" && import.meta.env.VITE_NETWORK_IP
                        ? `http://${import.meta.env.VITE_NETWORK_IP}:${import.meta.env.VITE_PORT || '8080'}`
                        : window.location.origin
                        }/student/verify?token=${session.qrCode.codeValue}`}
                      size={220}
                      level="H"
                    />
                  ) : (
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  )}
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 uppercase font-black">Rotation Sync</p>
                  <p className="text-3xl font-mono text-primary font-black">{qrTimer}s</p>
                  <Progress value={(qrTimer / 15) * 100} className="h-1 mt-3" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Present</p>
                    <p className="text-3xl font-bold text-emerald-500">{presentCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Absent</p>
                    <p className="text-3xl font-bold text-red-500">{absentees.length}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-4">Absentees</p>
                  <div className="space-y-2">
                    {absentees.map((s: any) => (
                      <div key={s.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <p className="text-sm font-bold text-slate-200">{s.fullName || s.username}</p>
                        <p className="text-[10px] text-slate-500">{s.studentProfile?.studentId || s.id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm col-span-1 lg:col-span-2">
          <CardHeader><CardTitle className="text-sm font-medium text-slate-300">Participation</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{pct}%</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Attendance</p>
              </div>
              <Progress value={pct} className="h-2 flex-1" />
              <div className="text-right">
                <p className="text-xl font-bold text-white">{presentCount} / {totalCount}</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm col-span-1 lg:col-span-2">
          <CardHeader><CardTitle className="text-sm font-medium text-slate-300">Integrity Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                <Shield className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Protocol</p>
                <p className="text-xs text-emerald-500 font-bold mt-1">SECURE</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                <Wifi className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Network</p>
                <p className="text-xs text-primary font-bold mt-1">CAMPUS</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                <AlertTriangle className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Threat</p>
                <p className="text-xs text-emerald-500 font-bold mt-1">ZERO</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showOverride && !isCompleted && (
        <Card className="bg-slate-900 border-primary/20 border backdrop-blur-md">
          <CardHeader><CardTitle className="text-sm font-medium text-white">Manual Presence Override</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Student ID..." value={overrideStudentId} onChange={(e) => setOverrideStudentId(e.target.value)} className="bg-slate-950" />
              <Textarea placeholder="Reason..." value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} className="bg-slate-950" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowOverride(false)}>Cancel</Button>
              <Button onClick={handleManualOverride} disabled={overrideMutation.isPending}>Authenticate Student</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader><CardTitle className="text-sm font-medium text-slate-300">Authentication Feed</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead>Student</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.map((log: any) => (
                <TableRow key={log.id} className="border-slate-800">
                  <TableCell className="font-bold text-white">{log.student?.profile?.fullName || log.student?.username}</TableCell>
                  <TableCell className="text-slate-500">{format(new Date(log.timestamp), "HH:mm:ss")}</TableCell>
                  <TableCell className="text-[10px] font-bold text-slate-400">{log.method || "QR_SCAN"}</TableCell>
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
