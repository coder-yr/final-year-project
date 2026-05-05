/**
 * Server-side seeding function using Firebase Admin SDK
 * This file should ONLY be used in API routes and server-side code
 */

import { adminAuth, adminDb } from './firebase-admin';

// Helper to get current timestamp
const getTimestamp = () => {
    return new Date();
};

// Sample data for each collection
// NOTE: Passwords are handled by Firebase Authentication, NOT stored in Firestore
const sampleUsers = [
    {
        email: 'user1@example.com',
        password: 'User@123456', // Password for authentication
        name: 'John Doe',
        role: 'user',
        phone: '9876543210',
    },
    {
        email: 'owner@example.com',
        password: 'Owner@123456', // Password for authentication
        name: 'Hotel Owner',
        role: 'owner',
        phone: '9876543211',
    },
    {
        email: 'admin@example.com',
        password: 'Admin@123456', // Password for authentication
        name: 'Admin User',
        role: 'admin',
        phone: '9876543212',
    },
];

const sampleHotels = [
    {
        name: 'Luxury Beach Resort',
        address: '123 Beach Road',
        city: 'Goa',
        rating: 4.8,
        price: 8000,
        category: 'Resort',
        facilities: ['wifi', 'pool', 'spa', 'gym', 'beach access'],
        ownerId: 'owner1',
        image: 'https://placehold.co/600x400.png?text=Luxury+Beach+Resort',
        status: 'approved',
        createdAt: getTimestamp(),
    },
    {
        name: 'Mountain Cabin Retreat',
        address: '456 Hill Station Road',
        city: 'Manali',
        rating: 4.6,
        price: 5000,
        category: 'Cabin',
        facilities: ['heating', 'bonfire', 'parking', 'restaurant'],
        ownerId: 'owner2',
        image: 'https://placehold.co/600x400.png?text=Mountain+Cabin',
        status: 'approved',
        createdAt: getTimestamp(),
    },
    {
        name: 'Boutique City Hotel',
        address: '789 Commercial Street',
        city: 'Mumbai',
        rating: 4.5,
        price: 6000,
        category: 'Boutique',
        facilities: ['wifi', 'gym', 'rooftop bar', 'restaurant', 'parking'],
        ownerId: 'owner1',
        image: 'https://placehold.co/600x400.png?text=Boutique+Hotel',
        status: 'approved',
        createdAt: getTimestamp(),
    },
];

const sampleRooms = [
    {
        hotelId: 'hotel1',
        roomNumber: '101',
        type: 'Deluxe',
        price: 3000,
        capacity: 2,
        amenities: ['AC', 'WiFi', 'TV', 'Balcony'],
        status: 'available',
        createdAt: getTimestamp(),
    },
    {
        hotelId: 'hotel1',
        roomNumber: '102',
        type: 'Suite',
        price: 5000,
        capacity: 4,
        amenities: ['AC', 'WiFi', 'TV', 'Jacuzzi', 'Balcony'],
        status: 'available',
        createdAt: getTimestamp(),
    },
    {
        hotelId: 'hotel2',
        roomNumber: '201',
        type: 'Standard',
        price: 2500,
        capacity: 2,
        amenities: ['Heating', 'WiFi', 'TV'],
        status: 'available',
        createdAt: getTimestamp(),
    },
];

const sampleBuses = [
    {
        operator: 'RedBus Premium',
        depart: 'Mumbai',
        arrive: 'Delhi',
        departTime: '22:00',
        arriveTime: '06:00',
        duration: '8h',
        price: 800,
        amenities: ['WiFi', 'AC', 'Charging'],
        seats: Array.from({ length: 50 }, (_, i) => ({
            id: `L${i + 1}`,
            price: 800,
            status: i < 10 ? 'sold' : 'available',
            deck: 'lower',
            row: Math.floor(i / 5) + 1,
            col: (i % 5) + 1,
        })),
        createdAt: getTimestamp(),
    },
    {
        operator: 'GoIBIBO Express',
        depart: 'Bangalore',
        arrive: 'Chennai',
        departTime: '18:00',
        arriveTime: '23:00',
        duration: '5h',
        price: 500,
        amenities: ['AC', 'Charging'],
        seats: Array.from({ length: 40 }, (_, i) => ({
            id: `S${i + 1}`,
            price: 500,
            status: 'available',
            deck: 'single',
            row: Math.floor(i / 4) + 1,
            col: (i % 4) + 1,
        })),
        createdAt: getTimestamp(),
    },
];

const sampleTrains = [
    {
        trainNumber: '12301',
        trainName: 'Rajdhani Express',
        depart: 'New Delhi',
        arrive: 'Mumbai Central',
        departTime: '16:55',
        arriveTime: '08:35',
        duration: '15h 40m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        seats: [
            { class: '1A', price: 3500, available: 12, status: 'available' },
            { class: '2A', price: 2200, available: 8, status: 'available' },
            { class: '3A', price: 1600, available: 5, status: 'limited' },
        ],
        amenities: ['WiFi', 'Pantry', 'Security', 'Charging Points'],
        createdAt: getTimestamp(),
    },
    {
        trainNumber: '12430',
        trainName: 'Shatabdi Express',
        depart: 'New Delhi',
        arrive: 'Lucknow',
        departTime: '06:10',
        arriveTime: '12:25',
        duration: '6h 15m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        seats: [
            { class: 'CC', price: 850, available: 25, status: 'available' },
            { class: 'EC', price: 1650, available: 10, status: 'available' },
        ],
        amenities: ['WiFi', 'Pantry', 'AC', 'Charging Points'],
        createdAt: getTimestamp(),
    },
];

const sampleFlights = [
    {
        airline: 'Air India',
        flightNumber: 'AI101',
        depart: 'Mumbai (BOM)',
        arrive: 'Delhi (DEL)',
        departTime: '06:00',
        arriveTime: '08:00',
        duration: '2h 30m',
        price: 5000,
        seats: 180,
        createdAt: getTimestamp(),
    },
    {
        airline: 'IndiGo',
        flightNumber: 'IG102',
        depart: 'Bangalore (BLR)',
        arrive: 'Mumbai (BOM)',
        departTime: '09:00',
        arriveTime: '11:00',
        duration: '2h',
        price: 4000,
        seats: 180,
        createdAt: getTimestamp(),
    },
];

// Main seeding function
async function seedDatabase() {
    try {
        console.log('🚀 Starting database seeding...\n');

        // Seed users with Firebase Authentication
        console.log('📝 Seeding users with Firebase Authentication...');
        for (const user of sampleUsers) {
            try {
                // Create user in Firebase Authentication
                const userRecord = await adminAuth.createUser({
                    email: user.email,
                    password: user.password,
                    displayName: user.name,
                });
                console.log(`  ✓ Created auth user: ${user.email}`);

                // Store user profile in Firestore
                await adminDb.collection('users').doc(userRecord.uid).set({
                    uid: userRecord.uid,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                    createdAt: getTimestamp(),
                    updatedAt: getTimestamp(),
                });
                console.log(`  ✓ Stored profile for: ${user.name}`);
            } catch (error) {
                if ((error as any).code === 'auth/email-already-exists') {
                    console.warn(`  ⚠️  User ${user.email} already exists, skipping...`);
                } else {
                    throw error;
                }
            }
        }

        // Seed hotels
        console.log('\n🏨 Seeding hotels...');
        for (const hotel of sampleHotels) {
            const docRef = await adminDb.collection('hotels').add(hotel);
            console.log(`  ✓ Added hotel: ${hotel.name}`);

            // Add a sample review to each hotel
            await docRef.collection('reviews').add({
                userId: 'user1',
                userName: 'John Doe',
                rating: 4,
                comment: 'Great hotel! Highly recommended.',
                createdAt: getTimestamp(),
            });
            console.log(`    ✓ Added review for ${hotel.name}`);
        }

        // Seed rooms
        console.log('\n🛏️ Seeding rooms...');
        for (const room of sampleRooms) {
            await adminDb.collection('rooms').add(room);
            console.log(`  ✓ Added room: ${room.roomNumber}`);
        }

        // Seed buses
        console.log('\n🚌 Seeding buses...');
        for (const bus of sampleBuses) {
            await adminDb.collection('buses').add(bus);
            console.log(`  ✓ Added bus: ${bus.operator}`);
        }

        // Seed trains
        console.log('\n🚂 Seeding trains...');
        for (const train of sampleTrains) {
            await adminDb.collection('trains').add(train);
            console.log(`  ✓ Added train: ${train.trainName}`);
        }

        // Seed flights
        console.log('\n✈️  Seeding flights...');
        for (const flight of sampleFlights) {
            await adminDb.collection('flights').add(flight);
            console.log(`  ✓ Added flight: ${flight.airline} ${flight.flightNumber}`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  • Users: ${sampleUsers.length}`);
        console.log(`  • Hotels: ${sampleHotels.length}`);
        console.log(`  • Rooms: ${sampleRooms.length}`);
        console.log(`  • Buses: ${sampleBuses.length}`);
        console.log(`  • Trains: ${sampleTrains.length}`);
        console.log(`  • Flights: ${sampleFlights.length}`);

        return true;
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

export { seedDatabase };
