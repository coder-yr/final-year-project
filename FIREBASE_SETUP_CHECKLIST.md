# Firebase Setup Checklist

## ✅ Phase 1: Prepare Credentials (5 minutes)

### Step 1: Access Firebase Console
- [ ] Go to https://console.firebase.google.com
- [ ] Select your new project
- [ ] Click **Settings** ⚙️ (top right)
- [ ] Click **Project Settings**

### Step 2: Copy Web App Credentials
- [ ] Note: **Project ID** (e.g., `my-project-id`)
- [ ] Note: **API Key** (starts with `AIza...`)
- [ ] Note: **Auth Domain** (e.g., `my-project-id.firebaseapp.com`)
- [ ] Note: **Storage Bucket** (e.g., `my-project-id.appspot.com`)
- [ ] Note: **Messaging Sender ID** (numeric)
- [ ] Note: **App ID** (e.g., `1:123456789:web:abc...`)

### Step 3: Get Service Account JSON
- [ ] Go to **Project Settings** → **Service Accounts** tab
- [ ] Click **Generate New Private Key**
- [ ] Save the JSON file safely
- [ ] Open it and copy the entire content
- [ ] ✅ You now have all public credentials!

---

## ✅ Phase 2: Configure Environment (2 minutes)

### Step 4: Create `.env.local`
- [ ] At project root, create file: `.env.local`
- [ ] Add these environment variables:

```env
# Firebase Public Keys (from Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Firebase Admin Key (from Service Account JSON)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"..."}
```

- [ ] Replace all `YOUR_...` values with actual credentials
- [ ] ✅ Save the file

---

## ✅ Phase 3: Setup Firebase Services (3 minutes)

### Step 5: Enable Firestore Database
- [ ] Go to **Firebase Console** → **Firestore Database**
- [ ] Click **Create Database**
- [ ] Select **Start in test mode**
- [ ] Choose region (closest to your location)
- [ ] Click **Enable**
- [ ] ✅ Wait for initialization (should complete in seconds)

### Step 6: Enable Authentication
- [ ] Go to **Firebase Console** → **Authentication**
- [ ] Click **Get Started**
- [ ] Enable: ✅ **Email/Password**
- [ ] Enable: ✅ **Google Sign-in**
- [ ] ✅ Authentication is ready!

---

## ✅ Phase 4: Configure Security Rules (2 minutes)

### Step 7: Set Firestore Rules
- [ ] Go to **Firebase Console** → **Firestore Database** → **Rules**
- [ ] Clear existing rules
- [ ] Paste the rules from [FIREBASE_QUICK_START.md](./FIREBASE_QUICK_START.md) (Search for "Security Rules")
- [ ] Click **Publish**
- [ ] ✅ Rules are now active!

---

## ✅ Phase 5: Seed Your Database (1 minute)

### Step 8: Start Development Server
```bash
npm run dev
```

- [ ] Wait for: "ready - started server on 0.0.0.0:3000"
- [ ] No TypeScript errors? ✅ Great!

### Step 9: Seed Sample Data
- [ ] Open browser: `http://localhost:3000/seed-new-db`
- [ ] Click **🌱 Seed Database** button
- [ ] Wait for success message ✅
- [ ] ✅ Database is populated!

---

## ✅ Phase 6: Verify Everything Works (2 minutes)

### Step 10: Check Firebase Console
- [ ] Go to **Firebase Console** → **Firestore Database**
- [ ] Check collections exist:
  - [ ] ✅ `users` (3 documents)
  - [ ] ✅ `hotels` (3 documents)
  - [ ] ✅ `rooms` (3 documents)
  - [ ] ✅ `buses` (2 documents)
  - [ ] ✅ `trains` (2 documents)
  - [ ] ✅ `flights` (2 documents)

### Step 11: Test Your App
- [ ] Go to `http://localhost:3000`
- [ ] Try to sign up with email
- [ ] Check new user in Firebase Console → `users` collection
- [ ] ✅ Everything working!

---

## ✅ Final Checklist

- [ ] `.env.local` created with all credentials
- [ ] Firestore database enabled
- [ ] Authentication enabled
- [ ] Security rules published
- [ ] Database seeded with sample data
- [ ] Firebase Console shows all collections
- [ ] App can sign up users
- [ ] No console errors

---

## 🎯 You're Done! 🎉

Your new Firebase database is ready to use!

### Next Steps:
1. Start building your features
2. Test with real data
3. Monitor Firebase usage in console
4. Adjust security rules as needed

### Need Help?
- 📖 See [FIREBASE_NEW_DB_SETUP.md](./FIREBASE_NEW_DB_SETUP.md) for detailed guide
- 🚀 See [FIREBASE_QUICK_START.md](./FIREBASE_QUICK_START.md) for quick reference
- 🔧 Check Firebase docs: https://firebase.google.com/docs

---

## ⏰ Total Time: ~15 minutes

- Phase 1 (Credentials): 5 min
- Phase 2 (Environment): 2 min
- Phase 3 (Services): 3 min
- Phase 4 (Rules): 2 min
- Phase 5 (Seed): 1 min
- Phase 6 (Verify): 2 min

**Let's go! 🚀**
