import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { GraduationCap, CalendarCheck, Clock, TrendingUp } from "lucide-react";
import { attendanceLogs, sessions, courses, courseOutcomes, getCourseName } from "@/lib/mock-data";

const coChartData = courseOutcomes.filter(co => co.courseId === "CS301").map(co => ({
  name: co.id,
  attainment: co.attainment,
  description: co.description.slice(0, 30),
}));

const weeklyData = [
  { day: "Mon", present: 3, total: 3 },
  { day: "Tue", present: 2, total: 3 },
  { day: "Wed", present: 3, total: 3 },
  { day: "Thu", present: 2, total: 3 },
  { day: "Fri", present: 3, total: 3 },
];

const recentLogs = attendanceLogs
  .filter(l => l.studentId === "STU001")
  .slice(0, 8)
  .map(log => {
    const session = sessions.find(s => s.id === log.sessionId);
    return { ...log, courseName: getCourseName(session?.courseId ?? ""), topic: session?.topic ?? "", date: session?.date ?? "" };
  });

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Aarav Sharma • Semester 5 • CSE</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Overall Attendance" value="87%" icon={GraduationCap} trend={{ value: 2.3, label: "vs last month" }} />
        <StatCard title="Today's Classes" value="3" subtitle="2 completed, 1 upcoming" icon={CalendarCheck} />
        <StatCard title="Sessions This Week" value="15" subtitle="13 present, 1 late, 1 absent" icon={Clock} />
        <StatCard title="OBE Attainment" value="72%" subtitle="Avg across all COs" icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" }} />
                <Bar dataKey="present" fill="hsl(187 100% 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="hsl(222 30% 18%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">CO Attainment — CS301</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={coChartData}>
                <PolarGrid stroke="hsl(222 30% 18%)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                <Radar dataKey="attainment" stroke="hsl(187 100% 50%)" fill="hsl(187 100% 50%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">OBE Progress by Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.filter(c => c.department === "CSE" && c.semester === 5).map(course => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{course.id} — {course.name}</span>
                <span className="text-muted-foreground">{Math.round((course.completedSessions / course.totalSessions) * 100)}%</span>
              </div>
              <Progress value={(course.completedSessions / course.totalSessions) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Recent Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                  <TableCell className="text-sm font-medium">{log.courseName}</TableCell>
                  <TableCell className="text-sm">{log.topic}</TableCell>
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
