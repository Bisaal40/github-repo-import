import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Lock } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupDisabledPage,
});

function SignupDisabledPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card p-8 text-center">
        <div className="mx-auto h-11 w-11 rounded-lg bg-primary text-primary-foreground grid place-items-center shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Signup disabled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a prototype for demonstration purposes. New accounts cannot be created.
          Please sign in using one of the two provided demo accounts.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Public signup is turned off
        </div>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
