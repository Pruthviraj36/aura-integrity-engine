import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileBarChart, Download, FileText, FileSpreadsheet } from "lucide-react";
import { departments } from "@/lib/mock-data";

const reportTypes = [
  { id: "naac", name: "NAAC Compliance Report", description: "National Assessment and Accreditation Council" },
  { id: "abet", name: "ABET Accreditation Report", description: "Accreditation Board for Engineering and Technology" },
  { id: "nep", name: "NEP-2020 Compliance Report", description: "National Education Policy 2020" },
  { id: "internal", name: "Internal Attendance Report", description: "Departmental attendance summary" },
];

export default function Reports() {
  const [dept, setDept] = useState("");
  const [reportType, setReportType] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileBarChart className="h-6 w-6 text-primary" /> Reports & Compliance
        </h1>
        <p className="text-sm text-muted-foreground">Generate attendance reports for accreditation & audits</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Generate Report</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Department</label>
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {reportTypes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">From Date</label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">To Date</label>
              <Input type="date" />
            </div>
          </div>
          <Button size="sm" disabled={!dept || !reportType}>Generate Report</Button>
        </CardContent>
      </Card>

      {/* Preview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map(r => (
          <Card key={r.id} className="border-border/50">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.description}</p>
                <p className="text-xs text-muted-foreground">Last generated: Feb 20, 2026</p>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8"><FileText className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8"><FileSpreadsheet className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
