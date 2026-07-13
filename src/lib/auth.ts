// Simple prototype auth with two fixed demo accounts.
// Session is stored in localStorage under AUTH_KEY.

export type DemoRole = "employee" | "admin";

export type DemoUser = {
  role: DemoRole;
  name: string;
  email: string;
  department: string;
  initials: string;
};

type Credential = { email: string; password: string; user: DemoUser };

export const DEMO_CREDENTIALS: Credential[] = [
  {
    email: "employee@akuh.demo",
    password: "Employee123",
    user: {
      role: "employee",
      name: "Aisha Siddiqui",
      email: "employee@akuh.demo",
      department: "Nursing",
      initials: "AS",
    },
  },
  {
    email: "admin@akuh.demo",
    password: "Admin123",
    user: {
      role: "admin",
      name: "Admin",
      email: "admin@akuh.demo",
      department: "AI Centre of Excellence",
      initials: "AD",
    },
  },
];

const AUTH_KEY = "akuh-auth-user-v1";
const AUTH_EVENT = "akuh-auth-changed";

export function login(email: string, password: string): DemoUser | null {
  const match = DEMO_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
  );
  if (!match) return null;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(match.user));
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return match.user;
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

// React hook — subscribes to auth changes (login/logout and cross-tab).
import { useEffect, useState } from "react";

export function useCurrentUser(): DemoUser | null {
  const [user, setUser] = useState<DemoUser | null>(null);
  useEffect(() => {
    setUser(getCurrentUser());
    const onChange = () => setUser(getCurrentUser());
    window.addEventListener(AUTH_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(AUTH_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return user;
}
