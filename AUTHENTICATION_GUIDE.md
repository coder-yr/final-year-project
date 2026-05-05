# Firebase Authentication & Passwords Explained

## 🔐 How Passwords Work in Your App

### Key Concept: Passwords are NOT stored in Firestore

Firebase separates **Authentication** (passwords) from **User Data** (profile info):

```
┌─────────────────────────────────────────────┐
│         FIREBASE AUTHENTICATION              │
│  (Handles passwords - encrypted by Firebase) │
│  • Email/Password storage                    │
│  • Login/Signup validation                   │
│  • Password reset                            │
│  • Session management                        │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          FIRESTORE DATABASE                  │
│     (Stores user profile data - NOT pwd)     │
│  • User name, phone, role                    │
│  • User preferences                          │
│  • User bookings & history                   │
│  • Can only store public data                │
└─────────────────────────────────────────────┘
```

### Why This Design?

✅ **Security** - Passwords never go to your database
✅ **Encryption** - Firebase Auth uses industry-standard encryption
✅ **Compliance** - Follows data protection standards
✅ **Simplicity** - Firebase handles all password logic

---

## 📝 Test Account Credentials

After seeding, use these accounts to login:

### Account 1: Regular User
- **Email:** `user1@example.com`
- **Password:** `User@123456`
- **Role:** user

### Account 2: Hotel Owner
- **Email:** `owner@example.com`
- **Password:** `Owner@123456`
- **Role:** owner

### Account 3: Admin
- **Email:** `admin@example.com`
- **Password:** `Admin@123456`
- **Role:** admin

---

## 🔄 How Signup/Login Works

### During Signup (New User)

```
1. User enters email & password on signup form
   ↓
2. Firebase Client SDK sends to Firebase Auth
   ↓
3. Firebase Auth:
   • Validates email format
   • Hashes password securely
   • Creates auth record
   • Returns user ID (UID)
   ↓
4. Your app receives UID
   ↓
5. Your app creates user profile in Firestore:
   {
     uid: "auth_uid",
     email: "user@example.com",
     name: "User Name",
     role: "user",
     createdAt: timestamp
   }
```

### During Login

```
1. User enters email & password
   ↓
2. Firebase Auth validates:
   • Email exists
   • Password matches (hashed comparison)
   ↓
3. If valid → returns auth token
   ↓
4. Your app stores token in browser
   ↓
5. Logged in! ✅
```

---

## 🌱 How Seeding Creates Accounts

Your updated `seed-new-db.ts` now:

```typescript
// 1. Creates user in Firebase Auth with password
const userRecord = await adminAuth.createUser({
    email: 'user1@example.com',
    password: 'User@123456',
    displayName: 'John Doe',
});

// 2. Stores profile in Firestore
await adminDb.collection('users').doc(userRecord.uid).set({
    uid: userRecord.uid,
    email: 'user1@example.com',
    name: 'John Doe',
    role: 'user',
    phone: '9876543210',
    createdAt: Timestamp.now(),
});
```

---

## 🔑 Two Authentication Methods

### Method 1: Email/Password (Default)
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

const result = await signInWithEmailAndPassword(
    auth,
    'user@example.com',
    'password123'
);
```

### Method 2: Google Sign-In
```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
```

---

## 🛡️ Security Features Built In

### Firebase Auth Automatically:

✅ **Hashes passwords** - Uses bcrypt/scrypt
✅ **Uses HTTPS** - All communication encrypted
✅ **Prevents brute force** - Blocks after failed attempts
✅ **Supports 2FA** - Can enable two-factor auth
✅ **Password reset** - Secure email verification
✅ **Session management** - Handles token expiration

---

## 💾 What Gets Stored Where

### Firebase Authentication (Secure)
```
✅ Email address
✅ Password (hashed)
✅ Auth provider (Email/Google/etc)
✅ Email verification status
✅ Last login time
```

### Firestore Database (Your choice)
```
✅ User name
✅ User role
✅ Phone number
✅ Profile picture
✅ Preferences
✅ User's bookings
```

---

## 🚀 Workflow to Test Authentication

### Step 1: Seed Database
```
1. Go to: http://localhost:3000/seed-new-db
2. Click "🌱 Seed Database"
3. Wait for success ✅
```

### Step 2: Check Firebase Console
```
1. Firebase Console → Authentication
2. Should see 3 users created:
   • user1@example.com
   • owner@example.com
   • admin@example.com
```

### Step 3: Try Logging In
```
1. Go to: http://localhost:3000/login
2. Enter: user1@example.com
3. Enter: User@123456
4. Click Login ✅
```

### Step 4: Check Firestore
```
1. Firebase Console → Firestore Database
2. View "users" collection
3. Should see 3 documents with profiles
```

---

## ⚠️ Important Notes

### ❌ DO NOT
- Store passwords in Firestore
- Send passwords in plaintext
- Hardcode passwords in client code
- Display password hashes anywhere

### ✅ DO
- Use Firebase Auth for passwords
- Store only profile data in Firestore
- Use environment variables for secrets
- Keep admin SDK code server-side only

---

## 🔄 Password Reset Flow

When users forget password:

```
1. Click "Forgot Password?"
   ↓
2. Enter email address
   ↓
3. Firebase Auth sends verification email
   ↓
4. User clicks link in email
   ↓
5. Creates new password
   ↓
6. Firebase Auth updates hash
   ↓
7. User can login with new password
```

---

## 🎯 Next Steps

1. ✅ Seed the database with test accounts
2. ✅ Verify users in Firebase Auth console
3. ✅ Test login with credentials
4. ✅ Create more features that use authentication
5. ✅ Add password reset functionality (if needed)

---

## 📚 Testing Credentials Quick Reference

| Email | Password | Role |
|-------|----------|------|
| user1@example.com | User@123456 | user |
| owner@example.com | Owner@123456 | owner |
| admin@example.com | Admin@123456 | admin |

Copy these into your login form to test!

---

## 🆘 Troubleshooting

### "User already exists"
- User was already created in Firebase Auth
- Try different email or delete in Firebase Console

### "Email/password incorrect"
- Check spelling and case (passwords are case-sensitive)
- Verify in Firebase Console that user exists
- Check that seeding completed successfully

### "Can't login but user exists in Firestore"
- User profile in Firestore ≠ Auth user
- Check Firebase Auth console (not Firestore)
- Both need to exist for login to work

### "How do I reset a test password?"
- Firebase Console → Authentication → Click user → Delete
- Run seeding again to create fresh test accounts

---

## 🔗 Related Docs

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Password Security Best Practices](https://firebase.google.com/docs/auth/best-practices)
- [Email Verification Setup](https://firebase.google.com/docs/auth/custom-email-handler)

