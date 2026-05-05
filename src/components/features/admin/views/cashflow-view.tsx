"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface CashflowViewProps {
    bookings: Booking[];
}

export function CashflowView({ bookings }: CashflowViewProps) {
    const { chartData, stats } = useMemo(() => {
        // Generate last 14 days for granular view
        const dates = Array.from({ length: 14 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (13 - i));
            return date;
        });

        const data = dates.map(date => {
            const dayStr = format(date, "MMM dd");
            let income = 0;
            let expense = 0; // Using cancelled refunds as 'expense'

            bookings.forEach(b => {
                let d: Date | null = null;
                try {
                    if (b.createdAt instanceof Date) d = b.createdAt;
                    else if ((b.createdAt as any)?.seconds) d = new Date((b.createdAt as any).seconds * 1000);
                    else if (typeof b.createdAt === 'string') d = new Date(b.createdAt);
                } catch (e) { }

                if (d && !isNaN(d.getTime()) && format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")) {
                    if (b.status === 'confirmed') income += (b.totalPrice || 0);
                    if (b.status === 'cancelled') expense += (b.totalPrice || 0);
                }
            });

            return {
                date: dayStr,
                income,
                expense,
                net: income - expense
            };
        });

        const totalIncome = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

        const totalExpense = bookings
            .filter(b => b.status === 'cancelled')
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

        return {
            chartData: data,
            stats: {
                totalIncome,
                totalExpense,
                netCashflow: totalIncome - totalExpense
            }
        };
    }, [bookings]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Cashflow</h2>
                <p className="text-muted-foreground">Monitor your financial inflow and outflow.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Net Cashflow</CardTitle>
                            <Wallet className="h-4 w-4 text-emerald-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatINR(stats.netCashflow)}</div>
                            <p className="text-xs text-emerald-100/80 mt-1">Available balance</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Income</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{formatINR(stats.totalIncome)}</div>
                            <p className="text-xs text-green-600 font-medium mt-1">+12.5% this month</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Refunded</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{formatINR(stats.totalExpense)}</div>
                            <p className="text-xs text-slate-400 mt-1">Due to cancellations</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Chart */}
            <Card className="col-span-4 border-none shadow-md">
                <CardHeader>
                    <CardTitle>Cashflow Analysis</CardTitle>
                    <CardDescription>Income vs Refunds over the last 14 days.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#dc2626" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="income"
                                    name="Income"
                                    fill="url(#incomeGradient)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                                <Bar
                                    dataKey="expense"
                                    name="Refunds"
                                    fill="url(#expenseGradient)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
