import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Crown, Sparkles, ArrowRight, Filter } from "lucide-react";
import { COURSES, type CourseLevel, type Course } from "@/lib/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { isEnrolled, usePortal } from "@/lib/portal-store";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Course Catalog — AKUH Learning Portal" },
      { name: "description", content: "Browse and search all Microsoft Copilot courses available at AKUH." },
    ],
  }),
  component: Catalog,
});

const LEVELS: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];

function Catalog() {
  const state = usePortal();
  const departments = useMemo(() => Array.from(new Set(COURSES.map((c) => c.department))), []);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<CourseLevel | "">("");
  const [dept, setDept] = useState<string>("");
  const [mandatoryOnly, setMandatoryOnly] = useState(false);

  const filtered = COURSES.filter((c) => {
    if (level && c.level !== level) return false;
    if (dept && c.department !== dept) return false;
    if (mandatoryOnly && !c.mandatory) return false;
    if (q) {
      const s = (c.title + c.tagline + c.desc + c.instructor).toLowerCase();
      if (!s.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <header className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.28em] text-amber-deep font-semibold">Catalog</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight">
          Every course, one shelf.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Curated by the AKUH AI Centre of Excellence. Search, filter, preview — then enroll in one tap.
        </p>
      </header>

      {/* Search + filters */}
      <div className="rounded-2xl border border-border bg-card p-4 md:p-5 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-10">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses, instructors, topics…"
            className="w-full h-11 pl-11 pr-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <FilterPill icon={Filter} label="Level" value={level} onChange={(v) => setLevel(v as CourseLevel | "")} options={["", ...LEVELS]} labelize={(v) => v || "All"} />
          <FilterPill label="Dept" value={dept} onChange={setDept} options={["", ...departments]} labelize={(v) => v || "All"} />
          <button
            onClick={() => setMandatoryOnly((v) => !v)}
            className={`h-9 px-3 rounded-full text-xs font-medium border transition ${
              mandatoryOnly
                ? "bg-amber-glow text-plum-ink border-amber-glow"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            Mandatory only
          </button>
        </div>
      </div>

      {featured && (
        <FeaturedCourse course={featured} enrolled={isEnrolled(state, featured.id)} />
      )}

      {rest.length > 0 && (
        <div className="mt-14">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-6">
            All courses
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {rest.map((c) => (
              <CatalogRow key={c.id} course={c} enrolled={isEnrolled(state, c.id)} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-plum-soft px-6 py-16 text-center">
          <div className="font-display text-2xl">No matching courses</div>
          <p className="mt-2 text-sm text-muted-foreground">Try clearing your filters.</p>
        </div>
      )}
    </div>
  );
}

function FilterPill<T extends string>({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  labelize,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: T[];
  labelize: (v: T) => string;
}) {
  return (
    <label className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-border bg-background text-xs">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-transparent font-medium text-foreground focus:outline-none pr-1"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labelize(o)}
          </option>
        ))}
      </select>
    </label>
  );
}

function FeaturedCourse({ course, enrolled }: { course: Course; enrolled: boolean }) {
  return (
    <Link
      to="/courses/$id"
      params={{ id: course.id }}
      className="group grid lg:grid-cols-[1.15fr_1fr] gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-card hover:shadow-card-hover transition"
    >
      <CourseThumbnail course={course} className="h-[240px] lg:h-full min-h-[280px]" />
      <div className="p-6 lg:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-semibold">
          <span className="text-amber-deep">Featured</span>
          <span className="text-muted-foreground">·</span>
          {course.tier === "premium" ? (
            <span className="inline-flex items-center gap-1 text-amber-deep">
              <Crown className="h-3 w-3" /> Premium
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary">
              <Sparkles className="h-3 w-3" /> Included
            </span>
          )}
        </div>
        <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight">{course.title}</h2>
        <p className="mt-3 text-muted-foreground">{course.desc}</p>
        <div className="mt-5 text-xs text-muted-foreground">
          {course.instructor} · {course.duration} · {course.level}
        </div>
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-plum-ink text-white text-sm font-semibold group-hover:bg-primary-hover transition">
            {enrolled ? "Continue Learning" : "Preview & Enroll"}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CatalogRow({ course, enrolled }: { course: Course; enrolled: boolean }) {
  return (
    <Link
      to="/courses/$id"
      params={{ id: course.id }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-card-hover hover:border-primary/30 transition p-4 flex flex-col gap-4"
    >
      <CourseThumbnail course={course} className="h-40 rounded-xl" />
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          {course.tier === "premium" ? (
            <span className="inline-flex items-center gap-1 text-amber-deep font-semibold">
              <Crown className="h-3 w-3" /> Premium
            </span>
          ) : (
            <span className="text-primary font-semibold">Included</span>
          )}
          <span>·</span>
          <span>{course.duration}</span>
          <span>·</span>
          <span>{course.level}</span>
          {course.mandatory && (
            <>
              <span>·</span>
              <span className="text-amber-deep font-semibold">Mandatory</span>
            </>
          )}
        </div>
        <div className="mt-1.5 font-display text-2xl leading-tight">{course.title}</div>
        <div className="text-sm text-muted-foreground mt-1">{course.tagline}</div>
      </div>
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-xs text-muted-foreground">{course.instructor}</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:translate-x-1 transition">
          {enrolled ? "Continue" : "Preview"} <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
