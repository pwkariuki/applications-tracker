import { Inbox } from "lucide-react";
import AddApplicationDialog from "./add-application-dialog";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-medium">No applications yet</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Start tracking your job search — add your first application to see it
        here.
      </p>
      <div className="mt-5">
        {/* Reuses the same dialog + mutation as the toolbar Add button. */}
        <AddApplicationDialog />
      </div>
    </div>
  );
}

export default EmptyState;
