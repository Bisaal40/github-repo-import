import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Copy, RotateCw, ExternalLink, CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/playground")({
  component: Playground,
});

type Evaluation = {
  score: number;
  reasons: string[];
  improved: string;
};

function evaluatePrompt(prompt: string): Evaluation {
  const p = prompt.trim();
  const words = p.split(/\s+/).filter(Boolean).length;
  let score = 20;
  const reasons: string[] = [];

  if (words >= 12) score += 15; else reasons.push("Add more context — your prompt is quite short.");
  if (words >= 25) score += 10;
  if (/audience|staff|team|nurses|doctors|manager|patient|student/i.test(p)) score += 12;
  else reasons.push("Specify the audience (e.g. nursing staff, department heads).");
  if (/email|report|summary|list|table|draft|plan|slide|memo/i.test(p)) score += 12;
  else reasons.push("Define the expected output (email, report, table, slides, etc.).");
  if (/tone|formal|friendly|professional|concise|polite/i.test(p)) score += 10;
  else reasons.push("Mention the desired tone or writing style.");
  if (/by |before |deadline|within|next|friday|monday|week/i.test(p)) score += 8;
  else reasons.push("Include deadlines, constraints, or key details.");
  if (/\?|please|kindly|need to|should/i.test(p)) score += 5;
  if (p.length > 180) score += 8;

  score = Math.max(10, Math.min(100, score));

  const improved =
    `Draft a ${/(formal|professional)/i.test(p) ? "professional" : "clear and professional"} ${
      /email/i.test(p) ? "email" : "message"
    } to ${/nurs/i.test(p) ? "all nursing staff at AKUH" : "the relevant AKUH team"} regarding: "${p}". ` +
    `Use a polite, concise tone suitable for internal hospital communication. ` +
    `Include: (1) a clear subject line, (2) the purpose and context, (3) specific action items with a deadline, ` +
    `(4) links or references where relevant, and (5) a closing with contact details. ` +
    `Keep it under 200 words and format it so it can be sent directly from Outlook.`;

  return { score, reasons: reasons.slice(0, 5), improved };
}

function Playground() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Evaluation | null>(null);

  const evaluate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to evaluate.");
      return;
    }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(evaluatePrompt(prompt));
      setLoading(false);
    }, 1200);
  };

  const copy = (text: string, label = "Copied to clipboard") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const openInCopilot = () => {
    window.open("https://copilot.microsoft.com/", "_blank");
    toast("Opening Microsoft 365 Copilot…");
  };

  const reset = () => {
    setResult(null);
    setPrompt("");
  };

  const excellent = result && result.score >= 80;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Prompt Playground</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Improve your prompts before using Microsoft 365 Copilot. Receive AI-powered feedback,
          a quality score, and an improved version of your prompt.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg shadow-card p-5">
            <label className="text-sm font-medium">Your prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              placeholder="Example: Draft a professional email reminding nursing staff to complete annual infection control training by Friday."
              className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {prompt.trim().split(/\s+/).filter(Boolean).length} words
              </div>
              <button
                onClick={evaluate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Analyzing…" : "Evaluate Prompt"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="bg-card border border-border rounded-lg shadow-card p-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              <div className="mt-3 text-sm font-medium">AI is analyzing your prompt…</div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg shadow-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Prompt Quality Score
                    </div>
                    <div className="mt-1 text-3xl font-semibold">
                      {result.score}
                      <span className="text-base text-muted-foreground"> / 100</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    excellent
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {excellent ? "Excellent Prompt" : "Needs Improvement"}
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all ${excellent ? "bg-green-500" : "bg-amber-500"}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {excellent ? (
                <div className="bg-card border border-border rounded-lg shadow-card p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Your prompt is ready to use</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        It's clear, specific, and ready to use in Microsoft 365 Copilot.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => copy(prompt, "Prompt copied")} className="btn-secondary">
                      <Copy className="h-4 w-4" /> Copy Prompt
                    </button>
                    <button onClick={openInCopilot} className="btn-primary">
                      <ExternalLink className="h-4 w-4" /> Open in Microsoft 365 Copilot
                    </button>
                    <button onClick={reset} className="btn-secondary">
                      <RotateCw className="h-4 w-4" /> Evaluate Another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-card border border-border rounded-lg shadow-card p-5">
                    <div className="text-sm font-semibold mb-2">Why your prompt needs improvement</div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                      {result.reasons.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>

                  <div className="bg-accent/50 border border-primary/30 rounded-lg shadow-card p-5">
                    <div className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">
                      Improved Prompt
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.improved}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => copy(result.improved, "Improved prompt copied")} className="btn-primary">
                        <Copy className="h-4 w-4" /> Copy Improved Prompt
                      </button>
                      <button onClick={() => { setPrompt(result.improved); evaluate(); }} className="btn-secondary">
                        <RotateCw className="h-4 w-4" /> Re-evaluate
                      </button>
                      <button onClick={openInCopilot} className="btn-secondary">
                        <ExternalLink className="h-4 w-4" /> Open in Microsoft 365 Copilot
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <aside>
          <div className="bg-card border border-border rounded-lg shadow-card p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-primary" />
              <div className="text-sm font-semibold">Tips for Better Prompts</div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Be specific.",
                "Provide context.",
                "Mention the audience.",
                "Define the desired output.",
                "Specify tone and writing style.",
                "Include deadlines or constraints where applicable.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <style>{`
        .btn-primary { display:inline-flex; align-items:center; gap:.5rem; background:var(--primary); color:var(--primary-foreground); padding:.5rem .875rem; border-radius:.375rem; font-size:.875rem; font-weight:500; transition:background .15s; }
        .btn-primary:hover { background:var(--primary-hover); }
        .btn-secondary { display:inline-flex; align-items:center; gap:.5rem; background:var(--secondary); color:var(--secondary-foreground); padding:.5rem .875rem; border-radius:.375rem; font-size:.875rem; font-weight:500; border:1px solid var(--border); transition:background .15s; }
        .btn-secondary:hover { background:var(--muted); }
      `}</style>
    </div>
  );
}
