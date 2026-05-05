"use client";

import { Booking } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatINR } from "@/lib/utils";

interface BookingsViewProps {
    bookings: Booking[];
}

export function BookingsView({ bookings }: BookingsViewProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bookings</h2>
                <p className="text-muted-foreground">Manage your reservations.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>A list of all bookings for your hotel.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Check-in</TableHead>
                                <TableHead>Check-out</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.userName || booking.userId}</TableCell>
                                        <TableCell>{booking.roomTitle}</TableCell>
                                        <TableCell>{format(new Date(booking.fromDate as any), "MMM dd, yyyy")}</TableCell>
                                        <TableCell>{format(new Date(booking.toDate as any), "MMM dd, yyyy")}</TableCell>
                                        <TableCell>{formatINR(booking.totalPrice)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                                className={booking.status === 'confirmed' ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-slate-100 text-slate-800"}
                                            >
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No bookings yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
