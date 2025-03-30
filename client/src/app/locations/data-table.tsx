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
import axios from "axios";
import { toast } from "react-hot-toast";

interface Location {
    _id: string;
    encodedId: string;
    address: string;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDelete?: (selectedRows: string[]) => void;
    onEdit?: (selectedRow: any) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onDelete,
                                             onEdit,
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
        },
    });

    const handleDelete = async () => {
        const selectedRows = table.getSelectedRowModel().rows.map((row) => (row.original as any)._id);
        if (selectedRows.length > 0) {
            try {
                await axios.delete("http://localhost:3000/api/locations", {
                    data: { ids: selectedRows },
                });
                toast.success("Xóa thành công!");
                if (onDelete) onDelete(selectedRows);
            } catch (error) {
                toast.error("Lỗi khi xóa dữ liệu!");
            }
        }
    };


    return (
        <div className="p-4 bg-white rounded-lg shadow">
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={table.getSelectedRowModel().rows.length === 0}
                >
                    Xóa
                </Button>
            </div>
        </div>
    );
}
