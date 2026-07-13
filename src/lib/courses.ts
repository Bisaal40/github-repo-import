export type CourseTier = "basic" | "premium";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  mandatory?: boolean;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  tier: CourseTier;
  title: string;
  tagline: string;
  desc: string;
  instructor: string;
  duration: string;
  level: CourseLevel;
  department: string;
  mandatory: boolean;
  outcomes: string[];
  modules: Module[];
  hue: string; // for thumbnail gradient
  glyph: string; // short symbol for thumbnail
};

export const COURSES: Course[] = [
  {
    id: "foundations",
    tier: "basic",
    title: "Copilot Foundations",
    tagline: "Start here.",
    desc: "The essential mental model for using Microsoft Copilot at AKUH — from access tiers to prompting patterns you'll use every day.",
    instructor: "Dr. Sana Rehman · AI CoE",
    duration: "1h 20m",
    level: "Beginner",
    department: "All Departments",
    mandatory: true,
    hue: "285",
    glyph: "◈",
    outcomes: [
      "Explain what Copilot is and is not",
      "Navigate the AKUH Learning Portal confidently",
      "Write prompts that consistently produce useful output",
      "Know which tier of access your role requires",
    ],
    modules: [
      {
        id: "w1",
        title: "Week 1 · Orientation",
        lessons: [
          { id: "l1", title: "What is Copilot?", duration: "6m", mandatory: true },
          { id: "l2", title: "Tour of the Learning Portal", duration: "8m", mandatory: true },
          { id: "l3", title: "Access Tiers Explained", duration: "5m" },
        ],
      },
      {
        id: "w2",
        title: "Week 2 · Prompting",
        lessons: [
          { id: "l4", title: "Anatomy of a great prompt", duration: "12m", mandatory: true },
          { id: "l5", title: "Using the Role-Based Prompt Library", duration: "9m" },
        ],
      },
    ],
  },
  {
    id: "outlook",
    tier: "basic",
    title: "Copilot for Outlook",
    tagline: "Reclaim your inbox.",
    desc: "Use Copilot Chat to summarize long threads, draft professional replies, and triage your inbox in a fraction of the time.",
    instructor: "Farhan Ali · Productivity Lead",
    duration: "45m",
    level: "Beginner",
    department: "All Departments",
    mandatory: false,
    hue: "230",
    glyph: "✉",
    outcomes: [
      "Summarize threads under 60 seconds",
      "Draft consistent, on-tone replies",
      "Set up prompt patterns for daily triage",
    ],
    modules: [
      {
        id: "w1",
        title: "Week 1 · Reading & Summarizing",
        lessons: [
          { id: "o1", title: "Summarizing long threads", duration: "7m", mandatory: true },
          { id: "o2", title: "Extracting action items", duration: "6m" },
        ],
      },
      {
        id: "w2",
        title: "Week 2 · Drafting",
        lessons: [
          { id: "o3", title: "Drafting professional replies", duration: "10m" },
          { id: "o4", title: "Prompt patterns for inbox triage", duration: "8m" },
        ],
      },
    ],
  },
  {
    id: "word",
    tier: "premium",
    title: "Copilot for Word",
    tagline: "Draft, rewrite, refine.",
    desc: "Master in-app AI drafting and editing — from generating first drafts to reviewing tone and summarizing long documents.",
    instructor: "Maria D'Souza · Editorial Lead",
    duration: "1h 45m",
    level: "Intermediate",
    department: "All Departments",
    mandatory: false,
    hue: "220",
    glyph: "W",
    outcomes: [
      "Draft documents from a short prompt",
      "Adjust tone and register with precision",
      "Summarize long documents into briefs",
      "Use Copilot to review your writing",
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1 · Drafting",
        lessons: [
          { id: "w1", title: "Drafting from a prompt", duration: "14m", mandatory: true },
          { id: "w2", title: "Templates and starting points", duration: "9m" },
        ],
      },
      {
        id: "m2",
        title: "Module 2 · Editing",
        lessons: [
          { id: "w3", title: "Rewriting and tone control", duration: "11m" },
          { id: "w4", title: "Summarizing long documents", duration: "8m" },
          { id: "w5", title: "Reviewing with Copilot", duration: "10m" },
        ],
      },
    ],
  },
  {
    id: "excel",
    tier: "premium",
    title: "Data Analysis with Copilot in Excel",
    tagline: "Ask your data questions.",
    desc: "Natural-language formulas, trend detection, and PivotTable insights — without memorizing syntax.",
    instructor: "Zain Kazim · Data & Insights",
    duration: "2h 10m",
    level: "Advanced",
    department: "Finance · Operations",
    mandatory: false,
    hue: "150",
    glyph: "∑",
    outcomes: [
      "Ask Copilot questions about a dataset",
      "Generate formulas from plain English",
      "Spot charts and trends automatically",
      "Extract insights from PivotTables",
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1 · Foundations",
        lessons: [
          { id: "e1", title: "Asking Copilot about your data", duration: "13m", mandatory: true },
          { id: "e2", title: "Generating formulas", duration: "12m" },
        ],
      },
      {
        id: "m2",
        title: "Module 2 · Analysis",
        lessons: [
          { id: "e3", title: "Charts and trends", duration: "10m" },
          { id: "e4", title: "PivotTable insights", duration: "14m" },
        ],
      },
    ],
  },
  {
    id: "agents",
    tier: "premium",
    title: "Building Custom AI Agents",
    tagline: "Automate the repetitive.",
    desc: "Design, test, and deploy multi-step agents that connect Microsoft 365 apps to real AKUH workflows.",
    instructor: "Dr. Sana Rehman · AI CoE",
    duration: "2h 30m",
    level: "Advanced",
    department: "All Departments",
    mandatory: false,
    hue: "40",
    glyph: "⚙",
    outcomes: [
      "Understand what an agent is (and isn't)",
      "Design a multi-step workflow",
      "Test and iterate on agent behavior",
      "Deploy an agent for your team",
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1 · Concepts",
        lessons: [
          { id: "a1", title: "Agent basics", duration: "12m", mandatory: true },
          { id: "a2", title: "Designing a workflow", duration: "15m", mandatory: true },
        ],
      },
      {
        id: "m2",
        title: "Module 2 · Build & Ship",
        lessons: [
          { id: "a3", title: "Testing and iterating", duration: "18m" },
          { id: "a4", title: "Deploying to your team", duration: "12m" },
        ],
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function allLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function totalLessons(course: Course): number {
  return allLessons(course).length;
}
