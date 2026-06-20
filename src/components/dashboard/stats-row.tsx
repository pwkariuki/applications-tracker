import { useMemo } from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { ACTIVE_STATUSES } from "@/data/types";

type StatsRowProps = {
  applications: Doc<"applications">[];
};

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <div className={`text-2xl font-medium leading-none ${accent ?? ""}`}>
        {value}
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function StatsRow({ applications }: StatsRowProps) {
  const stats = useMemo(() => {
    const total = applications.length;

    const active = applications.filter((a) =>
      ACTIVE_STATUSES.includes(a.status),
    ).length;

    const offers = applications.filter(
      (a) => a.status === "offer" || a.status === "signed",
    ).length;

    const responded = applications.filter(
      (a) => a.status !== "applied" && a.status !== "withdrawn",
    ).length;
    const responseRate =
      total === 0 ? 0 : Math.round((responded / total) * 100);

    return { total, active, offers, responseRate };
  }, [applications]);

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      <Stat label="Total Applied" value={String(stats.total)} />
      <Stat
        label="Active"
        value={String(stats.active)}
        accent="text-blue-600 dark:text-blue-400"
      />
      <Stat
        label="Offers"
        value={String(stats.offers)}
        accent="text-emerald-600 dark:text-emerald-400"
      />
      <Stat label="Response Rate" value={`${stats.responseRate}%`} />
    </div>
  );
}
