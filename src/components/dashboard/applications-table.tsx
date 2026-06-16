import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Filter, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  STATUS_CONFIG,
  STATUS_LIST,
  type Application,
  type Status,
} from "@/data/types";
import { columns } from "./columns";

function ApplicationsTable({ data }: { data: Application[] }) {
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: { pageSize: 15 },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  const selectedStatuses =
    (table.getColumn("status")?.getFilterValue() as Status[] | undefined) ?? [];

  function handleSearch(value: string) {
    setSearch(value);
    table.getColumn("company")?.setFilterValue(value);
  }

  function toggleStatus(status: Status) {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    table.getColumn("status")?.setFilterValue(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies, roles..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="gap-1.5">
              <Filter className="w-4 h-4" />
              Status
              {selectedStatuses.length > 0 && (
                <span className="ml-1 rounded bg-muted px-1.5 text-xs">
                  {selectedStatuses.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-1">
            {STATUS_LIST.map((status) => {
              const checked = selectedStatuses.includes(status);
              return (
                <Button
                  key={status}
                  variant={"ghost"}
                  onClick={() => toggleStatus(status)}
                  className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm font-normal hover:bg-accent"
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_CONFIG[status].dot}`}
                    aria-hidden="true"
                  />
                  <span className="text-left">
                    {STATUS_CONFIG[status].label}
                  </span>
                </Button>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 py-4">
        <Button
          variant={"outline"}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ApplicationsTable;
