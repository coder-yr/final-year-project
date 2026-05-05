import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Train, Shield } from 'lucide-react';
import Image from 'next/image';
import { SearchForm } from '@/components/features/search/search-form';
import { PNRStatusForm } from '@/components/features/train/pnr-status-form';
import { getAllTrains } from '@/lib/data';

// Default images for routes if we can't match specific cities
const ROUTE_IMAGES: Record<string, string> = {
    "Mumbai-Pune": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600&auto=format&fit=crop",
    "Delhi-Mumbai": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop",
    "Bangalore-Chennai": "https://images.unsplash.com/photo-1582972236019-6c1db6c3d3dd?q=80&w=600&auto=format&fit=crop",
    "Mumbai-Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
    "Delhi-Lucknow": "https://images.unsplash.com/photo-1588416936097-41850ab60cfa?q=80&w=600&auto=format&fit=crop",
};
const DEFAULT_ROUTE_IMAGE = "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=600&auto=format&fit=crop";

export default async function RailwayPage() {
    // 1. Fetch real trains from Firestore
    const trains = await getAllTrains();

    // Calculate tomorrow's date for default search
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString();

    // 2. Process trains to find unique routes (From -> To)
    // We'll use a Map to keep track of unique routes and store the "best" representation (e.g. shortest duration or lowest price)
    const uniqueRoutesMap = new Map();

    trains.forEach(train => {
        const routeKey = `${train.depart}-${train.arrive}`;

        // Calculate a base price estimate (lowest class price)
        const lowestPrice = train.seats.reduce((min, seat) => (seat.price < min ? seat.price : min), Infinity);

        // If this route hasn't been added, or if this train is cheaper/faster (simplifying to just taking the first one found or overwriting)
        // Let's just take the first one found for simplicity, or ideally find the cheapest.
        if (!uniqueRoutesMap.has(routeKey)) {
            uniqueRoutesMap.set(routeKey, {
                from: train.depart,
                to: train.arrive,
                duration: train.duration,
                price: lowestPrice !== Infinity ? `From ₹${lowestPrice}` : "Check Price",
                image: ROUTE_IMAGES[routeKey] || DEFAULT_ROUTE_IMAGE
            });
        }
    });

    const popularRoutes = Array.from(uniqueRoutesMap.values()).slice(0, 8); // Show up to 8 routes

    const features = [
        { icon: Shield, title: "IRCTC Authorised Partner", desc: "Book with confidence on India's trusted platform" },
        { icon: Shield, title: "Check PNR Status", desc: "Track your booking status in real-time" }, // Replaced CheckCircle2 with Shield temporarily as import optimization
        { icon: Train, title: "Live Train Status", desc: "Get live updates on train running status" },
        { icon: Shield, title: "Free Cancellation", desc: "Instant full fare refund on select bookings" }, // Replaced Wifi with Shield temporarily
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <Header />
            <main className="flex-1">

                {/* Hero Section */}
                <section className="relative h-[95vh] flex items-center justify-center pt-20">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover brightness-[0.6]"
                            poster="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1920&auto=format&fit=crop"
                        >
                            <source src="/videos/train.mp4" type="video/mp4" />
                        </video>
                    </div>

                    <div className="container relative z-10 px-4">
                        <div className="text-center mb-12 text-white space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6 animate-fade-in shadow-lg">
                                <Shield className="w-5 h-5 text-orange-400" />
                                <span className="text-sm font-semibold tracking-wide text-orange-50">IRCTC Authorised Partner</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
                                Live Train Booking
                            </h1>
                            <p className="text-xl md:text-3xl font-medium text-white/90 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
                                Experience the future of railway travel with <span className="text-orange-400">instant</span> confirmations.
                            </p>
                        </div>

                        {/* Glassmorphism Search Container */}
                        <div className="max-w-7xl mx-auto bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl ring-1 ring-white/10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-8">
                                    <div className="space-y-4">
                                        <h3 className="text-white/80 font-bold text-lg flex items-center gap-2">
                                            <Train className="w-5 h-5 text-orange-400" /> Search Trains
                                        </h3>
                                        <SearchForm defaultTab="railway" />
                                    </div>
                                </div>
                                <div className="lg:col-span-4">
                                    <div className="space-y-4 h-full">
                                        <h3 className="text-white/80 font-bold text-lg flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-orange-400" /> Check Status
                                        </h3>
                                        <div className="h-full bg-white/5 rounded-xl border border-white/10 p-1">
                                            <PNRStatusForm />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Routes */}
                <section className="py-20 container px-4 bg-muted/20">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Popular Train Routes</h2>
                            <p className="text-muted-foreground">Busy routes with highest availability</p>
                        </div>
                        <Button variant="outline">View All Trains</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularRoutes.map((route, index) => (
                            <Card key={index} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer h-[320px]">
                                <div className="absolute inset-0">
                                    <Image
                                        src={route.image}
                                        alt={`${route.from} to ${route.to}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                <CardContent className="relative h-full flex flex-col justify-end p-5 text-white">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-orange-300 mb-1">Direct Train</p>
                                                <h3 className="text-xl font-bold leading-tight">{route.from} <span className="text-white/60">to</span> {route.to}</h3>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
                                                {route.duration}
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                            <div>
                                                <p className="text-xs text-white/70">Starting from</p>
                                                <p className="text-xl font-bold text-orange-400">{route.price}</p>
                                            </div>
                                            <Link href={`/railway/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&date=${encodeURIComponent(defaultDate)}`}>
                                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-0">Check Seats</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Promotional Banner */}
                <section className="py-12 container px-4">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                        <div className="relative z-10 max-w-xl">
                            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                <Shield className="w-4 h-4" /> Instant Refund Guarantee
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Zero Convenience Fee</h2>
                            <p className="text-lg opacity-90 mb-8">Save more on your train bookings. Use code <span className="font-mono font-bold bg-white text-orange-600 px-2 py-1 rounded">ZEROFEE</span></p>
                            <Button size="lg" variant="secondary" className="font-bold text-orange-700 hover:text-orange-800">Book Now</Button>
                        </div>
                        <div className="relative z-10 mt-8 md:mt-0">
                            <Train className="w-48 h-48 text-white/20 -rotate-12" />
                        </div>
                        {/* Abstract Patterns */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
                    </div>
                </section>

                {/* Features */}
                <section className="py-20 container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Why Book Trains with Logify?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-6 border rounded-2xl hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 group">
                                <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 group-hover:scale-110 transition-transform mb-4">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
