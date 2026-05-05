"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Train, User, Mail, Phone, ArrowRight, CreditCard, ChevronLeft, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import type { Train as TrainType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

export function TrainBookingWizard() {
    const searchParams = useSearchParams();
    const trainId = searchParams.get('trainId');
    const classType = searchParams.get('class');
    const date = searchParams.get('date');
    const { user } = useAuth();

    const [train, setTrain] = useState<TrainType | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingProcessing, setBookingProcessing] = useState(false);
    const [step, setStep] = useState(1);
    const [passengers, setPassengers] = useState(1);
    const [pnr, setPnr] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'male',
    });

    useEffect(() => {
        if (trainId) fetchTrainDetails();
    }, [trainId]);

    const fetchTrainDetails = async () => {
        try {
            const response = await fetch(`/api/trains/${trainId}`);
            if (response.ok) {
                const data = await response.json();
                setTrain(data);
            }
        } catch (error) {
            console.error('Error fetching train:', error);
            toast({ title: "Error", description: "Failed to load train details", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const selectedSeat = train?.seats.find(s => s.classType === classType);
    const totalPrice = selectedSeat ? selectedSeat.price * passengers : 0;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const generatePNR = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const handleBooking = async () => {
        setBookingProcessing(true);
        const newPnr = generatePNR();

        const booking = {
            type: 'train', // Unified type
            trainId: train?.id,
            trainNumber: train?.trainNumber,
            trainName: train?.trainName,
            classType,
            passengers,
            date,
            ...formData,
            totalPrice,
            status: 'confirmed',
            pnr: newPnr,
            // Additional fields for unified dashboard
            title: `${train?.trainName} (${train?.trainNumber})`,
            subtitle: `${train?.depart} → ${train?.arrive}`,
            fromDate: date ? new Date(date).toISOString() : new Date().toISOString(),
            toDate: (() => {
                const start = date ? new Date(date) : new Date();
                if (train?.duration) {
                    const [hoursStr, minutesStr] = train.duration.split(' ');
                    const hours = parseInt(hoursStr) || 0;
                    const minutes = parseInt(minutesStr) || 0;
                    start.setHours(start.getHours() + hours);
                    start.setMinutes(start.getMinutes() + minutes);
                }
                return start.toISOString();
            })(),
            // Ensure compatibility with UserBookings
            userId: user?.id, // Use actual user ID
        };

        try {
            // Note: Saving to unified 'bookings' collection
            const response = await fetch('/api/bookings/train', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking),
            });

            if (response.ok) {
                const data = await response.json();
                setPnr(data.pnr || newPnr);
                setStep(4);
                toast({ title: "Success", description: "Booking confirmed successfully!" });
            } else {
                throw new Error("Booking failed");
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast({ title: "Booking Failed", description: "Please try again later.", variant: "destructive" });
        } finally {
            setBookingProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Train className="w-12 h-12 text-orange-500 animate-bounce mb-4" />
                <p className="text-muted-foreground animate-pulse">Locating your train...</p>
            </div>
        );
    }

    if (!train) return <div className="text-center p-8">Train not found.</div>;

    const steps = [
        { num: 1, label: 'Travellers' },
        { num: 2, label: 'Review' },
        { num: 3, label: 'Payment' },
        { num: 4, label: 'Done' }
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Stepper */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 to-red-600 -z-10 transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                    />

                    {steps.map((s) => (
                        <div key={s.num} className="flex flex-col items-center gap-2 bg-background p-2">
                            <motion.div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300",
                                    step >= s.num
                                        ? "bg-gradient-to-br from-orange-500 to-red-600 border-transparent text-white shadow-lg shadow-orange-500/30"
                                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                                )}
                                animate={{ scale: step === s.num ? 1.1 : 1 }}
                            >
                                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                            </motion.div>
                            <span className={cn("text-xs font-bold uppercase tracking-wider transition-colors", step >= s.num ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground")}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step 1: Passenger Details */}
                            {step === 1 && (
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-orange-500" />
                                            Passenger Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-10 h-11"
                                                        placeholder="Enter name as on ID"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Age</Label>
                                                <Input
                                                    type="number"
                                                    className="h-11"
                                                    placeholder="Age"
                                                    value={formData.age}
                                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        type="email"
                                                        className="pl-10 h-11"
                                                        placeholder="For ticket confirmation"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        type="tel"
                                                        className="pl-10 h-11"
                                                        placeholder="Mobile number"
                                                        value={formData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Gender</Label>
                                            <RadioGroup
                                                defaultValue="male"
                                                className="flex gap-6"
                                                value={formData.gender}
                                                onValueChange={(v) => handleInputChange('gender', v)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="male" id="male" />
                                                    <Label htmlFor="male">Male</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="female" id="female" />
                                                    <Label htmlFor="female">Female</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="other" id="other" />
                                                    <Label htmlFor="other">Other</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <Button
                                                className="bg-orange-600 hover:bg-orange-700 h-11 px-8 rounded-full shadow-lg shadow-orange-500/20"
                                                disabled={!formData.name || !formData.email || !formData.phone || !formData.age}
                                                onClick={() => setStep(2)}
                                            >
                                                Continue <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 2: Review */}
                            {step === 2 && (
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle>Review Booking Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Passenger</p>
                                                    <p className="font-semibold text-lg">{formData.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Contact</p>
                                                    <p className="font-semibold text-lg">{formData.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Email</p>
                                                    <p className="font-semibold text-lg">{formData.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Age/Gender</p>
                                                    <p className="font-medium">{formData.age} / {formData.gender}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button variant="outline" onClick={() => setStep(1)} className="h-11 px-6 rounded-full">
                                                <ChevronLeft className="w-4 h-4 mr-2" /> Edit
                                            </Button>
                                            <Button
                                                className="flex-1 bg-orange-600 hover:bg-orange-700 h-11 rounded-full shadow-lg shadow-orange-500/20"
                                                onClick={() => setStep(3)}
                                            >
                                                Proceed to Payment <CreditCard className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                            Secure Payment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 p-4 rounded-xl text-blue-700 dark:text-blue-300 text-sm">
                                            <p>This is a demo booking. No actual money will be deducted.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Card Number</Label>
                                                <Input placeholder="0000 0000 0000 0000" className="font-mono h-11" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Expiry</Label>
                                                    <Input placeholder="MM/YY" className="h-11" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>CVV</Label>
                                                    <Input type="password" placeholder="123" className="h-11" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button variant="outline" onClick={() => setStep(2)} className="h-11 px-6 rounded-full">
                                                Back
                                            </Button>
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700 h-11 rounded-full shadow-lg shadow-green-500/20 text-lg font-bold"
                                                onClick={handleBooking}
                                                disabled={bookingProcessing}
                                            >
                                                {bookingProcessing ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    `Pay ₹${totalPrice.toLocaleString()}`
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 4: Confirmation */}
                            {step === 4 && (
                                <Card className="border-2 border-green-500 shadow-2xl bg-white dark:bg-slate-900">
                                    <CardContent className="p-8 text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto"
                                        >
                                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                                        </motion.div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h2>
                                            <p className="text-muted-foreground">Your ticket has been booked successfully.</p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">PNR Number</p>
                                            <p className="text-4xl font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                                                {pnr}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                                            <Button variant="outline" className="h-12 px-8 rounded-full" onClick={() => window.location.href = '/railway'}>
                                                Book Another Train
                                            </Button>
                                            <Button
                                                className="bg-orange-600 hover:bg-orange-700 h-12 px-8 rounded-full shadow-lg"
                                                onClick={() => window.location.href = '/bookings'}
                                            >
                                                My Bookings
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <CardHeader className="border-b border-white/10">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Train className="w-5 h-5 text-orange-400" />
                                Trip Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <h3 className="font-bold text-xl mb-1">{train.trainName}</h3>
                                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                                    #{train.trainNumber}
                                </Badge>
                            </div>

                            <div className="space-y-4 relative">
                                {/* Timeline line */}
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/20" />

                                <div className="space-y-1 relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-orange-400 bg-slate-900" />
                                    <p className="text-xs text-white/60">Departure</p>
                                    <p className="font-bold text-lg">{train.departTime}</p>
                                    <p className="text-sm font-medium">{train.depart}</p>
                                    <p className="text-xs text-white/50">{date}</p>
                                </div>

                                <div className="space-y-1 relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-900" />
                                    <p className="text-xs text-white/60">Arrival</p>
                                    <p className="font-bold text-lg">{train.arriveTime}</p>
                                    <p className="text-sm font-medium">{train.arrive}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl space-y-2 border border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Class</span>
                                    <span className="font-bold">{classType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Travellers</span>
                                    <span className="font-bold">{passengers}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-white/60">Total Amount</span>
                                    <span className="text-2xl font-bold text-orange-400">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
