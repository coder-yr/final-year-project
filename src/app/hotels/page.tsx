
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FilterSidebar } from "@/components/features/hotel/landing/filter-sidebar";
import { ListingHeader } from "@/components/features/hotel/landing/listing-header";
import { HotelCard } from "@/components/features/hotel/hotel-card";
import { HotelLandingHero } from "@/components/features/hotel/landing/hotel-landing-hero";
import { searchHotels } from "@/lib/data";
import { HotelSearchCriteria } from "@/lib/types";
import Link from "next/link";

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HotelsPage({ searchParams }: PageProps) {
    // Parse search params into criteria
    // Note: searchParams values can be string, array, or undefined.
    // We need to safely convert them.

    const minPrice = typeof searchParams.minPrice === 'string' ? parseInt(searchParams.minPrice) : undefined;
    const maxPrice = typeof searchParams.maxPrice === 'string' ? parseInt(searchParams.maxPrice) : undefined;
    const destination = typeof searchParams.destination === 'string' ? searchParams.destination : undefined;

    const facilitiesParam = typeof searchParams.facilities === 'string'
        ? searchParams.facilities
        : (Array.isArray(searchParams.facilities) ? searchParams.facilities[0] : undefined);

    const facilities = facilitiesParam ? facilitiesParam.split(',') : undefined;

    const criteria: HotelSearchCriteria = {
        destination,
        minPrice,
        maxPrice,
        facilities,
        // Add dateRange and guests parsing if needed, but sidebar currently focuses on price/facilities
    };

    const hotels = await searchHotels(criteria);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
                <Header />
            </div>

            <HotelLandingHero initialDestination={destination} />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <ListingHeader count={hotels.length} />

                        {/* Mobile Filter Toggle could go here if implemented, or relying on FilterSidebar responsiveness if it handles it (it has hidden lg:block wrapper above, checking if sidebar itself has mobile view) */}
                        {/* The sidebar component viewed seemed to be a simple div, so hiding it on mobile here matches the aside class */}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hotels.map((hotel) => (
                                <Link href={`/hotels/${hotel.id}`} key={hotel.id} className="block h-full group">
                                    <HotelCard hotel={hotel} />
                                </Link>
                            ))}
                        </div>

                        {hotels.length === 0 && (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-bold text-slate-800">No hotels found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your filters to see more results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
