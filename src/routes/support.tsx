import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Bot, Play } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/support")({
  validateSearch: searchSchema,
  component: Support,
});

type Msg =
  | { id: string; role: "user" | "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "video"; title: string; text: string }
  | { id: string; role: "bot"; kind: "buddy"; text: string };

const suggestions = ["Reset my password", "Leave policy", "Request an AI Buddy"];

function reply(input: string): Msg[] {
  const t = input.toLowerCase();
  const id = () => Math.random().toString(36).slice(2);
  if (t.includes("password") || t.includes("reset")) {
    return [
      { id: id(), role: "bot", kind: "video", title: "Here's a video that answers your question.", text: "Reset your AKUH password (2:14)" },
    ];
  }
  if (t.includes("leave") || t.includes("policy") || t.includes("vacation")) {
    return [
      {
        id: id(),
        role: "bot",
        kind: "text",
        text:
          "**AKUH Leave Policy (summary):**\n• Annual leave: 20 working days\n• Sick leave: 10 days with medical certificate\n• Maternity leave: 12 weeks paid\n• Requests submitted via the HR portal, approved by your line manager.",
      },
    ];
  }
  if (t.includes("buddy")) {
    return [{ id: id(), role: "bot", kind: "buddy", text: "Sure — I can connect you with an AI Buddy." }];
  }
  return [
    {
      id: id(),
      role: "bot",
      kind: "buddy",
      text: "I couldn't find an answer to that. Would you like to request a human AI Buddy?",
    },
  ];
}

function Support() {
  const { q } = Route.useSearch();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", role: "bot", kind: "text", text: "Hi! I'm the AKUH Copilot support assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialQ = useRef(q);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), role: "user", kind: "text", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, ...reply(text)]);
      setTyping(false);
    }, 900);
  };

  useEffect(() => {
    if (initialQ.current) {
      const q0 = initialQ.current;
      initialQ.current = undefined;
      setTimeout(() => send(q0), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const requestBuddy = () => {
    toast.success("Your request has been sent — an AI Buddy will reach out soon.");
    setMessages((m) => [
      ...m,
      { id: Math.random().toString(36).slice(2), role: "bot", kind: "text", text: "Your request has been sent — an AI Buddy will reach out soon." },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="bg-card border border-border rounded-lg shadow-card flex flex-col h-[70vh]">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium">Support Assistant</div>
            <div className="text-[11px] text-muted-foreground">Usually replies instantly</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} onRequestBuddy={requestBuddy} />
          ))}
          {typing && (
            <div className="flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onRequestBuddy }: { msg: Msg; onRequestBuddy: () => void }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 text-sm">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-2 text-sm space-y-2">
        {msg.kind === "text" && (
          <p className="whitespace-pre-line">{renderMarkdown(msg.text)}</p>
        )}
        {msg.kind === "video" && (
          <>
            <p>{msg.title}</p>
            <div className="rounded-md overflow-hidden border border-border bg-card">
              <div className="aspect-video bg-gradient-to-br from-[oklch(0.88_0.04_255)] to-[oklch(0.78_0.06_255)] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-white/95 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary ml-0.5" />
                </div>
              </div>
              <div className="p-2 text-xs font-medium text-foreground">{msg.text}</div>
            </div>
          </>
        )}
        {msg.kind === "buddy" && (
          <>
            <p>{msg.text}</p>
            <button
              onClick={onRequestBuddy}
              className="mt-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition-colors"
            >
              Request an AI Buddy
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  // Minimal bold rendering for **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
