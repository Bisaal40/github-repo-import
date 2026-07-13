import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, BookOpen, Users, Crown, Plus, Edit3, Trash2, Check, X,
  Shield, Sparkles, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});


type AdminCourse = {
  id: string;
  title: string;
  desc: string;
  category: "Basic" | "Premium";
  lessons: string[];
  icon?: string;
};

type EnrollmentReq = {
  id: string;
  user: string;
  email: string;
  course: string;
  requestedAt: string;
  status: "Pending" | "Approved";
};

type PremiumReq = {
  id: string;
  name: string;
  email: string;
  department: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Rejected";
};

const COURSES_KEY = "akuh-admin-courses-v1";
const ENROLL_KEY = "akuh-admin-enrollments-v1";
const PREMIUM_REQ_KEY = "akuh-admin-premium-reqs-v1";
const USER_PREMIUM_KEY = "akuh-premium-request-v1";

const DEFAULT_COURSES: AdminCourse[] = [
  { id: "basic-foundations", title: "Copilot Foundations", desc: "Get started with Microsoft Copilot at AKUH.", category: "Basic", lessons: ["What is Copilot?", "Getting Started", "Writing Effective Prompts", "Understanding Access Tiers", "Prompt Library"] },
  { id: "basic-outlook", title: "Copilot for Outlook (Basic)", desc: "Use Copilot Chat to speed up email work.", category: "Basic", lessons: ["Summarizing threads", "Drafting replies", "Inbox triage"] },
  { id: "premium-word", title: "Copilot for Word", desc: "Master in-app AI drafting and editing.", category: "Premium", lessons: ["Drafting", "Rewriting", "Summarizing", "Reviewing"] },
  { id: "premium-excel", title: "Data Analysis with Copilot in Excel", desc: "Natural-language formulas and insights.", category: "Premium", lessons: ["Data Q&A", "Formulas", "Charts", "PivotTables"] },
  { id: "premium-agents", title: "Building Custom AI Agents", desc: "Automate multi-step workflows.", category: "Premium", lessons: ["Agent basics", "Design", "Testing", "Deploy"] },
];

const DEFAULT_ENROLL: EnrollmentReq[] = [
  { id: "e1", user: "Sara Ahmed", email: "sara.a@aku.edu", course: "Copilot Foundations", requestedAt: "2 days ago", status: "Approved" },
  { id: "e2", user: "Hassan Ali", email: "hassan.a@aku.edu", course: "Copilot for Word", requestedAt: "1 day ago", status: "Pending" },
  { id: "e3", user: "Fatima Khan", email: "fatima.k@aku.edu", course: "Data Analysis with Copilot in Excel", requestedAt: "5 hours ago", status: "Pending" },
];

const DEFAULT_PREMIUM: PremiumReq[] = [
  { id: "p1", name: "Ali Raza", email: "ali.r@aku.edu", department: "Finance", requestedAt: "3 days ago", status: "Pending" },
  { id: "p2", name: "Zainab Malik", email: "zainab.m@aku.edu", department: "Research", requestedAt: "1 week ago", status: "Approved" },
];

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type Tab = "courses" | "enrollments" | "premium";

function AdminPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("courses");
  const [hydrated, setHydrated] = useState(false);
  const [courses, setCourses] = useState<AdminCourse[]>(DEFAULT_COURSES);
  const [enrollments, setEnrollments] = useState<EnrollmentReq[]>(DEFAULT_ENROLL);
  const [premiumReqs, setPremiumReqs] = useState<PremiumReq[]>(DEFAULT_PREMIUM);

  // Guard: only admins may view /admin. Others redirect to home.
  useEffect(() => {
    // Wait one tick for user hook to hydrate from localStorage.
    const t = setTimeout(() => setAuthChecked(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!user || user.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/" });
    }
  }, [authChecked, user, navigate]);

  useEffect(() => {
    setCourses(loadJSON<AdminCourse[]>(COURSES_KEY, DEFAULT_COURSES));
    setEnrollments(loadJSON<EnrollmentReq[]>(ENROLL_KEY, DEFAULT_ENROLL));

    // Merge the current user's premium request into admin list, if any.
    const stored = loadJSON<PremiumReq[]>(PREMIUM_REQ_KEY, DEFAULT_PREMIUM);
    try {
      const userReqRaw = window.localStorage.getItem(USER_PREMIUM_KEY);
      if (userReqRaw) {
        const userReq = JSON.parse(userReqRaw) as { status: string; requestedAt?: string };
        if (userReq.status === "pending" && !stored.some((r) => r.email === "aisha.s@aku.edu" && r.status === "Pending")) {
          stored.unshift({
            id: "current-user",
            name: "Aisha Siddiqui",
            email: "aisha.s@aku.edu",
            department: "Nursing",
            requestedAt: userReq.requestedAt ? new Date(userReq.requestedAt).toLocaleDateString() : "Just now",
            status: "Pending",
          });
        }
      }
    } catch {
      /* ignore */
    }
    setPremiumReqs(stored);
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) window.localStorage.setItem(COURSES_KEY, JSON.stringify(courses)); }, [courses, hydrated]);
  useEffect(() => { if (hydrated) window.localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollments)); }, [enrollments, hydrated]);
  useEffect(() => { if (hydrated) window.localStorage.setItem(PREMIUM_REQ_KEY, JSON.stringify(premiumReqs)); }, [premiumReqs, hydrated]);

  if (!authChecked || !user || user.role !== "admin") {
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 text-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  const pendingEnroll = enrollments.filter((e) => e.status === "Pending").length;
  const pendingPremium = premiumReqs.filter((r) => r.status === "Pending").length;

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
            <Shield className="h-3 w-3" /> Admin
          </div>
        </div>

        {/* Header */}
        <div className="mt-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Manage courses, review enrollments, and approve premium access requests across the Learning Portal.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={BookOpen}
            label="Courses"
            value={courses.length}
            hint="Total published"
            tone="blue"
          />
          <StatCard
            icon={Users}
            label="Enrollments"
            value={pendingEnroll}
            hint={pendingEnroll === 0 ? "All caught up" : `${pendingEnroll} awaiting approval`}
            tone="amber"
            highlight={pendingEnroll > 0}
          />
          <StatCard
            icon={Crown}
            label="Premium"
            value={pendingPremium}
            hint={pendingPremium === 0 ? "No pending requests" : `${pendingPremium} awaiting approval`}
            tone="orange"
            highlight={pendingPremium > 0}
          />
        </div>

        {/* Layout */}
        <div className="mt-10 grid md:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="md:sticky md:top-24 h-fit bg-card border border-border rounded-2xl shadow-card p-3">
            <div className="px-3 pt-2 pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Management
            </div>
            <div className="space-y-1">
              <SideItem active={tab === "courses"} icon={BookOpen} label="Courses" onClick={() => setTab("courses")} />
              <SideItem active={tab === "enrollments"} icon={Users} label="Enrollments" onClick={() => setTab("enrollments")} badge={pendingEnroll} />
              <SideItem active={tab === "premium"} icon={Crown} label="Premium Requests" onClick={() => setTab("premium")} badge={pendingPremium} />
            </div>
            <div className="mt-3 pt-3 border-t border-border px-3 pb-1">
              <div className="text-[11px] text-muted-foreground">
                Signed in as <span className="font-semibold text-foreground">{user.name}</span>
              </div>
            </div>
          </aside>

          <main>
            {tab === "courses" && <CoursesPanel courses={courses} setCourses={setCourses} />}
            {tab === "enrollments" && <EnrollmentsPanel items={enrollments} setItems={setEnrollments} />}
            {tab === "premium" && <PremiumPanel items={premiumReqs} setItems={setPremiumReqs} />}
          </main>
        </div>
      </div>
    </div>
  );
}

const TONE_STYLES: Record<"blue" | "amber" | "orange", { bg: string; ring: string; iconBg: string; iconText: string; accent: string }> = {
  blue: {
    bg: "bg-gradient-to-br from-primary/5 to-transparent",
    ring: "border-primary/20",
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    accent: "text-primary",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-transparent",
    ring: "border-amber-200",
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
    accent: "text-amber-700",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-transparent",
    ring: "border-orange-200",
    iconBg: "bg-orange-100",
    iconText: "text-orange-700",
    accent: "text-orange-700",
  },
};

function StatCard({
  icon: Icon, label, value, hint, tone, highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: number; hint: string; tone: "blue" | "amber" | "orange"; highlight?: boolean;
}) {
  const t = TONE_STYLES[tone];
  return (
    <div className={`relative overflow-hidden bg-card border ${t.ring} rounded-2xl shadow-card p-5 ${t.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={`mt-2 text-4xl font-bold tabular-nums tracking-tight ${highlight ? t.accent : "text-foreground"}`}>
            {value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
        </div>
        <div className={`h-11 w-11 rounded-xl ${t.iconBg} ${t.iconText} grid place-items-center shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SideItem({
  active, icon: Icon, label, onClick, badge,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full transition-all ${
          active ? "bg-primary opacity-100" : "opacity-0 group-hover:opacity-40 bg-muted-foreground"
        }`}
      />
      <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
      <span className="flex-1 text-left">{label}</span>
      {typeof badge === "number" && badge > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          active ? "bg-primary text-primary-foreground" : "bg-amber-100 text-amber-800 border border-amber-300"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}


/* ---------- Courses ---------- */

function CoursesPanel({ courses, setCourses }: { courses: AdminCourse[]; setCourses: (c: AdminCourse[]) => void }) {
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [showForm, setShowForm] = useState(false);

  const remove = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    toast.success("Course deleted");
  };

  const save = (c: AdminCourse) => {
    if (courses.some((x) => x.id === c.id)) {
      setCourses(courses.map((x) => (x.id === c.id ? c : x)));
      toast.success("Course updated");
    } else {
      setCourses([...courses, c]);
      toast.success("Course added");
    }
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Manage Courses</h2>
          <p className="text-sm text-muted-foreground">Add, edit, or delete courses in the Learning Portal.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {courses.map((c) => (
          <div
            key={c.id}
            className="group relative bg-card border border-border rounded-2xl shadow-card hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 transition-all p-6"
          >
            {/* Action buttons — appear/emphasize on hover */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
              <button
                onClick={() => { setEditing(c); setShowForm(true); }}
                className="h-8 w-8 grid place-items-center rounded-md bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition"
                aria-label="Edit"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => remove(c.id)}
                className="h-8 w-8 grid place-items-center rounded-md bg-muted/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="pr-20">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                c.category === "Premium"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}>
                {c.category === "Premium" ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                {c.category}
              </span>
              <div className="mt-3 font-semibold text-base leading-snug">{c.title}</div>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{c.desc}</p>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                {c.lessons.length} lesson{c.lessons.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        ))}
      </div>



      {showForm && (
        <CourseFormModal
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={save}
        />
      )}
    </div>
  );
}

function CourseFormModal({ initial, onClose, onSave }: { initial: AdminCourse | null; onClose: () => void; onSave: (c: AdminCourse) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [category, setCategory] = useState<"Basic" | "Premium">(initial?.category ?? "Basic");
  const [lessonsText, setLessonsText] = useState((initial?.lessons ?? []).join("\n"));

  const submit = () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    const lessons = lessonsText.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave({
      id: initial?.id ?? `custom-${Date.now()}`,
      title: title.trim(),
      desc: desc.trim(),
      category,
      lessons,
    });
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="font-medium">{initial ? "Edit Course" : "Add New Course"}</div>
          <button onClick={onClose} className="h-8 w-8 rounded-md hover:bg-muted grid place-items-center"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </Field>
          <Field label="Description">
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="w-full p-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </Field>
          <Field label="Category">
            <div className="flex gap-2">
              {(["Basic", "Premium"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex-1 h-10 rounded-md border text-sm font-medium transition ${
                    category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Lessons (one per line)">
            <textarea value={lessonsText} onChange={(e) => setLessonsText(e.target.value)} rows={5} placeholder={"Lesson 1\nLesson 2"} className="w-full p-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono" />
          </Field>
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-10 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted transition">Cancel</button>
          <button onClick={submit} className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition">
            {initial ? "Save Changes" : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------- Enrollments ---------- */

function EnrollmentsPanel({ items, setItems }: { items: EnrollmentReq[]; setItems: (v: EnrollmentReq[]) => void }) {
  const approve = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: "Approved" } : i)));
    toast.success("Enrollment approved");
  };
  const pending = items.filter((i) => i.status === "Pending");
  const approved = items.filter((i) => i.status === "Approved");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Enrollment Requests</h2>
        <p className="text-sm text-muted-foreground">Users who have enrolled themselves in courses from their profile.</p>
      </div>

      <Section title="Pending" count={pending.length} tint="amber">
        {pending.length === 0 ? (
          <EmptyRow>No pending enrollments.</EmptyRow>
        ) : (
          pending.map((i) => (
            <EnrollRow key={i.id} item={i}>
              <button onClick={() => approve(i.id)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                <Check className="h-4 w-4" /> Approve
              </button>
            </EnrollRow>
          ))
        )}
      </Section>

      <Section title="Approved" count={approved.length} tint="green">
        {approved.length === 0 ? (
          <EmptyRow>No approved enrollments yet.</EmptyRow>
        ) : (
          approved.map((i) => (
            <EnrollRow key={i.id} item={i}>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4" /> Approved
              </span>
            </EnrollRow>
          ))
        )}
      </Section>
    </div>
  );
}

function EnrollRow({ item, children }: { item: EnrollmentReq; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-card-hover transition">
      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold text-sm shrink-0">
        {item.user.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.user}</div>
        <div className="text-xs text-muted-foreground truncate">{item.email} · {item.course}</div>
      </div>
      <div className="text-xs text-muted-foreground hidden md:block">{item.requestedAt}</div>
      {children}
    </div>
  );
}

/* ---------- Premium Requests ---------- */

function PremiumPanel({ items, setItems }: { items: PremiumReq[]; setItems: (v: PremiumReq[]) => void }) {
  const decide = (id: string, status: "Approved" | "Rejected") => {
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
    if (id === "current-user" && typeof window !== "undefined") {
      try {
        window.localStorage.setItem("akuh-premium-request-v1", JSON.stringify({
          status: status === "Approved" ? "approved" : "rejected",
          requestedAt: new Date().toISOString(),
        }));
      } catch { /* ignore */ }
    }
    toast.success(`Premium access ${status.toLowerCase()}`);
  };
  const pending = items.filter((i) => i.status === "Pending");
  const decided = items.filter((i) => i.status !== "Pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Premium Access Requests</h2>
        <p className="text-sm text-muted-foreground">Approve or reject premium Copilot license requests.</p>
      </div>

      <Section title="Pending" count={pending.length} tint="amber">
        {pending.length === 0 ? (
          <EmptyRow>No pending premium requests.</EmptyRow>
        ) : (
          pending.map((i) => (
            <PremiumRow key={i.id} item={i}>
              <button onClick={() => decide(i.id, "Approved")} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                <Check className="h-4 w-4" /> Approve
              </button>
              <button onClick={() => decide(i.id, "Rejected")} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm font-medium text-destructive hover:bg-destructive/10 transition">
                <X className="h-4 w-4" /> Reject
              </button>
            </PremiumRow>
          ))
        )}
      </Section>

      <Section title="Processed" count={decided.length} tint="muted">
        {decided.length === 0 ? (
          <EmptyRow>No processed requests yet.</EmptyRow>
        ) : (
          decided.map((i) => (
            <PremiumRow key={i.id} item={i}>
              {i.status === "Approved" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                  <XCircle className="h-4 w-4" /> Rejected
                </span>
              )}
            </PremiumRow>
          ))
        )}
      </Section>
    </div>
  );
}

function PremiumRow({ item, children }: { item: PremiumReq; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-card-hover transition">
      <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 grid place-items-center shrink-0">
        <Crown className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.name} <span className="text-muted-foreground font-normal">· {item.department}</span></div>
        <div className="text-xs text-muted-foreground truncate">{item.email}</div>
      </div>
      <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1"><Clock className="h-3 w-3" />{item.requestedAt}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Section({ title, count, tint, children }: { title: string; count: number; tint: "amber" | "green" | "muted"; children: React.ReactNode }) {
  const dot = tint === "amber" ? "bg-amber-500" : tint === "green" ? "bg-green-500" : "bg-muted-foreground";
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <div className="text-sm font-semibold">{title}</div>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
