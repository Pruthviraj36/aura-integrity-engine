import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  iconClassName?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, iconClassName }: StatCardProps) {
  return (
    <Card className={cn("glass-card aura-glow border-none group hover:scale-[1.02] transition-all duration-500", className)}>
      <CardContent className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1.5 focus-within:z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{title}</p>
            <p className="text-3xl font-black tracking-tighter aura-text-glow">{value}</p>
            {subtitle && <p className="text-[10px] font-mono text-muted-foreground uppercase opacity-60">{subtitle}</p>}
            {trend && (
              <p className={cn("text-[10px] font-bold uppercase tracking-wider mt-2", trend.value >= 0 ? "text-emerald-500" : "text-destructive")}>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn("rounded-xl bg-primary/10 p-3 shadow-[0_0_20px_rgba(var(--primary),0.1)] group-hover:scale-110 transition-transform duration-500", iconClassName)}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
