import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Crown, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { usePortal, portalActions, selectStats } from "@/lib/portal-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile Settings — AKUH Learning Portal" },
      { name: "description", content: "Manage your profile, learning summary, and account preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const state = usePortal();
  const stats = selectStats(state);
  const [form, setForm] = useState(state.profile);
  const isPremium = state.premium.status === "approved";
  const initials = form.name.split(" ").slice(0, 2).map((s) => s[0]).join("");

  const save = () => {
    portalActions.updateProfile(form);
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[0.28em] text-amber-deep font-semibold">Profile</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight">Your details</h1>
      </header>

      <div className="grid lg:grid-cols-[340px_1fr] gap-10">
        {/* Sticky summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl bg-plum-mesh text-white p-6">
            <div className="mx-auto h-24 w-24 rounded-2xl bg-amber-glow text-plum-ink text-3xl font-display grid place-items-center shadow-glow-amber">
              {initials || <User className="h-8 w-8" />}
            </div>
            <div className="mt-4 text-center">
              <div className="font-display text-2xl">{form.name}</div>
              <div className="text-sm text-white/70">{form.email}</div>
              <div className="mt-1 text-xs text-white/50">{form.role} · {form.department}</div>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {isPremium ? (
                <Badge tone="amber"><Crown className="h-3 w-3" /> Premium</Badge>
              ) : (
                <Badge><Sparkles className="h-3 w-3" /> Tier 1 Basic</Badge>
              )}
              <Badge><User className="h-3 w-3" /> Employee</Badge>
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 text-center">
              <MiniStat value={stats.enrolledCount} label="Enrolled" />
              <MiniStat value={stats.inProgressCount} label="Ongoing" />
              <MiniStat value={stats.completedCount} label="Certs" />
            </div>
          </div>
        </aside>

        <div>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-2 border-b border-border rounded-none w-full justify-start">
              {[
                { v: "basic", label: "Basic Info" },
                { v: "about", label: "About" },
                { v: "education", label: "Education" },
                { v: "experience", label: "Experience" },
                { v: "password", label: "Change Password" },
              ].map((t) => (
                <TabsTrigger
                  key={t.v}
                  value={t.v}
                  className="rounded-none border-0 px-4 py-3 text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-glow -mb-px"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="basic" className="mt-8 space-y-5 animate-in fade-in duration-200">
              <Row>
                <FieldWrap label="Full name">
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </FieldWrap>
                <FieldWrap label="Role">
                  <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </FieldWrap>
              </Row>
              <Row>
                <FieldWrap label="Email">
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </FieldWrap>
                <FieldWrap label="Department">
                  <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </FieldWrap>
              </Row>
              <SaveBar onSave={save} />
            </TabsContent>

            <TabsContent value="about" className="mt-8 animate-in fade-in duration-200">
              <FieldWrap label="About you">
                <Textarea rows={6} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
              </FieldWrap>
              <SaveBar onSave={save} />
            </TabsContent>

            <TabsContent value="education" className="mt-8 animate-in fade-in duration-200">
              <FieldWrap label="Education">
                <Textarea rows={5} value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
              </FieldWrap>
              <SaveBar onSave={save} />
            </TabsContent>

            <TabsContent value="experience" className="mt-8 animate-in fade-in duration-200">
              <FieldWrap label="Experience">
                <Textarea rows={5} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              </FieldWrap>
              <SaveBar onSave={save} />
            </TabsContent>

            <TabsContent value="password" className="mt-8 space-y-5 animate-in fade-in duration-200">
              <FieldWrap label="Current password"><Input type="password" placeholder="••••••••" /></FieldWrap>
              <FieldWrap label="New password"><Input type="password" placeholder="••••••••" /></FieldWrap>
              <FieldWrap label="Confirm new password"><Input type="password" placeholder="••••••••" /></FieldWrap>
              <div className="pt-2">
                <Button onClick={() => toast.success("Password updated")} className="bg-plum-ink text-white hover:bg-primary-hover">
                  <Check className="h-4 w-4 mr-1" /> Update password
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="pt-2 flex justify-end">
      <Button onClick={onSave} className="bg-plum-ink text-white hover:bg-primary-hover rounded-full px-6">
        Save changes
      </Button>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: "amber" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
        tone === "amber"
          ? "bg-amber-glow text-plum-ink border-amber-glow"
          : "bg-white/10 text-white border-white/20"
      }`}
    >
      {children}
    </span>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-amber-glow leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">{label}</div>
    </div>
  );
}
