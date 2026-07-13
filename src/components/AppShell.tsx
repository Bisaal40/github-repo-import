import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingChat } from "./FloatingChat";

// Routes that render their own full-bleed hero/sections and manage padding themselves.
const FULL_BLEED = new Set<string>(["/", "/about", "/premium"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const fullBleed = FULL_BLEED.has(pathname);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {fullBleed ? children : (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10">{children}</div>
        )}
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
