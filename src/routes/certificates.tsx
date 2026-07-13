import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Download, Linkedin, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePortal, selectStats, useHydrated } from "@/lib/portal-store";
import type { Course } from "@/lib/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "My Certificates — AKUH Learning Portal" },
      { name: "description", content: "Every certificate you've earned across the AKUH Learning Portal." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const state = usePortal();
  const hydrated = useHydrated();
  const stats = selectStats(state);
  const [open, setOpen] = useState<Course | null>(null);

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <header className="mb-12">
        <div className="text-[11px] uppercase tracking-[0.28em] text-amber-deep font-semibold">Wall of wins</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight">Your certificates.</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Every completed course lives here — download the PDF or share to LinkedIn in one tap.
        </p>
      </header>

      {hydrated && stats.completedCount === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {stats.completed.map((c) => (
            <CertificateTile
              key={c.id}
              course={c}
              date={state.enrollments[c.id]?.completedAt}
              name={state.profile.name}
              onOpen={() => setOpen(c)}
            />
          ))}
        </div>
      )}

      {open && (
        <CertificateModal
          course={open}
          name={state.profile.name}
          date={state.enrollments[open.id]?.completedAt}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

function CertificateTile({
  course, date, name, onOpen,
}: {
  course: Course;
  date?: string;
  name: string;
  onOpen: () => void;
}) {
  const dateStr = date
    ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "Recently";
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card hover:shadow-card-hover transition">
      <div
        onClick={onOpen}
        className="cursor-pointer relative aspect-[16/10] overflow-hidden"
      >
        <CourseThumbnail course={course} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" showGlyph={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-ink/95 via-plum-ink/40 to-transparent" />

        {/* Certificate faux-plate */}
        <div className="absolute inset-0 grid place-items-center p-8">
          <div className="w-full max-w-[380px] rounded-2xl bg-white/95 backdrop-blur border-2 border-amber-glow/50 shadow-glow-amber p-6 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-amber-glow to-amber-deep grid place-items-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="mt-3 text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
              Certificate of Completion
            </div>
            <div className="mt-2 font-display text-lg leading-tight">{name}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">completed</div>
            <div className="mt-0.5 font-display text-base text-primary leading-tight">{course.title}</div>
          </div>
        </div>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Certificate download started");
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full bg-white text-plum-ink text-sm font-semibold hover:bg-amber-glow transition"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Added to LinkedIn profile");
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full bg-[#0A66C2] text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </button>
        </div>
      </div>

      <div className="p-5 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Issued {dateStr}</div>
          <div className="mt-0.5 font-display text-xl truncate">{course.title}</div>
        </div>
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:translate-x-1 transition shrink-0"
        >
          View <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CertificateModal({
  course, name, date, onClose,
}: {
  course: Course;
  name: string;
  date?: string;
  onClose: () => void;
}) {
  const dateStr = date
    ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "Recently";
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-plum-ink/80 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="text-sm font-medium">Certificate of Completion</div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative p-10 bg-plum-soft">
          <div className="border-[6px] border-double border-plum-ink/20 rounded-2xl bg-white p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-glow/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-amber-glow to-amber-deep grid place-items-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div className="mt-4 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                AKUH Learning Portal
              </div>
              <div className="mt-1 font-display text-3xl">Certificate of Completion</div>
              <p className="mt-8 text-sm text-muted-foreground">This certifies that</p>
              <p className="mt-1 font-display text-4xl italic">{name}</p>
              <p className="mt-4 text-sm text-muted-foreground">has successfully completed the course</p>
              <p className="mt-1 font-display text-2xl text-primary">{course.title}</p>
              <div className="mt-10 flex items-center justify-between text-xs text-muted-foreground">
                <div>Issued {dateStr}</div>
                <div>Aga Khan University Hospital · AI CoE</div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-border flex justify-end gap-2">
          <button
            onClick={() => toast.success("Added to LinkedIn")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#0A66C2] text-white text-sm font-medium"
          >
            <Linkedin className="h-4 w-4" /> Add to LinkedIn
          </button>
          <button
            onClick={() => toast.success("Certificate download started")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-plum-ink text-white text-sm font-medium"
          >
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-plum-soft border border-border px-6 py-20 text-center">
      <div className="mx-auto relative h-32 w-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-amber-glow/30 blur-2xl" />
        <div className="relative h-full w-full rounded-full bg-white shadow-card grid place-items-center border border-amber-glow/40">
          <Award className="h-14 w-14 text-amber-deep" />
        </div>
      </div>
      <div className="font-display text-3xl">No certificates yet</div>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Complete your first course and your certificate will appear here — ready to download and share.
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
