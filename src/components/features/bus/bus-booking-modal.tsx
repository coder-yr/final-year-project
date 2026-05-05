"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useAuth } from '@/hooks/use-auth'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Bus, Armchair, ArrowLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaymentGateway } from "@/components/features/booking/payment-gateway"

type BusInfo = {
  id: string
  operator: string
  busType: string
  departureTime: string
  arrivalTime: string
  price: number
  source: string
  destination: string
}

type Props = {
  bus: BusInfo | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onBookedAction?: () => void
  travelDate?: string
}

// Mock 12-row sleeper bus layout (Lower/Upper Deck)
const ROWS = 6;

export default function BusBookingModal({ bus, open, onOpenChangeAction, onBookedAction, travelDate }: Props) {
  const [step, setStep] = useState(1) // 1: Seat, 2: Review
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [deck, setDeck] = useState<'lower' | 'upper'>('lower')
  const [isBooking, setIsBooking] = useState(false)
  const router = useRouter()
  const { user } = useAuth();

  // State for Payment Modal
  const [showPayment, setShowPayment] = useState(false);

  const handleBook = () => {
    if (!user) {
      alert('Please log in to complete booking.');
      return;
    }
    setShowPayment(true);
  }

  const onPaymentSuccess = async () => {
    setShowPayment(false);
    try {
      setIsBooking(true);

      const bookingsCol = collection(db, 'bookings');
      // No delay needed

      await addDoc(bookingsCol, {
        userId: user!.id,
        roomId: bus ? `bus-${bus.id}` : `bus-unknown`,
        hotelId: bus ? `bus-${bus.id}` : `bus-unknown`, // Reusing field for simplicity
        fromDate: Timestamp.fromDate(new Date(travelDate || new Date())),
        toDate: Timestamp.fromDate(new Date(new Date(travelDate || new Date()).getTime() + 10 * 60 * 60 * 1000)), // Approx duration
        totalPrice: bus?.price || 0,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        hotelName: bus ? `${bus.operator} (${bus.busType})` : 'Bus Booking',
        hotelLocation: bus ? `${bus.source} - ${bus.destination}` : 'Bus Trip',
        roomTitle: `Seat ${selectedSeat || 'Any'} (${deck.toUpperCase()})`,
        coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop', // Bus image
        userName: user!.name,
        hotelOwnerId: user!.id,
      });

      onBookedAction?.();
      onOpenChangeAction(false);
      router.push('/bookings');
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert('Failed to book: ' + (err as Error).message);
    } finally {
      setIsBooking(false);
    }
  }

  if (!bus) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 overflow-hidden h-[85vh] flex flex-col rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md px-8 py-5 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="p-2 -ml-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-lg shadow-teal-500/20">
                <Bus className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">
                {step === 1 ? "Select Seat" : "Review Booking"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                  {bus.busType}
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {bus.operator}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-500 dark:text-slate-400">Travel Date</p>
            <p className="font-bold text-slate-900 dark:text-white">{travelDate || 'Today'}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950/50">
          {step === 1 && (
            <div className="flex flex-col items-center h-full">

              {/* Deck Switcher */}
              <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8 w-fit mx-auto sticky top-0 z-20">
                <button
                  onClick={() => setDeck('lower')}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    deck === 'lower'
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  Lower Deck
                </button>
                <button
                  onClick={() => setDeck('upper')}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    deck === 'upper'
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  Upper Deck
                </button>
              </div>

              {/* Bus Layout Container */}
              <div className="relative flex-1 w-full max-w-3xl mx-auto flex justify-center py-4">
                {/* Bus Shape */}
                <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 pr-12 md:pr-24 shadow-xl w-full max-w-2xl mx-auto min-h-[500px]">

                  {/* Front Indicator */}
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-2 text-slate-300 dark:text-slate-600">
                    <Armchair className="w-8 h-8 rotate-90" />
                    <span className="text-[10px] font-bold uppercase tracking-widest rotate-90 mt-4 whitespace-nowrap">Driver</span>
                  </div>

                  <div className="grid grid-rows-2 gap-16 h-full">
                    {/* Left Side (Single Seats) */}
                    <div className="grid grid-cols-6 gap-3 md:gap-6 items-center">
                      {Array.from({ length: ROWS }).map((_, i) => {
                        const seatId = `${deck === 'lower' ? 'L' : 'U'}${i + 1}`;
                        const isSelected = selectedSeat === seatId;
                        return (
                          <button
                            key={seatId}
                            onClick={() => setSelectedSeat(seatId)}
                            className={cn(
                              "group relative w-10 md:w-14 h-16 md:h-24 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                              isSelected
                                ? "bg-gradient-to-br from-teal-500 to-emerald-600 border-teal-600 text-white shadow-lg shadow-teal-500/30 z-10 scale-105"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-400"
                            )}
                          >
                            {deck === 'upper' ? (
                              <div className="w-full h-full p-2 flex flex-col justify-between">
                                <div className={cn("w-full h-2 rounded-full opacity-30", isSelected ? "bg-white" : "bg-slate-400")} />
                                <span className={cn("text-[10px] font-bold", isSelected ? "text-white" : "text-slate-400 group-hover:text-teal-500")}>{seatId}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Armchair className={cn("w-5 h-5 md:w-6 md:h-6 transition-colors", isSelected ? "text-white" : "text-slate-300 group-hover:text-teal-400")} />
                                <span className={cn("text-[10px] font-bold md:block hidden", isSelected ? "text-white" : "text-slate-400")}>{seatId}</span>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Right Side (Double Seats - implied Logic for simplicity just showing another row) */}
                    <div className="grid grid-cols-6 gap-3 md:gap-6 items-center">
                      {Array.from({ length: ROWS }).map((_, i) => {
                        const seatId = `${deck === 'lower' ? 'L' : 'U'}${i + 7}`;
                        const isSelected = selectedSeat === seatId;
                        return (
                          <button
                            key={seatId}
                            onClick={() => setSelectedSeat(seatId)}
                            className={cn(
                              "group relative w-10 md:w-14 h-16 md:h-24 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                              isSelected
                                ? "bg-gradient-to-br from-teal-500 to-emerald-600 border-teal-600 text-white shadow-lg shadow-teal-500/30 z-10 scale-105"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-400"
                            )}
                          >
                            {deck === 'upper' ? (
                              <div className="w-full h-full p-2 flex flex-col justify-between">
                                <div className={cn("w-full h-2 rounded-full opacity-30", isSelected ? "bg-white" : "bg-slate-400")} />
                                <span className={cn("text-[10px] font-bold", isSelected ? "text-white" : "text-slate-400 group-hover:text-teal-500")}>{seatId}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Armchair className={cn("w-5 h-5 md:w-6 md:h-6 transition-colors", isSelected ? "text-white" : "text-slate-300 group-hover:text-teal-400")} />
                                <span className={cn("text-[10px] font-bold md:block hidden", isSelected ? "text-white" : "text-slate-400")}>{seatId}</span>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 flex justify-center gap-8 py-4 px-6 bg-white/60 dark:bg-slate-900/60 rounded-full backdrop-blur border border-white/20 shadow-sm md:w-fit w-full">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <div className="w-4 h-4 rounded border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600" />
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-teal-400 to-emerald-600 shadow-sm" />
                  Selected
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                  <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                  Booked
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-xl mt-8">
              <h3 className="font-bold text-2xl mb-6 text-center text-slate-900 dark:text-white">Trip Summary</h3>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between py-3 border-b border-dashed border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Operator</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bus.operator}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-dashed border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Seat</span>
                  <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{selectedSeat} <span className="text-slate-400 font-normal">({deck} deck)</span></span>
                </div>
                <div className="flex justify-between py-3 border-b border-dashed border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">{travelDate || 'Today'}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-slate-50 dark:bg-slate-800/50 px-4 rounded-xl mt-4">
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Total Pay</span>
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400">₹{bus.price}</span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-800/50 flex gap-3">
                <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                Boarding point details will be sent via SMS/Email after booking.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center shrink-0 z-20">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Total Amount</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-400">₹</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{selectedSeat ? bus.price : 0}</span>
            </div>
          </div>

          <button
            onClick={() => step === 2 ? handleBook() : setStep(step + 1)}
            disabled={!selectedSeat || isBooking}
            className={cn(
              "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300",
              isBooking || !selectedSeat ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" :
                "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isBooking ? 'Processing...' : step === 2 ? 'Proceed to Pay' : 'Review Trip'}
            {!isBooking && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

      </DialogContent>

      <PaymentGateway
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={bus ? bus.price : 0}
        onSuccess={onPaymentSuccess}
      />
    </Dialog>
  )
}
