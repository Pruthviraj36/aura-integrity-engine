import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AppLayout } from "@/components/AppLayout";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import QRScanner from "./pages/student/QRScanner";
import Simulator from "./pages/student/Simulator";
import Leaves from "./pages/student/Leaves";
import ExamPermit from "./pages/student/ExamPermit";

// Faculty pages
import FacultyDashboard from "./pages/faculty/Dashboard";
import CreateSession from "./pages/faculty/CreateSession";
import LiveSession from "./pages/faculty/LiveSession";
import Records from "./pages/faculty/Records";
import Analytics from "./pages/faculty/Analytics";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import StudentManagement from "./pages/admin/Students";
import CourseManagement from "./pages/admin/Courses";
import Timetable from "./pages/admin/Timetable";
import Reports from "./pages/admin/Reports";
import ShortageAlerts from "./pages/admin/Alerts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
            <Route element={<AppLayout />}>
              {/* Student */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/scan" element={<QRScanner />} />
              <Route path="/student/simulator" element={<Simulator />} />
              <Route path="/student/leaves" element={<Leaves />} />
              <Route path="/student/permit" element={<ExamPermit />} />
              {/* Faculty */}
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/session/new" element={<CreateSession />} />
              <Route path="/faculty/session/:id" element={<LiveSession />} />
              <Route path="/faculty/records" element={<Records />} />
              <Route path="/faculty/analytics" element={<Analytics />} />
              {/* Admin */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentManagement />} />
              <Route path="/admin/courses" element={<CourseManagement />} />
              <Route path="/admin/timetable" element={<Timetable />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/alerts" element={<ShortageAlerts />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
