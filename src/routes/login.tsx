import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, Info } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      const user = login(email, password);
      setLoading(false);
      if (!user) {
        toast.error("Invalid credentials. Use one of the demo accounts below.");
        return;
      }
      toast.success(`Signed in as ${user.role === "admin" ? "Admin" : user.name}`);
      navigate({ to: user.role === "admin" ? "/admin" : "/profile" });
    }, 500);
  };

  const fill = (e: string, p: string) => { setEmail(e); setPassword(p); };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card p-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-11 w-11 rounded-lg bg-primary text-primary-foreground grid place-items-center shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back to the AKUH Learning Portal.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Email" icon={<Mail className="h-4 w-4" />}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@akuh.demo"
              className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </Field>
          <Field label="Password" icon={<Lock className="h-4 w-4" />}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Info className="h-3.5 w-3.5" /> Demo accounts
          </div>
          <div className="mt-3 space-y-2">
            <DemoRow label="Employee" email="employee@akuh.demo" password="Employee123" onUse={() => fill("employee@akuh.demo", "Employee123")} />
            <DemoRow label="Admin" email="admin@akuh.demo" password="Admin123" onUse={() => fill("admin@akuh.demo", "Admin123")} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This is a prototype — signup is disabled. <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}

function DemoRow({ label, email, password, onUse }: { label: string; email: string; password: string; onUse: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-card border border-border px-3 py-2">
      <div className="min-w-0">
        <div className="text-xs font-semibold">{label}</div>
        <div className="text-[11px] text-muted-foreground truncate">{email} · {password}</div>
      </div>
      <button type="button" onClick={onUse} className="text-[11px] font-medium text-primary hover:underline shrink-0">
        Use
      </button>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-foreground mb-1.5">{label}</div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
