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
    badge:
      "bg-emerald-300 text-emerald-900 dark:bg-emerald-600 dark:text-emerald-400",
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

export const ACTIVE_STATUSES: Status[] = [
  "phone_screen",
  "technical",
  "onsite",
];

export type Source =
  | "Referral"
  | "Careers page"
  | "Wellfound"
  | "GitHub list"
  | "Email"
  | "Handshake"
  | "LinkedIn";
