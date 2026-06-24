import { useQuery } from "convex/react";
import { Link } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  CircleDot,
  Inbox,
  Calendar,
  Clock,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { colorFor } from "@/components/dashboard/company-cell";
import SelectStatus from "./select-status";

function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-8 grid-cols-[160px_1fr] items-center rounded-md px-2 -mx-2 hover:bg-muted/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function ApplicationDetail({ id }: { id: string }) {
  const application = useQuery(api.applications.get, {
    id: id as Id<"applications">,
  });

  if (application === undefined) {
    return (
      <div className="mx-auto max-w-180 px-4 py-10">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-full animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  // Not found: bad id in the URL, or a deleted application.
  if (application === null) {
    return (
      <div className="mx-auto max-w-180 px-4 py-20 text-center">
        <p className="text-lg font-medium">Application not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been deleted, or the link is incorrect.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-180 px-4 py-10">
      <Link
        to="/"
        className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Applications
      </Link>

      <div className="mb-4 flex items-center gap-3.5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-base font-medium",
            colorFor(application.company),
          )}
        >
          {application.company.slice(0, 2)}
        </div>
        <h1 className="text-3xl font-medium tracking-tight">
          {application.company}
        </h1>
      </div>

      <div className="mb-8 flex flex-col gap-0.5">
        <PropertyRow icon={<Briefcase className="h-4 w-4" />} label="Role">
          {application.role}
        </PropertyRow>

        <PropertyRow icon={<CircleDot className="h-4 w-4" />} label="Status">
          <SelectStatus id={application._id} status={application.status} />
        </PropertyRow>

        <PropertyRow icon={<Inbox className="h-4 w-4" />} label="Source">
          {application.source}
        </PropertyRow>

        <PropertyRow icon={<Calendar className="h-4 w-4" />} label="Applied">
          {format(new Date(application._creationTime), "MMMM d, yyyy")}
        </PropertyRow>

        <PropertyRow icon={<Clock className="h-4 w-4" />} label="Last update">
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(application.lastUpdate), {
              addSuffix: true,
            })}
            {/* TODO: Maybe add auto-updated badge */}
          </span>
        </PropertyRow>
      </div>

      <div className="mb-2 text-sm font-medium text-muted-foreground">
        Notes
      </div>
      {/* TODO: swap this read-only view for an autosave Textarea bound to `notes`. */}
      <div className="min-h-30 rounded-lg border p-4 text-sm leading-relaxed">
        {application.notes ? (
          <p className="whitespace-pre-wrap">{application.notes}</p>
        ) : (
          <p className="text-muted-foreground">No notes yet.</p>
        )}
      </div>

      {/* TODO: render the statusHistory timeline here once that table is populated. */}

      <div className="mt-7 border-t pt-4 text-xs text-muted-foreground">
        Created {format(new Date(application._creationTime), "MMMM d, yyyy")}
      </div>
    </div>
  );
}

export default ApplicationDetail;
