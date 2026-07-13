import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "What is Microsoft 365 Copilot?", a: "Microsoft 365 Copilot is an AI assistant integrated across Word, Excel, PowerPoint, Outlook, Teams, and more. It helps you draft, summarize, analyze, and create — using your organization's context." },
  { q: "Who can access Copilot at AKU?", a: "All AKU staff have Tier 1 Basic Access to Copilot Chat. Departmental Premium access is available upon request through the AI Centre of Excellence." },
  { q: "How do I request Premium access?", a: "Go to Premium Access, complete the request form (including your department and use case), and submit. The AI CoE team reviews requests within 5 working days." },
  { q: "What is the Prompt Library?", a: "A curated collection of prompts tailored to AKU roles — nursing, HR, finance, ICT, research, and more — so you can get high-quality outputs without starting from scratch." },
  { q: "How do I contact the AI CoE?", a: "Email ai.coe@aku.edu or use the AI chat at the bottom-right of this portal. For urgent items, call +92-21-3486-4000." },
  { q: "Is my data secure?", a: "Yes. AKU's Copilot deployment respects existing Microsoft 365 permissions. Your prompts and files are not used to train foundation models and remain within your organizational boundary." },
  { q: "Which Microsoft apps support Copilot?", a: "Word, Excel, PowerPoint, Outlook, Teams, OneNote, OneDrive, and SharePoint — with capabilities varying by license tier." },
  { q: "Where can I learn prompt writing?", a: "Visit the Learning section for guided tutorials, and try the Prompt Playground for hands-on practice with instant AI feedback." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground max-w-2xl">
          Frequently asked questions
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Answers to common questions about Copilot at Aga Khan University Hospital.
        </p>
      </div>
      <div className="divide-y divide-border border-t border-b border-border">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-xs font-mono text-muted-foreground w-8">{String(i + 1).padStart(2, "0")}/</span>
                  <span className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {f.q}
                  </span>
                </div>
                <span className={`h-9 w-9 shrink-0 rounded-md grid place-items-center transition-all ${
                  isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-foreground text-background"
                }`}>
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="pl-14 pr-16 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
