import { useEffect, useSyncExternalStore } from "react";
import { COURSES, allLessons, getCourse, type Course } from "./courses";

export type Enrollment = {
  courseId: string;
  enrolledAt: string;
  fullName: string;
  employeeId: string;
  department: string;
  completedLessonIds: string[];
  completedAt?: string;
};

export type Notification = {
  id: string;
  category: "Enrollment" | "Certificate" | "Announcement" | "Learning Resources";
  title: string;
  desc: string;
  date: string; // ISO
  read: boolean;
};

export type PortalProfile = {
  name: string;
  email: string;
  department: string;
  role: string;
  about: string;
  education: string;
  experience: string;
};

export type PremiumStatus = "none" | "pending" | "approved" | "rejected";

export type PortalState = {
  enrollments: Record<string, Enrollment>;
  notifications: Notification[];
  profile: PortalProfile;
  premium: { status: PremiumStatus; requestedAt?: string };
};

const KEY = "akuh-portal-v2";
const LEGACY_KEY = "akuh-profile-v1";
const LEGACY_PREMIUM_KEY = "akuh-premium-request-v1";

const DEFAULT_PROFILE: PortalProfile = {
  name: "Aisha Siddiqui",
  email: "aisha.s@aku.edu",
  department: "Nursing",
  role: "Senior Nurse",
  about:
    "Senior Nurse at AKUH with 8+ years in critical care. Exploring how AI copilots can free up bedside time.",
  education: "BSN, Aga Khan University School of Nursing (2016)",
  experience: "Nursing Department, AKUH — 2016 to present",
};

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "seed-1",
    category: "Learning Resources",
    title: "New Outlook guide added",
    desc: "A step-by-step walkthrough for Copilot in Outlook.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
  },
  {
    id: "seed-2",
    category: "Announcement",
    title: "Upcoming Copilot workshop",
    desc: "Register for the next hands-on session, next Tuesday.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: false,
  },
  {
    id: "seed-3",
    category: "Announcement",
    title: "New Responsible AI guidelines",
    desc: "Updated principles for safe, effective AI use at AKU.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    read: true,
  },
];

function defaultState(): PortalState {
  return {
    enrollments: {},
    notifications: SEED_NOTIFICATIONS,
    profile: DEFAULT_PROFILE,
    premium: { status: "none" },
  };
}

let state: PortalState = defaultState();
let hydrated = false;
const listeners = new Set<() => void>();

function migrate(): PortalState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const p = JSON.parse(legacy) as { enrolled?: Record<string, string[]>; completedAt?: Record<string, string> };
      const enrollments: Record<string, Enrollment> = {};
      Object.entries(p.enrolled ?? {}).forEach(([cid, lessons]) => {
        const c = getCourse(cid);
        if (!c) return;
        enrollments[cid] = {
          courseId: cid,
          enrolledAt: new Date().toISOString(),
          fullName: DEFAULT_PROFILE.name,
          employeeId: "AKU-00000",
          department: DEFAULT_PROFILE.department,
          completedLessonIds: [],
          completedAt: p.completedAt?.[cid],
        };
        // best-effort: map by title
        const titles = new Set(lessons);
        enrollments[cid].completedLessonIds = allLessons(c)
          .filter((l) => titles.has(l.title))
          .map((l) => l.id);
      });
      const premRaw = window.localStorage.getItem(LEGACY_PREMIUM_KEY);
      const premium = premRaw ? JSON.parse(premRaw) : { status: "none" };
      return { ...defaultState(), enrollments, premium };
    }
  } catch {
    /* ignore */
  }
  return defaultState();
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  state = migrate();
  hydrated = true;
  emit();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function set(updater: (s: PortalState) => PortalState) {
  state = updater(state);
  persist();
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;
const getServerSnapshot = () => defaultState();

export function usePortal() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);
  return s;
}

export function useHydrated(): boolean {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);
  // subtle: `s` triggers re-render after hydrate runs (emit is called)
  void s;
  return hydrated;
}

/* ---------------- actions ---------------- */

function pushNotification(n: Omit<Notification, "id" | "date" | "read">) {
  const notif: Notification = {
    ...n,
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    read: false,
  };
  set((s) => ({ ...s, notifications: [notif, ...s.notifications] }));
}

export const portalActions = {
  enroll(courseId: string, data: { fullName: string; employeeId: string; department: string }) {
    const c = getCourse(courseId);
    if (!c) return;
    set((s) => ({
      ...s,
      enrollments: {
        ...s.enrollments,
        [courseId]: {
          courseId,
          enrolledAt: new Date().toISOString(),
          fullName: data.fullName,
          employeeId: data.employeeId,
          department: data.department,
          completedLessonIds: [],
        },
      },
    }));
    pushNotification({
      category: "Enrollment",
      title: `Enrolled in ${c.title}`,
      desc: "Your course is now in My Learning. Continue anytime.",
    });
  },

  toggleLesson(courseId: string, lessonId: string) {
    const c = getCourse(courseId);
    if (!c) return;
    set((s) => {
      const e = s.enrollments[courseId];
      if (!e) return s;
      const done = new Set(e.completedLessonIds);
      if (done.has(lessonId)) done.delete(lessonId);
      else done.add(lessonId);
      const nextIds = Array.from(done);
      const isNowComplete = nextIds.length === allLessons(c).length;
      const wasComplete = !!e.completedAt;
      const completedAt =
        isNowComplete && !wasComplete
          ? new Date().toISOString()
          : !isNowComplete && wasComplete
          ? undefined
          : e.completedAt;
      const updated: Enrollment = { ...e, completedLessonIds: nextIds, completedAt };
      const next: PortalState = {
        ...s,
        enrollments: { ...s.enrollments, [courseId]: updated },
      };
      return next;
    });
    // fire certificate notification outside the setter for cleanliness
    const cur = state.enrollments[courseId];
    if (cur?.completedAt) {
      const already = state.notifications.some(
        (n) => n.category === "Certificate" && n.title.includes(c.title)
      );
      if (!already) {
        pushNotification({
          category: "Certificate",
          title: `Certificate ready · ${c.title}`,
          desc: "Congratulations! Your certificate is available in My Certificates.",
        });
      }
    }
  },

  markCourseComplete(courseId: string) {
    const c = getCourse(courseId);
    if (!c) return;
    set((s) => {
      const e = s.enrollments[courseId];
      if (!e) return s;
      const allIds = allLessons(c).map((l) => l.id);
      return {
        ...s,
        enrollments: {
          ...s.enrollments,
          [courseId]: {
            ...e,
            completedLessonIds: allIds,
            completedAt: e.completedAt ?? new Date().toISOString(),
          },
        },
      };
    });
    const already = state.notifications.some(
      (n) => n.category === "Certificate" && n.title.includes(c.title)
    );
    if (!already) {
      pushNotification({
        category: "Certificate",
        title: `Certificate ready · ${c.title}`,
        desc: "Congratulations! Your certificate is available in My Certificates.",
      });
    }
  },

  markNotificationRead(id: string) {
    set((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  markAllNotificationsRead() {
    set((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  requestPremium() {
    set((s) => ({ ...s, premium: { status: "pending", requestedAt: new Date().toISOString() } }));
    pushNotification({
      category: "Announcement",
      title: "Premium access requested",
      desc: "The AI CoE team will review your request shortly.",
    });
  },

  updateProfile(patch: Partial<PortalProfile>) {
    set((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  },
};

/* ---------------- selectors ---------------- */

export function selectEnrolledCourses(s: PortalState): Course[] {
  return COURSES.filter((c) => c.id in s.enrollments);
}

export function selectStats(s: PortalState) {
  const enrolled = selectEnrolledCourses(s);
  const completed = enrolled.filter((c) => s.enrollments[c.id]?.completedAt);
  const inProgress = enrolled.filter((c) => !s.enrollments[c.id]?.completedAt);
  return {
    enrolledCount: enrolled.length,
    completedCount: completed.length,
    inProgressCount: inProgress.length,
    enrolled,
    completed,
    inProgress,
  };
}

export function courseProgress(s: PortalState, courseId: string): number {
  const c = getCourse(courseId);
  const e = s.enrollments[courseId];
  if (!c || !e) return 0;
  const total = allLessons(c).length;
  if (!total) return 0;
  return Math.round((e.completedLessonIds.length / total) * 100);
}

export function isEnrolled(s: PortalState, courseId: string): boolean {
  return courseId in s.enrollments;
}
