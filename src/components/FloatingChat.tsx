import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Minus, Maximize2, Minimize2, Send, Bot, User, Play } from "lucide-react";
import { toast } from "sonner";

type Msg =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "video"; title: string; videoLabel: string; docHref: string; docLabel: string }
  | { id: string; role: "bot"; kind: "premium"; text: string }
  | { id: string; role: "bot"; kind: "outlook"; text: string; examples: string[] }
  | { id: string; role: "bot"; kind: "prompt"; text: string }
  | { id: string; role: "bot"; kind: "unknown"; text: string };

const SUGGESTIONS = [
  "How do I access Microsoft 365 Copilot?",
  "Compare Basic vs Premium Copilot",
  "Show Outlook prompt examples",
  "How do I request Premium Access?",
  "Where can I find training videos?",
];

const rid = () => Math.random().toString(36).slice(2);

function generateReply(input: string): Msg[] {
  const t = input.toLowerCase();
  if (t.includes("password") || t.includes("reset")) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "video",
        title: "You can reset your AKUH account password from the self-service portal. Here's a quick walkthrough:",
        videoLabel: "Reset your AKUH password (2:14)",
        docHref: "/learning",
        docLabel: "Open account help documentation",
      },
    ];
  }
  if (t.includes("premium") || t.includes("license") || t.includes("licence") || t.includes("upgrade")) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "premium",
        text:
          "**Microsoft 365 Copilot Premium** unlocks in-app AI inside Word, Excel, PowerPoint, Outlook, Teams and OneNote, plus priority processing.\n\nTo request access, submit the Premium Access form — your line manager and the AI CoE will review the request.",
      },
    ];
  }
  if (t.includes("outlook")) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "outlook",
        text: "Copilot in Outlook helps you draft, summarize, and prioritize email. Try prompts like:",
        examples: [
          "Summarize this email thread in 3 bullet points.",
          "Draft a polite reply declining the meeting on Thursday.",
          "What action items are assigned to me in this thread?",
        ],
      },
    ];
  }
  if (t.includes("prompt")) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "prompt",
        text:
          "**Prompt writing tips:**\n• Give context (who, what, why)\n• Specify the format you want\n• Provide examples when possible\n• Iterate — refine, don't restart",
      },
    ];
  }
  if (t.includes("training") || t.includes("video") || t.includes("tutorial") || t.includes("learn")) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "video",
        title: "You'll find video tutorials, app-wise guides, and learning paths on the Learning page:",
        videoLabel: "What is Microsoft Copilot? (4:32)",
        docHref: "/learning",
        docLabel: "Open the Learning page",
      },
    ];
  }
  if (t.includes("access") && (t.includes("copilot") || t.includes("microsoft"))) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "text",
        text:
          "All AKU staff have **Basic Copilot** access via the standalone Copilot Chat. To use Copilot inside Word, Excel, PowerPoint, Outlook, Teams or OneNote, request a **Microsoft 365 Copilot Premium** license from the Premium Access page.",
      },
    ];
  }
  if (t.includes("basic") && t.includes("premium")) {
    return [
      {
        id: rid(),
        role: "bot",
        kind: "text",
        text:
          "**Basic Copilot** (included for all staff): standalone Copilot Chat + Outlook assistance. No in-app Copilot in Word, Excel, PowerPoint.\n\n**Copilot Premium** (license required): embedded Copilot inside Word, Excel, PowerPoint, Outlook, Teams and OneNote, plus priority access.",
      },
    ];
  }
  return [
    {
      id: rid(),
      role: "bot",
      kind: "unknown",
      text: "I couldn't find a matching answer. Would you like a human AI Buddy to reach out?",
    },
  ];
}

const WELCOME: Msg = {
  id: "welcome",
  role: "bot",
  kind: "text",
  text: "Hi! I'm **AI Buddy** — your AKUH Copilot support assistant. Ask about Microsoft 365 Copilot, prompts, licensing, or portal resources.",
};

export const OPEN_CHAT_EVENT = "akuh:open-chat";

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openChat = useCallback(() => {
    setOpen(true);
    setMinimized(false);
  }, []);

  useEffect(() => {
    const h = () => openChat();
    window.addEventListener(OPEN_CHAT_EVENT, h);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, h);
  }, [openChat]);

  useEffect(() => {
    if (open && !minimized) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open, minimized, messages, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { id: rid(), role: "user", kind: "text", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, ...generateReply(t)]);
      setTyping(false);
    }, 900);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const requestHuman = () => {
    toast.success("Your request has been submitted. An AI Champion or AI Buddy will contact you shortly.");
    setMessages((m) => [
      ...m,
      {
        id: rid(),
        role: "bot",
        kind: "text",
        text: "Your request has been submitted. An AI Champion or AI Buddy will contact you shortly.",
      },
    ]);
  };

  // Floating launcher only when chat isn't fully open (or when minimized)
  return (
    <>
      {(!open || minimized) && (
        <div className="fixed bottom-5 right-5 z-40 group">
          <button
            onClick={openChat}
            aria-label="Ask AI Buddy"
            className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground text-background text-xs font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Ask AI Buddy
          </span>
        </div>
      )}

      {open && !minimized && (
        <div
          className={`fixed z-50 bg-card border border-border shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            maximized
              ? "inset-4 md:inset-10 rounded-2xl"
              : "bottom-5 right-5 left-5 sm:left-auto sm:w-[400px] md:w-[420px] h-[min(640px,calc(100vh-3rem))] max-h-[calc(100vh-2.5rem)] rounded-2xl"
          }`}
          role="dialog"
          aria-label="AI Buddy chat"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border rounded-t-2xl bg-gradient-to-r from-primary to-[oklch(0.42_0.17_260)] text-primary-foreground">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight">AI Buddy</div>
              <div className="text-[11px] text-white/80">AI Support Assistant</div>
            </div>
            <button
              onClick={() => setMinimized(true)}
              className="h-7 w-7 rounded-md hover:bg-white/20 flex items-center justify-center transition"
              aria-label="Minimize"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMaximized((v) => !v)}
              className="hidden sm:flex h-7 w-7 rounded-md hover:bg-white/20 items-center justify-center transition"
              aria-label={maximized ? "Restore" : "Maximize"}
            >
              {maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => { setOpen(false); setMaximized(false); }}
              className="h-7 w-7 rounded-md hover:bg-white/20 flex items-center justify-center transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
            {messages.map((m) => (
              <Bubble key={m.id} msg={m} onRequestHuman={requestHuman} onClose={() => setOpen(false)} />
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground">AI Buddy is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-3 pt-2 pb-1 border-t border-border">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent hover:border-primary/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-border bg-card rounded-b-2xl"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about Microsoft Copilot, prompts, licensing, or portal resources..."
                rows={1}
                className="flex-1 resize-none max-h-32 min-h-[40px] px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-10 w-10 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 text-[10px] text-muted-foreground text-right">
              Enter to send • Shift + Enter for new line
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({
  msg,
  onRequestHuman,
  onClose,
}: {
  msg: Msg;
  onRequestHuman: () => void;
  onClose: () => void;
}) {
  if (msg.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2 text-sm whitespace-pre-line">
          {msg.text}
        </div>
        <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0">
          <User className="h-3.5 w-3.5" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="max-w-[85%] bg-muted text-foreground rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm space-y-2">
        {msg.kind === "text" && <div className="whitespace-pre-line">{md(msg.text)}</div>}

        {msg.kind === "video" && (
          <>
            <p className="whitespace-pre-line">{msg.title}</p>
            <div className="rounded-md overflow-hidden border border-border bg-card">
              <div className="aspect-video bg-gradient-to-br from-[oklch(0.88_0.04_255)] to-[oklch(0.78_0.06_255)] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-white/95 flex items-center justify-center shadow">
                  <Play className="h-4 w-4 text-primary ml-0.5" />
                </div>
              </div>
              <div className="p-2 text-xs font-medium">{msg.videoLabel}</div>
            </div>
            <Link
              to={msg.docHref as "/learning"}
              onClick={onClose}
              className="inline-block text-xs font-medium text-primary hover:underline"
            >
              {msg.docLabel} →
            </Link>
          </>
        )}

        {msg.kind === "premium" && (
          <>
            <div className="whitespace-pre-line">{md(msg.text)}</div>
            <Link
              to="/premium"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition"
            >
              Open Premium Access →
            </Link>
          </>
        )}

        {msg.kind === "outlook" && (
          <>
            <p>{msg.text}</p>
            <ul className="space-y-1 pl-1">
              {msg.examples.map((e) => (
                <li key={e} className="text-xs bg-card border border-border rounded-md px-2 py-1.5">
                  {e}
                </li>
              ))}
            </ul>
            <Link
              to="/learning"
              onClick={onClose}
              className="inline-block text-xs font-medium text-primary hover:underline"
            >
              Open Outlook Learning Guide →
            </Link>
          </>
        )}

        {msg.kind === "prompt" && (
          <>
            <div className="whitespace-pre-line">{md(msg.text)}</div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                to="/prompts"
                onClick={onClose}
                className="text-xs font-medium text-primary hover:underline"
              >
                Prompt Library →
              </Link>
              <Link
                to="/playground"
                onClick={onClose}
                className="text-xs font-medium text-primary hover:underline"
              >
                Prompt Playground →
              </Link>
            </div>
          </>
        )}

        {msg.kind === "unknown" && (
          <>
            <p>{msg.text}</p>
            <button
              onClick={onRequestHuman}
              className="mt-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition"
            >
              Request Human AI Buddy
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function md(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}
