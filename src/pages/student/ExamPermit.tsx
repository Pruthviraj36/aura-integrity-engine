import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Download, Lock, CheckCircle2, XCircle } from "lucide-react";

const permitData = {
  studentName: "Aarav Sharma",
  rollNo: "STU001",
  department: "Computer Science & Engineering",
  semester: "5th Semester",
  examName: "End Semester Examination — Feb 2026",
  courses: [
    { id: "CS301", name: "Data Structures & Algorithms", attendance: 87, eligible: true },
    { id: "CS302", name: "Database Management Systems", attendance: 86, eligible: true },
    { id: "CS303", name: "Operating Systems", attendance: 88, eligible: true },
  ],
  overallEligible: true,
};

export default function ExamPermit() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" /> Exam Permit
        </h1>
        <p className="text-sm text-muted-foreground">Your hall ticket eligibility based on attendance</p>
      </div>

      <Card className={`border-2 ${permitData.overallEligible ? "border-success/30" : "border-destructive/30"}`}>
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-border/50 pb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">National Institute of Technology, Tiruchirappalli</p>
            <h2 className="text-lg font-bold">{permitData.examName}</h2>
            <p className="text-xs text-muted-foreground">Hall Ticket / Exam Permit</p>
          </div>

          {/* Student Info */}
          <div className="grid gap-3 grid-cols-2 text-sm">
            <div><span className="text-muted-foreground text-xs">Name:</span><p className="font-medium">{permitData.studentName}</p></div>
            <div><span className="text-muted-foreground text-xs">Roll No:</span><p className="font-medium">{permitData.rollNo}</p></div>
            <div><span className="text-muted-foreground text-xs">Department:</span><p className="font-medium">{permitData.department}</p></div>
            <div><span className="text-muted-foreground text-xs">Semester:</span><p className="font-medium">{permitData.semester}</p></div>
          </div>

          {/* Course Eligibility */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Course-wise Eligibility</p>
            {permitData.courses.map(course => (
              <div key={course.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                <div>
                  <p className="text-sm font-medium">{course.id} — {course.name}</p>
                  <p className="text-xs text-muted-foreground">Attendance: {course.attendance}%</p>
                </div>
                {course.eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="text-center pt-2">
            {permitData.overallEligible ? (
              <Button size="lg" className="glow-cyan">
                <Download className="mr-2 h-5 w-5" /> Download Hall Ticket
              </Button>
            ) : (
              <Button size="lg" variant="destructive" disabled>
                <Lock className="mr-2 h-5 w-5" /> Hall Ticket Locked
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
