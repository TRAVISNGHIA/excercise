"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export type ResultLog = {
    _id: string
    timestamp: string
    brand: string
    location: string
    url: string
    source: string
    image: string
}

export const columns: ColumnDef<ResultLog>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "timestamp",
        header: "Timestamp",
    },
    {
        accessorKey: "brand",
        header: "Brand",
    },
    {
        accessorKey: "location",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Location
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => {
            const url = row.original.url;
            const shortUrl = url.length > 30 ? url.slice(0, 30) + "..." : url;
            return (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    {shortUrl}
                </a>
            );
        },
    },
    {
        accessorKey: "source",
        header: "Source",
    },
    {
        accessorKey: "image",
        header: "image",
        cell: ({ row }) => (
            <img
                src={row.getValue("image")}
                alt={`image ${row.original.brand}`}
                className="w-20 h-auto"
            />
        ),
    },
]