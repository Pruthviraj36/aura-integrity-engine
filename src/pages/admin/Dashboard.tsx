import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BookOpen, GraduationCap, AlertTriangle, TrendingUp } from "lucide-react";
import { departments, students } from "@/lib/mock-data";

const deptChart = departments.map(d => ({ name: d.id, avg: d.avgAttendance, students: d.totalStudents }));
const shortageStudents = students.filter(s => s.attendance < 75);

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Institution-wide attendance overview • NIT Tiruchirappalli</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value="570" icon={Users} trend={{ value: 5, label: "vs last year" }} />
        <StatCard title="Active Courses" value="24" subtitle="Across 3 departments" icon={BookOpen} />
        <StatCard title="Avg Attendance" value="78%" trend={{ value: -1.2, label: "this month" }} icon={TrendingUp} />
        <StatCard title="Flagged Students" value={shortageStudents.length.toString()} subtitle="Below 75% threshold" icon={AlertTriangle} iconClassName="bg-destructive/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Department Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptChart}>
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" }} />
                <Bar dataKey="avg" fill="hsl(187 100% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Shortage Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shortageStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.id} • {s.department} • Sem {s.semester}</p>
                </div>
                <span className="text-sm font-bold text-destructive">{s.attendance}%</span>
              </div>
            ))}
            {shortageStudents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No students below threshold</p>}
          </CardContent>
        </Card>
      </div>

      {/* Department Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {departments.map(dept => (
          <Card key={dept.id} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{dept.id}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{dept.avgAttendance}%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{dept.name}</p>
              <p className="text-xs text-muted-foreground">HOD: {dept.hod}</p>
              <p className="text-xs text-muted-foreground">{dept.totalStudents} students</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
