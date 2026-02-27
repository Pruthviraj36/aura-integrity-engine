import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { courses } from "@/lib/mock-data";
import { Calculator, AlertTriangle, CheckCircle2 } from "lucide-react";

const courseData = [
  { id: "CS301", attended: 28, total: 32 },
  { id: "CS302", attended: 24, total: 28 },
  { id: "CS303", attended: 22, total: 25 },
];

export default function WhatIfSimulator() {
  const [selectedCourse, setSelectedCourse] = useState("CS301");
  const [plannedAbsences, setPlannedAbsences] = useState([0]);

  const data = courseData.find(c => c.id === selectedCourse)!;
  const course = courses.find(c => c.id === selectedCourse)!;
  const remaining = course.totalSessions - data.total;
  const futureAttended = remaining - plannedAbsences[0];
  const projectedPct = Math.round(((data.attended + Math.max(0, futureAttended)) / course.totalSessions) * 100);
  const passThreshold = 75;
  const willPass = projectedPct >= passThreshold;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" /> What-If Simulator
        </h1>
        <p className="text-sm text-muted-foreground">Plan your absences and see projected attendance</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Select Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {courseData.map(c => {
                const cr = courses.find(x => x.id === c.id)!;
                return <SelectItem key={c.id} value={c.id}>{c.id} — {cr.name}</SelectItem>;
              })}
            </SelectContent>
          </Select>

          <div className="grid gap-3 grid-cols-3 text-center">
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xl font-bold">{data.attended}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Attended</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xl font-bold">{data.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Held</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xl font-bold">{remaining}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Remaining</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Planned Absences</span>
              <span className="font-mono font-bold text-primary">{plannedAbsences[0]} / {remaining}</span>
            </div>
            <Slider value={plannedAbsences} onValueChange={setPlannedAbsences} max={remaining} step={1} className="py-2" />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${willPass ? "border-success/30" : "border-destructive/30"}`}>
        <CardContent className="p-6 text-center space-y-3">
          {willPass ? (
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          )}
          <p className="text-4xl font-bold">{projectedPct}%</p>
          <p className="text-sm text-muted-foreground">Projected Attendance</p>
          <p className={`text-sm font-medium ${willPass ? "text-success" : "text-destructive"}`}>
            {willPass ? "✓ You will meet the 75% threshold" : "✗ You will fall below the 75% threshold"}
          </p>
          {!willPass && (
            <p className="text-xs text-muted-foreground">
              You need to attend at least {Math.ceil(course.totalSessions * 0.75) - data.attended} more sessions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
