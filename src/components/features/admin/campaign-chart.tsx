"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Booking } from "@/lib/types";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface CampaignChartProps {
    bookings: Booking[];
}

export function CampaignChart({ bookings }: CampaignChartProps) {
    const data = useMemo(() => {
        const last9Months = Array.from({ length: 9 }, (_, i) => {
            const date = subMonths(new Date(), i);
            return {
                name: format(date, 'MMM'),
                fullDate: date,
                Booked: 0,
                Cancelled: 0,
            };
        }).reverse();

        bookings.forEach(booking => {
            if (!booking.createdAt) return;

            let date: Date;

            try {
                if (booking.createdAt instanceof Date) {
                    date = booking.createdAt;
                } else if ((booking.createdAt as any).seconds) {
                    date = new Date((booking.createdAt as any).seconds * 1000);
                } else if (typeof booking.createdAt === 'string') {
                    date = new Date(booking.createdAt);
                } else {
                    return;
                }

                if (isNaN(date.getTime())) return;

                const monthData = last9Months.find(m =>
                    format(m.fullDate, 'MMM yyyy') === format(date, 'MMM yyyy')
                );

                if (monthData) {
                    if (booking.status === 'confirmed') {
                        monthData.Booked += 1;
                    } else if (booking.status === 'cancelled') {
                        monthData.Cancelled += 1;
                    }
                }
            } catch (error) {
                console.error("Error parsing date in CampaignChart:", error);
            }
        });

        return last9Months;
    }, [bookings]);

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Booking Trends</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs h-8">Monthly</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="Booked"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Cancelled"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
