"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Train, Clock, Wifi, Coffee, Shield, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import type { Train as TrainType, TrainSeat } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TrainCardProps {
    train: TrainType;
    date: string;
}

export function TrainCard({ train, date }: TrainCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const getClassBadgeColor = (className: string) => {
        const colors: Record<string, string> = {
            '1A': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-200 dark:border-purple-800',
            '2A': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-800',
            '3A': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800',
            'SL': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border-orange-200 dark:border-orange-800',
            '2S': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
        };
        return colors[className] || 'bg-slate-100 text-slate-800';
    };

    const getStatusColor = (status: string) => {
        if (status === 'available') return 'text-green-600 dark:text-green-400';
        if (status === 'limited') return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleBook = (seat: TrainSeat) => {
        const bookingUrl = `/railway/book?trainId=${train.id}&class=${seat.classType}&date=${date}`;
        router.push(bookingUrl);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm group">
                <CardContent className="p-0">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">

                            {/* Train Info Section */}
                            <div className="flex-1 space-y-6">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 text-white">
                                            <Train className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {train.trainName}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs font-mono font-medium">
                                                    #{train.trainNumber}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <div className="flex gap-1">
                                                    {train.runningDays?.map((day, idx) => (
                                                        <span key={idx} className="text-xs text-muted-foreground font-medium uppercase">
                                                            {day.slice(0, 1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">{train.duration}</span>
                                    </div>
                                </div>

                                {/* Journey Details */}
                                <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{train.departTime}</p>
                                        <p className="text-sm font-medium text-muted-foreground mt-0.5">{train.depart}</p>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center px-4">
                                        <div className="w-full flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                                            <Train className="w-4 h-4 text-orange-500" />
                                            <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                                            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground mt-2 md:hidden">{train.duration}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{train.arriveTime}</p>
                                        <p className="text-sm font-medium text-muted-foreground mt-0.5">{train.arrive}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px bg-slate-200 dark:bg-slate-700 self-stretch hidden md:block" />
                            <div className="h-px bg-slate-200 dark:bg-slate-700 w-full md:hidden" />

                            {/* Quick Booking Section */}
                            <div className="md:w-72 space-y-4">
                                <div className="space-y-3">
                                    {train.seats?.slice(0, 3).map((seat, idx) => (
                                        <div
                                            key={idx}
                                            className="group/seat flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-orange-200 dark:hover:border-orange-900 bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all cursor-pointer"
                                            onClick={() => handleBook(seat)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className={cn("rounded-md px-2 min-w-[3rem] justify-center border", getClassBadgeColor(seat.classType))}>
                                                    {seat.classType}
                                                </Badge>
                                                <div className="flex flex-col">
                                                    <span className={cn("text-xs font-bold uppercase", getStatusColor(seat.status))}>
                                                        {seat.status === 'available' ? 'Available' : seat.status}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {seat.status === 'available' ? `${seat.available} Seats` : 'WL-45'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-slate-900 dark:text-white group-hover/seat:text-orange-600 dark:group-hover/seat:text-orange-400">
                                                    {formatPrice(seat.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full justify-between group-hover:border-orange-200 dark:group-hover:border-orange-800 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <span className="text-xs uppercase font-bold tracking-wider">
                                        {isExpanded ? 'Hide Details' : 'View All Classes'}
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                            >
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                            All Available Classes
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {train.seats?.map((seat, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex flex-col p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <Badge variant="outline" className={cn("px-2 py-1 text-sm font-bold border-2", getClassBadgeColor(seat.classType))}>
                                                            {seat.classType}
                                                        </Badge>
                                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                            {formatPrice(seat.price)}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 mb-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={cn("w-2 h-2 rounded-full", seat.status === 'available' ? 'bg-green-500' : seat.status === 'limited' ? 'bg-orange-500' : 'bg-red-500')} />
                                                            <span className={cn("font-medium", getStatusColor(seat.status))}>
                                                                {seat.status === 'available' ? 'Available' :
                                                                    seat.status === 'limited' ? 'Limited Seats' : 'Waitlist'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground ml-4">
                                                            {seat.status === 'available' ? `${seat.available} seats left` : 'Chance of confirmation: 65%'}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 dark:hover:bg-orange-500 transition-colors"
                                                        onClick={() => handleBook(seat)}
                                                        disabled={seat.status === 'full'}
                                                    >
                                                        Book Ticket
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    {train.amenities && train.amenities.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                                                Onboard Amenities
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {train.amenities.map((amenity, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                                                        {amenity === 'WiFi' && <Wifi className="w-3.5 h-3.5 text-blue-500" />}
                                                        {amenity === 'Pantry' && <Coffee className="w-3.5 h-3.5 text-orange-500" />}
                                                        {amenity === 'Security' && <Shield className="w-3.5 h-3.5 text-green-500" />}
                                                        <span>{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
}
