"use client";

import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Lock,
  Unlock,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for static display
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    lastLoginTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    lastLoginTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "blocked",
    lastLoginTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    status: "active",
    lastLoginTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    status: "active",
    lastLoginTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
];

// Format time since last login - move to lib/utils
const formatTimeSince = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
};

const UsersTable = () => {
  const [users] = useState(mockUsers);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'blocked'

  // Server Action Handlers
  const handleBlockUsers = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users[parseInt(index)].id
    );
    console.log("Block users:", selectedIds);
    // In a real app, this would call an API
  };

  const handleUnblockUsers = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users[parseInt(index)].id
    );
    console.log("Unblock users:", selectedIds);
    // In a real app, this would call an API
  };

  const handleDeleteUsers = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users[parseInt(index)].id
    );
    console.log("Delete users:", selectedIds);
    // In a real app, this would call an API
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center h-4 w-4">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center h-4 w-4">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        minWidth: 150,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
          >
            Email
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        ),
        minWidth: 200,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          let badgeColor = "bg-green-500 hover:bg-green-600";
          if (status === "blocked") {
            badgeColor = "bg-red-500 hover:bg-red-600";
          }
          return <Badge className={badgeColor}>{status}</Badge>;
        },
        minWidth: 100,
      },
      {
        accessorKey: "lastLoginTime",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
          >
            Last Login
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        ),
        cell: ({ row }) => formatTimeSince(row.getValue("lastLoginTime")),
        minWidth: 120,
        enableSorting: true,
      },
    ],
    []
  );

  // Filter data based on status
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return users;
    return users.filter((user) => user.status === statusFilter);
  }, [users, statusFilter]);

  // Setup TanStack Table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [{ id: "lastLoginTime", desc: true }],
    },
    enableSorting: true,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            className="bg-red-800"
            size="sm"
            onClick={handleDeleteUsers}
            disabled={Object.keys(rowSelection).length === 0}
          >
            <Trash className="h-2 w-2 " />
            Delete
          </Button>
          <Button
            size="sm"
            className="bg-amber-800 "
            onClick={handleBlockUsers}
            disabled={Object.keys(rowSelection).length === 0}
          >
            <Lock className="h-2 w-2" />
            Block
          </Button>
          <Button
            size="sm"
            className="bg-green-800 flex self-center"
            onClick={handleUnblockUsers}
            disabled={Object.keys(rowSelection).length === 0}
          >
            <Unlock className="h-2 w-2 " />
            Unblock
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter:{" "}
              {statusFilter === "all"
                ? "All Users"
                : statusFilter === "active"
                ? "Active Users"
                : "Blocked Users"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("active")}>
              Active Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("blocked")}>
              Blocked Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All Users
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-64"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-bold"
                      style={{ minWidth: header.column.columnDef.minWidth }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ minWidth: cell.column.columnDef.minWidth }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UsersTable;
