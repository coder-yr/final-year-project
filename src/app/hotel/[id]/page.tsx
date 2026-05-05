
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getHotelById, getRoomsByHotelId, getUserById } from '@/lib/data';
import { getCachedHotels, generateHotelMetadata } from '@/lib/server-utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share2, Heart, Star, ShieldCheck, MapPin, Wifi, ParkingSquare, UtensilsCrossed, Dumbbell, Waves, Sparkles, User, BadgeCheck, Phone, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingCard } from '@/components/features/hotel/booking-card';
import { SimilarProperties } from '@/components/features/hotel/similar-properties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewsSection } from '@/components/features/reviews/reviews-section';
import Image from "next/image";
import Link from 'next/link';

type HotelPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
    const { id } = await params;
    return generateHotelMetadata(id);
}

const facilityIconMap: { [key: string]: React.ElementType } = {
    wifi: Wifi,
    parking: ParkingSquare,
    restaurant: UtensilsCrossed,
    gym: Dumbbell,
    pool: Waves,
    spa: Sparkles,
};
const facilityNameMap: { [key: string]: string } = {
    wifi: "Free WiFi",
    parking: "Parking",
    restaurant: "Restaurant",
    gym: "Gym",
    pool: "Swimming Pool",
    spa: "Spa",
}

export default async function HotelPage({ params }: HotelPageProps) {
    const { id } = await params;
    const hotel = await getHotelById(id);
    if (!hotel || hotel.status !== 'approved') {
        notFound();
    }
    const rooms = await getRoomsByHotelId(id);
    const similarHotels = (await getCachedHotels()).filter(h => h.id !== id).slice(0, 3);
    const owner = await getUserById(hotel.ownerId);

    const allImages = [
        hotel.coverImage,
        ...rooms.flatMap(room => room.images).slice(0, 2)
    ];
    // Ensure at least 3 images for the specific grid layout (1 big, 2 small)
    while (allImages.length < 3) {
        allImages.push('https://placehold.co/600x400.png');
    }

    return (
        <div className="flex flex-col min-h-screen font-sans text-slate-900 dark:text-foreground">
            <Header />
            <main className="flex-1 pt-24 pb-12 relative overflow-hidden">
                {/* Animated Gradient Orbs Background */}
                <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse delay-1000" />
                    <div className="absolute top-[30%] right-[30%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse delay-700" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

                    {/* Hero Image Grid - 1 Large Left, 2 Small Right */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                        <div className="md:col-span-3 relative h-full group">
                            <Image
                                src={allImages[0]}
                                alt={hotel.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        </div>
                        <div className="hidden md:flex flex-col gap-4 h-full md:col-span-1">
                            <div className="relative h-1/2 rounded-tr-3xl overflow-hidden group">
                                <Image
                                    src={allImages[1]}
                                    alt="Property detail"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="relative h-1/2 rounded-br-3xl overflow-hidden group">
                                <Image
                                    src={allImages[2]}
                                    alt="Property detail"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                                    <span className="text-white font-medium border border-white/50 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-all">View all photos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT COLUMN - Main Information */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Header Info */}
                            <div className="glass-card p-8 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
                                <h1 className="text-4xl font-headline font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                                    {hotel.name}
                                </h1>
                                <div className="flex items-center text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                                    <span>{hotel.address}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full font-medium border border-emerald-100 dark:border-emerald-900">
                                        <BadgeCheck className="w-4 h-4" /> Verified Listing
                                    </div>
                                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 px-4 py-1.5 rounded-full font-medium border border-orange-100 dark:border-orange-900">
                                        <Star className="w-4 h-4 fill-current" /> 4.8 (24 Reviews)
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                    {hotel.description}
                                </p>
                            </div>

                            {/* Property Features */}
                            <div className="glass-card p-8 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
                                <h3 className="text-2xl font-headline font-bold mb-6 text-slate-900 dark:text-white">Property Features</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                                    {hotel.facilities && hotel.facilities.map(facility => {
                                        const Icon = facilityIconMap[facility];
                                        return Icon ? (
                                            <div key={facility} className="flex items-center gap-4 group">
                                                <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <span className="font-medium text-slate-700 dark:text-slate-200">{facilityNameMap[facility]}</span>
                                            </div>
                                        ) : null;
                                    })}
                                    {(!hotel.facilities || hotel.facilities.length === 0) && (
                                        <p className="text-slate-500 dark:text-muted-foreground italic">No specific features listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Video Reviews (Placeholder) */}
                            {hotel.videoUrl && (
                                <div className="glass-card p-8 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-headline font-bold text-slate-900 dark:text-white">Video Tour</h3>
                                    </div>
                                    <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden relative group shadow-lg">
                                        {hotel.videoUrl.includes('youtube.com') || hotel.videoUrl.includes('youtu.be') ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={hotel.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                                title="Video Tour"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="shadow-inner"
                                            ></iframe>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white">
                                                <a href={hotel.videoUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 hover:opacity-80 transition-opacity">
                                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform">
                                                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
                                                    </div>
                                                    <span className="font-medium tracking-wide">Watch Video Tour</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            <div className="glass-card p-1 rounded-3xl border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
                                <div className="h-[400px] w-full rounded-[20px] overflow-hidden relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight={0}
                                        marginWidth={0}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        title={`Map of ${hotel.name}`}
                                        className="filter grayscale-[10%] contrast-[1.05]"
                                    ></iframe>
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-primary w-5 h-5" />
                                            <span className="font-medium text-slate-900 dark:text-white">{hotel.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews */}
                            <div id="reviews" className="glass-card p-8 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
                                <h3 className="text-2xl font-headline font-bold mb-8 text-slate-900 dark:text-white">Guest Reviews</h3>
                                <ReviewsSection hotelId={hotel.id} />
                            </div>

                        </div>

                        {/* RIGHT COLUMN - Sidebar */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Booking Card */}
                            <div className="sticky top-28 z-20">
                                <BookingCard rooms={rooms} hotel={hotel} />
                            </div>

                            {/* Detail Card */}
                            <Card className="glass-card border-slate-200/50 dark:border-slate-800/50 shadow-xl rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 py-4 border-b border-slate-100 dark:border-slate-800 backdrop-blur-sm">
                                    <CardTitle className="text-lg font-headline font-bold text-slate-900 dark:text-white">Property Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <div className="flex justify-between py-4 px-6 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400">Property Type</span>
                                            <span className="font-medium text-slate-900 dark:text-white">Hotel</span>
                                        </div>
                                        <div className="flex justify-between py-4 px-6 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400">Cancellation</span>
                                            <span className="font-medium text-right ml-2 text-slate-900 dark:text-white">{hotel.cancellationPolicy}</span>
                                        </div>
                                        <div className="flex justify-between py-4 px-6 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400">Check-in</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{hotel.checkInTime}</span>
                                        </div>
                                        <div className="flex justify-between py-4 px-6 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400">Check-out</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{hotel.checkOutTime}</span>
                                        </div>
                                        <div className="flex justify-between py-4 px-6 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400">Pet Friendly</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{hotel.isPetFriendly ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Agent Detail Card */}
                            <Card className="glass-card border-slate-200/50 dark:border-slate-800/50 shadow-xl rounded-3xl overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                                            <AvatarImage src={owner?.avatarUrl || `https://i.pravatar.cc/150?u=${hotel.ownerId}`} />
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{owner?.name || hotel.ownerName || 'Host'}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Property Manager
                                            </p>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl h-12 font-bold shadow-lg transition-all">
                                        Contact Host
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>

                {/* Similar Properties Section */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-24">
                    <div className="glass-card p-8 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
                        <SimilarProperties hotels={similarHotels} />
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
