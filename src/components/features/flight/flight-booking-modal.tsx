"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from '@/hooks/use-auth'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Plane, Check, X, Calendar, Briefcase, Utensils, Armchair, RefreshCw, Luggage, ArrowLeft, Info, ChevronRight, CreditCard, User, Sparkles, AlertCircle } from "lucide-react"
import { cn, formatDate } from "@/lib"
import { PaymentGateway } from "@/components/features/booking/payment-gateway"

type FlightInfo = {
  id: string
  airline: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
  flightNumber?: string
}

type Props = {
  flight: FlightInfo | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onBookedAction?: () => void
  originCity: string
  destinationCity: string
  travelDate: string
}

const FARE_OPTIONS = [
  {
    id: 'value',
    name: 'SAVER',
    priceOffset: 0,
    color: 'bg-white',
    borderColor: 'border-slate-200',
    titleColor: 'text-slate-700',
    description: "Travel light, travel smart.",
    benefits: [
      { icon: Briefcase, text: 'Cabin bag (7kg)', included: true },
      { icon: Luggage, text: 'Check-in bag (15kg)', included: true },
      { icon: Armchair, text: 'Seat selection', included: false },
      { icon: Utensils, text: 'Meal', included: false },
      { icon: RefreshCw, text: 'Cancellation', included: false },
    ] as { icon: any, text: string, included: boolean, info?: string }[]
  },
  {
    id: 'classic',
    name: 'CLASSIC',
    recommended: true,
    priceOffset: 1200,
    color: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200',
    titleColor: 'text-indigo-700',
    description: "Extra flexibility & comfort.",
    benefits: [
      { icon: Briefcase, text: 'Cabin bag (7kg)', included: true },
      { icon: Luggage, text: 'Check-in bag (15kg)', included: true },
      { icon: Armchair, text: 'Standard Seat', included: true },
      { icon: Utensils, text: 'Meal', included: true },
      { icon: RefreshCw, text: 'Cancellation (Fee)', included: true, info: "Low Fee" },
    ]
  },
  {
    id: 'flex',
    name: 'FLEXI PLUS',
    priceOffset: 3500,
    color: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
    titleColor: 'text-amber-700',
    description: "Total peace of mind.",
    benefits: [
      { icon: Briefcase, text: 'Cabin bag (7kg)', included: true },
      { icon: Luggage, text: 'Check-in bag (25kg)', included: true },
      { icon: Armchair, text: 'Any Seat Free', included: true },
      { icon: Utensils, text: 'Gourmet Meal', included: true },
      { icon: RefreshCw, text: 'Free Cancellation', included: true },
    ]
  }
]

// Mock Seat Map Data
const SEAT_ROWS = 12;

export default function FlightBookingModal({ flight, open, onOpenChangeAction, onBookedAction, originCity, destinationCity, travelDate }: Props) {
  const [step, setStep] = useState(1) // 1: Fare, 2: Seat, 3: Passenger
  const [selectedFare, setSelectedFare] = useState('classic')
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const router = useRouter()
  const { user } = useAuth();

  const basePrice = flight ? Number(flight.price.replace(/[^0-9.-]+/g, '')) : 0
  const selectedOption = FARE_OPTIONS.find(f => f.id === selectedFare)

  // Calculate Seat Price
  const getSeatPrice = (row: number, col: string) => {
    if (selectedOption?.id === 'flex') return 0;
    if (selectedOption?.id === 'classic' && row > 3) return 0;

    if (row <= 3) return 1500; // Premium rows
    if (col === 'A' || col === 'F') return 350; // Window
    if (col === 'C' || col === 'D') return 250; // Aisle
    return 150; // Middle
  }

  const seatPrice = selectedSeat ? getSeatPrice(parseInt(selectedSeat.slice(0, -1)), selectedSeat.slice(-1)) : 0
  const totalPrice = basePrice + (selectedOption?.priceOffset || 0) + seatPrice

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
      // No need for fake delay here, payment gateway did it

      await addDoc(bookingsCol, {
        userId: user!.id,
        roomId: flight ? `flight-${flight.id}` : `flight-unknown`,
        hotelId: flight ? `flight-${flight.id}` : `flight-unknown`,
        fromDate: Timestamp.fromDate(new Date(travelDate)),
        toDate: Timestamp.fromDate(new Date(new Date(travelDate).getTime() + 24 * 60 * 60 * 1000)),
        totalPrice: totalPrice,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        hotelName: flight ? `${flight.airline} (${selectedOption?.name})` : 'Flight Booking',
        hotelLocation: `${originCity} - ${destinationCity}`,
        roomTitle: `Flight ${flight?.flightNumber || ''} • Seat ${selectedSeat || 'Any'}`,
        coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop',
        userName: user!.name,
        hotelOwnerId: user!.id, // For now, mapping to self as placeholder
      });

      onBookedAction?.();
      onOpenChangeAction(false);
      router.push('/bookings');
    } catch (err) {
      console.error('Failed to create booking doc:', err);
      alert('Failed to create booking: ' + (err as Error).message);
    } finally {
      setIsBooking(false);
    }
  }

  if (!flight) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 overflow-hidden h-[90vh] flex flex-col rounded-3xl shadow-2xl ring-1 ring-black/5">

        {/* Top Progress Bar */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-8 py-5 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                <Plane className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-headline font-bold text-slate-900 dark:text-white leading-tight">
                {step === 1 && "Select Fare"}
                {step === 2 && "Choose Seat"}
                {step === 3 && "Review & Pay"}
              </h2>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                <span className="font-semibold">{originCity}</span>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="font-semibold">{destinationCity}</span>
              </div>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("h-1.5 rounded-full transition-all duration-300", step >= s ? "w-8 bg-gradient-to-r from-teal-500 to-emerald-500" : "w-2 bg-slate-200 dark:bg-slate-700")} />
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/30">

          {/* STEP 1: FARE SELECTION */}
          {step === 1 && (
            <div className="p-8 max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-headline font-bold mb-3 text-slate-900 dark:text-white">Customize your journey</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Select the fare package that suits your travel style.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FARE_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedFare(option.id)}
                    className={cn(
                      "relative overflow-hidden rounded-3xl border transition-all duration-300 p-0 cursor-pointer group",
                      selectedFare === option.id
                        ? `border-primary/50 ring-4 ring-primary/10 bg-white dark:bg-slate-800 shadow-2xl scale-[1.02] z-10`
                        : "border-transparent bg-white/60 dark:bg-slate-800/60 shadow-lg hover:shadow-xl hover:scale-[1.01] hover:bg-white dark:hover:bg-slate-800"
                    )}
                  >
                    {option.recommended && (
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500" />
                    )}
                    {option.recommended && (
                      <div className="absolute top-5 right-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Best Value
                      </div>
                    )}

                    <div className={cn("p-8 pb-6 border-b border-dashed border-slate-200 dark:border-slate-700", option.color)}>
                      <h4 className={cn("font-headline font-black text-2xl tracking-tight mb-2", option.titleColor)}>{option.name}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{option.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-400 dark:text-slate-500">₹</span>
                        <span className="text-4xl font-headline font-bold text-slate-900 dark:text-white">{(basePrice + option.priceOffset).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-8 space-y-5">
                      {option.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={cn(
                            "mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                            benefit.included ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                          )}>
                            {benefit.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <p className={cn("text-base font-medium", benefit.included ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600 line-through")}>
                              {benefit.text}
                            </p>
                            {benefit.info && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">{benefit.info}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedFare === option.id && (
                      <div className="absolute bottom-5 right-5 text-primary">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* STEP 2: SEAT SELECTION */}
          {step === 2 && (
            <div className="flex flex-col items-center py-10 min-h-full justify-center">
              <div className="mb-10 flex flex-wrap justify-center gap-4 text-sm font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/20">
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-sm" /> <span className="text-slate-600 dark:text-slate-300">Free</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md border bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800" /> <span className="text-slate-600 dark:text-slate-300">₹150+</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md border bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800" /> <span className="text-slate-600 dark:text-slate-300">Premium</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md border bg-gradient-to-r from-teal-500 to-emerald-500 border-transparent shadow-md" /> <span className="text-slate-900 dark:text-white font-semibold">Selected</span></div>
                <div className="flex items-center gap-2 opacity-40"><div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700" /> <span className="text-slate-600 dark:text-slate-300">Occupied</span></div>
              </div>

              {/* Plane Fuselage */}
              <div className="relative bg-white dark:bg-slate-900 pt-32 pb-16 px-16 rounded-[4rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full mx-4">
                {/* Cockpit */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-full opacity-60 blur-2xl pointer-events-none" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-1.5 border-b-4 border-slate-200 dark:border-slate-700 rounded-full" />

                <div className="flex justify-center gap-16">
                  {/* Left Block */}
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: SEAT_ROWS }).map((_, row) => (
                      <React.Fragment key={`left-${row}`}>
                        {['A', 'B', 'C'].map(col => {
                          const seatId = `${row + 1}${col}`;
                          const price = getSeatPrice(row + 1, col);
                          const isSelected = selectedSeat === seatId;
                          const isPremium = row < 3;
                          const isOccupied = row === 4 && col === 'B'; // Mock occupied

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatId)}
                              className={cn(
                                "w-12 h-12 rounded-xl border transition-all flex flex-col items-center justify-center relative group",
                                isOccupied ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-40" :
                                  isSelected ? "bg-gradient-to-br from-teal-500 to-emerald-600 border-transparent text-white shadow-xl scale-110 z-10" :
                                    isPremium ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30" :
                                      price > 0 ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30" :
                                        "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                              )}
                            >
                              <span className="text-xs font-bold">{col}</span>
                              {/* Tooltip Price */}
                              {!isOccupied && !isSelected && (
                                <span className={cn(
                                  "absolute -top-10 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg font-bold",
                                  "after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-slate-800 after:rotate-45"
                                )}>
                                  {price === 0 ? 'Free' : `₹${price}`}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Aisle - Row Numbers */}
                  <div className="flex flex-col gap-4 items-center pt-2 text-sm font-mono font-bold text-slate-300 dark:text-slate-600">
                    {Array.from({ length: SEAT_ROWS }).map((_, i) => (
                      <div key={i} className="h-12 flex items-center">{i + 1}</div>
                    ))}
                  </div>

                  {/* Right Block */}
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: SEAT_ROWS }).map((_, row) => (
                      <React.Fragment key={`right-${row}`}>
                        {['D', 'E', 'F'].map(col => {
                          const seatId = `${row + 1}${col}`;
                          const price = getSeatPrice(row + 1, col);
                          const isSelected = selectedSeat === seatId;
                          const isPremium = row < 3;
                          const isOccupied = row === 6 && col === 'E'; // Mock occupied

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatId)}
                              className={cn(
                                "w-12 h-12 rounded-xl border transition-all flex flex-col items-center justify-center relative group",
                                isOccupied ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-40" :
                                  isSelected ? "bg-gradient-to-br from-teal-500 to-emerald-600 border-transparent text-white shadow-xl scale-110 z-10" :
                                    isPremium ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30" :
                                      price > 0 ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30" :
                                        "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                              )}
                            >
                              <span className="text-xs font-bold">{col}</span>
                              {/* Tooltip Price */}
                              {!isOccupied && !isSelected && (
                                <span className={cn(
                                  "absolute -top-10 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg font-bold",
                                  "after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-slate-800 after:rotate-45"
                                )}>
                                  {price === 0 ? 'Free' : `₹${price}`}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="p-10 max-w-3xl mx-auto flex flex-col justify-center h-full">
              <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-2xl overflow-hidden mb-8">
                <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm"><Plane className="w-8 h-8" /></div>
                    <div>
                      <div className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Flight Summary</div>
                      <div className="font-headline font-bold text-2xl tracking-tight">{originCity} <span className="opacity-50 mx-2">→</span> {destinationCity}</div>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <div className="text-sm opacity-70 mb-1">Travel Date</div>
                    <div className="font-bold text-lg">{formatDate(travelDate, 'PPP')}</div>
                  </div>
                </div>

                <div className="p-8 space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                  <div className="flex justify-between items-center py-3 border-b border-dashed border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Base Fare <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded ml-2">{selectedOption?.name}</span></span>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">₹{(basePrice + (selectedOption?.priceOffset || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-dashed border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Seat Selection <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded ml-2">{selectedSeat}</span></span>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">₹{seatPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-2xl font-headline font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-4xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 p-5 rounded-2xl flex gap-4 text-orange-800 dark:text-orange-300 text-sm">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-medium leading-relaxed">Please review your booking details accurately. Names must match government ID presented at the airport.</p>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Bottom Footer */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-6 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total to pay</span>
              <span className="text-3xl font-headline font-black text-slate-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
            </div>

            <button
              onClick={() => step === 3 ? handleBook() : setStep(step + 1)}
              disabled={(step === 2 && !selectedSeat) || isBooking}
              className={cn(
                "flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-xl hover:shadow-2xl hover:-translate-y-1",
                isBooking ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" :
                  "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20"
              )}
            >
              {isBooking ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : step === 3 ? (
                <>Confirm & Pay <CreditCard className="w-5 h-5 ml-1" /></>
              ) : (
                <>Continue <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

      </DialogContent>

      <PaymentGateway
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={totalPrice}
        onSuccess={onPaymentSuccess}
      />
    </Dialog>
  )
}
