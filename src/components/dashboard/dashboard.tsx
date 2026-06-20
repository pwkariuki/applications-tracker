import StatsRow from "@/components/dashboard/stats-row";
import ApplicationsTable from "@/components/dashboard/applications-table";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

function Dashboard() {
  const data: Doc<"applications">[] = useQuery(api.applications.list) ?? [];

  if (data === undefined) {
    return <p className="text-muted-foreground">Loading applications...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Applications Tracker
        </h1>
        <p className="text-sm text-muted-foreground">
          Track every application, interview, and offer in one place.
        </p>
      </div>
      <StatsRow applications={data} />

      <ApplicationsTable data={data} />
    </div>
  );
}

export default Dashboard;
