import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const booking = await request.json();

        // Validate required fields
        if (!booking.trainId || !booking.name || !booking.email || !booking.phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Add booking to Firestore
        const bookingsRef = collection(db, 'bookings');
        const docRef = await addDoc(bookingsRef, {
            ...booking,
            type: 'train', // Ensure type is explicitly set
            createdAt: new Date().toISOString(),
            status: 'confirmed',
        });

        return NextResponse.json({
            success: true,
            bookingId: docRef.id,
            pnr: booking.pnr,
            message: 'Booking confirmed successfully',
        });
    } catch (error: any) {
        console.error('Booking error:', error);
        return NextResponse.json(
            { error: 'Failed to create booking', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pnr = searchParams.get('pnr');

        if (!pnr) {
            return NextResponse.json(
                { error: 'PNR number required' },
                { status: 400 }
            );
        }

        // Query Firestore for the booking with this PNR
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('pnr', '==', pnr));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json(
                { error: 'PNR not found' },
                { status: 404 }
            );
        }

        const bookingDoc = querySnapshot.docs[0];
        const bookingData = bookingDoc.data();

        // Format the response
        const responseData = {
            pnr,
            status: bookingData.status,
            trainNumber: bookingData.trainNumber,
            trainName: bookingData.trainName || 'Train',
            date: bookingData.fromDate ? new Date(bookingData.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
            from: bookingData.boardingStation || 'Origin',
            to: bookingData.destinationStation || 'Destination',
            classType: bookingData.classType,
            passengers: Array.from({ length: bookingData.passengers || 1 }).map((_, i) => ({
                name: bookingData.name || `Passenger ${i + 1}`,
                seat: `CNF/${bookingData.classType}/${Math.floor(Math.random() * 72) + 1}`, // Simulate seat assignment
                status: bookingData.status === 'confirmed' ? 'CNF' : 'WL'
            }))
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error('PNR Lookup Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}
