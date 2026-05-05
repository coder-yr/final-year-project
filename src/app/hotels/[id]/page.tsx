import { notFound } from 'next/navigation';
import { getHotelById, getRoomsByHotelId } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BookingCard } from '@/components/features/hotel/booking-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MapPin, Star, Wifi, Car, Utensils, Coffee, Info, Wind, Tv, Dumbbell, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type HotelDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function HotelDetailsPage({ params }: HotelDetailsPageProps) {
    const { id } = await params;
    const hotel = await getHotelById(id);

    if (!hotel) {
        notFound();
    }

    const rooms = await getRoomsByHotelId(id);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
                <Header />
            </div>

            <main className="flex-1 pb-12">
                {/* Hero Section */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <Image
                        src={hotel.coverImage}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white container mx-auto">
                        <div className="max-w-4xl space-y-4">
                            {hotel.category && (
                                <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-white/20 text-sm py-1">
                                    {hotel.category}
                                </Badge>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-xl">{hotel.name}</h1>
                            <div className="flex items-center text-lg md:text-xl text-white/90">
                                <MapPin className="h-5 w-5 mr-2" />
                                {hotel.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Description */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold font-headline text-slate-900">About this place</h2>
                                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                    {hotel.description}
                                </p>
                            </section>

                            <Separator />

                            {hotel.isVirtualTourEnabled && hotel.virtualTourUrl && (
                                <>
                                    <section className="space-y-6">
                                        <h2 className="text-2xl font-bold font-headline text-slate-900">360° Virtual Tour</h2>
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                                            <iframe
                                                src={hotel.virtualTourUrl}
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                allowFullScreen
                                                allow="xr-spatial-tracking; gyroscope; accelerometer"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </section>
                                    <Separator />
                                </>
                            )}

                            <Separator />

                            {/* Amenities (Placeholder logic, assuming generic for now or from future data) */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold font-headline text-slate-900">What this place offers</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Wifi className="h-5 w-5 text-teal-600" />
                                        <span>Fast Wifi</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Car className="h-5 w-5 text-teal-600" />
                                        <span>Free parking on premises</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Utensils className="h-5 w-5 text-teal-600" />
                                        <span>Kitchen</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Coffee className="h-5 w-5 text-teal-600" />
                                        <span>Breakfast included</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Wind className="h-5 w-5 text-teal-600" />
                                        <span>Air conditioning</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Tv className="h-5 w-5 text-teal-600" />
                                        <span>HDTV</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="mt-4">Show all amenities</Button>
                            </section>

                            <Separator />

                            {/* Location / Map Placeholder */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold font-headline text-slate-900">Where you'll be</h2>
                                <div className="bg-slate-100 rounded-2xl h-64 w-full flex items-center justify-center text-slate-400">
                                    <div className="text-center">
                                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>Map view coming soon</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-900">{hotel.location}</h3>
                                    <p className="text-slate-500 text-sm">Exact location provided after booking.</p>
                                </div>
                            </section>

                            <Separator />

                            {/* House Rules */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold font-headline text-slate-900">Things to know</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-600">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-slate-900">House rules</h3>
                                        <p>Check-in: {hotel.checkInTime || '14:00'}</p>
                                        <p>Checkout: {hotel.checkOutTime || '11:00'}</p>
                                        <p>No smoking</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-slate-900">Safety & property</h3>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>Security camera on property</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-slate-900">Cancellation policy</h3>
                                        <p>Free cancellation for 48 hours.</p>
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* Right Column: Booking */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <BookingCard hotel={hotel} rooms={rooms} />
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <Info className="h-3 w-3" />
                                    <span>Prices may vary based on dates</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
