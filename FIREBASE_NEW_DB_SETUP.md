# Firebase New Database Setup Guide

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your new project
3. Click **Settings** ⚙️ (top right) → **Project Settings**
4. Copy these details:
   - **Project ID**
   - **Web API Key**
   - **Auth Domain** (format: `projectid.firebaseapp.com`)
   - **Storage Bucket**
   - **Messaging Sender ID**
   - **App ID**

## Step 2: Create `.env.local` File

Create a file at the root: `.env.local`

```env
# Firebase - Client Side (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Firebase Admin - Server Side (Private)
# Option 1: Using Service Account JSON (Recommended)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}

# Option 2: Using Individual Variables (Alternative)
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

### How to Get Service Account JSON:

1. Go to **Firebase Console** → **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. A JSON file downloads - copy its content into `FIREBASE_SERVICE_ACCOUNT` env variable
   - Make sure to escape it properly or use Option 2 (individual variables)

## Step 3: Enable Firestore Database

1. **Firebase Console** → **Firestore Database**
2. Click **Create Database**
3. Choose: **Start in test mode** (for development)
4. Select region closest to you
5. Click **Enable**

## Step 4: Create Collections

### Create Collections Manually (Easy Way):

1. Go to **Firebase Console** → **Firestore Database**
2. Click **+ Start collection** and create these:

#### Collection: **users**
Add a sample document with this structure:
```json
{
  "email": "test@example.com",
  "name": "Test User",
  "role": "user",
  "createdAt": "<timestamp>",
  "phone": "1234567890"
}
```

#### Collection: **hotels**
```json
{
  "name": "Sample Hotel",
  "address": "123 Main St",
  "city": "Mumbai",
  "rating": 4.5,
  "price": 5000,
  "category": "Premium",
  "facilities": ["wifi", "pool", "gym"],
  "ownerId": "user_id_here",
  "image": "https://placehold.co/600x400.png",
  "status": "approved",
  "createdAt": "<timestamp>"
}
```
**Add subcollection: `reviews`** on this document:
```json
{
  "userId": "user_id",
  "rating": 4,
  "comment": "Great hotel!",
  "createdAt": "<timestamp>"
}
```

#### Collection: **rooms**
```json
{
  "hotelId": "hotel_id_here",
  "roomNumber": "101",
  "type": "Deluxe",
  "price": 3000,
  "capacity": 2,
  "amenities": ["AC", "WiFi", "TV"],
  "status": "available",
  "createdAt": "<timestamp>"
}
```

#### Collection: **bookings**
```json
{
  "userId": "user_id_here",
  "hotelId": "hotel_id_here",
  "roomId": "room_id_here",
  "checkInDate": "<date>",
  "checkOutDate": "<date>",
  "totalPrice": 6000,
  "status": "confirmed",
  "createdAt": "<timestamp>"
}
```

#### Collection: **buses**
```json
{
  "operator": "Sample Bus Company",
  "depart": "Mumbai",
  "arrive": "Delhi",
  "departTime": "22:00",
  "arriveTime": "06:00",
  "duration": "8h",
  "price": 800,
  "seats": [
    {
      "id": "L1",
      "price": 800,
      "status": "available",
      "deck": "lower",
      "row": 1,
      "col": 1
    }
  ],
  "createdAt": "<timestamp>"
}
```

#### Collection: **trains**
```json
{
  "trainNumber": "12301",
  "trainName": "Rajdhani Express",
  "depart": "New Delhi",
  "arrive": "Mumbai Central",
  "departTime": "16:55",
  "arriveTime": "08:35",
  "duration": "15h 40m",
  "seats": [
    {
      "class": "1A",
      "price": 3500,
      "available": 12,
      "status": "available"
    },
    {
      "class": "2A",
      "price": 2200,
      "available": 8,
      "status": "available"
    }
  ],
  "amenities": ["WiFi", "Pantry", "Security"],
  "createdAt": "<timestamp>"
}
```

#### Collection: **flights**
```json
{
  "airline": "Air India",
  "flightNumber": "AI101",
  "depart": "Mumbai",
  "arrive": "Delhi",
  "departTime": "06:00",
  "arriveTime": "08:00",
  "duration": "2h 30m",
  "price": 5000,
  "seats": 180,
  "createdAt": "<timestamp>"
}
```

#### Collection: **bus_bookings**
```json
{
  "userId": "user_id_here",
  "busId": "bus_id_here",
  "seats": ["L1", "L2"],
  "totalPrice": 1600,
  "passengerDetails": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  ],
  "status": "confirmed",
  "createdAt": "<timestamp>"
}
```

#### Collection: **conversations** (with subcollection)
```json
{
  "userId": "user_id",
  "subject": "Hotel Inquiry",
  "createdAt": "<timestamp>",
  "lastMessage": "When is checkout time?"
}
```
**Add subcollection: `messages`** on this document:
```json
{
  "sender": "user",
  "text": "When is checkout time?",
  "timestamp": "<timestamp>"
}
```

## Step 5: Set Firestore Security Rules

Go to **Firestore Database** → **Rules** and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow anyone to read hotels (public listings)
    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      // Hotel reviews subcollection
      match /reviews/{reviewId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }

    // Allow anyone to read rooms
    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Allow users to access bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    // Allow anyone to read buses
    match /buses/{busId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Allow anyone to read trains
    match /trains/{trainId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Allow anyone to read flights
    match /flights/{flightId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Allow users to book buses
    match /bus_bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    // Allow users to have conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish** to apply the rules.

## Step 6: Enable Authentication

1. **Firebase Console** → **Authentication**
2. Click **Get Started**
3. Enable:
   - ✅ Email/Password
   - ✅ Google Sign-in

## Step 7: Update Your Code

Your `.env.local` file is already set up. Just run:

```bash
npm run dev
```

## Step 8: Seed Data (Optional)

To populate sample data, go to: `http://localhost:3000/test-redis`

Or run the seed script:

```bash
npx ts-node src/lib/seed-trains.ts
```

## Step 9: Verify Setup

1. Open your app: `http://localhost:3000`
2. Try signing up / logging in
3. Check **Firebase Console** → **Firestore** to see new documents being created

## Troubleshooting

### "Permission denied" errors?
- Check if `.env.local` is properly set
- Verify Firestore rules (should allow auth and public reads)
- Check browser console for detailed errors

### Data not showing?
- Verify collections exist in Firebase Console
- Check if you're using correct collection names
- Ensure documents have required fields

### Admin SDK not working?
- Verify `FIREBASE_SERVICE_ACCOUNT` env variable is valid JSON
- Check Firebase logs in console
- Try using individual env variables (Option 2)

## Next Steps

1. ✅ Create `.env.local` with your credentials
2. ✅ Create Firestore collections
3. ✅ Set security rules
4. ✅ Enable authentication
5. ✅ Test your app

Your app should now connect to the new Firebase database!
