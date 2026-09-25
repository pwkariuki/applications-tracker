import type { Doc } from "../../../convex/_generated/dataModel";
import { colorFor } from "@/lib/company-color";

type CompanyCellProps = {
  application: Doc<"applications">;
};

const CompanyCell = ({ application }: CompanyCellProps) => {
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
