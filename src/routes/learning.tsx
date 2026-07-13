import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Play,
  Sparkles,
  Bot,
  Zap,
  Brain,
  Workflow,
  Mail,
  FileText,
  Presentation,
  Sheet,
  MessageSquare,
  Rocket,
  Crown,
} from "lucide-react";

export const Route = createFileRoute("/learning")({
  component: Learning,
});

type Video = { id: string; title: string; duration: string; desc: string };
type Feature = { title: string; desc: string; icon: React.ComponentType<{ className?: string }> };
type App = { id: string; title: string; icon: React.ComponentType<{ className?: string }>; color: string; desc: string };

const basicVideos: Video[] = [
  { id: "b1", title: "What is Copilot?", duration: "3:20", desc: "Understand what Microsoft Copilot does and where it lives." },
  { id: "b2", title: "Getting Started with the Learning Portal", duration: "4:12", desc: "A quick tour of the portal." },
  { id: "b3", title: "Writing Effective Prompts", duration: "5:44", desc: "Craft prompts that give you great answers." },
  { id: "b4", title: "Understanding Access Tiers", duration: "2:58", desc: "Learn about Tier 1, 2, and 3 access." },
  { id: "b5", title: "Using the Role-Based Prompt Library", duration: "3:47", desc: "Find prompts tailored to your role." },
];

const premiumVideos: Video[] = [
  { id: "p1", title: "Copilot in Word — Deep Dive", duration: "6:10", desc: "Drafting, rewriting, and summarizing inside Word." },
  { id: "p2", title: "Data Analysis with Copilot in Excel", duration: "7:28", desc: "Natural-language formulas, trends, and insights." },
  { id: "p3", title: "Building Presentations in PowerPoint", duration: "5:32", desc: "Generate slides from an outline or prompt." },
  { id: "p4", title: "Advanced Outlook Workflows", duration: "4:55", desc: "Meeting prep, inbox triage, and context-aware replies." },
  { id: "p5", title: "Building Custom AI Agents", duration: "8:12", desc: "Automate multi-step workflows across Microsoft 365." },
];

const basicFeatures: Feature[] = [
  { title: "Outlook Assistance", desc: "Draft emails and summarize threads via Copilot Chat.", icon: Mail },
  { title: "Copilot Chat", desc: "Ask questions, brainstorm, and generate content on the web.", icon: MessageSquare },
  { title: "Quick Productivity", desc: "Everyday help with writing, summarizing, and ideation.", icon: Rocket },
  { title: "Prompt Coaching", desc: "Improve your prompts with structured guidance.", icon: Sparkles },
];

const premiumFeatures: Feature[] = [
  { title: "Advanced Data Analysis", desc: "Analyze large datasets with natural language.", icon: Brain },
  { title: "Custom AI Agents", desc: "Build agents tailored to your workflow.", icon: Bot },
  { title: "Priority Processing", desc: "Faster responses even under heavy load.", icon: Zap },
  { title: "Extended Context & Memory", desc: "Longer conversations with persistent memory.", icon: Sparkles },
  { title: "Multi-Step Workflow Automation", desc: "Automate approvals and cross-app tasks.", icon: Workflow },
];

const basicApps: App[] = [
  { id: "outlook-b", title: "Copilot for Outlook", icon: Mail, color: "text-blue-600", desc: "Summarize threads and draft replies from Copilot Chat." },
];

const premiumApps: App[] = [
  { id: "outlook", title: "Copilot for Outlook", icon: Mail, color: "text-blue-600", desc: "In-app AI for triage, meeting prep, and context-aware replies." },
  { id: "word", title: "Copilot for Word", icon: FileText, color: "text-blue-700", desc: "Draft, rewrite, and summarize documents directly in Word." },
  { id: "ppt", title: "Copilot for PowerPoint", icon: Presentation, color: "text-orange-600", desc: "Generate slides and improve decks inside PowerPoint." },
  { id: "excel", title: "Copilot for Excel", icon: Sheet, color: "text-green-600", desc: "Analyze data and build formulas with natural language." },
];

function Learning() {
  const [tab, setTab] = useState<"basic" | "premium">("basic");
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [openApp, setOpenApp] = useState<App | null>(null);

  if (openVideo) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setOpenVideo(null)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center text-white/70 text-sm">
            [ Video player placeholder — {openVideo.duration} ]
          </div>
          <div className="p-5">
            <h2 className="text-lg font-semibold">{openVideo.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{openVideo.desc}</p>
          </div>
        </div>
      </div>
    );
  }

  if (openApp) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setOpenApp(null)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="aspect-[21/9] bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <openApp.icon className={`h-20 w-20 ${openApp.color}`} />
          </div>
          <div className="p-5 space-y-3">
            <h2 className="text-lg font-semibold">{openApp.title}</h2>
            <p className="text-sm text-muted-foreground">{openApp.desc}</p>
            <div className="text-sm space-y-2">
              <p className="font-medium">Getting started</p>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                <li>Open the app on your AKU-managed device.</li>
                <li>Click the Copilot icon in the ribbon.</li>
                <li>Type your request in plain language.</li>
                <li>Review, refine, and apply the suggestion.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const videos = tab === "basic" ? basicVideos : premiumVideos;
  const feats = tab === "basic" ? basicFeatures : premiumFeatures;
  const apps = tab === "basic" ? basicApps : premiumApps;

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Learning</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
          Choose your Copilot tier to see tutorials, features, and app-wise guides.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-lg border border-border bg-card shadow-card">
          <button
            onClick={() => setTab("basic")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
              tab === "basic" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" /> Basic Copilot
          </button>
          <button
            onClick={() => setTab("premium")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
              tab === "premium" ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="h-4 w-4" /> Premium Copilot
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Video Tutorials</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setOpenVideo(v)}
              className="text-left group bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition"
            >
              <div className="relative aspect-video bg-gradient-to-br from-[oklch(0.88_0.04_255)] to-[oklch(0.78_0.06_255)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-11 w-11 rounded-full bg-white/95 flex items-center justify-center shadow group-hover:scale-110 transition">
                    <Play className="h-5 w-5 text-primary ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded">
                  {v.duration}
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium">{v.title}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          {tab === "basic" ? "Basic Copilot Features" : "Premium Copilot Features"}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feats.map((p) => (
            <div
              key={p.title}
              className={`relative overflow-hidden rounded-lg border border-border shadow-card p-5 hover:shadow-card-hover transition ${
                tab === "premium"
                  ? "bg-gradient-to-br from-amber-50 to-accent"
                  : "bg-gradient-to-br from-primary/10 to-accent"
              }`}
            >
              <div className={`h-10 w-10 rounded-md flex items-center justify-center text-white ${
                tab === "premium" ? "bg-amber-500" : "bg-primary"
              }`}>
                <p.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">App-Wise Guides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {apps.map((a) => (
            <button
              key={a.id}
              onClick={() => setOpenApp(a)}
              className="text-left bg-card border border-border rounded-lg shadow-card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition"
            >
              <a.icon className={`h-8 w-8 ${a.color}`} />
              <div className="mt-3 text-sm font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
