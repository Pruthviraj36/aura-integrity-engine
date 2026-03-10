import {
  GraduationCap,
  ScanLine,
  Calculator,
  FileText,
  Ticket,
  LayoutDashboard,
  Plus,
  ClipboardList,
  BarChart3,
  ArrowLeftRight,
  Users,
  BookOpen,
  Calendar,
  FileBarChart,
  AlertTriangle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { Role } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import React from "react";

const studentMenu = [
  {
    title: "Performance Hub",
    url: "/student/dashboard",
    icon: LayoutDashboard,
  },
  { title: "Academic Schedule", url: "/student/timetable", icon: Calendar },
  {
    title: "Biometric Verification",
    url: "/student/scan",
    icon: ScanLine,
  },
  { title: "Leave Management", url: "/student/leaves", icon: FileText },
  { title: "Exam Permit", url: "/student/permit", icon: Ticket },
];

const facultyMenu = [
  {
    title: "Executive Dashboard",
    url: "/faculty/dashboard",
    icon: LayoutDashboard,
  },
  { title: "Active Session", url: "/faculty/session/new", icon: Plus },
  { title: "Biometric Registry", url: "/faculty/records", icon: ClipboardList },
  { title: "Lecture Schedule", url: "/faculty/timetable", icon: Calendar },
  {
    title: "Institutional Analytics",
    url: "/faculty/analytics",
    icon: BarChart3,
  },
];

const adminMenu = [
  { title: "Command Center", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Faculty Registry", url: "/admin/faculty", icon: Shield },
  { title: "Student Database", url: "/admin/students", icon: Users },
  { title: "Curriculum Matrix", url: "/admin/courses", icon: BookOpen },
  { title: "Institutional Timetable", url: "/admin/timetable", icon: Calendar },
  { title: "Leave Approvals", url: "/admin/leaves", icon: FileText },
  { title: "Audit Reports", url: "/admin/reports", icon: FileBarChart },
  { title: "Risk Compliance", url: "/admin/alerts", icon: AlertTriangle },
];

const roleConfig: Record<
  Role,
  { label: string; menu: typeof studentMenu; icon: React.ElementType }
> = {
  student: { label: "Student", menu: studentMenu, icon: GraduationCap },
  faculty: { label: "Faculty", menu: facultyMenu, icon: BookOpen },
  admin: { label: "Admin / HOD", menu: adminMenu, icon: Settings },
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const role = user?.role || "student";
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const config = roleConfig[role];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/30 glass-panel shadow-2xl"
    >
      <SidebarHeader className="p-4 pb-2">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <Shield className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tighter text-foreground uppercase leading-none">
                <span className="text-primary">Aura</span> Integrity
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-mono mt-0.5">
                v1.0 Standard
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-3 h-9 w-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-sm">
            A
          </div>
        )}
        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-primary/8 border border-primary/15 mb-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <config.icon className="h-3 w-3" /> {config.label} Portal
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] uppercase tracking-widest text-muted-foreground/50 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.menu.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 transition-all duration-150 text-sm font-medium"
                      activeClassName="bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/30">
        {!collapsed && user ? (
          <div className="rounded-xl bg-muted/40 dark:bg-white/[0.03] border border-border/50 p-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-black text-primary border border-primary/20 flex-shrink-0">
                {(user.profile?.fullName || user.username)
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">
                  {user.profile?.fullName || user.username}
                </p>
                <p className="text-[10px] text-muted-foreground/70 truncate font-mono">
                  {user.profile?.department ||
                    (role === "admin" ? "Administration" : "Unassigned")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                onClick={() => logout()}
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 mx-auto text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            onClick={() => logout()}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
