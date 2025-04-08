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

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDelete?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onDelete,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

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
        const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original as TData);
        if (selectedRows.length > 0 && onDelete) {
            onDelete(selectedRows);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/keywords">Keywords</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/locations">Locations</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/results">Data Results</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/resultLogs">Data Logs</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/urlMatchs">URL Matchs</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center justify-between py-4 gap-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Lọc theo ID mã hóa..."
                        value={(table.getColumn("encodedId")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("encodedId")?.setFilterValue(event.target.value)}
                        className="max-w-xs"
                    />
                    <Input
                        placeholder="Lọc theo địa chỉ..."
                        value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("address")?.setFilterValue(event.target.value)}
                        className="max-w-xs"
                    />
                </div>
                {table.getSelectedRowModel().rows.length > 0 && (
                    <Button variant="destructive" onClick={handleDelete}>
                        Xóa đã chọn
                    </Button>
                )}
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.column.id}>
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={(row.original as any)._id} data-state={row.getIsSelected() && "selected"}>
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
        </div>
    );
}
