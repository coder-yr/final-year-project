# ⚡ Quick Firebase Setup - 5 Minutes

## 🚀 Quick Start

### 1️⃣ Get Firebase Credentials (2 min)
```
Firebase Console → Settings ⚙️ → Project Settings
Copy:
  • Project ID
  • API Key
  • Auth Domain
  • Storage Bucket
  • Messaging Sender ID
  • App ID
```

### 2️⃣ Create `.env.local` (1 min)
Create file at project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

**To get FIREBASE_SERVICE_ACCOUNT:**
- Firebase Console → Project Settings → Service Accounts
- Click "Generate New Private Key"
- Copy the entire JSON content

### 3️⃣ Create Firestore Database (1 min)
```
Firebase Console → Firestore Database
  → Create Database
  → Start in test mode
  → Select region
  → Enable
```

### 4️⃣ Create Collections (Skip - We'll seed it!)

### 5️⃣ Run Your App (1 min)
```bash
npm run dev
```

### 6️⃣ Seed Database
Go to: `http://localhost:3000/seed-new-db`
Click "🌱 Seed Database" button

✅ **Done!** Your new database is ready with sample data.

---

## 📝 Manually Create Collections (Alternative)

If you prefer manual setup, create these collections in Firebase:

| Collection | Sample Fields |
|-----------|--------------|
| **users** | email, name, role, phone |
| **hotels** | name, city, price, rating, status |
| **rooms** | roomNumber, type, price, hotelId |
| **buses** | operator, depart, arrive, price |
| **trains** | trainName, depart, arrive, price |
| **flights** | airline, depart, arrive, price |
| **bookings** | userId, itemId, totalPrice, status |

### Add Subcollections
- `hotels/{hotelId}/reviews` - Hotel reviews
- `conversations/{conversationId}/messages` - Chat messages

---

## 🔒 Security Rules (Important!)

Go to **Firestore → Rules** and paste:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /reviews/{reviewId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }

    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    match /buses/{busId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /trains/{trainId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /flights/{flightId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /conversations/{conversationId} {
      allow read, write: if request.auth != null;
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish**

---

## ✅ Verify Setup

- [ ] App runs: `http://localhost:3000`
- [ ] Can sign up / login
- [ ] Data appears in Firebase Console
- [ ] No console errors

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permission denied" | Check `.env.local` and Firestore rules |
| "Data not showing" | Verify collections exist in Firebase |
| "Admin SDK error" | Check `FIREBASE_SERVICE_ACCOUNT` is valid JSON |
| "Build error" | Run `npm install` and `npm run dev` again |

---

## 📚 Full Documentation

See: [FIREBASE_NEW_DB_SETUP.md](./FIREBASE_NEW_DB_SETUP.md) for detailed guide

---

## 🎯 You're All Set! 

Your app is now connected to your new Firebase database. Start building! 🚀
