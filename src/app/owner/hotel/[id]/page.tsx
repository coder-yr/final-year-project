import { notFound } from 'next/navigation';
import { getHotelById, getRoomsByHotelId, getHotelsByOwner, getBookingsByHotelId } from '@/lib/data';
import { Header } from '@/components/header';
import { HotelManager } from '@/components/features/owner/dashboard/hotel-manager';

type HotelManagementPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function HotelManagementPage({ params }: HotelManagementPageProps) {
    const { id } = await params;
    const hotel = await getHotelById(id);

    if (!hotel) {
        notFound();
    }

    const rooms = await getRoomsByHotelId(id);
    const ownerHotels = await getHotelsByOwner(hotel.ownerId);
    const bookings = await getBookingsByHotelId(id);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <Header />
            <main className="flex-1 pt-28">
                <HotelManager hotel={hotel} rooms={rooms} ownerHotels={ownerHotels} bookings={bookings} />
            </main>
        </div>
    );
}
