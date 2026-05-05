"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from "recharts";
import { format, subDays, startOfDay, isAfter } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react";

interface AnalyticsViewProps {
    bookings: Booking[];
}

export function AnalyticsView({ bookings }: AnalyticsViewProps) {
    // Process Data for Charts
    const { revenueData, pieData, summary } = useMemo(() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(startOfDay(new Date()), 29 - i);
            return {
                date: format(date, "MMM dd"),
                rawDate: date,
                revenue: 0,
                bookings: 0
            };
        });

        const categoryCounts: Record<string, number> = {
            hotel: 0,
            bus: 0,
            train: 0,
            flight: 0
        };

        let totalRevenue = 0;
        let cancelledCount = 0;

        bookings.forEach(booking => {
            if (!booking.createdAt) return;

            let bookingDate: Date | null = null;

            try {
                if (booking.createdAt instanceof Date) {
                    bookingDate = booking.createdAt;
                } else if ((booking.createdAt as any)?.seconds) {
                    bookingDate = new Date((booking.createdAt as any).seconds * 1000);
                } else if (typeof booking.createdAt === 'string') {
                    bookingDate = new Date(booking.createdAt);
                }
            } catch (e) {
                return;
            }

            // Check if date is valid
            if (!bookingDate || isNaN(bookingDate.getTime())) return;

            // Summary Metrics
            if (booking.status === 'confirmed') {
                totalRevenue += booking.totalPrice || 0;
            }
            if (booking.status === 'cancelled') {
                cancelledCount++;
            }

            // Category Counts
            const type = booking.type ||
                (booking.hotelId ? 'hotel' :
                    booking.busId ? 'bus' :
                        booking.trainName || booking.trainNumber ? 'train' :
                            booking.airline || booking.flightNumber ? 'flight' : 'other');

            if (categoryCounts[type] !== undefined) {
                categoryCounts[type]++;
            } else if (type === 'flight') {
                // Safety fallback if type is 'flight' but somehow not in keys (though it is)
                categoryCounts.flight++;
            }

            // Revenue Trend (Last 30 Days)
            const dayStat = last30Days.find(d =>
                format(d.rawDate, "yyyy-MM-dd") === format(bookingDate, "yyyy-MM-dd")
            );

            if (dayStat) {
                if (booking.status === 'confirmed') {
                    dayStat.revenue += booking.totalPrice || 0;
                }
                // Count all bookings regardless of status for activity tracking? Or just confirmed?
                // valid bookings usually means confirmed or pending. cancelled are interest.
                // Let's count all non-cancelled for "Bookings" trend, or just confirmed.
                if (booking.status === 'confirmed') {
                    dayStat.bookings += 1;
                }
            }
        });

        const pieData = [
            { name: "Hotels", value: categoryCounts.hotel, color: "#0ea5e9" }, // Sky 500
            { name: "Buses", value: categoryCounts.bus, color: "#8b5cf6" },   // Violet 500
            { name: "Trains", value: categoryCounts.train, color: "#f97316" }, // Orange 500
            { name: "Flights", value: categoryCounts.flight, color: "#10b981" }, // Emerald 500
        ].filter(d => d.value > 0);

        const summary = {
            totalRevenue,
            avgOrderValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
            totalBookings: bookings.length,
            cancellationRate: bookings.length > 0 ? (cancelledCount / bookings.length) * 100 : 0
        };

        return { revenueData: last30Days, pieData, summary };
    }, [bookings]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
                <p className="text-muted-foreground">Detailed insights into your platform's performance.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatINR(summary.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime revenue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatINR(summary.avgOrderValue)}</div>
                        <p className="text-xs text-muted-foreground">Per booking average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">All time bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.cancellationRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Of total bookings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Daily revenue trends for the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <Tooltip
                                        formatter={(value: number) => [formatINR(value), "Revenue"]}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Booking Distribution</CardTitle>
                        <CardDescription>Bookings breakdown by category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2: Daily Bookings */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Trends</CardTitle>
                        <CardDescription>Number of confirmed/pending bookings per day (Last 30 Days).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="bookings" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Bookings" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
