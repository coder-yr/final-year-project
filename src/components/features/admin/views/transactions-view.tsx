"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionsViewProps {
    bookings: Booking[];
}

export function TransactionsView({ bookings }: TransactionsViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Filter and Sort Transactions (Newest First)
    const filteredTransactions = bookings
        .filter(booking => {
            const matchesSearch =
                booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (booking.userName || "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === "all" || booking.status === filterStatus;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date((a.createdAt as any).seconds * 1000);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date((b.createdAt as any).seconds * 1000);
            return dateB.getTime() - dateA.getTime();
        });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h2>
                <p className="text-muted-foreground">Manage and view all financial transactions.</p>
            </div>

            <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
                            <CardDescription className="text-muted-foreground">A list of all payments and refunds.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-9">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Controls */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search transaction ID or user..."
                                className="pl-9 bg-muted/50 border-input text-foreground"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px] bg-card text-foreground">
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="confirmed">Payment Received</SelectItem>
                                <SelectItem value="cancelled">Refunded/Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-semibold text-muted-foreground">Transaction ID</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">User</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Service</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Date</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Amount</TableHead>
                                    <TableHead className="font-semibold text-right text-muted-foreground">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((booking) => {
                                    let dateStr = "N/A";
                                    try {
                                        const d = booking.createdAt instanceof Date
                                            ? booking.createdAt
                                            : new Date((booking.createdAt as any).seconds * 1000);
                                        if (!isNaN(d.getTime())) dateStr = format(d, "PPP");
                                    } catch (e) { }

                                    const serviceType = booking.type || (booking.hotelId ? 'Hotel' : booking.busId ? 'Bus' : booking.trainName ? 'Train' : 'Other');

                                    return (
                                        <TableRow key={booking.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-mono text-xs text-muted-foreground py-4">
                                                #{booking.id.slice(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm text-foreground">{booking.userName || 'Guest User'}</span>
                                                    <span className="text-xs text-muted-foreground">{booking.userId.slice(0, 8)}...</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize font-normal text-muted-foreground border-border">
                                                    {serviceType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {dateStr}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                {formatINR(booking.totalPrice || 0)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    className={
                                                        booking.status === 'confirmed'
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none shadow-none"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 border-none shadow-none"
                                                    }
                                                >
                                                    {booking.status === 'confirmed' ? 'Success' : 'Refunded'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredTransactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No transactions found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
