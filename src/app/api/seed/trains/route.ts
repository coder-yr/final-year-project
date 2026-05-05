
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, writeBatch, doc } from 'firebase/firestore';
// import { mockTrains } from '@/lib/data'; // Removed to fix lint as we use local array

export async function GET() {
    try {
        const trainsCol = collection(db, 'trains');
        const batch = writeBatch(db);
        let addedCount = 0;

        // Get existing trains to avoid duplicates (naive check by trainNumber)
        const snapshot = await getDocs(trainsCol);
        const existingTrainNumbers = new Set(snapshot.docs.map(d => d.data().trainNumber));

        // Note: mockTrains in data.ts is not exported. 
        // I will copy the Navi Mumbai trains here for seeding specifically as requested.

        const newTrains = [
            {
                id: "10111",
                trainNumber: "10111",
                trainName: "Konkan Kanya Express",
                depart: "Mumbai CST",
                arrive: "Madgaon",
                departTime: "23:05",
                arriveTime: "10:45",
                duration: "11h 40m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "1A", classType: "1A", price: 2800, available: 5, status: "available" },
                    { id: "2A", classType: "2A", price: 1700, available: 10, status: "available" },
                    { id: "3A", classType: "3A", price: 1200, available: 30, status: "available" },
                    { id: "SL", classType: "SL", price: 450, available: 80, status: "available" },
                ],
                amenities: ["Pantry", "Bio Toilets"]
            },
            {
                id: "10103",
                trainNumber: "10103",
                trainName: "Mandovi Express",
                depart: "Mumbai CST",
                arrive: "Madgaon",
                departTime: "07:10",
                arriveTime: "19:10",
                duration: "12h 00m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "1A", classType: "1A", price: 2800, available: 4, status: "waitlist" },
                    { id: "2A", classType: "2A", price: 1700, available: 8, status: "available" },
                    { id: "3A", classType: "3A", price: 1200, available: 45, status: "available" },
                    { id: "SL", classType: "SL", price: 450, available: 15, status: "limited" },
                ],
                amenities: ["Pantry", "Catering"]
            },
            {
                id: "12051",
                trainNumber: "12051",
                trainName: "Jan Shatabdi Express",
                depart: "Dadar",
                arrive: "Madgaon",
                departTime: "05:25",
                arriveTime: "14:10",
                duration: "8h 45m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "2S", classType: "2S", price: 320, available: 120, status: "available" },
                    { id: "CC", classType: "CC", price: 980, available: 45, status: "available" },
                    { id: "EC", classType: "EC", price: 1950, available: 10, status: "available" },
                ],
                amenities: ["Catering"]
            },
            {
                id: "99001",
                trainNumber: "99001",
                trainName: "Navi Mumbai Local",
                depart: "CSMT",
                arrive: "Panvel",
                departTime: "08:15",
                arriveTime: "09:35",
                duration: "1h 20m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "FC", classType: "FC", price: 105, available: 999, status: "available" },
                    { id: "SC", classType: "2S", price: 20, available: 999, status: "available" },
                ],
                amenities: []
            },
            {
                id: "99003",
                trainNumber: "99003",
                trainName: "Thane - Panvel Local",
                depart: "Thane",
                arrive: "Panvel",
                departTime: "10:00",
                arriveTime: "10:50",
                duration: "0h 50m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "FC", classType: "FC", price: 85, available: 999, status: "available" },
                    { id: "SC", classType: "2S", price: 15, available: 999, status: "available" },
                ],
                amenities: []
            },
            {
                id: "12619",
                trainNumber: "12619",
                trainName: "Matsyagandha Express",
                depart: "Lokmanya Tilak Terminus",
                arrive: "Mangalore",
                departTime: "15:20",
                arriveTime: "07:30",
                duration: "16h 10m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "2A", classType: "2A", price: 2400, available: 10, status: "available" },
                    { id: "3A", classType: "3A", price: 1650, available: 20, status: "available" },
                    { id: "SL", classType: "SL", price: 620, available: 0, status: "waitlist" },
                ],
                amenities: ["Pantry"]
            },
            {
                id: "01045",
                trainNumber: "01045",
                trainName: "Panvel - Madgaon Special",
                depart: "Panvel",
                arrive: "Madgaon",
                departTime: "20:00",
                arriveTime: "05:15",
                duration: "9h 15m",
                runningDays: ["Fri", "Sun"],
                seats: [
                    { id: "2A", classType: "2A", price: 1800, available: 15, status: "available" },
                    { id: "3A", classType: "3A", price: 1300, available: 40, status: "available" },
                    { id: "SL", classType: "SL", price: 500, available: 60, status: "available" },
                ],
                amenities: ["Pantry"]
            },
            {
                id: "17613",
                trainNumber: "17613",
                trainName: "Panvel - Nanded Express",
                depart: "Panvel",
                arrive: "Pune",
                departTime: "16:00",
                arriveTime: "19:10",
                duration: "3h 10m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "1A", classType: "1A", price: 1200, available: 2, status: "waitlist" },
                    { id: "2A", classType: "2A", price: 750, available: 10, status: "available" },
                    { id: "3A", classType: "3A", price: 550, available: 25, status: "available" },
                    { id: "SL", classType: "SL", price: 185, available: 50, status: "available" },
                ],
                amenities: ["Pantry", "Charging Points"]
            },
            {
                id: "51027",
                trainNumber: "51027",
                trainName: "Panvel - Pune Passenger",
                depart: "Panvel",
                arrive: "Pune",
                departTime: "22:00",
                arriveTime: "01:45",
                duration: "3h 45m",
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                seats: [
                    { id: "FC", classType: "FC", price: 250, available: 20, status: "available" },
                    { id: "2S", classType: "2S", price: 65, available: 150, status: "available" },
                ],
                amenities: []
            }
        ];

        for (const train of newTrains) {
            if (!existingTrainNumbers.has(train.trainNumber)) {
                const newDocRef = doc(trainsCol); // Auto-ID
                batch.set(newDocRef, {
                    ...train,
                    createdAt: new Date().toISOString()
                });
                addedCount++;
            }
        }

        if (addedCount > 0) {
            await batch.commit();
        }

        return NextResponse.json({
            success: true,
            added: addedCount,
            message: `Seeded ${addedCount} trains successfully`
        });

    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
