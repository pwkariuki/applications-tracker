import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteApplicationDialog from "./delete-application-dialog";
import EditStatusDialog from "./edit-status-dialog";
import type { Doc } from "../../../convex/_generated/dataModel";

type ApplicationActionsProps = {
  application: Doc<"applications">;
};

const ApplicationActions = ({ application }: ApplicationActionsProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <EditStatusDialog
          id={application._id}
          status={application.status}
          onEdit={() => setOpen(false)}
        />
        <DeleteApplicationDialog
          id={application._id}
          company={application.company}
          role={application.role}
          onDeleted={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApplicationActions;
