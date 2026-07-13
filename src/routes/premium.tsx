import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Crown, Circle, Clock } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ premium: z.boolean().optional() });

export const Route = createFileRoute("/premium")({
  validateSearch: searchSchema,
  component: Premium,
});

const DEPARTMENTS = [
  "Nursing", "ICT", "HR", "Finance", "Administration",
  "Facilities", "Medical Education", "Research", "Other",
];

const TIMELINE = [
  { key: "submitted", label: "Request Submitted" },
  { key: "review", label: "Under AI CoE Review" },
  { key: "manager", label: "Manager Approval" },
  { key: "license", label: "License Assignment" },
  { key: "active", label: "Premium Activated" },
] as const;

function Premium() {
  const { premium } = Route.useSearch();
  const [email, setEmail] = useState("aisha.siddiqui@aku.edu");
  const [department, setDepartment] = useState("Nursing");
  const [reason, setReason] = useState("");
  const [tier, setTier] = useState("Tier 2 — Team/Department Use Case");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Current status index for the tracker (0-based across TIMELINE)
  const currentStep = 0;

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
          <Crown className="h-3.5 w-3.5 text-primary" /> Premium Access
        </div>
        <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight">Request Premium Copilot</h1>
        <p className="mt-4 text-muted-foreground">
          Tell us how you plan to use Premium — the AI CoE will review your request and get back to you.
        </p>
      </div>

      {premium && (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm max-w-2xl mx-auto">
          This task requires Premium Access. We've started a request for you.
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                <h2 className="mt-4 text-xl font-semibold">Request received</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Your request has been received by the AI CoE team. Track its progress on the right.
                </p>
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="mt-6 inline-flex items-center px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition"
                >
                  Back to Portal Home
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Access request form</h2>
                <p className="text-xs text-muted-foreground mt-1">All fields are required.</p>
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="mt-6 space-y-5"
                >
                  <Field label="Email">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </Field>
                  <Field label="Department">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Reason for Request">
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={5}
                      required
                      placeholder="Describe how you plan to use Premium Copilot..."
                      className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </Field>
                  <Field label="Tier">
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Tier 2 — Team/Department Use Case</option>
                      <option>Tier 3 — Enterprise Agent Automation Need</option>
                    </select>
                  </Field>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition"
                  >
                    Submit Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Tracker */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 sticky top-24">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Application Status</h3>
            </div>

            <div className="mt-5 space-y-2">
              <MetaRow label="Current Status" value="Submitted" highlight />
              <MetaRow label="Submitted On" value="15 July 2026" />
              <MetaRow label="Request ID" value="AKU-PA-1045" mono />
              <MetaRow label="Requested Tier" value="Tier 2 — Department Use Case" />
            </div>

            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Timeline</div>
              <ol className="relative">
                {TIMELINE.map((step, i) => {
                  const done = i < currentStep;
                  const active = i === currentStep;
                  const last = i === TIMELINE.length - 1;
                  return (
                    <li key={step.key} className="relative pl-9 pb-6 last:pb-0">
                      {!last && (
                        <span
                          className={`absolute left-[13px] top-6 bottom-0 w-px ${
                            done ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}
                      <span
                        className={`absolute left-0 top-0 h-7 w-7 rounded-full grid place-items-center border-2 ${
                          done
                            ? "bg-primary border-primary text-primary-foreground"
                            : active
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                      </span>
                      <div className={`text-sm ${done || active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {step.label}
                      </div>
                      {active && (
                        <div className="text-[11px] text-primary mt-0.5">In progress</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function MetaRow({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${mono ? "font-mono text-xs" : ""} ${highlight ? "text-primary font-semibold" : "text-foreground font-medium"} text-right`}>
        {value}
      </span>
    </div>
  );
}
