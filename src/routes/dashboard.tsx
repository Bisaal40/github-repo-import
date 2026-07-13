import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, BookOpen, Award, TrendingUp, Sparkles, Crown } from "lucide-react";
import { usePortal, selectStats, courseProgress, useHydrated } from "@/lib/portal-store";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { COURSES } from "@/lib/courses";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AKUH Learning Portal" },
      { name: "description", content: "Your personal learning dashboard: continue courses, track progress, and see what's next." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const state = usePortal();
  const hydrated = useHydrated();
  const stats = selectStats(state);
  const continueCourse = stats.inProgress[0] ?? stats.enrolled[0];
  const suggestions = COURSES.filter((c) => !(c.id in state.enrollments)).slice(0, 3);
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = state.profile.name.split(" ")[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-plum-mesh text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-faint opacity-40 pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/60">
                <Sparkles className="h-3 w-3 text-amber-glow" />
                {greeting}, {state.profile.department}
              </div>
              <h1 className="mt-4 font-display text-[44px] leading-[1.05] md:text-[64px] md:leading-[1.02]">
                Hello, <span className="text-gradient-amber italic">{firstName}</span>.
                <br />
                Pick up where you left off.
              </h1>
              <p className="mt-5 text-white/70 max-w-lg text-[15px] leading-relaxed">
                A curated learning path for AKUH staff — with hands-on labs, prompt libraries, and
                certifications recognised across the network.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {continueCourse ? (
                  <Link
                    to="/learn/$id"
                    params={{ id: continueCourse.id }}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-amber-glow text-plum-ink text-sm font-semibold hover:shadow-glow-amber transition"
                  >
                    <Play className="h-4 w-4 fill-plum-ink" /> Resume learning
                  </Link>
                ) : (
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-amber-glow text-plum-ink text-sm font-semibold hover:shadow-glow-amber transition"
                  >
                    Browse courses <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/20 text-white/90 text-sm font-medium hover:bg-white/5 transition"
                >
                  Explore catalog
                </Link>
              </div>
            </div>

            {/* Abstract graphic */}
            <div className="hidden lg:block relative h-[280px]">
              <div className="absolute inset-0">
                <div className="absolute right-6 top-4 h-40 w-40 rounded-full bg-gradient-to-br from-amber-glow to-transparent blur-2xl opacity-70" />
                <div className="absolute right-24 bottom-6 h-52 w-52 rounded-full bg-gradient-to-tr from-[oklch(0.55_0.18_300)] to-transparent blur-3xl opacity-70" />
                <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="oklch(0.82 0.16 72)" />
                      <stop offset="1" stopColor="oklch(0.42 0.16 285)" />
                    </linearGradient>
                  </defs>
                  <circle cx="240" cy="140" r="90" fill="none" stroke="url(#g1)" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="240" cy="140" r="60" fill="none" stroke="oklch(0.82 0.16 72)" strokeWidth="1" opacity="0.7" />
                  <circle cx="240" cy="140" r="30" fill="oklch(0.82 0.16 72)" opacity="0.9" />
                  <circle cx="180" cy="80" r="4" fill="oklch(0.82 0.16 72)" />
                  <circle cx="320" cy="220" r="4" fill="#fff" opacity="0.7" />
                  <circle cx="120" cy="220" r="4" fill="#fff" opacity="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP — integrated */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-6 grid grid-cols-3 divide-x divide-border">
          <StatCell icon={BookOpen} label="Enrolled" value={hydrated ? stats.enrolledCount : 0} />
          <StatCell icon={TrendingUp} label="In progress" value={hydrated ? stats.inProgressCount : 0} tone="amber" />
          <StatCell icon={Award} label="Certificates" value={hydrated ? stats.completedCount : 0} />
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-14 space-y-16">
        {/* CONTINUE LEARNING */}
        {continueCourse ? (
          <section>
            <SectionHeader eyebrow="Continue Learning" title="Right where you left off" />
            <ContinueBanner courseId={continueCourse.id} progress={courseProgress(state, continueCourse.id)} />
          </section>
        ) : (
          <section>
            <SectionHeader eyebrow="Get started" title="Your journey begins with one course" />
            <div className="relative overflow-hidden rounded-3xl bg-plum-soft border border-border p-10 text-center">
              <div className="font-display text-3xl">No courses yet.</div>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Browse the catalog and enroll in a course to start earning certificates.
              </p>
              <Link
                to="/courses"
                className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-plum-ink text-white text-sm font-semibold hover:bg-primary-hover transition"
              >
                Browse catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* SUGGESTED */}
        {suggestions.length > 0 && (
          <section>
            <SectionHeader eyebrow="Recommended" title="Pair well with what you're learning" />
            <div className="space-y-3">
              {suggestions.map((c, i) => (
                <Link
                  key={c.id}
                  to="/courses/$id"
                  params={{ id: c.id }}
                  className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-3 pr-6 hover:shadow-card-hover hover:border-primary/30 transition"
                >
                  <CourseThumbnail course={c} className="w-32 h-20 rounded-xl shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {c.tier === "premium" ? (
                        <span className="inline-flex items-center gap-1 text-amber-deep">
                          <Crown className="h-3 w-3" /> Premium
                        </span>
                      ) : (
                        <span>Included · Tier 1</span>
                      )}
                      <span>·</span>
                      <span>{c.duration}</span>
                      <span>·</span>
                      <span>{c.level}</span>
                    </div>
                    <div className="mt-1 font-display text-xl truncate">{c.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{c.tagline}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-sm font-medium text-primary group-hover:translate-x-1 transition">
                    Preview <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="font-display text-3xl text-muted-foreground/40 tabular-nums w-10 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.28em] text-amber-deep font-semibold">{eyebrow}</div>
      <h2 className="mt-2 font-display text-3xl md:text-4xl leading-tight">{title}</h2>
    </div>
  );
}

function StatCell({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone?: "amber";
}) {
  return (
    <div className="flex items-center gap-4 px-6 first:pl-0 last:pr-0">
      <div
        className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${
          tone === "amber"
            ? "bg-amber-glow/20 text-amber-deep"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-4xl leading-none tabular-nums">{value}</div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5">
          {label}
        </div>
      </div>
    </div>
  );
}

function ContinueBanner({ courseId, progress }: { courseId: string; progress: number }) {
  const course = COURSES.find((c) => c.id === courseId);
  if (!course) return null;
  return (
    <Link
      to="/learn/$id"
      params={{ id: courseId }}
      className="group relative block overflow-hidden rounded-3xl border border-border shadow-card hover:shadow-card-hover transition"
    >
      <CourseThumbnail course={course} className="h-[280px] md:h-[340px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-plum-ink/95 via-plum-ink/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-amber-glow">
          <Play className="h-3 w-3" /> Continue · {progress}% complete
        </div>
        <div className="mt-2 font-display text-3xl md:text-5xl leading-tight max-w-3xl">
          {course.title}
        </div>
        <div className="mt-2 text-white/70 max-w-2xl">{course.tagline}</div>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 max-w-md h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-glow to-amber-deep transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-amber-glow text-plum-ink text-sm font-semibold group-hover:scale-[1.02] transition">
            <Play className="h-3.5 w-3.5 fill-plum-ink" /> Resume
          </span>
        </div>
      </div>
    </Link>
  );
}
