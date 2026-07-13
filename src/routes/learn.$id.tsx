import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, ChevronDown, ChevronRight, Check, Play, CheckCircle2, ChevronLeft,
  MessageSquare, Star, FileText,
} from "lucide-react";
import { getCourse, allLessons, type Lesson } from "@/lib/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { portalActions, usePortal, isEnrolled, courseProgress } from "@/lib/portal-store";
import { toast } from "sonner";

export const Route = createFileRoute("/learn/$id")({
  loader: ({ params }) => {
    if (!getCourse(params.id)) throw notFound();
    return {};
  },
  head: () => ({
    meta: [
      { title: "Learning — AKUH Learning Portal" },
      { name: "description", content: "Course player and lessons." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { id } = Route.useParams();
  const course = getCourse(id)!;
  const state = usePortal();
  const navigate = useNavigate();

  const enrolled = isEnrolled(state, id);
  const lessons = useMemo(() => allLessons(course), [course]);
  const completed = new Set(state.enrollments[id]?.completedLessonIds ?? []);
  const firstIncomplete = lessons.find((l) => !completed.has(l.id));
  const [activeLessonId, setActiveLessonId] = useState<string>(firstIncomplete?.id ?? lessons[0].id);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    Object.fromEntries(course.modules.map((m) => [m.id, true]))
  );
  const [tab, setTab] = useState<"desc" | "discussion" | "review">("desc");
  const [fade, setFade] = useState(false);

  if (!enrolled) {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
        <div className="font-display text-3xl">Enroll first</div>
        <p className="mt-2 text-muted-foreground">You need to enroll before opening the player.</p>
        <Link
          to="/courses/$id"
          params={{ id }}
          className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-plum-ink text-white text-sm font-semibold"
        >
          Go to course preview
        </Link>
      </div>
    );
  }


  const activeIdx = lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = lessons[activeIdx];
  const prev = activeIdx > 0 ? lessons[activeIdx - 1] : null;
  const next = activeIdx < lessons.length - 1 ? lessons[activeIdx + 1] : null;
  const pct = courseProgress(state, id);

  const switchLesson = (lid: string) => {
    setFade(true);
    setTimeout(() => {
      setActiveLessonId(lid);
      setFade(false);
    }, 150);
  };

  const markComplete = () => {
    if (!completed.has(activeLesson.id)) {
      portalActions.toggleLesson(id, activeLesson.id);
      toast.success("Lesson complete");
      if (state.enrollments[id]?.completedLessonIds.length + 1 === lessons.length) {
        setTimeout(() => {
          toast.success("🎉 Course completed! Certificate issued.", { duration: 5000 });
          navigate({ to: "/certificates" });
        }, 400);
      }
    }
    if (next) switchLesson(next.id);
  };

  return (
    <div className="grid lg:grid-cols-[340px_1fr] min-h-[calc(100vh-4rem)]">
      {/* TOC */}
      <aside className="border-r border-border bg-card lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-5 border-b border-border">
          <Link
            to="/enrolled"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Enrolled courses
          </Link>
          <div className="mt-3 font-display text-lg leading-tight">{course.title}</div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-glow to-amber-deep transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs tabular-nums font-semibold text-amber-deep">{pct}%</span>
          </div>
        </div>
        <div className="p-3">
          {course.modules.map((m, mi) => {
            const isOpen = openModules[m.id];
            const done = m.lessons.filter((l) => completed.has(l.id)).length;
            return (
              <div key={m.id} className="mb-1">
                <button
                  onClick={() => setOpenModules((s) => ({ ...s, [m.id]: !isOpen }))}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-left"
                >
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Module {mi + 1}
                    </div>
                    <div className="text-sm font-medium truncate">{m.title}</div>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                    {done}/{m.lessons.length}
                  </span>
                </button>
                {isOpen && (
                  <ul className="mt-1 ml-3 border-l border-border">
                    {m.lessons.map((l) => (
                      <li key={l.id}>
                        <LessonRow
                          lesson={l}
                          active={l.id === activeLessonId}
                          done={completed.has(l.id)}
                          onClick={() => switchLesson(l.id)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* PLAYER */}
      <div className={`transition-opacity duration-150 ${fade ? "opacity-0" : "opacity-100"}`}>
        <div className="bg-plum-ink relative">
          <CourseThumbnail
            course={course}
            className="absolute inset-0"
            showGlyph={false}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative aspect-video max-h-[70vh] mx-auto max-w-[1100px] w-full grid place-items-center">
            <button className="group h-20 w-20 rounded-full bg-white/95 grid place-items-center shadow-2xl hover:scale-105 transition">
              <Play className="h-8 w-8 text-plum-ink ml-1 fill-plum-ink" />
            </button>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-deep font-semibold">
                Now playing · {activeLesson.duration}
              </div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl leading-tight truncate">
                {activeLesson.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => prev && switchLesson(prev.id)}
                disabled={!prev}
                className="h-10 w-10 grid place-items-center rounded-full border border-border disabled:opacity-40 hover:bg-muted transition"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={markComplete}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-amber-glow text-plum-ink text-sm font-semibold hover:shadow-glow-amber transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                {completed.has(activeLesson.id) ? "Next lesson" : "Mark complete & continue"}
              </button>
              <button
                onClick={() => next && switchLesson(next.id)}
                disabled={!next}
                className="h-10 w-10 grid place-items-center rounded-full border border-border disabled:opacity-40 hover:bg-muted transition"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b border-border flex gap-1">
            {[
              { key: "desc", label: "Description", icon: FileText },
              { key: "discussion", label: "Discussion", icon: MessageSquare },
              { key: "review", label: "Write Review", icon: Star },
            ].map((t) => {
              const active = tab === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-amber-glow" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-6 min-h-[240px]">
            {tab === "desc" && (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {course.desc}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  In this lesson we'll cover the essentials of <strong>{activeLesson.title}</strong>.
                  Follow along, try it in your own environment, and return here to mark it complete.
                </p>
              </div>
            )}
            {tab === "discussion" && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Discussion opens next week. Start a thread and your colleagues will see it here.
              </div>
            )}
            {tab === "review" && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-5 w-5 text-amber-glow fill-amber-glow" />
                  ))}
                </div>
                <textarea
                  placeholder="What worked, what didn't? Your feedback shapes the next cohort."
                  className="w-full min-h-[120px] rounded-xl border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => toast.success("Thanks for the review!")}
                    className="h-9 px-4 rounded-full bg-plum-ink text-white text-sm font-medium"
                  >
                    Submit review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonRow({
  lesson, active, done, onClick,
}: {
  lesson: Lesson;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 pl-4 pr-3 py-2 text-left text-sm rounded-r-lg transition group ${
        active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full grid place-items-center shrink-0 border transition ${
          done
            ? "bg-green-500 border-green-500 text-white"
            : active
            ? "border-primary"
            : "border-border group-hover:border-foreground"
        }`}
      >
        {done ? <Check className="h-2.5 w-2.5" /> : active ? <Play className="h-2 w-2 fill-current" /> : null}
      </span>
      <span className="flex-1 min-w-0 truncate">{lesson.title}</span>
      {lesson.mandatory && (
        <span className="text-[9px] uppercase tracking-wide text-amber-deep font-semibold shrink-0">
          Req
        </span>
      )}
      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{lesson.duration}</span>
    </button>
  );
}
