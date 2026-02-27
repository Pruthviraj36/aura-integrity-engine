import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timetable, getCourseName, getFacultyName } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "14:00-15:00", "15:00-16:00"];

export default function Timetable() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" /> Timetable
        </h1>
        <p className="text-sm text-muted-foreground">Weekly schedule — All departments</p>
      </div>

      <Card className="border-border/50 overflow-auto">
        <CardContent className="p-0">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border/50">
              <div className="p-3 text-xs font-medium text-muted-foreground">Time</div>
              {timetable.map(day => (
                <div key={day.day} className="p-3 text-xs font-semibold text-center border-l border-border/50">{day.day}</div>
              ))}
            </div>
            {timeSlots.map(slot => (
              <div key={slot} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border/30">
                <div className="p-3 text-xs text-muted-foreground font-mono">{slot}</div>
                {timetable.map(day => {
                  const session = day.slots.find(s => s.time === slot);
                  return (
                    <div key={day.day} className="p-2 border-l border-border/30 min-h-[60px]">
                      {session && (
                        <div className="rounded-md bg-primary/10 border border-primary/20 p-2 text-xs space-y-0.5">
                          <p className="font-semibold text-primary">{session.courseId}</p>
                          <p className="text-muted-foreground truncate">{getCourseName(session.courseId)}</p>
                          <p className="text-muted-foreground">{session.room}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
