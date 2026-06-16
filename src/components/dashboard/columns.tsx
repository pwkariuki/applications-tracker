import type { ColumnDef } from "@tanstack/react-table";
import type { Application } from "@/data/types";

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "lastUpdate",
    header: "Last Update",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
];
