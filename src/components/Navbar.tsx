import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, HelpCircle, ChevronDown, User, Sliders, LogOut, X,
  Sparkles, Crown, GraduationCap, Megaphone, Search, Menu, Shield, LogIn,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { logout, useCurrentUser } from "@/lib/auth";

type NavRoute = "/" | "/learning" | "/prompts" | "/premium" | "/about" | "/admin";
const NAV: { label: string; to: NavRoute }[] = [
  { label: "Home", to: "/" },
  { label: "Learning", to: "/learning" },
  { label: "Prompt Library", to: "/prompts" },
  { label: "Premium Access", to: "/premium" },
  { label: "About", to: "/about" },
];

type NotifCategory = "Microsoft Copilot Updates" | "Premium Features" | "Learning Resources" | "AI CoE Announcements";
type Notif = { id: string; category: NotifCategory; title: string; desc: string; date: string };

const NOTIFS: Notif[] = [
  { id: "1", category: "Microsoft Copilot Updates", title: "New Microsoft 365 Copilot capabilities", desc: "Improved reasoning and faster responses across Word, Excel, and Outlook.", date: "2 days ago" },
  { id: "2", category: "Microsoft Copilot Updates", title: "Performance enhancements", desc: "Reduced latency during peak usage hours.", date: "5 days ago" },
  { id: "3", category: "Premium Features", title: "New Custom AI Agents", desc: "Build department-specific agents for repetitive workflows.", date: "1 week ago" },
  { id: "4", category: "Premium Features", title: "Extended Context Window", desc: "Analyze larger documents and longer conversations.", date: "1 week ago" },
  { id: "5", category: "Learning Resources", title: "New Outlook Guide Added", desc: "A step-by-step guide for using Copilot in Outlook.", date: "Today" },
  { id: "6", category: "Learning Resources", title: "New Prompt Pack Released", desc: "HR, Finance, ICT, and Nursing prompt templates now available.", date: "Yesterday" },
  { id: "7", category: "AI CoE Announcements", title: "Upcoming Copilot Workshop", desc: "Register for the next hands-on training session.", date: "Next Tuesday" },
  { id: "8", category: "AI CoE Announcements", title: "New Responsible AI Guidelines", desc: "Updated principles for safe and effective AI use at AKU.", date: "This week" },
];

const CAT_ICON: Record<NotifCategory, React.ComponentType<{ className?: string }>> = {
  "Microsoft Copilot Updates": Sparkles,
  "Premium Features": Crown,
  "Learning Resources": GraduationCap,
  "AI CoE Announcements": Megaphone,
};

export function Navbar() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = NOTIFS.filter((n) => !readIds.has(n.id)).length;
  const grouped = (Object.keys(CAT_ICON) as NotifCategory[]).map((cat) => ({
    cat, items: NOTIFS.filter((n) => n.category === cat),
  }));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-[1400px] mx-auto h-16 px-4 md:px-8 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center shadow-sm group-hover:scale-105 transition">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-foreground">Learning Portal</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                } group`}
              >
                {item.label}
                <span className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-primary transition-transform origin-left ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1 ml-auto lg:ml-0">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted text-muted-foreground transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-11 w-[min(360px,calc(100vw-2rem))] bg-popover border border-border rounded-xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search videos, guides, prompts..."
                    className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 px-1">Tip: try "Outlook", "Premium", or "prompt".</p>
              </div>
            )}
          </div>

          {/* Notifications (unchanged behaviour) */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-muted text-muted-foreground transition"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-11 w-[min(400px,calc(100vw-2rem))] max-h-[75vh] bg-popover border border-border rounded-xl shadow-2xl flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">AI News & Updates</div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Copilot updates, learning resources, Premium features, and AI CoE announcements.
                      </p>
                    </div>
                    <button onClick={() => setNotifOpen(false)} className="h-7 w-7 rounded-md hover:bg-muted grid place-items-center" aria-label="Close">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {grouped.map(({ cat, items }) => {
                    const Icon = CAT_ICON[cat];
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 px-1 mb-2">
                          <Icon className="h-3.5 w-3.5 text-primary" />
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{cat}</div>
                        </div>
                        <div className="space-y-2">
                          {items.map((n) => {
                            const isUnread = !readIds.has(n.id);
                            return (
                              <div
                                key={n.id}
                                className="p-3 rounded-lg border border-border hover:shadow-card-hover hover:border-primary/40 transition cursor-pointer"
                                onClick={() => setReadIds((s) => new Set(s).add(n.id))}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {isUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
                                  <div className="text-sm font-medium">{n.title}</div>
                                  <span className="text-[11px] text-muted-foreground ml-auto whitespace-nowrap">{n.date}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{n.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-border flex items-center justify-between gap-2">
                  <button onClick={() => setReadIds(new Set(NOTIFS.map((n) => n.id)))} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                    Mark All as Read
                  </button>
                  <button onClick={() => setNotifOpen(false)} className="text-xs font-medium text-primary hover:underline">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button
            onClick={() => toast("Need help? Try the AI chat at the bottom-right.")}
            className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted text-muted-foreground transition"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Profile / Sign in */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-md hover:bg-muted transition"
              >
                <div className={`h-7 w-7 rounded-full text-xs font-semibold grid place-items-center ${
                  isAdmin ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
                }`}>
                  {currentUser.initials}
                </div>
                {isAdmin && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    <Shield className="h-2.5 w-2.5" /> Admin
                  </span>
                )}
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 w-60 rounded-md border border-border bg-popover shadow-lg py-1 text-sm z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{currentUser.name}</div>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{currentUser.email}</div>
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors">
                      <Shield className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { toast("Preferences"); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors">
                    <Sliders className="h-4 w-4" /> Preferences
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      toast.success("Signed out");
                      navigate({ to: "/login" });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition"
            >
              <LogIn className="h-4 w-4" /> Sign In
            </Link>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-muted text-muted-foreground transition"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-2">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                  active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
