"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getBookingsByUser, cancelBooking, fromFirestore } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, BedDouble, Calendar, MapPin, Ban, Plane, Clock, Armchair, TrainFront } from 'lucide-react';
import Image from 'next/image';
import { format, isPast, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Train, Bus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Timestamp, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';


export function UserBookings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCancelling, startTransition] = useTransition();
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const bookingsQuery = query(
                collection(db, 'bookings'),
                where('userId', '==', user.id)
            );

            const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
                const userBookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
                userBookings.sort((a, b) => (b.fromDate as Date).getTime() - (a.fromDate as Date).getTime());
                setBookings(userBookings);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setBookings([]);
            setLoading(false);
        }
    }, [user]);

    const handleCancelBooking = async () => {
        if (!bookingToCancel) return;

        startTransition(async () => {
            try {
                await cancelBooking(bookingToCancel.id);
                toast({
                    title: "Booking Cancelled",
                    description: "Your reservation has been successfully cancelled.",
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Cancellation Failed",
                    description: (error as Error).message || "There was a problem cancelling your booking.",
                });
            } finally {
                setBookingToCancel(null);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    Please log in to see your bookings.
                </CardContent>
            </Card>
        );
    }

    if (bookings.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    You have no bookings yet. Time to <Link href="/" className="text-primary underline">plan a trip</Link>!
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {bookings.map((booking: any) => {
                    const fromDate = booking.fromDate ? new Date(booking.fromDate) : new Date();
                    const toDate = booking.toDate ? new Date(booking.toDate) : new Date(fromDate.getTime() + 86400000);
                    const isCancelled = booking.status?.trim().toLowerCase() === 'cancelled';
                    const isDateInPast = startOfDay(fromDate) < startOfDay(new Date());
                    const canCancel = !isCancelled && !isDateInPast;

                    // Determine booking type
                    const isTrain = booking.type === 'train';
                    const isBus = booking.type === 'bus';
                    const isFlight = booking.roomId?.startsWith('flight-');
                    const isHotel = !isTrain && !isBus && !isFlight;

                    // Unified Data Mapping
                    let typeIcon = <BedDouble className="w-6 h-6" />;
                    let typeColor = "text-blue-600 bg-blue-50";
                    let title = booking.hotelName || booking.title;
                    let subtitle = booking.hotelLocation || booking.subtitle;
                    let details = booking.roomTitle || `${booking.passengers || booking.seats?.length} Guests`;
                    let highlight = booking.totalPrice ? `₹${booking.totalPrice.toLocaleString('en-IN')}` : 'Prepaid';

                    if (isTrain) {
                        typeIcon = <TrainFront className="w-6 h-6" />;
                        typeColor = "text-orange-600 bg-orange-50";
                        title = booking.trainName || title;
                        details = `${booking.classType} • ${booking.passengers} Passengers • PNR: ${booking.pnr}`;
                    } else if (isBus) {
                        typeIcon = <Bus className="w-6 h-6" />;
                        typeColor = "text-red-600 bg-red-50";
                        title = booking.busName || booking.operator || title;
                        details = `Seats: ${booking.seats?.join(', ')}`;
                    } else if (isFlight) {
                        typeIcon = <Plane className="w-6 h-6" />;
                        typeColor = "text-sky-600 bg-sky-50";
                        const airlineName = booking.hotelName?.split('(')[0].trim();
                        title = airlineName || title;
                    }

                    return (
                        <div key={booking.id} className="relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            {/* Visual Indicator Strip */}
                            <div className={cn("absolute left-0 top-0 bottom-0 w-1.5",
                                isTrain ? "bg-orange-500" : isBus ? "bg-red-500" : isFlight ? "bg-sky-500" : "bg-blue-500"
                            )} />

                            <div className="flex flex-col md:flex-row">
                                {/* Main Content */}
                                <div className="flex-1 p-6 pl-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", typeColor)}>
                                                {typeIcon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-900">{title}</h3>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                                    {subtitle || 'View Details'}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={isCancelled ? "destructive" : "secondary"} className="uppercase tracking-wider font-bold">
                                            {booking.status || 'Confirmed'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-dashed border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date</p>
                                            <p className="font-semibold text-gray-700 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {fromDate && !isNaN(fromDate.getTime()) ? format(fromDate, 'dd MMM yyyy') : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">{isTrain ? 'Class/PNR' : isBus ? 'Seats' : 'Details'}</p>
                                            <p className="font-semibold text-gray-700 truncate" title={String(details)}>
                                                {details}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Amount</p>
                                            <p className="font-semibold text-gray-700">{highlight}</p>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end">
                                            {canCancel && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    onClick={() => setBookingToCancel(booking)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently cancel your booking
                            for <span className="font-semibold">{bookingToCancel?.hotelName}</span>. Please review the hotel's cancellation policy.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Back</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Yes, cancel booking
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
