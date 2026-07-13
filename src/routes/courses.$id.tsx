import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Play, Clock, GraduationCap, Users, CheckCircle2, Crown, Sparkles, ArrowRight } from "lucide-react";
import { getCourse, totalLessons } from "@/lib/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { EnrollModal } from "@/components/EnrollModal";
import { isEnrolled, usePortal, courseProgress } from "@/lib/portal-store";

export const Route = createFileRoute("/courses/$id")({
  loader: ({ params }) => {
    const course = getCourse(params.id);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.course.title} — AKUH Learning Portal`
          : "Course — AKUH Learning Portal",
      },
      { name: "description", content: loaderData?.course.desc ?? "Course preview." },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <div className="font-display text-3xl">Course not found</div>
      <Link to="/courses" className="text-primary underline mt-4 inline-block">
        Back to catalog
      </Link>
    </div>
  ),
  component: CoursePreview,
});

function CoursePreview() {
  const { course } = Route.useLoaderData();
  const state = usePortal();
  const enrolled = isEnrolled(state, course.id);
  const [modalOpen, setModalOpen] = useState(false);
  const pct = courseProgress(state, course.id);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <CourseThumbnail course={course} className="absolute inset-0" showGlyph={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-plum-ink/60 via-plum-ink/70 to-plum-ink" />
        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-10 pt-12 pb-16 text-white">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to catalog
          </Link>
          <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-amber-glow font-semibold">
                {course.tier === "premium" ? (
                  <><Crown className="h-3 w-3" /> Premium</>
                ) : (
                  <><Sparkles className="h-3 w-3" /> Included</>
                )}
                <span className="text-white/40">·</span>
                <span className="text-white/70">{course.department}</span>
              </div>
              <h1 className="mt-3 font-display text-4xl md:text-6xl leading-[1.02]">
                {course.title}
              </h1>
              <p className="mt-4 text-white/70 max-w-2xl text-lg italic font-display">
                {course.tagline}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {course.duration}</span>
                <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {course.level}</span>
                <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> {course.instructor}</span>
              </div>
            </div>
            <div>
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6">
                {enrolled ? (
                  <>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-amber-glow">You're enrolled</div>
                    <div className="mt-2 font-display text-2xl">{pct}% complete</div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-glow to-amber-deep"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <Link
                      to="/learn/$id"
                      params={{ id: course.id }}
                      className="mt-5 inline-flex items-center justify-center gap-2 w-full h-11 rounded-full bg-amber-glow text-plum-ink text-sm font-semibold hover:shadow-glow-amber transition"
                    >
                      <Play className="h-4 w-4 fill-plum-ink" /> {pct === 100 ? "Review course" : "Continue learning"}
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Ready to start?</div>
                    <div className="mt-2 font-display text-2xl">
                      {totalLessons(course)} lessons · {course.duration}
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      Free for AKUH staff. Certificate on completion.
                    </p>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="mt-5 inline-flex items-center justify-center gap-2 w-full h-11 rounded-full bg-amber-glow text-plum-ink text-sm font-semibold hover:shadow-glow-amber transition"
                    >
                      Enroll now <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1.5fr_1fr] gap-12">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">About this course</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{course.desc}</p>

          <h3 className="mt-10 font-display text-xl">What you'll learn</h3>
          <ul className="mt-4 space-y-2">
            {course.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-amber-deep mt-0.5 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-display text-xl">Syllabus</h3>
          <div className="mt-4 space-y-4">
            {course.modules.map((m, i) => (
              <div key={m.id} className="rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-3 bg-muted/50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Module {i + 1}</div>
                    <div className="font-medium">{m.title}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{m.lessons.length} lessons</div>
                </div>
                <ul className="divide-y divide-border">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                      <div className="h-6 w-6 rounded-full border border-border grid place-items-center text-muted-foreground shrink-0">
                        <Play className="h-2.5 w-2.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{l.title}</div>
                      </div>
                      {l.mandatory && (
                        <span className="text-[10px] uppercase tracking-wide text-amber-deep font-semibold">
                          Mandatory
                        </span>
                      )}
                      <div className="text-xs text-muted-foreground tabular-nums">{l.duration}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Instructor</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-plum-2 text-white grid place-items-center font-semibold">
                {course.instructor.split(" ").slice(0, 2).map((s) => s[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm">{course.instructor}</div>
                <div className="text-xs text-muted-foreground">AKUH · AI Centre of Excellence</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-plum-soft border border-border p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Certificate</div>
            <div className="mt-2 font-display text-xl">
              Earn a verified certificate on completion
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Downloadable PDF, shareable on LinkedIn, auto-issued at 100%.
            </p>
          </div>
        </aside>
      </section>

      <EnrollModal course={course} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
