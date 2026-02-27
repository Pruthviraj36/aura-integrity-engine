import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { CalendarCheck, Users, BarChart3, Play, Clock } from "lucide-react";
import { sessions, courses, getCourseName, courseOutcomes } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

const todaySessions = sessions.filter(s => s.date === "2026-02-27" && (s.facultyId === "FAC001" || s.facultyId === "FAC002"));

const attainmentData = courseOutcomes.slice(0, 6).map(co => ({
  name: co.id,
  attainment: co.attainment,
  bloom: co.bloomLevel,
}));

const recentActivity = [
  { text: "Completed session: AVL Tree Rotations", time: "Yesterday, 10:00 AM", type: "session" },
  { text: "Marked Vikram Singh late (manual override)", time: "Yesterday, 10:15 AM", type: "override" },
  { text: "Completed session: Graph BFS & DFS", time: "Feb 25, 10:00 AM", type: "session" },
  { text: "Generated compliance report for CS301", time: "Feb 24, 3:00 PM", type: "report" },
];

export default function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-sm text-muted-foreground">Dr. Rajesh Kumar • Professor • CSE Department</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Sessions" value="3" subtitle="1 completed, 2 upcoming" icon={CalendarCheck} />
        <StatCard title="Total Students" value="173" subtitle="Across 3 courses" icon={Users} />
        <StatCard title="Avg Attendance" value="84%" trend={{ value: 1.5, label: "this week" }} icon={BarChart3} />
        <StatCard title="CO Attainment" value="72%" subtitle="Avg across all COs" icon={BarChart3} />
      </div>

      {/* Today's Sessions */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaySessions.map(session => (
            <div key={session.id} className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border/30 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{getCourseName(session.courseId)} — {session.topic}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time}</span>
                  <span>{session.room}</span>
                  <span>{session.present}/{session.total} students</span>
                </div>
              </div>
              <Button size="sm" variant={session.status === "upcoming" ? "default" : "outline"} onClick={() => navigate(`/faculty/session/${session.id}`)}>
                {session.status === "upcoming" ? <><Play className="mr-1 h-3 w-3" />Start</> : "View"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">CO Attainment Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attainmentData}>
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" }} />
                <Bar dataKey="attainment" fill="hsl(187 100% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
