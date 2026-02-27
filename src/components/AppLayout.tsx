import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10 px-4">
            <SidebarTrigger className="mr-3" />
            <div className="h-4 w-px bg-border/50 mr-3" />
            <span className="text-xs text-muted-foreground">Aura-Attendance Pro</span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
