import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { portalActions, usePortal } from "@/lib/portal-store";
import type { Course } from "@/lib/courses";
import { Sparkles } from "lucide-react";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  employeeId: z
    .string()
    .trim()
    .min(3, "Enter your Employee ID or AKU email")
    .max(80)
    .refine(
      (v) => /^AKU-?\w+$/i.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Use an Employee ID (e.g. AKU-12345) or your @aku.edu email"
    ),
  department: z.string().trim().min(2, "Select your department").max(80),
});

export function EnrollModal({
  course,
  open,
  onOpenChange,
}: {
  course: Course | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const state = usePortal();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(state.profile.name);
  const [employeeId, setEmployeeId] = useState(state.profile.email);
  const [department, setDepartment] = useState(state.profile.department);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!course) return null;

  const submit = () => {
    const parsed = schema.safeParse({ fullName, employeeId, department });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    portalActions.enroll(course.id, parsed.data);
    setTimeout(() => {
      setSubmitting(false);
      onOpenChange(false);
      toast.success(`Enrolled in ${course.title}`, {
        description: "Jumping into your first lesson…",
      });
      navigate({ to: "/learn/$id", params: { id: course.id } });
    }, 350);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="bg-plum-mesh text-white p-6 relative">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
            <Sparkles className="h-3 w-3" /> Enrollment
          </div>
          <DialogHeader className="mt-2 space-y-1">
            <DialogTitle className="font-display text-2xl text-white leading-tight">
              {course.title}
            </DialogTitle>
            <DialogDescription className="text-white/70 text-sm">
              {course.duration} · {course.level} · Confirm a few details to begin.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Full name" error={errors.fullName}>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aisha Siddiqui"
            />
          </Field>
          <Field label="Employee ID or AKU email" error={errors.employeeId}>
            <Input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="AKU-12345 or you@aku.edu"
            />
          </Field>
          <Field label="Department" error={errors.department}>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Nursing"
            />
          </Field>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0 gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            {submitting ? "Enrolling…" : "Confirm & start"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
}
