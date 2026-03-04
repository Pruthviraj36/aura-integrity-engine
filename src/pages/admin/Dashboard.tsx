import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BookOpen, AlertTriangle, TrendingUp, Loader2, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reportsAPI, usersAPI, coursesAPI } from "@/lib/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: deptData, isLoading: isDeptsLoading } = useQuery({
    queryKey: ["admin", "departments"],
    queryFn: async () => {
      const resp = await reportsAPI.getDepartmentReports();
      return resp.data.data.departments;
    }
  });

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const resp = await usersAPI.getUsers({ role: "student", limit: 1000 });
      return resp.data.data.users || [];
    }
  });

  const { data: coursesData, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const resp = await coursesAPI.getCourses({ limit: 1000 });
      return resp.data.data.courses || [];
    }
  });

  const { data: facultyData, isLoading: isFacultyLoading } = useQuery({
    queryKey: ["admin", "faculty"],
    queryFn: async () => {
      const resp = await usersAPI.getUsers({ role: "faculty", limit: 1000 });
      return resp.data.data.users || [];
    }
  });

  const { data: attendanceData, isLoading: isAttLoading } = useQuery({
    queryKey: ["admin", "global-attendance"],
    queryFn: async () => {
      const resp = await reportsAPI.attendance({ limit: 5000 });
      return resp.data.data.reports || [];
    }
  });

  const isLoading = isDeptsLoading || isStudentsLoading || isFacultyLoading || isCoursesLoading || isAttLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const deptChart = deptData?.map((d: any) => ({
    name: d.department,
    avg: d.averageAttendance,
    students: d.totalStudents
  })) || [];

  const avgAttendance = deptData?.length
    ? (deptData.reduce((acc: number, d: any) => acc + d.averageAttendance, 0) / deptData.length).toFixed(1)
    : "0";

  // Compute shortage students from real attendance data
  const students: any[] = Array.isArray(studentsData) ? studentsData : [];
  const reports: any[] = Array.isArray(attendanceData) ? attendanceData : [];

  const shortageStudents = students.map((s: any) => {
    const studentReports = reports.filter((r: any) => r.studentId === s.id);
    const total = studentReports.length;
    const present = studentReports.filter((r: any) => r.status === "present").length;
    const attendance = total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0;
    return { ...s, attendance, totalClasses: total };
  })
    .filter((s: any) => s.attendance < 75 && s.totalClasses > 0)
    .sort((a: any, b: any) => a.attendance - b.attendance)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground uppercase aura-text-glow">Institutional Command</h1>
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] mt-1">
          Root Access // Global System Metrics
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={studentsData?.length.toString() || "0"} icon={Users} className="glass-card aura-glow border-none" />
        <StatCard title="Staff Faculty" value={facultyData?.length.toString() || "0"} icon={ShieldAlert} className="glass-card aura-glow border-none" />
        <StatCard title="Active Courses" value={coursesData?.length.toString() || "0"} subtitle={`${deptData?.length || 0} SECTORS`} icon={BookOpen} className="glass-card aura-glow border-none" />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={TrendingUp} className="glass-card aura-glow border-none" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass-card aura-glow border-none overflow-hidden group">
          <CardHeader className="bg-primary/5 border-b border-border/10 px-6 py-4">
            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Sector Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptChart}>
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "rgba(var(--primary), 0.05)" }}
                  contentStyle={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[8, 8, 2, 2]} barSize={45} className="filter drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card aura-glow border-none overflow-hidden group">
          <CardHeader className="bg-destructive/5 border-b border-destructive/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Shortage Alerts
              </CardTitle>
              {shortageStudents.length > 0 && (
                <Link to="/admin/alerts" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                  View All →
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6 h-[260px] overflow-y-auto custom-scrollbar">
            {shortageStudents.length > 0 ? (
              shortageStudents.map((s: any) => {
                const severity = s.attendance < 50 ? "CRITICAL" : s.attendance < 65 ? "HIGH" : "MODERATE";
                const colorClass = severity === "CRITICAL" ? "text-rose-500 bg-rose-500/10 border-rose-500/30" : severity === "HIGH" ? "text-orange-500 bg-orange-500/10 border-orange-500/30" : "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl bg-muted/10 border border-white/5 p-4 hover:border-destructive/40 transition-all hover:bg-muted/20">
                    <div>
                      <p className="text-sm font-black text-foreground uppercase tracking-tight">{s.studentProfile?.fullName || s.username}</p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase opacity-70">{s.studentProfile?.enrollmentNumber || s.id} // {s.studentProfile?.department || "—"}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className={`text-[8px] px-2 py-0.5 rounded border font-black tracking-widest ${colorClass}`}>{severity}</span>
                      <span className="text-sm font-black text-destructive font-mono aura-text-glow">{s.attendance}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <ShieldAlert className="h-8 w-8 mb-2 opacity-20 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-600">All clear</p>
                <p className="text-xs">No attendance shortages detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {deptData?.map((dept: any) => (
          <Card key={dept.department} className="glass-card aura-glow border-none hover:scale-[1.02] transition-all duration-500 group overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-xs font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-widest">{dept.department}</h3>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 aura-glow shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                  {dept.averageAttendance}%
                </span>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-mono tracking-tight opacity-70">
                  <span>Courses: <span className="text-foreground font-bold">{dept.totalCourses}</span></span>
                  <span>Students: <span className="text-foreground font-bold">{dept.totalStudents}</span></span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-mono tracking-tight opacity-70">
                  <span>Faculty: <span className="text-foreground font-bold">{dept.totalFaculty}</span></span>
                  <span>Avg Marks: <span className="text-foreground font-bold">{dept.averageMarks}</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
