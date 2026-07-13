import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, BookOpenCheck, Award, UserCircle2, Compass, Sparkles, Menu, X, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { usePortal, selectStats } from "@/lib/portal-store";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Courses", to: "/courses", icon: Compass },
  { label: "Enrolled Courses", to: "/enrolled", icon: BookOpenCheck },
  { label: "My Certificates", to: "/certificates", icon: Award },
  { label: "Profile Settings", to: "/profile", icon: UserCircle2 },
] as const;

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const state = usePortal();
  const stats = selectStats(state);

  return (
    <div className="flex flex-col h-full bg-plum-mesh text-white">
      <div className="px-5 pt-6 pb-4">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-amber-glow text-plum-ink grid place-items-center shadow-glow-amber group-hover:scale-105 transition">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-lg leading-none">AKUH Copilot</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">Learning Portal</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 pt-2 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "text-plum-ink bg-gradient-to-r from-amber-glow to-[oklch(0.86_0.14_60)] shadow-glow-amber"
                  : "text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform ${
                  active ? "scale-110" : "group-hover:scale-110 group-hover:rotate-[-3deg]"
                }`}
              />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-plum-ink" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4 space-y-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Your progress</div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <MiniStat value={stats.enrolledCount} label="Enrolled" />
            <MiniStat value={stats.inProgressCount} label="Ongoing" />
            <MiniStat value={stats.completedCount} label="Done" />
          </div>
        </div>

        {state.premium.status !== "approved" && (
          <Link
            to="/premium"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-glow/20 to-transparent border border-amber-glow/30 p-3 hover:from-amber-glow/30 transition"
          >
            <div className="h-9 w-9 rounded-lg bg-amber-glow text-plum-ink grid place-items-center shrink-0">
              <Crown className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white">Unlock Premium</div>
              <div className="text-[11px] text-white/60 truncate">M365 Copilot everywhere</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-amber-glow leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">{label}</div>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed left-3 top-[72px] z-30 h-10 w-10 grid place-items-center rounded-full bg-plum-ink text-white shadow-glow-plum"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Desktop */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-[260px] z-20">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-10 top-3 h-8 w-8 grid place-items-center rounded-full bg-white text-plum-ink"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
