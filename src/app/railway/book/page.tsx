"use client"

import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TrainBookingWizard } from '@/components/features/train/train-booking-wizard';

export default function BookingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-red-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20" />
            </div>

            <Header />
            <main className="flex-1 py-12 relative z-10">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                }>
                    <TrainBookingWizard />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
