import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Target, Shield, Users } from "lucide-react";
import { FAQ } from "../components/FAQ";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Learning Portal" },
      { name: "description", content: "About the AKUH Learning Portal and the AI Centre of Excellence." },
    ],
  }),
});

const PILLARS = [
  { icon: Target, title: "Our Mission", body: "Empower every AKU staff member to work smarter, safer, and faster with AI." },
  { icon: Shield, title: "Responsible AI", body: "Every capability follows AKU's Responsible AI principles — privacy first, human in the loop." },
  { icon: Users, title: "AI Centre of Excellence", body: "A dedicated team supporting departments with training, tooling, and premium access." },
];

function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[oklch(0.96_0.02_255)] to-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> About the Learning Portal
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-foreground max-w-3xl mx-auto">
            AI at Aga Khan University Hospital
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            A single home for learning, prompts, and support — designed to help every team put Microsoft 365 Copilot to work responsibly.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl bg-card border border-border p-8 shadow-card hover:shadow-card-hover transition">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <FAQ />
    </div>
  );
}
