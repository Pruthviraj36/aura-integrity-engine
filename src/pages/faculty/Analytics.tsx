import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from "recharts";
import { courseOutcomes, courses } from "@/lib/mock-data";

const tooltipStyle = { background: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" };
const tickStyle = { fill: "hsl(215 20% 55%)", fontSize: 12 };

const attainmentData = courseOutcomes.map(co => ({
  name: co.id,
  attainment: co.attainment,
  course: co.courseId,
}));

const radarData = courseOutcomes.filter(co => co.courseId === "CS301").map(co => ({
  subject: co.id,
  A: co.attainment,
  fullMark: 100,
}));

const trendData = [
  { week: "W1", CS301: 85, CS302: 78, CS303: 90 },
  { week: "W2", CS301: 82, CS302: 80, CS303: 88 },
  { week: "W3", CS301: 87, CS302: 76, CS303: 85 },
  { week: "W4", CS301: 84, CS302: 82, CS303: 87 },
  { week: "W5", CS301: 87, CS302: 86, CS303: 88 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attainment Analytics</h1>
        <p className="text-sm text-muted-foreground">Course outcome attainment and attendance correlation</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">CO Attainment by Course</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attainmentData}>
                <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="attainment" fill="hsl(187 100% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">CS301 — Radar View</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(222 30% 18%)" />
                <PolarAngleAxis dataKey="subject" tick={tickStyle} />
                <PolarRadiusAxis tick={{ ...tickStyle, fontSize: 10 }} />
                <Radar dataKey="A" stroke="hsl(187 100% 50%)" fill="hsl(187 100% 50%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Weekly Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="CS301" stroke="hsl(187 100% 50%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="CS302" stroke="hsl(142 76% 46%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="CS303" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attainment Formula */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">OBE Attainment Formula</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/30 p-4 font-mono text-sm text-center">
            <p>A<sub>CO</sub> = (W<sub>att</sub> × P<sub>att</sub>) + (W<sub>int</sub> × M<sub>int</sub>)</p>
            <p className="text-xs text-muted-foreground mt-2">W<sub>att</sub>=0.2, W<sub>int</sub>=0.8 — Configurable per course</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
