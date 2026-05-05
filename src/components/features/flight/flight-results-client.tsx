"use client"

import React, { useState, useEffect } from "react"
import FlightBookingModal from "@/components/features/flight/flight-booking-modal"
import { Plane, Clock } from "lucide-react"

type Flight = {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
  badge?: string
}

const CITY_CODES: Record<string, string> = {
  'new delhi': 'DEL',
  'delhi': 'DEL',
  'mumbai': 'BOM',
  'bengaluru': 'BLR',
  'bangalore': 'BLR',
  'chennai': 'MAA',
  'kolkata': 'CCU',
  'hyderabad': 'HYD',
  'goa': 'GOI',
  'pune': 'PNQ',
};

const AIRLINE_NAMES: Record<string, string> = {
  'AI': 'Air India',
  'UK': 'Vistara',
  '6E': 'IndiGo',
  'SG': 'SpiceJet',
  'QP': 'Akasa Air',
  'IX': 'Air India Express',
  'G8': 'Go First',
};

const AIRLINE_COLORS: Record<string, string> = {
  'AI': 'bg-red-600',
  'UK': 'bg-purple-800',
  '6E': 'bg-blue-700',
  'SG': 'bg-orange-600',
  'QP': 'bg-orange-500',
  'IX': 'bg-red-500',
};

type Props = {
  initialOrigin?: string
  initialDestination?: string
  initialDate?: string
}

export default function FlightResultsClient({ initialOrigin, initialDestination, initialDate }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState(initialOrigin || 'New Delhi')
  const [to, setTo] = useState(initialDestination || 'Bengaluru')
  const [date, setDate] = useState(initialDate || '2025-12-12')
  const [searchOpen, setSearchOpen] = useState(false)


  const fetchFlights = async (origin: string, destination: string, date: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ origin, destination, date });
      const res = await fetch(`/api/flights?${params}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const mappedFlights: Flight[] = data.map((offer: any, index: number) => {
          const itinerary = offer.itineraries[0];
          const segment = itinerary.segments[0];
          const airlineCode = segment.carrierCode;
          const flightNumber = segment.number;
          const duration = itinerary.duration.replace('PT', '').toLowerCase();
          const airlineName = AIRLINE_NAMES[airlineCode] || `Airline ${airlineCode}`;

          // Mock badges for demo
          const badges = ["Enjoy free seat and meal", "Partial Refundable", "Enjoy free seat and meal"];
          const badge = badges[index % badges.length];

          return {
            id: offer.id,
            airline: airlineName,
            airlineCode: airlineCode,
            flightNumber: `${airlineCode}-${flightNumber}`,
            depart: new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrive: new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            duration: duration.replace('h', 'h ').replace('m', 'm'),
            price: `₹${offer.price.total}`,
            stops: itinerary.segments.length > 1 ? `${itinerary.segments.length - 1} stop` : 'Non-stop',
            badge: badge
          };
        });
        setFlights(mappedFlights);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("Failed to fetch flights", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine codes - simple heuristic or mapping for demo
    const normalize = (str: string) => str.toLowerCase().trim();
    const originCode = CITY_CODES[normalize(from)] || from.toUpperCase().substring(0, 3);
    const destCode = CITY_CODES[normalize(to)] || to.toUpperCase().substring(0, 3);

    fetchFlights(originCode, destCode, date);
  }, [from, to, date]);

  const handleSearch = (nf: string, nt: string, nd: string) => {
    setFrom(nf);
    setTo(nt);
    setDate(nd);
    setSearchOpen(false);
    const normalize = (str: string) => str.toLowerCase().trim();
    const originCode = CITY_CODES[normalize(nf)] || nf.toUpperCase().substring(0, 3);
    const destCode = CITY_CODES[normalize(nt)] || nt.toUpperCase().substring(0, 3);
    fetchFlights(originCode, destCode, nd);
  };

  return (
    <>
      <div className="mb-8">
        <div className="glass-card rounded-2xl p-6 border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-headline font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              Flights from <span className="text-gradient">{from}</span> to <span className="text-gradient">{to}</span>
            </h1>
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-primary hover:text-primary/80 font-medium transition-colors text-sm underline decoration-2 underline-offset-4">
              {searchOpen ? 'Close Search' : 'Update Search'}
            </button>
          </div>

          {searchOpen && (
            <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={from} onChange={e => setFrom(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">To</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={to} onChange={e => setTo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <button onClick={() => handleSearch(from, to, date)} className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Search Flights
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 text-lg">Finding the best flights for you...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No flights found</h3>
            <p className="text-slate-500">Try changing your dates or destinations.</p>
          </div>
        ) : (
          flights.map(f => (
            <div key={f.id} className="glass-card rounded-2xl border-slate-200/50 dark:border-slate-800/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Badge */}
              {f.badge && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 inline-block rounded-br-2xl shadow-md">
                  {f.badge}
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Airline Info */}
                <div className="flex items-center gap-5 min-w-[200px]">
                  <div className={`w-14 h-14 rounded-2xl ${AIRLINE_COLORS[f.airlineCode] || 'bg-slate-500'} flex items-center justify-center text-white shadow-lg shadow-black/10`}>
                    <Plane className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{f.airline}</div>
                    <div className="text-sm text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-center inline-block mt-1">{f.flightNumber}</div>
                  </div>
                </div>

                {/* Flight Times */}
                <div className="flex items-center gap-6 text-center flex-1 w-full md:w-auto">
                  <div className="text-left">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{f.depart}</div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">{from.substring(0, 3)}</div>
                  </div>

                  <div className="flex flex-col items-center flex-1 px-4">
                    <div className="text-xs text-slate-500 font-medium mb-2">{f.duration}</div>
                    <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 left-0 top-1/2 -translate-y-1/2" />
                      <Plane className="absolute w-4 h-4 text-primary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                      <div className="absolute w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 right-0 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-xs text-primary font-medium mt-2">{f.stops}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{f.arrive}</div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">{to.substring(0, 3)}</div>
                  </div>
                </div>

                {/* Price & Book */}
                <div className="flex flex-col items-center md:items-end gap-3 min-w-[180px] w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
                  <div className="text-center md:text-right">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{f.price}</div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-1">Includes all taxes</div>
                  </div>
                  <button
                    onClick={() => { setSelectedFlight(f); setModalOpen(true); }}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                  >
                    Select Flight
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <FlightBookingModal
        flight={selectedFlight}
        open={modalOpen}
        onOpenChangeAction={(v) => { setModalOpen(v); if (!v) setSelectedFlight(null); }}
        onBookedAction={() => console.log('flight booked')}
        originCity={from}
        destinationCity={to}
        travelDate={date}
      />
    </>
  )
}
