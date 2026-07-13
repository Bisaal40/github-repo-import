import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Crown,
  Settings,
  LifeBuoy,
  Sparkles,
  Wand2,
} from "lucide-react";
import { OPEN_CHAT_EVENT } from "./FloatingChat";

type NavRoute = "/" | "/learning" | "/prompts" | "/playground" | "/premium" | "/settings";

type NavItem =
  | { title: string; icon: typeof Home; kind: "link"; url: NavRoute }
  | { title: string; icon: typeof Home; kind: "chat" };

const items: NavItem[] = [
  { title: "Home", url: "/", icon: Home, kind: "link" },
  { title: "Learning", url: "/learning", icon: GraduationCap, kind: "link" },
  { title: "Prompt Library", url: "/prompts", icon: BookOpen, kind: "link" },
  { title: "Prompt Playground", url: "/playground", icon: Wand2, kind: "link" },
  { title: "Support Chat", icon: MessageSquare, kind: "chat" },
  { title: "Premium Access", url: "/premium", icon: Crown, kind: "link" },
];

const pinned: NavItem[] = [
  { title: "Settings", url: "/settings", icon: Settings, kind: "link" },
  { title: "Help & Support", icon: LifeBuoy, kind: "chat" },
];

function openChat() {
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const renderItem = (it: NavItem) => {
    if (it.kind === "chat") {
      return (
        <button
          key={it.title}
          onClick={openChat}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-hover transition-colors text-left"
        >
          <it.icon className="h-4 w-4" />
          <span>{it.title}</span>
        </button>
      );
    }
    const active = pathname === it.url;
    return (
      <Link
        key={it.title}
        to={it.url}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          active
            ? "bg-sidebar-active text-accent-foreground font-medium"
            : "text-sidebar-foreground hover:bg-sidebar-hover"
        }`}
      >
        <it.icon className="h-4 w-4" />
        <span>{it.title}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] flex-col border-r border-sidebar-border bg-sidebar z-20">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="text-sm font-semibold leading-tight">
          AKUH Copilot
          <div className="text-[11px] font-normal text-muted-foreground">Learning Portal</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map(renderItem)}
      </nav>
      <div className="border-t border-sidebar-border py-3 px-2 space-y-0.5">
        {pinned.map(renderItem)}
      </div>
    </aside>
  );
}
