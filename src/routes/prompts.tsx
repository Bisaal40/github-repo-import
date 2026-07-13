import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Play, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/prompts")({
  component: Prompts,
});

const departments = ["HR", "Finance", "Nursing", "ICT", "Administration", "Facilities"] as const;
type Dept = (typeof departments)[number];

const promptData: Record<Dept, { title: string; desc: string }[]> = {
  HR: [
    { title: "Draft a leave policy summary", desc: "Summarize AKUH leave policy for new staff." },
    { title: "Write a job description", desc: "Generate a JD for a nursing supervisor role." },
    { title: "Onboarding checklist", desc: "Create a 30/60/90-day onboarding plan." },
    { title: "Automate a multi-step approval workflow", desc: "Chain leave approval across managers." },
    { title: "Employee survey questions", desc: "Draft an engagement survey." },
  ],
  Finance: [
    { title: "Monthly variance report", desc: "Summarize budget vs actual variance." },
    { title: "Invoice reminder email", desc: "Draft a polite overdue payment reminder." },
    { title: "Expense categorization", desc: "Classify expenses from a CSV." },
    { title: "Cash flow forecast", desc: "Project next-quarter cash flow." },
    { title: "Audit prep checklist", desc: "Prepare for annual audit." },
  ],
  Nursing: [
    { title: "Shift handover summary", desc: "Summarize a patient handover note." },
    { title: "Patient education draft", desc: "Explain post-op care in simple language." },
    { title: "Compliance training summary", desc: "Summarize infection control guidelines." },
    { title: "Incident report draft", desc: "Draft a structured incident report." },
    { title: "Care plan template", desc: "Create a personalized care plan." },
  ],
  ICT: [
    { title: "Password reset instructions", desc: "Write user-friendly reset steps." },
    { title: "Incident triage summary", desc: "Summarize a ServiceNow ticket." },
    { title: "System downtime notice", desc: "Draft a professional downtime email." },
    { title: "Security awareness tip", desc: "Weekly cyber tip for staff." },
    { title: "SOP for onboarding devices", desc: "Steps to enroll a new laptop." },
  ],
  Administration: [
    { title: "Meeting minutes summary", desc: "Summarize a 60-minute meeting." },
    { title: "Vendor comparison table", desc: "Compare three vendor proposals." },
    { title: "Draft an internal memo", desc: "Announce a new policy." },
    { title: "Event planning checklist", desc: "Plan a hospital-wide event." },
    { title: "Weekly executive update", desc: "Draft a leadership update." },
  ],
  Facilities: [
    { title: "Maintenance request triage", desc: "Prioritize incoming tickets." },
    { title: "Vendor SLA summary", desc: "Summarize vendor SLA terms." },
    { title: "Safety inspection checklist", desc: "Prep monthly inspection." },
    { title: "Energy usage report", desc: "Summarize utility usage." },
    { title: "Space allocation proposal", desc: "Draft a room reallocation memo." },
  ],
};

type Step = "browse" | "redirecting" | "chat" | "checking";

function Prompts() {
  const [step, setStep] = useState<Step>("browse");
  const [dept, setDept] = useState<Dept | "">("");
  const [selected, setSelected] = useState<{ title: string; desc: string } | null>(null);
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {step === "browse" && (
        <div className="bg-card border border-border rounded-xl shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Prompt Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated prompts tailored to AKUH departments and roles.
          </p>

          <div className="mt-6 max-w-md">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Choose your department
            </label>
            <div className="relative mt-2">
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value as Dept)}
                className="w-full h-11 pl-4 pr-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer hover:border-primary/60 transition-colors"
              >
                <option value="" disabled>Select a department...</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {dept && (
            <div className="mt-8">
              <div className="text-sm font-medium mb-3">Prompts for {dept}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {promptData[dept].map((p) => (
                  <button
                    key={p.title}
                    onClick={() => {
                      setSelected(p);
                      setPrompt(p.title);
                      setStep("redirecting");
                      setTimeout(() => setStep("chat"), 1200);
                    }}
                    className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/40 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
                  >
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === "redirecting" && (
        <div className="bg-card border border-border rounded-lg shadow-card p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="mt-3 text-sm">
            Redirecting to Microsoft 365 Copilot Chat with your selected prompt...
          </p>
        </div>
      )}

      {step === "chat" && selected && (
        <div className="bg-card border border-border rounded-lg shadow-card">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
              M
            </div>
            <span className="text-sm font-medium">Microsoft 365 Copilot Chat</span>
          </div>
          <div className="p-5 space-y-3">
            <label className="text-xs text-muted-foreground">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setStep("checking");
                  setTimeout(() => {
                    if (selected.title === "Automate a multi-step approval workflow") {
                      toast("This prompt requires Premium Access.");
                      navigate({ to: "/premium", search: { premium: true } });
                    } else {
                      toast.success("You're all set!");
                      navigate({ to: "/" });
                    }
                  }, 1400);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                <Play className="h-4 w-4" /> Run
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "checking" && (
        <div className="bg-card border border-border rounded-lg shadow-card p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="mt-3 text-sm">Checking license requirements...</p>
        </div>
      )}
    </div>
  );
}
