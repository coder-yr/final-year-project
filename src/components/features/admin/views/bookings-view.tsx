"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, User as UserIcon, Calendar, BookOpen, MoreHorizontal } from "lucide-react";
import type { Booking } from "@/lib/types";
import { format } from "date-fns";
import { formatINR } from '@/lib/utils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BookingsViewProps {
    bookings: Booking[];
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function BookingsView({ bookings }: BookingsViewProps) {
    const [filter, setFilter] = useState("all");

    const filteredBookings = bookings.filter(b => {
        if (filter === "all") return true;
        return b.status === filter;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bookings</h2>
                    <p className="text-muted-foreground">Track reservations across all services.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="space-y-4">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">All Bookings</TabsTrigger>
                    <TabsTrigger value="confirmed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-green-700">Confirmed</TabsTrigger>
                    <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-red-700">Cancelled</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-orange-700">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                {filter === 'all' ? 'All Reservations' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Reservations`} ({filteredBookings.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                        <TableHead className="pl-6 w-[250px] font-medium">Guest</TableHead>
                                        <TableHead className="font-medium">Service Info</TableHead>
                                        <TableHead className="font-medium">Dates</TableHead>
                                        <TableHead className="font-medium">Status</TableHead>
                                        <TableHead className="text-right pr-6 font-medium">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                                        <TableRow key={booking.id} className="cursor-pointer hover:bg-slate-50 transition-colors group">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 bg-slate-100 text-slate-600">
                                                        <AvatarFallback className="bg-slate-100 text-slate-600">{booking.userName?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm">{booking.userName || 'Guest User'}</span>
                                                        <span className="text-xs text-muted-foreground font-mono">#{booking.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{booking.hotelName || booking.trainName || booking.airline || 'Service'}</span>
                                                    <span className="text-xs text-muted-foreground">{booking.roomTitle || booking.trainNumber || booking.flightNumber || 'Details'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                    <span>
                                                        {(() => {
                                                            const getValidDate = (d: any) => {
                                                                if (!d) return null;
                                                                if (d instanceof Date) return d;
                                                                if (typeof d === 'string') return new Date(d);
                                                                if (typeof d === 'number') return new Date(d);
                                                                if (d && typeof d.toDate === 'function') return d.toDate();
                                                                return null;
                                                            };

                                                            const from = getValidDate(booking.fromDate);
                                                            const to = getValidDate(booking.toDate) || from;

                                                            if (!from) return "Invalid Date";

                                                            return (
                                                                <>
                                                                    {format(from, "MMM d")}
                                                                    {to && to.getTime() !== from.getTime() && ` - ${format(to, "MMM d, yyyy")}`}
                                                                    {(!to || to.getTime() === from.getTime()) && `, ${format(from, "yyyy")}`}
                                                                </>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={booking.status === 'confirmed' ? "default" : "secondary"}
                                                    className={
                                                        booking.status === 'confirmed'
                                                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-none px-3"
                                                            : booking.status === 'cancelled'
                                                                ? "bg-red-100 text-red-700 hover:bg-red-100 border-none px-3"
                                                                : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3"
                                                    }
                                                >
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <span className="font-bold text-sm text-slate-700">
                                                    {formatINR(booking.totalPrice)}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                        <BookOpen className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <p className="text-lg font-medium text-slate-900">No bookings found</p>
                                                    <p className="text-sm">Filter criteria returned no results.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
