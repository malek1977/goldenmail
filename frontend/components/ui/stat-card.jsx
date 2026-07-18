import { TrendingUp, TrendingDown, FolderKanban, Users, DollarSign, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = { project: FolderKanban, users: Users, dollar: DollarSign, message: MessageSquare };
const COLOR_MAP = {
  gold: { bg: "from-gold-600/20 to-gold-600/5", text: "text-gold-300", ring: "ring-gold-600/30", icon: "text-gold-300" },
  success: { bg: "from-success/20 to-success/5", text: "text-success", ring: "ring-success/30", icon: "text-success" },
  info: { bg: "from-info/20 to-info/5", text: "text-info", ring: "ring-info/30", icon: "text-info" },
  warning: { bg: "from-warning/20 to-warning/5", text: "text-warning", ring: "ring-warning/30", icon: "text-warning" },
  danger: { bg: "from-danger/20 to-danger/5", text: "text-danger", ring: "ring-danger/30", icon: "text-danger" },
};

export function StatCard({ title, value, change = 0, changeLabel, icon = "project", color = "gold" }) {
  const Icon = ICON_MAP[icon] || FolderKanban;
  const c = COLOR_MAP[color];
  const positive = change >= 0;
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-ink-800/60 border border-white/5 hover:border-gold-600/30 transition-all duration-300 group card-hover">
      <div className={cn("absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br", c.bg)} />
      <div className="relative flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ring-1", c.bg, c.ring)}>
          <Icon className={cn("w-6 h-6", c.icon)} />
        </div>
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold", positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="relative">
        <h3 className="text-xs font-medium text-slate-400 mb-1.5">{title}</h3>
        <p className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">{value}</p>
        {changeLabel && <p className="text-[11px] text-slate-500 mt-2">{changeLabel}</p>}
      </div>
    </div>
  );
}