import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  Award,
  BookOpen,
  Check,
  X,
  Sparkles,
  Crown,
  Download,
  GraduationCap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

type Course = {
  id: string;
  tier: "basic" | "premium";
  title: string;
  desc: string;
  lessons: string[];
};

const COURSES: Course[] = [
  {
    id: "basic-foundations",
    tier: "basic",
    title: "Copilot Foundations",
    desc: "Get started with Microsoft Copilot at AKUH.",
    lessons: [
      "What is Copilot?",
      "Getting Started with the Learning Portal",
      "Writing Effective Prompts",
      "Understanding Access Tiers",
      "Using the Role-Based Prompt Library",
    ],
  },
  {
    id: "basic-outlook",
    tier: "basic",
    title: "Copilot for Outlook (Basic)",
    desc: "Use Copilot Chat to speed up email work.",
    lessons: [
      "Summarizing long threads",
      "Drafting professional replies",
      "Prompt patterns for inbox triage",
    ],
  },
  {
    id: "premium-word",
    tier: "premium",
    title: "Copilot for Word",
    desc: "Master in-app AI drafting and editing.",
    lessons: [
      "Drafting from a prompt",
      "Rewriting and tone control",
      "Summarizing long documents",
      "Reviewing with Copilot",
    ],
  },
  {
    id: "premium-excel",
    tier: "premium",
    title: "Data Analysis with Copilot in Excel",
    desc: "Natural-language formulas and insights.",
    lessons: [
      "Asking Copilot about your data",
      "Generating formulas",
      "Charts and trends",
      "PivotTable insights",
    ],
  },
  {
    id: "premium-agents",
    tier: "premium",
    title: "Building Custom AI Agents",
    desc: "Automate multi-step workflows across Microsoft 365.",
    lessons: [
      "Agent basics",
      "Designing a workflow",
      "Testing and iterating",
      "Deploying to your team",
    ],
  },
];

const STORAGE_KEY = "akuh-profile-v1";
const PREMIUM_KEY = "akuh-premium-request-v1";

type ProfileState = {
  enrolled: Record<string, string[]>; // courseId -> completed lesson titles
  completedAt?: Record<string, string>; // courseId -> ISO date completion
};

type PremiumRequest = {
  status: "none" | "pending" | "approved" | "rejected";
  requestedAt?: string;
};

function loadState(): ProfileState {
  if (typeof window === "undefined") return { enrolled: {}, completedAt: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { enrolled: {}, completedAt: {} };
    const p = JSON.parse(raw) as ProfileState;
    return { enrolled: p.enrolled ?? {}, completedAt: p.completedAt ?? {} };
  } catch {
    return { enrolled: {}, completedAt: {} };
  }
}

function loadPremium(): PremiumRequest {
  if (typeof window === "undefined") return { status: "none" };
  try {
    const raw = window.localStorage.getItem(PREMIUM_KEY);
    if (!raw) return { status: "none" };
    return JSON.parse(raw) as PremiumRequest;
  } catch {
    return { status: "none" };
  }
}

function ProfilePage() {
  const [state, setState] = useState<ProfileState>({ enrolled: {}, completedAt: {} });
  const [premium, setPremium] = useState<PremiumRequest>({ status: "none" });
  const [hydrated, setHydrated] = useState(false);
  const [certCourse, setCertCourse] = useState<Course | null>(null);

  useEffect(() => {
    setState(loadState());
    setPremium(loadPremium());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(PREMIUM_KEY, JSON.stringify(premium));
  }, [premium, hydrated]);

  const enroll = (id: string) => {
    setState((s) => ({ ...s, enrolled: { ...s.enrolled, [id]: s.enrolled[id] ?? [] } }));
    toast.success("Enrolled in course");
  };

  const toggleLesson = (courseId: string, lesson: string) => {
    setState((s) => {
      const course = COURSES.find((c) => c.id === courseId);
      const done = new Set(s.enrolled[courseId] ?? []);
      if (done.has(lesson)) done.delete(lesson);
      else done.add(lesson);
      const completedAt = { ...(s.completedAt ?? {}) };
      if (course && done.size === course.lessons.length && !completedAt[courseId]) {
        completedAt[courseId] = new Date().toISOString();
      }
      if (course && done.size < course.lessons.length && completedAt[courseId]) {
        delete completedAt[courseId];
      }
      return { ...s, enrolled: { ...s.enrolled, [courseId]: Array.from(done) }, completedAt };
    });
  };

  const enrolledCourses = useMemo(
    () => COURSES.filter((c) => c.id in state.enrolled),
    [state]
  );
  const availableCourses = useMemo(
    () => COURSES.filter((c) => !(c.id in state.enrolled)),
    [state]
  );
  const completedCourses = useMemo(
    () => enrolledCourses.filter((c) => (state.enrolled[c.id] ?? []).length === c.lessons.length),
    [enrolledCourses, state]
  );

  const isPremium = premium.status === "approved";

  const requestPremium = () => {
    setPremium({ status: "pending", requestedAt: new Date().toISOString() });
    toast.success("Premium access request submitted. The AI CoE team will review it shortly.");
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent to-background border border-border rounded-2xl shadow-card-hover p-6 md:p-8">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.42_0.2_270)] text-primary-foreground text-3xl font-semibold grid place-items-center shadow-lg ring-4 ring-white/40">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Aisha Siddiqui</h1>
            <p className="text-sm text-muted-foreground mt-1">aisha.s@aku.edu · Nursing Department</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {isPremium ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border bg-amber-100 text-amber-800 border-amber-300">
                  <Crown className="h-3 w-3" /> Premium Access
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3" /> Tier 1 Basic Access
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border bg-accent text-accent-foreground border-border">
                <User className="h-3 w-3" /> Employee
              </span>
              {premium.status === "pending" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="h-3 w-3" /> Premium Requested
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={BookOpen} label="Enrolled" value={enrolledCourses.length} />
            <Stat icon={Award} label="Certificates" value={completedCourses.length} />
          </div>
        </div>
      </div>

      {/* Request Premium Card (only for basic users) */}
      {!isPremium && (
        <section className="bg-gradient-to-br from-amber-50 via-card to-card border border-amber-200/70 rounded-2xl shadow-card p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-amber-500 text-white grid place-items-center shadow-sm shrink-0">
            <Crown className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold">Unlock Microsoft 365 Copilot Premium</div>
            <p className="text-sm text-muted-foreground mt-1">
              Get embedded AI inside Word, Excel, PowerPoint, Outlook, and Teams — plus priority access and custom agents.
            </p>
          </div>
          <button
            onClick={requestPremium}
            disabled={premium.status === "pending"}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed transition shrink-0"
          >
            {premium.status === "pending" ? (
              <><Clock className="h-4 w-4" /> Request Pending</>
            ) : (
              <><Crown className="h-4 w-4" /> Request Premium Access</>
            )}
          </button>
        </section>
      )}

      {/* Enrolled */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" /> My Courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
            You're not enrolled in any courses yet. Browse available courses below to get started.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {enrolledCourses.map((c) => {
              const done = state.enrolled[c.id] ?? [];
              const pct = Math.round((done.length / c.lessons.length) * 100);
              const complete = pct === 100;
              const barColor = complete
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : c.tier === "premium"
                ? "bg-gradient-to-r from-amber-400 to-amber-600"
                : "bg-gradient-to-r from-primary to-[oklch(0.55_0.18_260)]";
              return (
                <div key={c.id} className="bg-card border border-border rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {c.tier === "premium" ? (
                          <Crown className="h-4 w-4 text-amber-600 shrink-0" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <div className="font-semibold text-[15px] truncate">{c.title}</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                    </div>
                    <span className={`text-xs font-semibold tabular-nums shrink-0 ${complete ? "text-green-600" : "text-foreground"}`}>{pct}%</span>
                  </div>

                  <div className="mt-4 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground">
                    {done.length} of {c.lessons.length} lessons complete
                  </div>

                  <ul className="mt-4 space-y-1 flex-1">
                    {c.lessons.map((l) => {
                      const isDone = done.includes(l);
                      return (
                        <li key={l}>
                          <button
                            onClick={() => toggleLesson(c.id, l)}
                            className="w-full flex items-center gap-2.5 text-left text-sm py-1.5 rounded-md hover:bg-muted px-2 transition"
                          >
                            <span
                              className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 border transition ${
                                isDone ? "bg-green-500 border-green-500 text-white" : "border-border"
                              }`}
                            >
                              {isDone && <Check className="h-3 w-3" />}
                            </span>
                            <span className={isDone ? "text-muted-foreground line-through" : ""}>{l}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {complete && (
                    <button
                      onClick={() => setCertCourse(c)}
                      className="mt-5 inline-flex items-center justify-center gap-2 h-10 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition"
                    >
                      <Award className="h-4 w-4" /> View Certificate
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Certificates */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Certificates
        </h2>
        {completedCourses.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
            <Award className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              Complete a course to earn your first certificate.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {completedCourses.map((c) => {
              const dateStr = state.completedAt?.[c.id];
              const date = dateStr ? new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
              return (
                <div key={c.id} className="group relative overflow-hidden bg-gradient-to-br from-[oklch(0.98_0.02_150)] to-card border border-green-200/60 rounded-xl shadow-card hover:shadow-card-hover transition p-5">
                  <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white grid place-items-center shadow-sm">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-green-700">Certificate</div>
                        <div className="text-sm font-semibold truncate">{c.title}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Completed {date || "recently"}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setCertCourse(c)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> View
                      </button>
                      <button
                        onClick={() => toast.success("Certificate download started")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Available */}
      {availableCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableCourses.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-5 flex flex-col">
                <div className="flex items-center gap-2">
                  {c.tier === "premium" ? (
                    <Crown className="h-4 w-4 text-amber-600" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-primary" />
                  )}
                  <div className="font-medium">{c.title}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex-1">{c.desc}</p>
                <div className="text-[11px] text-muted-foreground mt-3">{c.lessons.length} lessons</div>
                <button
                  onClick={() => enroll(c.id)}
                  className={`mt-3 inline-flex items-center justify-center h-9 rounded-md text-sm font-medium transition ${
                    c.tier === "premium"
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-primary text-primary-foreground hover:bg-primary-hover"
                  }`}
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {certCourse && (
        <div
          onClick={() => setCertCourse(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="text-sm font-medium">Certificate of Completion</div>
              <button
                onClick={() => setCertCourse(null)}
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Certificate course={certCourse} date={state.completedAt?.[certCourse.id]} />
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => toast.success("Certificate download started")}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition"
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-border p-4 min-w-[120px] shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Certificate({ course, date }: { course: Course; date?: string }) {
  const displayDate = (date ? new Date(date) : new Date()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="p-8 bg-gradient-to-br from-[oklch(0.98_0.01_255)] to-[oklch(0.94_0.03_255)]">
      <div className="border-4 border-primary/30 rounded-xl p-8 text-center bg-white">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-sm">
            <Award className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          AKUH Learning Portal
        </div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">Certificate of Completion</div>
        <p className="mt-6 text-sm text-muted-foreground">This certifies that</p>
        <p className="mt-1 text-xl font-semibold">Aisha Siddiqui</p>
        <p className="mt-4 text-sm text-muted-foreground">has successfully completed the course</p>
        <p className="mt-1 text-lg font-semibold text-primary">{course.title}</p>
        <p className="mt-6 text-xs text-muted-foreground">
          Issued {displayDate} · Aga Khan University Hospital · AI Centre of Excellence
        </p>
      </div>
    </div>
  );
}
