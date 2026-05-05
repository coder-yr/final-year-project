"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Train } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrainFront, MapPin, Clock, MoreHorizontal, Trash } from "lucide-react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { deleteTrain } from "@/lib/data"; // Ensure this exists in lib/data

const TrainActions = ({ train }: { train: Train }) => {
    const { toast } = useToast()

    const handleDelete = async () => {
        try {
            await deleteTrain(train.id)
            toast({
                title: "Train deleted",
                description: "The train has been successfully deleted.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete train.",
                variant: "destructive",
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(train.id)}
                >
                    Copy Train ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Train
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Train>[] = [
    {
        accessorKey: "trainNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Train No.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-[80px] font-mono font-medium">{row.getValue("trainNumber")}</div>,
    },
    {
        accessorKey: "trainName",
        header: "Train Name",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2 items-center">
                    <Badge variant="outline" className="rounded-sm px-1 font-normal bg-orange-50 text-orange-600 border-orange-200 h-fit">
                        Express
                    </Badge>
                    <span className="max-w-[150px] truncate font-medium">
                        {row.getValue("trainName")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "depart",
        header: "Route",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center text-muted-foreground"><MapPin className="w-3 h-3 mr-1" /> {row.getValue("depart")}</span>
                    <span className="flex items-center mt-1"><TrainFront className="w-3 h-3 mr-1 text-orange-500" /> to <MapPin className="w-3 h-3 ml-1 mr-1" /> {row.original.arrive}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "departTime",
        header: "Timings",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center font-medium"><Clock className="w-3 h-3 mr-1" /> {row.getValue("departTime")}</span>
                    <span className="text-muted-foreground text-xs ml-4">Arrive: {row.original.arriveTime}</span>
                    <span className="text-xs text-green-600 bg-green-50 px-1 rounded w-fit mt-1 ml-4">{row.original.duration}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "runningDays",
        header: "Running Days",
        cell: ({ row }) => {
            const days = row.getValue("runningDays") as string[];
            return (
                <div className="flex gap-1 flex-wrap w-[120px]">
                    {days.map(day => (
                        <span key={day} className="text-[10px] bg-slate-100 px-1 rounded border">{day}</span>
                    ))}
                </div>
            )
        }
    },
    {
        accessorKey: "seats",
        header: "Classes",
        cell: ({ row }) => {
            const seats = row.getValue("seats") as any[];
            return (
                <div className="flex gap-1 flex-wrap max-w-[150px]">
                    {Array.isArray(seats) && seats.length > 0 ? seats.map((seat: any, index: number) => (
                        <Badge key={seat.id || index} variant="secondary" className="text-[10px] h-5 px-1">
                            {seat.classType || seat.id}
                        </Badge>
                    )) : (
                        <span className="text-xs text-muted-foreground">-</span>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <TrainActions train={row.original} />,
    },
];
