import { db } from "@/lib/firebase";
import { Hotel, Review } from "@/lib/types";
import { addDoc, collection, doc, serverTimestamp, updateDoc, Timestamp, query, where, getDocs } from "firebase/firestore";

// Constants
const MIN_RATING_THRESHOLD = 3.0;
const PROBATION_PERIOD_MONTHS = 3;
const WARNING_MESSAGE = `
⚠️ **IMPORTANT WARNING: Low Rating Alert**

Your hotel's average rating has dropped below ${MIN_RATING_THRESHOLD}. 
We are committed to maintaining high standards for our travelers.

**Improvement Required:**
You have ${PROBATION_PERIOD_MONTHS} months to improve your rating to above ${MIN_RATING_THRESHOLD}. 
Failure to do so will result in the automatic deactivation of your listing.

Please review your recent feedback and take immediate action.
`;

const SUSPENSION_MESSAGE = `
⛔ **ACCOUNT SUSPENDED**

Checking your performance: Unfortunately, your hotel's rating has remained below ${MIN_RATING_THRESHOLD} for the duration of your probation period.
As per our quality standards, your listing has been automatically deactivated.

Please contact support if you believe this is an error or if you have made significant improvements.
`;

export async function calculateHotelRating(hotelId: string): Promise<number> {
    // Correct path: hotels/{hotelId}/reviews
    const reviewsRef = collection(db, "hotels", hotelId, "reviews");
    const snapshot = await getDocs(reviewsRef);

    console.log(`[QualityCheck] Hotel ${hotelId}: Found ${snapshot.size} reviews in subcollection.`);

    if (snapshot.empty) return 0;

    const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().rating || 0), 0);
    const average = total / snapshot.size;
    console.log(`[QualityCheck] Hotel ${hotelId}: Average Rating = ${average}`);
    return average;
}

export async function runQualityCheckForHotel(hotel: Hotel) {
    if (!hotel.id) return;
    console.log(`[QualityCheck] Starting check for ${hotel.name} (${hotel.id})`);

    // 1. Get current rating
    const currentRating = await calculateHotelRating(hotel.id);

    // Update local rating if needed
    const hotelRef = doc(db, "hotels", hotel.id);
    await updateDoc(hotelRef, {
        averageRating: currentRating,
        // Update totalReviews too if we want, but keeping it simple
    });

    console.log(`Checking quality for ${hotel.name}: Rating matches ${currentRating}`);

    // 2. Logic
    if (currentRating > 0 && currentRating < MIN_RATING_THRESHOLD) {

        // CASE A: Already on probation? Check if time is up.
        if (hotel.probationStatus === 'warning' && hotel.warningSentAt) {
            const warningDate = hotel.warningSentAt instanceof Date
                ? hotel.warningSentAt
                : new Date((hotel.warningSentAt as any).seconds * 1000);

            const monthsSinceWarning = (new Date().getTime() - warningDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

            if (monthsSinceWarning >= PROBATION_PERIOD_MONTHS) {
                // SUSPEND
                await updateDoc(hotelRef, {
                    status: 'rejected', // Deactivate
                    probationStatus: 'suspended'
                });
                await sendMessageToOwner(hotel.ownerId, SUSPENSION_MESSAGE);
                return { status: 'suspended', rating: currentRating };
            }
        }

        // CASE B: New Low Rating (No previous warning or strict 'none')
        else if (hotel.probationStatus !== 'warning' && hotel.probationStatus !== 'suspended') {
            // WARN
            await updateDoc(hotelRef, {
                probationStatus: 'warning',
                warningSentAt: serverTimestamp()
            });
            await sendMessageToOwner(hotel.ownerId, WARNING_MESSAGE);
            return { status: 'warning_sent', rating: currentRating };
        }
    } else if (currentRating >= MIN_RATING_THRESHOLD && hotel.probationStatus === 'warning') {
        // CASE C: Improved! Clear probation.
        await updateDoc(hotelRef, {
            probationStatus: 'none',
            warningSentAt: null
        });
        // Optional: Send "Good job" message
        return { status: 'improved', rating: currentRating };
    }

    return { status: 'ok', rating: currentRating };
}

async function sendMessageToOwner(ownerId: string, text: string) {
    if (!ownerId) return;

    // Check if conversation exists (simplified: just create new one or add to existing if found)
    // For now, let's just assume we create a message in a "support" thread or similar.
    // In this system, 'conversations' seem to be between admin and user.

    // 1. Find or Create Conversation
    const convsRef = collection(db, "conversations");
    const q = query(convsRef, where("participants", "array-contains", ownerId));
    const snapshot = await getDocs(q);

    let conversationId = "";

    if (!snapshot.empty) {
        conversationId = snapshot.docs[0].id;
    } else {
        const newConv = await addDoc(convsRef, {
            participants: [ownerId, "ADMIN"], // Assuming ADMIN is a specialized ID or we handle it
            participantsData: [{ userId: ownerId, name: "Hotel Owner" }], // Simplified
            lastMessage: "System Alert",
            lastMessageAt: serverTimestamp(),
            adminUnreadCount: 0,
            userUnreadCount: 1,
            startedAt: serverTimestamp(),
            status: 'active'
        });
        conversationId = newConv.id;
    }

    // 2. Add Message
    await addDoc(collection(db, "conversations", conversationId, "messages"), {
        text: text,
        senderId: "ADMIN",
        createdAt: serverTimestamp(),
        readBy: ["ADMIN"],
        isAdmin: true
    });

    // 3. Update Conversation Meta
    await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: "⚠️ Quality Control Alert",
        lastMessageAt: serverTimestamp(),
        userUnreadCount: 1 // Increment properly in real app
    });
}
