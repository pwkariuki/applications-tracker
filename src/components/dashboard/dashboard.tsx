import StatsRow from "@/components/dashboard/stats-row";
import ApplicationsTable from "@/components/dashboard/applications-table";
import { sampleApplications, type Application } from "@/data/types";

function Dashboard() {
  const data: Application[] = sampleApplications;

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
      <StatsRow />

      <ApplicationsTable data={data} />
    </div>
  );
}

export default Dashboard;
