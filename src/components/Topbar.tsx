import { useRouterState } from "@tanstack/react-router";
import { Bell, HelpCircle, ChevronDown, User, Sliders, LogOut, X, Sparkles, Crown, GraduationCap, Megaphone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const titles: Record<string, string> = {
  "/": "Home",
  "/learning": "Learning",
  "/prompts": "Role-Based Prompt Library",
  "/playground": "Prompt Playground",
  "/support": "Support Chat",
  "/premium": "Premium Access",
  "/settings": "Settings",
};

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

export function Topbar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const title = titles[pathname] ?? "AKUH Copilot Learning Portal";
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = NOTIFS.filter((n) => !readIds.has(n.id)).length;

  const grouped = (Object.keys(CAT_ICON) as NotifCategory[]).map((cat) => ({
    cat,
    items: NOTIFS.filter((n) => n.category === cat),
  }));

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[220px] h-14 bg-topbar border-b border-border z-10 flex items-center justify-between px-4 md:px-6">
      <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
      <div className="flex items-center gap-1">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
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
                      Stay informed about Microsoft 365 Copilot updates, AI learning resources, Premium features, and AI CoE announcements.
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="h-7 w-7 flex-shrink-0 rounded-md hover:bg-muted flex items-center justify-center"
                    aria-label="Close"
                  >
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
                              <button
                                onClick={(e) => { e.stopPropagation(); toast(n.title); }}
                                className="mt-2 text-xs font-medium text-primary hover:underline"
                              >
                                Read More →
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-border flex items-center justify-between gap-2">
                <button
                  onClick={() => setReadIds(new Set(NOTIFS.map((n) => n.id)))}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Mark All as Read
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toast("Opening full updates feed…")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View All Updates
                  </button>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => toast("Need help? Try the Support Chat")}
          className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-md hover:bg-muted transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
              AS
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          {open && (
            <div className="absolute right-0 top-11 w-56 rounded-md border border-border bg-popover shadow-lg py-1 text-sm z-50">
              <div className="px-3 py-2 border-b border-border">
                <div className="font-medium">Aisha Siddiqui</div>
                <div className="text-xs text-muted-foreground">aisha.s@aku.edu</div>
              </div>
              <button
                onClick={() => { toast("Profile"); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4" /> My Profile
              </button>
              <button
                onClick={() => { toast("Preferences"); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors"
              >
                <Sliders className="h-4 w-4" /> Preferences
              </button>
              <button
                onClick={() => { toast("Signed out"); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors text-destructive"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
