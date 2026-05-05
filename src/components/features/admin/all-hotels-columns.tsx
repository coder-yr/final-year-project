
"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Hotel } from "@/lib/types"
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Clock, Link as LinkIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib"
import { APPROVAL_STATUS } from "@/lib/constants"
import Link from "next/link"
import { Timestamp } from "firebase/firestore"

const statusIcons = {
  approved: <CheckCircle className="mr-2 h-4 w-4 text-green-500" />,
  pending: <Clock className="mr-2 h-4 w-4 text-yellow-500" />,
  rejected: <XCircle className="mr-2 h-4 w-4 text-red-500" />,
}

import { Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteHotel, updateHotelProbationStatus } from "@/lib/data"

const HotelActions = ({ hotel }: { hotel: Hotel }) => {
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await deleteHotel(hotel.id)
      toast({
        title: "Hotel deleted",
        description: "The hotel has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotel.",
        variant: "destructive",
      })
    }
  }

  const handleIssueWarning = async () => {
    try {
      await updateHotelProbationStatus(hotel.id, 'warning')
      toast({
        title: "Warning Issued",
        description: "The owner has been notified.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue warning.",
        variant: "destructive",
      })
    }
  }

  const handleResolveWarning = async () => {
    try {
      await updateHotelProbationStatus(hotel.id, 'none')
      toast({
        title: "Warning Resolved",
        description: "The warning has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve warning.",
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
          onClick={() => navigator.clipboard.writeText(hotel.id)}
        >
          Copy hotel ID
        </DropdownMenuItem>
        <Link href={`/hotel/${hotel.id}`} passHref>
          <DropdownMenuItem>
            <LinkIcon className="mr-2 h-4 w-4" />
            View Hotel Page
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />

        {hotel.probationStatus !== 'warning' ? (
          <DropdownMenuItem onClick={handleIssueWarning} className="text-orange-600 focus:text-orange-600">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Issue Warning
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleResolveWarning} className="text-green-600 focus:text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            Resolve Warning
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Hotel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hotel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const hotel = row.original
      return (
        <div>
          <div className="font-medium">{hotel.name}</div>
          <div className="text-xs text-muted-foreground">{hotel.location}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row }) => {
      const hotel = row.original
      return (
        <div>
          <div>{hotel.ownerName}</div>
          <div className="text-xs text-muted-foreground">{hotel.ownerEmail}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "averageRating",
    header: "Quality & Rating",
    cell: ({ row }) => {
      const hotel = row.original;
      const rating = hotel.averageRating || 0;
      const status = hotel.probationStatus;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="font-bold">{rating.toFixed(1)}</span>
            <span className="text-yellow-500">★</span>
            <span className="text-xs text-muted-foreground">({hotel.totalReviews || 0})</span>
          </div>
          {status === 'warning' && <Badge variant="destructive" className="w-fit text-[10px] px-1 py-0 h-5">Warning Sent</Badge>}
          {status === 'probation' && <Badge variant="destructive" className="w-fit text-[10px] px-1 py-0 h-5">Probation</Badge>}
          {status === 'suspended' && <Badge variant="destructive" className="w-fit text-[10px] px-1 py-0 h-5">Suspended</Badge>}
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === APPROVAL_STATUS.APPROVED ? "default" : status === APPROVAL_STATUS.PENDING ? 'secondary' : 'destructive'

      return <Badge variant={variant} className="capitalize flex items-center w-fit">
        {statusIcons[status as keyof typeof statusIcons]}
        {status}
      </Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creation Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      if (!value) return null;
      return <div>{formatDate(value, "LLL dd, yyyy")}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <HotelActions hotel={row.original} />,
  },
]
