import { Link } from "@tanstack/react-router";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { OPEN_CHAT_EVENT } from "./FloatingChat";

const openChat = () => window.dispatchEvent(new Event(OPEN_CHAT_EVENT));

type LinkItem = { label: string; to?: "/" | "/learning" | "/prompts" | "/premium" | "/about"; action?: () => void };

const COLS: { title: string; items: LinkItem[] }[] = [
  {
    title: "Learning",
    items: [
      { label: "Video Tutorials", to: "/learning" },
      { label: "App Guides", to: "/learning" },
      { label: "Prompt Library", to: "/prompts" },
      { label: "Glossary", to: "/learning" },
      { label: "Quizzes", to: "/learning" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "AI Policies", to: "/learning" },
      { label: "Responsible AI", to: "/learning" },
      { label: "Approved Tools", to: "/learning" },
      { label: "FAQs", to: "/about" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "AI Buddy", action: openChat },
      { label: "Support Chat", action: openChat },
      { label: "Contact AI CoE", action: openChat },
      { label: "Premium Access", to: "/premium" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-[oklch(0.98_0.005_250)] border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + Contact */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[15px]">Learning Portal</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              A hub for Aga Khan University Hospital staff to explore AI tools, learn responsibly, and get support.
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /><a href="mailto:ai.coe@aku.edu" className="hover:text-foreground">ai.coe@aku.edu</a></div>
              <div className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /><span>+92-21-3486-4000</span></div>
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /><span>AI Centre of Excellence<br />Aga Khan University Hospital</span></div>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{c.title}</h4>
              <ul className="space-y-3">
                {c.items.map((it) =>
                  it.to ? (
                    <li key={it.label}>
                      <Link to={it.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {it.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={it.label}>
                      <button onClick={it.action} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                        {it.label}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© Aga Khan University Hospital · Learning Portal · All Rights Reserved</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
