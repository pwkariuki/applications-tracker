import type { ColumnDef } from "@tanstack/react-table";
import { STATUS_CONFIG } from "@/data/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, SquarePen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CompanyCell from "@/components/dashboard/company-cell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Doc } from "../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteApplicationDialog from "./delete-application-dialog";
import { useState } from "react";
import EditStatusDialog from "./edit-status-dialog";

export const columns: ColumnDef<Doc<"applications">>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <CompanyCell application={row.original} />,
    // Let search box filter on company text and roles
    filterFn: (row, _id, value) => {
      const app = row.original;
      const haystack = `${app.company} ${app.role}`.toLowerCase();
      return haystack.includes(String(value).toLowerCase());
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
      >
        Status
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    // Sort by the logical application pipeline order
    sortingFn: (a, b) =>
      STATUS_CONFIG[a.original.status].order -
      STATUS_CONFIG[b.original.status].order,
    // Filter based on statuses selected in filter dropdown
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.status),
  },
  {
    accessorKey: "lastUpdate",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
      >
        Last Update
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.getValue("lastUpdate")), {
          addSuffix: true,
        })}
        {/** TODO: Possibly add an auto updated badge */}
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("source")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;
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
    },
  },
];
