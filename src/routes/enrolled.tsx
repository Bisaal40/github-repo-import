import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { usePortal, selectStats, courseProgress, useHydrated } from "@/lib/portal-store";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { totalLessons } from "@/lib/courses";

export const Route = createFileRoute("/enrolled")({
  head: () => ({
    meta: [
      { title: "Enrolled Courses — AKUH Learning Portal" },
      { name: "description", content: "All the courses you're currently enrolled in, with progress and next lessons." },
    ],
  }),
  component: EnrolledPage,
});

function EnrolledPage() {
  const state = usePortal();
  const hydrated = useHydrated();
  const stats = selectStats(state);

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[0.28em] text-amber-deep font-semibold">My Learning</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight">Enrolled courses</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Everything you've signed up for, sorted by what needs your attention.
        </p>
      </header>

      {/* Stat strip */}
      <div className="mb-12 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card px-4 py-5">
        <StatMini label="Total enrolled" value={stats.enrolledCount} icon={BookOpen} />
        <StatMini label="On going" value={stats.inProgressCount} icon={Clock} tone="amber" />
        <StatMini label="Completed" value={stats.completedCount} icon={CheckCircle2} tone="green" />
      </div>

      {hydrated && stats.enrolledCount === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {stats.enrolled.map((c) => {
            const pct = courseProgress(state, c.id);
            const done = state.enrollments[c.id]?.completedLessonIds.length ?? 0;
            const total = totalLessons(c);
            const isDone = pct === 100;
            return (
              <Link
                key={c.id}
                to="/learn/$id"
                params={{ id: c.id }}
                className="group grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[220px_minmax(0,1fr)_auto] gap-5 items-center rounded-3xl border border-border bg-card p-3 hover:shadow-card-hover hover:border-primary/30 transition-all overflow-hidden"
              >
                <CourseThumbnail
                  course={c}
                  className="hidden md:block h-32 rounded-2xl"
                  overlay={
                    <div className="absolute inset-0 flex items-end p-3">
                      <div className="text-[10px] uppercase tracking-wide text-white/70">
                        {c.duration} · {c.level}
                      </div>
                    </div>
                  }
                />
                <div className="min-w-0 pl-3 md:pl-0">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide">
                    {isDone ? (
                      <span className="text-green-700 font-semibold">Completed</span>
                    ) : (
                      <span className="text-amber-deep font-semibold">On going</span>
                    )}
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {done} / {total} lessons
                    </span>
                  </div>
                  <div className="mt-1 font-display text-2xl md:text-3xl truncate">{c.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{c.tagline}</div>
                  <div className="mt-3 h-1.5 max-w-md rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isDone
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-amber-glow to-amber-deep"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="pr-4 md:pr-6 flex flex-col items-end gap-1">
                  <span className="font-display text-3xl tabular-nums text-primary">{pct}%</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:translate-x-1 transition">
                    {isDone ? "Review" : "Resume"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone?: "amber" | "green";
}) {
  const color =
    tone === "amber"
      ? "bg-amber-glow/20 text-amber-deep"
      : tone === "green"
      ? "bg-green-100 text-green-700"
      : "bg-primary/10 text-primary";
  return (
    <div className="flex items-center gap-3 px-4 first:pl-1 last:pr-1">
      <div className={`h-10 w-10 rounded-lg grid place-items-center ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="font-display text-3xl leading-none tabular-nums">{value}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-plum-soft border border-border px-6 py-16 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-white grid place-items-center shadow-card mb-6">
        <Play className="h-8 w-8 text-primary ml-1" />
      </div>
      <div className="font-display text-3xl">Nothing here yet</div>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Browse the course catalog to enroll in your first course.
      </p>
      <Link
        to="/courses"
        className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-plum-ink text-white text-sm font-semibold hover:bg-primary-hover transition"
      >
        Browse courses <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
