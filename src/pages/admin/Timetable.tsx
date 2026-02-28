import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2, Clock, MapPin, Plus, Trash2, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timetableAPI, coursesAPI, usersAPI } from "@/lib/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];

export default function Timetable() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number, time: string } | null>(null);
  const [formData, setFormData] = useState({
    courseId: "",
    roomNumber: "",
    type: "Theory"
  });

  const { data: timetableData, isLoading } = useQuery({
    queryKey: ["admin", "timetable"],
    queryFn: async () => {
      const resp = await timetableAPI.getTimetable({ limit: 100 });
      return resp.data.data.timetableEntries;
    }
  });

  const { data: courses } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const resp = await coursesAPI.getCourses();
      return resp.data.data.courses;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => timetableAPI.createTimetableEntry(data),
    onSuccess: () => {
      toast.success("Timeline synchronized");
      queryClient.invalidateQueries({ queryKey: ["admin", "timetable"] });
      setIsAddOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Sync failure")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => timetableAPI.deleteTimetableEntry(id.toString()),
    onSuccess: () => {
      toast.success("Node purged from timeline");
      queryClient.invalidateQueries({ queryKey: ["admin", "timetable"] });
    }
  });

  const handleSlotClick = (dayIdx: number, time: string) => {
    setSelectedSlot({ day: dayIdx + 1, time });
    setIsAddOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const entries = Array.isArray(timetableData) ? timetableData : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-tighter italic flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Temporal Grid
          </h1>
          <p className="text-sm text-slate-400 font-mono tracking-wider uppercase">Institutional Scheduling Matrix</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Sync: Active</div>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md overflow-x-auto shadow-2xl">
        <CardContent className="p-0">
          <div className="min-w-[1000px]">
            {/* Header */}
            <div className="grid grid-cols-[120px_repeat(5,1fr)] bg-slate-950/60 border-b border-slate-800">
              <div className="p-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="h-3 w-3" /> Timeline
              </div>
              {days.map((day, idx) => (
                <div key={day} className="p-4 text-[10px] font-black text-slate-300 text-center border-l border-slate-800/50 uppercase tracking-[0.3em]">
                  {day}
                </div>
              ))}
            </div>

            {/* Rows */}
            {timeSlots.map(slot => (
              <div key={slot} className="grid grid-cols-[120px_repeat(5,1fr)] border-b border-slate-800/30 group">
                <div className="p-4 text-[11px] text-slate-500 font-mono font-bold bg-slate-950/20 group-hover:text-primary transition-colors">
                  {slot}:00 Protocol
                </div>
                {days.map((day, dayIdx) => {
                  // dayOfWeek is 0-6 (Sun-Sat), but our grid is Mon-Fri (1-5)
                  const session = entries.find(e =>
                    e.dayOfWeek === (dayIdx + 1) &&
                    e.startTime.startsWith(slot)
                  );

                  return (
                    <div
                      key={day}
                      className="p-3 border-l border-slate-800/30 min-h-[120px] hover:bg-white/5 transition-all duration-300 cursor-pointer group/slot relative"
                      onClick={() => !session && handleSlotClick(dayIdx, slot)}
                    >
                      {session ? (
                        <div className="h-full rounded-lg bg-slate-950/80 border border-primary/20 p-3 text-xs space-y-2 group/card relative overflow-hidden flex flex-col justify-between shadow-lg">
                          <button
                            className="absolute top-1 right-1 p-1 opacity-0 group-hover/card:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/40 rounded text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Purge this temporal node?')) deleteMutation.mutate(session.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <div>
                            <p className="font-black text-primary uppercase tracking-tighter italic text-sm">{session.course?.code}</p>
                            <p className="text-slate-400 line-clamp-1 font-medium">{session.course?.name}</p>
                          </div>
                          <div className="space-y-1 pt-2">
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                              <MapPin className="h-3 w-3 text-slate-700" /> {session.roomNumber || "LH-201"}
                            </div>
                            <p className="text-[9px] text-slate-600 italic font-mono truncate">
                              FAC: {session.facultyProfile?.fullName || session.faculty?.username || "AURA_CORE"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full border border-dashed border-slate-800/50 rounded-lg flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity">
                          <Plus className="h-4 w-4 text-slate-700" />
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

      <div className="flex justify-center gap-8 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <div className="h-2 w-2 rounded-full bg-primary" /> Active Thread
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <div className="h-2 w-2 rounded-full bg-slate-800" /> Empty Node
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-primary">Initialize Temporal Node</DialogTitle>
            <DialogDescription className="text-slate-500 font-mono text-[10px] uppercase">
              Scheduling for {selectedSlot && days[selectedSlot.day - 1]} at {selectedSlot?.time}:00
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Course</Label>
              <Select value={formData.courseId} onValueChange={v => setFormData({ ...formData, courseId: v })}>
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  {courses?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.code} — {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Room Matrix</Label>
                <Input
                  placeholder="e.g. LH-201"
                  value={formData.roomNumber}
                  onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="bg-slate-950 border-slate-800 focus:ring-primary/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Session Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="bg-slate-950 border-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Practical">Practical</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter"
              onClick={() => createMutation.mutate({
                ...formData,
                dayOfWeek: selectedSlot?.day,
                startTime: `${selectedSlot?.time}:00`,
                endTime: `${parseInt(selectedSlot?.time || "9") + 1}:00`
              })}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Commit to Timeline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
