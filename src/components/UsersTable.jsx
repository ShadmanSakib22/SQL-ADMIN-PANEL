"use client";

import { useState, useEffect, useMemo } from "react";
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { fetchUsers } from "@/app/actions/fetchUsers";
import { formatDateTime, formatTimeSince } from "@/lib/table-utils";
import {
  blockUsers,
  unblockUsers,
  deleteUsers,
} from "@/app/actions/userActions";
import { checkUserStatus } from "@/app/actions/checkUserStatus";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [reload, setReload] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Check Func before Block/Unblock/Delete
  const secureAuth = async () => {
    const status = await checkUserStatus();
    if (status.status === "blocked" || status.status === "userNotFound") {
      signOut();
      redirect("/page/login");
    }
  };

  // Fetch User Data
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const { users: fetchedUsers } = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [reload]);

  // Manual Table Reload Button
  const handleReload = () => {
    setReload((prev) => !prev);
  };

  // Server Action Handlers (using IDs)
  const handleBlockUsers = async () => {
    secureAuth();
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users[parseInt(index)].id
    );
    const result = await blockUsers(selectedIds);
    if (result.success) {
      setReload((prev) => !prev);
      setRowSelection({}); // Clear selection
    } else {
      console.log(result.error);
    }
  };

  const handleUnblockUsers = async () => {
    secureAuth();
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users[parseInt(index)].id
    );
    const result = await unblockUsers(selectedIds);
    if (result.success) {
      setReload((prev) => !prev);
      setRowSelection({});
    } else {
      console.log(result.error);
    }
  };

  const handleDeleteUsers = async () => {
    secureAuth();
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users[parseInt(index)].id
    );
    const result = await deleteUsers(selectedIds);
    if (result.success) {
      setReload((prev) => !prev);
      setRowSelection({});
    } else {
      console.log(result.error);
    }
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      // checkbox
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
      // username
      {
        accessorKey: "name",
        header: "Username",
        minWidth: 150,
      },
      // email
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
      // acc status
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
      // registration time
      {
        accessorKey: "registration_time",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
          >
            Registration Time
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        ),
        cell: ({ row }) => {
          const regTime = row.getValue("registration_time");
          return formatDateTime(regTime);
        },
        minWidth: 200,
        enableSorting: true,
      },
      // login time
      {
        accessorKey: "last_login_time",
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
        cell: ({ row }) => {
          const loginTime = row.getValue("last_login_time");
          if (!loginTime) return "Never";

          const formattedTime = formatTimeSince(loginTime);
          const exactTime = formatDateTime(loginTime);

          return (
            <div
              data-tooltip-id={`login-time-${row.id}`}
              data-tooltip-content={exactTime}
            >
              {formattedTime}
              <Tooltip id={`login-time-${row.id}`} />
            </div>
          );
        },
        minWidth: 160,
        enableSorting: true,
      },
      // logout time
      {
        accessorKey: "last_activity_time",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
          >
            Last Seen
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        ),
        cell: ({ row }) => {
          const logoutTime = row.getValue("last_activity_time");
          if (!logoutTime) return "Never";

          const formattedTime = formatTimeSince(logoutTime);
          const exactTime = formatDateTime(logoutTime);

          return (
            <div
              data-tooltip-id={`logout-time-${row.id}`}
              data-tooltip-content={exactTime}
            >
              {formattedTime}
              <Tooltip id={`logout-time-${row.id}`} />
            </div>
          );
        },
        minWidth: 160,
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
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReload}
            disabled={loading}
          >
            <RefreshCw className="h-2 w-2" />
            Reload
          </Button>
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
        </div>
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
                      className="text-xs md:text-sm font-bold"
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
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ minWidth: cell.column.columnDef.minWidth }}
                        className="text-xs md:text-sm"
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
                    No users found.
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
          disabled={!table.getCanPreviousPage() || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UsersTable;
