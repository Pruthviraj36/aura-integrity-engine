import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { courses, getFacultyName } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { useState } from "react";

export default function CourseManagement() {
  const [search, setSearch] = useState("");
  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
        <p className="text-sm text-muted-foreground">{courses.length} active courses</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm font-bold text-primary">{c.id}</TableCell>
                  <TableCell className="font-medium text-sm">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.department}</TableCell>
                  <TableCell className="text-sm">{c.credits}</TableCell>
                  <TableCell className="text-sm">{getFacultyName(c.faculty)}</TableCell>
                  <TableCell className="w-36">
                    <div className="space-y-1">
                      <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground">{c.completedSessions}/{c.totalSessions} sessions</p>
                    </div>
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
