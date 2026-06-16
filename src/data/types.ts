// Status of an application

export type Status =
  | "applied"
  | "referred"
  | "phone_screen"
  | "technical"
  | "onsite"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "signed";

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
