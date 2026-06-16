// Status of an application
export type Status =
  | "applied"
  | "phone_screen"
  | "technical"
  | "onsite"
  | "offer"
  | "signed"
  | "rejected"
  | "withdrawn";

export const STATUS_CONFIG: Record<
  Status,
  { label: string; dot: string; badge: string; order: number }
> = {
  applied: {
    label: "Applied",
    order: 0,
    dot: "bg-stone-500",
    badge: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  },
  phone_screen: {
    label: "Phone screen",
    order: 1,
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  technical: {
    label: "Technical",
    order: 2,
    dot: "bg-violet-500",
    badge:
      "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  },
  onsite: {
    label: "Onsite",
    order: 3,
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  offer: {
    label: "Offer",
    order: 4,
    dot: "bg-emerald-300",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  signed: {
    label: "Signed",
    order: 5,
    dot: "bg-emerald-600",
    badge: "bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white",
  },
  rejected: {
    label: "Rejected",
    order: 6,
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
  withdrawn: {
    label: "Withdrawn",
    order: 7,
    dot: "bg-stone-400",
    badge: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
  },
};

export const STATUS_LIST = Object.keys(STATUS_CONFIG) as Status[];

export type Source =
  | "Referral"
  | "Careers page"
  | "Wellfound"
  | "GitHub list"
  | "Email"
  | "Handshake"
  | "LinkedIn";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: Status;
  source: Source;
  // ISO date string of the last status change
  lastUpdate: string;
  // true when the most recent update came from the AI email parser
  autoUpdated?: boolean;
}

export const sampleApplications: Application[] = [
  {
    id: "1",
    company: "Stripe",
    role: "Software Engineer, New Grad",
    status: "offer",
    source: "Referral",
    lastUpdate: daysAgo(2),
  },
  {
    id: "2",
    company: "Notion",
    role: "Fullstack Engineer",
    status: "onsite",
    source: "Referral",
    lastUpdate: daysAgo(0),
    autoUpdated: true,
  },
  {
    id: "3",
    company: "Vercel",
    role: "Frontend Engineer",
    status: "technical",
    source: "Careers page",
    lastUpdate: daysAgo(1),
  },
  {
    id: "4",
    company: "Linear",
    role: "Software Engineer",
    status: "phone_screen",
    source: "Wellfound",
    lastUpdate: daysAgo(4),
  },
  {
    id: "5",
    company: "Ramp",
    role: "Backend Engineer, New Grad",
    status: "applied",
    source: "GitHub list",
    lastUpdate: daysAgo(7),
  },
  {
    id: "6",
    company: "Figma",
    role: "Product Engineer",
    status: "rejected",
    source: "Careers page",
    lastUpdate: daysAgo(14),
  },
  {
    id: "7",
    company: "Supabase",
    role: "Developer Experience Engineer",
    status: "applied",
    source: "GitHub list",
    lastUpdate: daysAgo(9),
  },
  {
    id: "8",
    company: "Anthropic",
    role: "Member of Technical Staff, New Grad",
    status: "phone_screen",
    source: "Careers page",
    lastUpdate: daysAgo(3),
    autoUpdated: true,
  },
  {
    id: "9",
    company: "Retool",
    role: "Software Engineer",
    status: "withdrawn",
    source: "Email",
    lastUpdate: daysAgo(20),
  },
  {
    id: "10",
    company: "Plaid",
    role: "Backend Engineer",
    status: "technical",
    source: "Referral",
    lastUpdate: daysAgo(5),
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
