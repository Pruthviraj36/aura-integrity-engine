import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sessions, getCourseName } from "@/lib/mock-data";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AttendanceRecords() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredSessions = sessions.filter(s =>
    getCourseName(s.courseId).toLowerCase().includes(search.toLowerCase()) ||
    s.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Records</h1>
        <p className="text-sm text-muted-foreground">View and manage all session records</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search sessions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs text-muted-foreground">{s.date}</TableCell>
                  <TableCell className="font-medium text-sm">{getCourseName(s.courseId)}</TableCell>
                  <TableCell className="text-sm">{s.topic}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.room}</TableCell>
                  <TableCell className="text-sm font-mono">{s.present}/{s.total}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "completed" ? "bg-success/15 text-success" : "bg-info/15 text-info"}`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/faculty/session/${s.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
