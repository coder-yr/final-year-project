"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Wifi, ChevronDown, ChevronUp, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BusCardProps {
    id: string;
    operator: string;
    busType: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    rating: number;
    reviews: number;
    price: number;
    seatsAvailable: number;
    amenities: string[];
    seats?: any[];
    source: string;
    destination: string;
    onBook?: (bus: BusCardProps, selectedSeats: string[], boarding: string, dropping: string) => void;
}

// Generate mock seat layout (Lower Deck)
// Generate mock seat layout (Lower Deck)
type Seat = {
    id: string;
    row: number;
    col: string;
    status: 'booked' | 'available';
    type: 'sleeper' | 'seater';
    price: number;
};

// Deterministic seat generation based on busId
const generateSeats = (busId: string) => {
    const seats: Seat[] = [];
    const rows = 12;
    const layout = ['A', 'B', '', 'C', 'D']; // '' represents aisle

    // Simple seeded random function
    const getSeededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Convert busId to a numeric seed base
    const baseSeed = busId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    for (let row = 1; row <= rows; row++) {
        layout.forEach((col, idx) => {
            if (col) {
                const seatId = `${col}${row}`;
                // Use deterministic random based on busId, row, and col index
                const randomVal = getSeededRandom(baseSeed + row * 100 + idx);
                const isBooked = randomVal > 0.7;
                seats.push({
                    id: seatId,
                    row,
                    col,
                    status: isBooked ? 'booked' : 'available',
                    type: row <= 2 ? 'sleeper' : 'seater',
                    price: row <= 2 ? 200 : 150
                });
            }
        });
    }
    return seats;
};

const BOARDING_POINTS = [
    { name: 'Borivali East', time: '20:30' },
    { name: 'Dadar West', time: '21:00' },
    { name: 'Bandra Kurla Complex', time: '21:30' },
];

const DROPPING_POINTS = [
    { name: 'Panjim Bus Stand', time: '06:00' },
    { name: 'Mapusa Circle', time: '06:30' },
    { name: 'Calangute Beach', time: '07:00' },
];

export const BusCard = (props: BusCardProps) => {
    const {
        id,
        operator,
        busType,
        departureTime,
        arrivalTime,
        duration,
        rating,
        reviews,
        price,
        seatsAvailable,
        amenities,
        onBook
    } = props;

    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedBoarding, setSelectedBoarding] = useState('');
    const [selectedDropping, setSelectedDropping] = useState('');
    const [seatLayout] = useState(() => generateSeats(id));

    const handleSeatClick = (seatId: string, status: string) => {
        if (status === 'booked') return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const totalAmount = selectedSeats.reduce((acc, seatId) => {
        const seat = seatLayout.find(s => s.id === seatId);
        return acc + (seat?.price || 0);
    }, 0);

    const handleProceed = () => {
        if (selectedSeats.length === 0 || !selectedBoarding || !selectedDropping) return;
        onBook?.(props, selectedSeats, selectedBoarding, selectedDropping);
    };

    return (
        <div className="glass-card relative rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 mb-6 overflow-hidden group">
            {/* Decorative Top Band */}
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-500" />

            {/* Main Card */}
            <div className="p-5">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Operator Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">{operator}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium bg-slate-100 dark:bg-slate-800 inline-block px-2 py-0.5 rounded">{busType}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            {amenities.slice(0, 3).map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none">
                                    {amenity === 'wifi' && <Wifi className="w-2.5 h-2.5 mr-1" />}
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="flex items-center gap-6 justify-center md:justify-start">
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{departureTime}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{props.source}</p>
                        </div>
                        <div className="text-center px-2 flex flex-col items-center">
                            <p className="text-[10px] text-slate-400 mb-1 font-medium">{duration}</p>
                            <div className="w-24 h-[1px] bg-slate-300 dark:bg-slate-700 relative flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                <div className="flex-1"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{arrivalTime}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{props.destination}</p>
                        </div>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex flex-row md:flex-col justify-between items-end md:text-right gap-4 md:gap-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                        <div className="flex items-center gap-1 justify-end">
                            <div className="flex items-center gap-1 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-sm">
                                <Star className="h-3 w-3 fill-white" />
                                {rating}
                            </div>
                            <span className="text-xs text-slate-400 font-medium">({reviews})</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-xs text-slate-400 line-through">₹{Math.round(price * 1.15)}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{price}</p>
                            </div>
                            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium text-right mt-1">
                                Pay only ₹{Math.round(price * 0.2)} now
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="w-full md:w-auto">
                            <p className="text-[10px] text-slate-500 text-right mb-1 hidden md:block">{seatsAvailable} Seats Left</p>
                            <Button
                                onClick={() => setExpanded(!expanded)}
                                variant={expanded ? "outline" : "default"}
                                size="sm"
                                className={cn(
                                    "w-full md:w-auto transition-all",
                                    !expanded
                                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg border-0"
                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                {expanded ? (
                                    <>Hide Seats <ChevronUp className="ml-1 h-3 w-3" /></>
                                ) : (
                                    <>Select Seats <ChevronDown className="ml-1 h-3 w-3" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Seat Selection */}
            {expanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Seat Map */}
                        <div className="md:col-span-5 bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-inner">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Select Seats</h4>
                                <div className="flex gap-3 text-[10px]">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 border border-slate-300 rounded bg-white dark:bg-slate-800"></div>
                                        <span className="text-slate-500">Available</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-teal-500 rounded border-teal-600"></div>
                                        <span className="text-slate-500">Selected</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-slate-300 rounded"></div>
                                        <span className="text-slate-500">Booked</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lower Deck Label */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lower Deck</span>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                    Steering <div className="w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center">
                                        <div className="w-1.5 h-0.5 bg-slate-300"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Seat Grid */}
                            <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                {Array.from({ length: 12 }).map((_, rowIdx) => (
                                    <React.Fragment key={rowIdx}>
                                        {['A', 'B', '', 'C', 'D'].map((col, colIdx) => {
                                            if (!col) return <div key={`aisle-${rowIdx}-${colIdx}`} className="w-8"></div>;

                                            const seatId = `${col}${rowIdx + 1}`;
                                            const seat = seatLayout.find(s => s.id === seatId);
                                            const isSelected = selectedSeats.includes(seatId);
                                            const isBooked = seat?.status === 'booked';

                                            return (
                                                <button
                                                    key={seatId}
                                                    onClick={() => handleSeatClick(seatId, seat?.status || 'available')}
                                                    disabled={isBooked}
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center",
                                                        isBooked && "bg-slate-200 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed",
                                                        !isBooked && !isSelected && "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 shadow-sm",
                                                        isSelected && "bg-teal-500 border-teal-600 text-white shadow-md transform scale-105"
                                                    )}
                                                >
                                                    {!isBooked && seatId}
                                                </button>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Boarding & Dropping Points */}
                        <div className="md:col-span-4 space-y-4">
                            {/* Boarding */}
                            <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full ring-2 ring-teal-100 dark:ring-teal-900"></div>
                                    Boarding Point
                                </h4>
                                <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                                    {BOARDING_POINTS.map((point) => (
                                        <div
                                            key={point.name}
                                            onClick={() => setSelectedBoarding(point.name)}
                                            className={cn(
                                                "p-2.5 rounded-lg border cursor-pointer transition-all text-sm group",
                                                selectedBoarding === point.name
                                                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                                    : "border-transparent hover:bg-white dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                                            )}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className={cn("font-medium", selectedBoarding === point.name ? "text-teal-700 dark:text-teal-300" : "text-slate-700 dark:text-slate-300")}>{point.name}</span>
                                                <span className="text-xs text-slate-500 font-mono bg-slate-200/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">{point.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dropping */}
                            <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full ring-2 ring-rose-100 dark:ring-rose-900"></div>
                                    Dropping Point
                                </h4>
                                <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                                    {DROPPING_POINTS.map((point) => (
                                        <div
                                            key={point.name}
                                            onClick={() => setSelectedDropping(point.name)}
                                            className={cn(
                                                "p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                                                selectedDropping === point.name
                                                    ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                                                    : "border-transparent hover:bg-white dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                                            )}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className={cn("font-medium", selectedDropping === point.name ? "text-rose-700 dark:text-rose-300" : "text-slate-700 dark:text-slate-300")}>{point.name}</span>
                                                <span className="text-xs text-slate-500 font-mono bg-slate-200/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">{point.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary & Proceed */}
                        <div className="md:col-span-3 bg-white dark:bg-slate-900/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm h-fit sticky top-4 flex flex-col justify-between">
                            <div>
                                <h4 className="font-semibold text-sm mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">Booking Summary</h4>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 text-xs uppercase tracking-wide">Seats</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-slate-500 text-xs uppercase tracking-wide mt-0.5">Boarding</span>
                                        <span className="font-medium text-xs text-right text-slate-700 dark:text-slate-300 max-w-[120px] leading-tight">{selectedBoarding || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-slate-500 text-xs uppercase tracking-wide mt-0.5">Dropping</span>
                                        <span className="font-medium text-xs text-right text-slate-700 dark:text-slate-300 max-w-[120px] leading-tight">{selectedDropping || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 mb-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Total Price</span>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-teal-600 dark:text-teal-400">₹{totalAmount}</p>
                                            <p className="text-[10px] text-slate-400">{selectedSeats.length} seat(s) selected</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleProceed}
                                    disabled={selectedSeats.length === 0 || !selectedBoarding || !selectedDropping}
                                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-6 text-base shadow-lg shadow-teal-500/20 rounded-xl transition-all active:scale-[0.98]"
                                >
                                    PROCEED
                                </Button>

                                <p className="text-[10px] text-slate-400 mt-3 text-center flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Seats reserved for 5 mins
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
