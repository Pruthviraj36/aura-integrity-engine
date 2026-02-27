import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courses, courseOutcomes } from "@/lib/mock-data";
import { QrCode, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const topics: Record<string, string[]> = {
  CS301: ["Binary Search Trees", "AVL Trees", "Red-Black Trees", "Graph Traversal", "Dijkstra's Algorithm"],
  CS302: ["ER Diagrams", "Normalization", "SQL Joins", "Transactions", "Indexing"],
  CS303: ["Process Scheduling", "Deadlocks", "Memory Management", "File Systems", "I/O Systems"],
};

export default function CreateSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [co, setCo] = useState("");

  const facultyCourses = courses.filter(c => c.faculty === "FAC001");
  const availableTopics = course ? topics[course] || [] : [];
  const availableCOs = course ? courseOutcomes.filter(c => c.courseId === course) : [];

  const handleGenerate = () => {
    navigate("/faculty/session/SES001");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Session</h1>
        <p className="text-sm text-muted-foreground">Set up a session and generate a QR code for attendance</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 text-xs">
        {["Course", "Topic", "CO", "Generate"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              {i + 1}
            </div>
            <span className={i + 1 <= step ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6 space-y-6">
          {step >= 1 && (
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Course</label>
              <Select value={course} onValueChange={(v) => { setCourse(v); setStep(Math.max(step, 2)); }}>
                <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
                <SelectContent>
                  {facultyCourses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.id} — {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step >= 2 && course && (
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Topic</label>
              <Select value={topic} onValueChange={(v) => { setTopic(v); setStep(Math.max(step, 3)); }}>
                <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                <SelectContent>
                  {availableTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {step >= 3 && topic && (
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Map to Course Outcome</label>
              <Select value={co} onValueChange={(v) => { setCo(v); setStep(4); }}>
                <SelectTrigger><SelectValue placeholder="Choose a CO" /></SelectTrigger>
                <SelectContent>
                  {availableCOs.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.id}: {c.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 4 && co && (
            <div className="text-center pt-4">
              <Button size="lg" className="glow-cyan" onClick={handleGenerate}>
                <QrCode className="mr-2 h-5 w-5" /> Generate QR & Start Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
