import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Preference controls will appear here in a future release.
        </p>
      </div>
    </div>
  );
}
