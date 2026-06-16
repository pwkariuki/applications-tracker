import type { Application } from "@/data/types";

// Deterministic color per company so the logo square is stable across renders
const LOGO_COLORS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
];

const colorFor = (company: string): string => {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
};

const CompanyCell = ({ application }: { application: Application }) => {
  const initials = application.company.slice(0, 2);
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-medium
        ${colorFor(application.company)}`}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <div className="truncate font-medium">{application.company}</div>
        <div className="truncate text-xs text-muted-foreground">
          {application.role}
        </div>
      </div>
    </div>
  );
};

export default CompanyCell;
