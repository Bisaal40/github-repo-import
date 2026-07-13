import type { Course } from "@/lib/courses";

/**
 * Generative course thumbnail — no image assets.
 * Uses OKLCH gradients keyed off the course hue plus a large glyph.
 */
export function CourseThumbnail({
  course,
  className = "",
  showGlyph = true,
  overlay,
}: {
  course: Course;
  className?: string;
  showGlyph?: boolean;
  overlay?: React.ReactNode;
}) {
  const h = course.hue;
  const style: React.CSSProperties = {
    backgroundColor: `oklch(0.22 0.08 ${h})`,
    backgroundImage: [
      `radial-gradient(ellipse 70% 60% at 15% 10%, oklch(0.55 0.18 ${h} / 0.85), transparent 60%)`,
      `radial-gradient(ellipse 50% 70% at 90% 30%, oklch(0.72 0.16 ${Number(h) + 40}) / 0.7, transparent 60%)`.replace(
        ") /",
        " /"
      ),
      `radial-gradient(ellipse 60% 50% at 60% 100%, oklch(0.32 0.14 ${Number(h) - 20}) / 0.9, transparent 65%)`.replace(
        ") /",
        " /"
      ),
    ].join(", "),
  };
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* noise */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {showGlyph && (
        <div
          className="absolute -right-4 -bottom-6 font-display text-white/25 select-none pointer-events-none"
          style={{ fontSize: "min(60%, 12rem)", lineHeight: 1 }}
        >
          {course.glyph}
        </div>
      )}
      {overlay}
    </div>
  );
}
