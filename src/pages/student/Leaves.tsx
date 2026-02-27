import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { leaves } from "@/lib/mock-data";
import { FileText, Upload, Plus } from "lucide-react";

export default function LeaveManagement() {
  const [showForm, setShowForm] = useState(false);
  const studentLeaves = leaves.filter(l => l.studentId === "STU001");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-sm text-muted-foreground">Submit and track your leave requests</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30 border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Submit Leave Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Leave Type</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="od">On-Duty (OD)</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="family">Family Emergency</SelectItem>
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
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Document</label>
                <div className="border border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-accent/30 transition-colors">
                  <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Click to upload</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Reason</label>
              <Textarea placeholder="Explain your reason for leave..." className="resize-none" rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setShowForm(false)}>Submit Request</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" /> Leave History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentLeaves.map(leave => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium text-sm">{leave.type}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{leave.startDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{leave.endDate}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{leave.reason}</TableCell>
                  <TableCell className="text-xs text-primary">{leave.document || "—"}</TableCell>
                  <TableCell><StatusBadge status={leave.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
