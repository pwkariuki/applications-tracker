import StatsRow from "@/components/dashboard/stats-row";
import ApplicationsTable from "@/components/dashboard/applications-table";
import EmptyState from "./empty-state";
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
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <StatsRow applications={data} />
          <ApplicationsTable data={data} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
