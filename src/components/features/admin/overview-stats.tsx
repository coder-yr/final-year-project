"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { FileText, X, Ticket, Archive } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewStatsProps {
    bookingsCount: number;
    cancelledCount: number;
    totalRevenue: number;
    checkInCount: number;
}

export function OverviewStats({ bookingsCount, cancelledCount, totalRevenue, checkInCount }: OverviewStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booked Rooms */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="group hover:-translate-y-1 transition-transform duration-300"
            >
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-[2rem] h-full overflow-hidden bg-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <CardContent className="p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-600 shadow-inner">
                                <FileText className="h-7 w-7" />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                                +18.5% <span className="">↗</span>
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatINR(totalRevenue)}</h3>
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Booked Revenue</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Cancelled Rooms */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="group hover:-translate-y-1 transition-transform duration-300"
            >
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-[2rem] h-full overflow-hidden bg-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <CardContent className="p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-orange-100/50 flex items-center justify-center text-orange-600 shadow-inner">
                                <X className="h-7 w-7" />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-full">
                                -24.8% <span className="">↘</span>
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{cancelledCount}</h3>
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Cancelled Rooms</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Check In */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="group hover:-translate-y-1 transition-transform duration-300"
            >
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-[2rem] h-full overflow-hidden bg-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <CardContent className="p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 shadow-inner">
                                <Ticket className="h-7 w-7" />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                +14.6% <span className="">↗</span>
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{checkInCount.toLocaleString()}</h3>
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Check-Ins</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Check Out */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="group hover:-translate-y-1 transition-transform duration-300"
            >
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-[2rem] h-full overflow-hidden bg-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <CardContent className="p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-purple-100/50 flex items-center justify-center text-purple-600 shadow-inner">
                                <Archive className="h-7 w-7" />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                                +12.8% <span className="">↗</span>
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{bookingsCount}</h3>
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Check-Outs</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
