"use client";
import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

import {exportToCSV} from "../../../utils/exportUtils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDelete?: (selectedRows: any[]) => void;

}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onDelete,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const router = useRouter();
    const pathname = usePathname();

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination: {
                pageIndex: 0,
                pageSize: data.length
            }
        },
    });

    const handleDelete = () => {
        const selectedRows = table.getSelectedRowModel().rows.map((row) => (row.original as any)._id);
        if (selectedRows.length > 0) {
            if (onDelete) onDelete(selectedRows);
        } else {
            toast.error("Hãy chọn ít nhất một mục để xóa!");
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <Tabs className="mb-4">
                <TabsList>
                    <TabsTrigger
                        value="keywords"
                        className={pathname === "/" ? "bg-black text-white" : ""}
                        onClick={() => router.push("/")}
                    >
                        Keywords
                    </TabsTrigger>
                    <TabsTrigger
                        value="locations"
                        className={pathname === "/locations" ? "bg-black text-white" : ""}
                        onClick={() => router.push("/locations")}
                    >
                        Locations
                    </TabsTrigger>
                    <TabsTrigger
                        value="results"
                        className={pathname === "/results" ? "bg-black text-white" : ""}
                        onClick={() => router.push("/results")}
                    >
                       Results
                    </TabsTrigger>
                    <TabsTrigger
                        value="logs"
                        className={pathname === "/resultLogs" ? "bg-black text-white" : ""}
                        onClick={() => router.push("/resultLogs")}
                    >
                       Logs
                    </TabsTrigger>
                    <TabsTrigger
                        value="urls"
                        className={pathname === "/urlMatchs" ? "bg-black text-white" : ""}
                        onClick={() => router.push("/urlMatchs")}
                    >
                        URL Matchs
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex items-center justify-between py-4 gap-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Filter by URL..."
                        value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("url")?.setFilterValue(event.target.value)}
                        className="max-w-xs"
                    />
                </div>
                {table.getSelectedRowModel().rows.length > 0 && (
                    <Button variant="destructive" onClick={handleDelete}>
                        Xóa đã chọn
                    </Button>
                )}
            </div>
            <div className="rounded-md border overflow-x-auto">
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="bottom-4">
                <button onClick={() => exportToCSV(data)} className="bg-black text-white px-4 py-1 rounded shadow-md">
                    Export CSV
                </button>
            </div>
        </div>
    );
}