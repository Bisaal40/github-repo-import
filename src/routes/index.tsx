import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Play,
  Search,
  X,
  Check,
  AlertTriangle,
  Sparkles,
  Crown,
  ArrowRight,
} from "lucide-react";
import { FAQ } from "../components/FAQ";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [dot, setDot] = useState(0);

  return (
    <div>
      {/* Microsoft-style hero */}
      <section className="bg-gradient-to-b from-[oklch(0.96_0.02_255)] via-[oklch(0.97_0.015_255)] to-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Tier 1 Basic Access · Available to all AKU staff
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              Learn, prompt, and build with AI at AKUH
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Your single home for Microsoft 365 Copilot training, role-based prompts, and expert support from the AI Centre of Excellence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/learning"
                className="inline-flex items-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition"
              >
                Start Learning
              </Link>
              <Link
                to="/premium"
                className="inline-flex items-center rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                Request Premium Access
              </Link>
            </div>
            <div className="mt-8 flex justify-start gap-1.5">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setDot(i)}
                  className={`h-1.5 rounded-full transition-all ${dot === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30 hover:bg-foreground/50"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.55_0.18_260)] to-[oklch(0.42_0.2_270)] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 grid place-items-center p-8">
                <HeroIllustration />
              </div>
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 space-y-16">
        {/* Smart Search */}
        <SmartSearch query={query} setQuery={setQuery} />

        {/* Microsoft Copilot 365 — intro + featured video */}
        <section>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Microsoft Copilot 365
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              A copilot is a conversational, AI-powered assistant that helps boost productivity and streamline workflows by offering contextual assistance, automating routine tasks, and analyzing data.
            </p>
          </div>

          <button
            onClick={() => setVideoOpen(true)}
            className="mt-10 group w-full text-left bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition"
          >
            <div className="relative aspect-[21/9] bg-gradient-to-br from-[oklch(0.85_0.05_255)] to-[oklch(0.75_0.08_255)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play className="h-7 w-7 text-primary ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 rounded bg-black/70 text-white text-xs px-2 py-0.5">
                4:32
              </div>
            </div>
            <div className="p-5">
              <div className="font-medium text-base">What is the Learning Portal?</div>
              <div className="text-sm text-muted-foreground mt-1">
                A 5-minute tour of the portal and how to use it.
              </div>
            </div>
          </button>
        </section>

        {/* Plans */}
        <section>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Microsoft 365 Copilot Plans
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Compare the Basic Copilot experience available to all AKU staff with the Microsoft 365 Copilot Premium plan for embedded, in-app AI.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <PlanCard
              title="Basic Copilot"
              badge="Included for All Staff"
              badgeClass="bg-primary/10 text-primary border-primary/20"
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              rows={BASIC_ROWS}
              suitable="Employees who need AI assistance for everyday productivity without requiring embedded AI inside Microsoft 365 applications."
            />
            <PlanCard
              title="Microsoft 365 Copilot Premium"
              badge="Premium License Required"
              badgeClass="bg-amber-100 text-amber-800 border-amber-300"
              icon={<Crown className="h-5 w-5 text-amber-600" />}
              rows={PREMIUM_ROWS}
              suitable="Employees who regularly work with Microsoft 365 applications and require embedded AI assistance throughout their daily workflow."
              accent="premium"
            />
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/learning"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-3 text-sm font-medium hover:bg-foreground/90 transition"
            >
              Explore More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg overflow-hidden max-w-3xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <div className="text-sm font-medium">What is the Learning Portal?</div>
              <button
                onClick={() => setVideoOpen(false)}
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center text-white/70 text-sm">
              [ Video player placeholder ]
            </div>
          </div>
        </div>
      )}

      <FAQ />
    </div>
  );
}

type RoutePath = "/" | "/learning" | "/prompts" | "/playground" | "/premium" | "/support" | "/profile";
type SearchItem = { title: string; desc: string; to: RoutePath; hash?: string; type: string };

const SEARCH_INDEX: SearchItem[] = [
  // Videos
  { type: "Video", title: "What is Microsoft Copilot?", desc: "Intro overview video", to: "/learning" },
  { type: "Video", title: "Writing Effective Prompts", desc: "Prompt basics tutorial", to: "/learning" },
  { type: "Video", title: "Copilot in Outlook", desc: "Video walkthrough", to: "/learning" },
  { type: "Video", title: "Data Analysis with Copilot in Excel", desc: "Video walkthrough", to: "/learning" },
  { type: "Video", title: "Building Presentations in PowerPoint", desc: "Video walkthrough", to: "/learning" },

  // Guides
  { type: "Guide", title: "Copilot for Outlook", desc: "App-wise guide", to: "/learning" },
  { type: "Guide", title: "Copilot for Excel", desc: "App-wise guide", to: "/learning" },
  { type: "Guide", title: "Copilot for Word", desc: "App-wise guide", to: "/learning" },
  { type: "Guide", title: "Copilot for PowerPoint", desc: "App-wise guide", to: "/learning" },

  // Prompts
  { type: "Prompt", title: "HR Email Prompt", desc: "Draft internal HR emails", to: "/prompts" },
  { type: "Prompt", title: "Finance Report Prompt", desc: "Summarize monthly reports", to: "/prompts" },
  { type: "Prompt", title: "Nursing Handover Prompt", desc: "Structured shift handover", to: "/prompts" },
  { type: "Prompt", title: "ICT Incident Triage", desc: "Summarize a support ticket", to: "/prompts" },
  { type: "Prompt", title: "Open Prompt Playground", desc: "AI Prompt Coach with scoring", to: "/playground" },

  // FAQs — mirror content in FAQ.tsx
  { type: "FAQ", title: "What is Microsoft 365 Copilot?", desc: "An AI assistant integrated across Microsoft 365 apps.", to: "/", hash: "faq" },
  { type: "FAQ", title: "Who can access Copilot at AKU?", desc: "All AKU staff have Tier 1 Basic Access.", to: "/", hash: "faq" },
  { type: "FAQ", title: "How do I request Premium access?", desc: "Submit the Premium Access form for review.", to: "/", hash: "faq" },
  { type: "FAQ", title: "What is the Prompt Library?", desc: "Curated prompts by AKU role and department.", to: "/", hash: "faq" },
  { type: "FAQ", title: "How do I contact the AI CoE?", desc: "Email ai.coe@aku.edu or use the AI chat.", to: "/", hash: "faq" },
  { type: "FAQ", title: "Is my data secure?", desc: "AKU respects Microsoft 365 permissions; data is not used to train models.", to: "/", hash: "faq" },
  { type: "FAQ", title: "Which Microsoft apps support Copilot?", desc: "Word, Excel, PowerPoint, Outlook, Teams, and more.", to: "/", hash: "faq" },
  { type: "FAQ", title: "Where can I learn prompt writing?", desc: "Visit Learning and try the Prompt Playground.", to: "/", hash: "faq" },

  // Policies
  { type: "Policy", title: "Responsible AI Guidelines", desc: "AKUH AI policy", to: "/learning" },
  { type: "Policy", title: "Approved AI Tools", desc: "List of approved tools", to: "/learning" },
  { type: "Policy", title: "Data Privacy & Copilot", desc: "How your data is handled", to: "/learning" },

  // Premium
  { type: "Premium Feature", title: "Custom AI Agents", desc: "Premium capability", to: "/premium" },
  { type: "Premium Feature", title: "Advanced Workflows", desc: "Premium capability", to: "/premium" },
  { type: "Premium Feature", title: "Priority Access", desc: "Faster responses during peak hours", to: "/premium" },

  // Support
  { type: "Support", title: "Ask a Support Question", desc: "Chat with support", to: "/support" },
  { type: "Support", title: "Ask an AI Buddy", desc: "Human AI Buddy match", to: "/support" },

  // Profile
  { type: "Profile", title: "My Certificates", desc: "View earned certificates", to: "/profile" },
  { type: "Profile", title: "My Courses", desc: "Track enrolled courses", to: "/profile" },
];

const TYPE_STYLES: Record<string, string> = {
  Video: "bg-blue-50 text-blue-700 border-blue-200",
  Guide: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Prompt: "bg-purple-50 text-purple-700 border-purple-200",
  FAQ: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Policy: "bg-slate-100 text-slate-700 border-slate-200",
  "Premium Feature": "bg-amber-50 text-amber-800 border-amber-200",
  Support: "bg-rose-50 text-rose-700 border-rose-200",
  Profile: "bg-primary/10 text-primary border-primary/20",
};

function SmartSearch({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const q = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    if (!q) return [] as { type: string; items: SearchItem[] }[];
    const results = SEARCH_INDEX.filter(
      (i) => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)
    );
    const byType = new Map<string, SearchItem[]>();
    for (const r of results) {
      const arr = byType.get(r.type) ?? [];
      arr.push(r);
      byType.set(r.type, arr);
    }
    return Array.from(byType.entries()).map(([type, items]) => ({ type, items }));
  }, [q]);

  const showDropdown = focused && q.length > 0;
  const totalCount = grouped.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="relative max-w-3xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Search videos, guides, prompts, FAQs, policies..."
        className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-card shadow-card text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
      />
      {showDropdown && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-card-hover max-h-[440px] overflow-y-auto">
          {totalCount === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">No results for "{query}"</div>
          ) : (
            <>
              <div className="px-3 pt-3 pb-1 text-[11px] text-muted-foreground">
                {totalCount} result{totalCount === 1 ? "" : "s"}
              </div>
              {grouped.map(({ type, items }) => (
                <div key={type} className="p-2">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{type}s</div>
                  {items.map((it) => (
                    <Link
                      key={`${type}-${it.title}`}
                      to={it.to}
                      hash={it.hash}
                      className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <span className={`shrink-0 mt-0.5 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${TYPE_STYLES[type] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {type}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{it.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{it.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full max-w-[320px] h-auto">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="30" y="30" width="260" height="140" rx="12" fill="url(#g)" stroke="rgba(255,255,255,0.3)" />
      <rect x="46" y="46" width="90" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
      <rect x="46" y="62" width="60" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <rect x="46" y="88" width="228" height="60" rx="8" fill="rgba(255,255,255,0.15)" />
      <circle cx="240" cy="60" r="18" fill="rgba(255,255,255,0.9)" />
      <path d="M234 60 l5 4 l8 -8" stroke="oklch(0.52 0.16 255)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type PlanRow = { ok: "yes" | "warn"; title: string; desc: string };

const BASIC_ROWS: PlanRow[] = [
  { ok: "yes", title: "Outlook Assistance", desc: "Draft emails, summarize conversations, and manage your inbox." },
  { ok: "yes", title: "Copilot Chat", desc: "Ask questions, brainstorm, summarize text, and generate content in the standalone Copilot Chat experience." },
  { ok: "yes", title: "Quick Productivity", desc: "Ideal for everyday questions, email writing, and general AI assistance." },
  { ok: "warn", title: "Word, Excel & PowerPoint", desc: "No in-app Copilot experience. You can still copy content into Copilot Chat for assistance." },
];

const PREMIUM_ROWS: PlanRow[] = [
  { ok: "yes", title: "Word", desc: "Draft, rewrite, summarize, and improve documents directly within Word." },
  { ok: "yes", title: "Excel", desc: "Analyze data, explain formulas, identify trends, and generate insights inside Excel." },
  { ok: "yes", title: "PowerPoint", desc: "Create presentations, generate slides, and improve decks inside PowerPoint." },
  { ok: "yes", title: "Outlook", desc: "Advanced email assistance using your inbox, calendar, meetings, and organizational context." },
  { ok: "yes", title: "Teams & OneNote", desc: "AI assistance available inside meetings, notes, and collaboration workflows." },
  { ok: "yes", title: "Priority Access", desc: "Faster responses and enhanced performance during peak usage." },
];

function PlanCard({
  title, badge, badgeClass, icon, rows, suitable, accent,
}: {
  title: string;
  badge: string;
  badgeClass: string;
  icon: React.ReactNode;
  rows: PlanRow[];
  suitable: string;
  accent?: "premium";
}) {
  return (
    <div
      className={`bg-card border rounded-2xl shadow-card hover:shadow-card-hover transition p-6 md:p-7 flex flex-col ${
        accent === "premium" ? "border-amber-300/60" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">{icon}</div>
          <div className="text-lg font-semibold">{title}</div>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${badgeClass}`}>
          {badge}
        </span>
      </div>

      <ul className="mt-6 space-y-3.5 flex-1">
        {rows.map((r) => (
          <li key={r.title} className="flex items-start gap-3">
            <span
              className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                r.ok === "yes" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {r.ok === "yes" ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            </span>
            <div>
              <div className="text-sm font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-5 border-t border-border">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Suitable For</div>
        <p className="text-xs text-muted-foreground leading-relaxed">{suitable}</p>
      </div>
    </div>
  );
}
