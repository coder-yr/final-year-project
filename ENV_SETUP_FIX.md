# ✅ Fix: FIREBASE_SERVICE_ACCOUNT JSON Format

## Problem
The `FIREBASE_SERVICE_ACCOUNT` in `.env.local` is not valid JSON. This causes the error:
```
SyntaxError: Expected double-quoted property name in JSON at position 26
```

## Solution

You have **2 options** - choose ONE:

---

## Option 1: ✅ RECOMMENDED - Individual Environment Variables

This is the **easiest and most reliable** approach.

### Step 1: Get Your Service Account JSON
1. Firebase Console → Project Settings → Service Accounts
2. Click **Generate New Private Key**
3. A JSON file downloads - open it

### Step 2: Copy Individual Values
Inside the JSON file, find these fields:

```json
{
  "project_id": "your-project-id-here",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

### Step 3: Update `.env.local`

Replace the file contents with:

```env
# Firebase Public Keys
NEXT_PUBLIC_FIREBASE_API_KEY=AIza_your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin - Option 1: Individual Variables (RECOMMENDED)
FIREBASE_PRIVATE_KEY_ID=abc123def456
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
```

**Important:** The `\n` in PRIVATE_KEY must stay - they are literal newlines!

---

## Option 2: Full JSON (Advanced)

If you want to use the full service account JSON:

### Step 1: Get the JSON file
Same as Option 1 - download from Firebase Console

### Step 2: Convert to Single Line
The JSON **must be on a single line** with no breaks. Use this tool to minify:

**Online:**
- Visit: https://www.jsoncrush.com/
- Paste your JSON
- Copy the minified output

**Or manually:**
```json
{"type":"service_account","project_id":"your-id","private_key_id":"abc","private_key":"-----BEGIN...","client_email":"...","client_id":"..."}
```

### Step 3: Update `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza_...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc

# Firebase Admin - Option 2: Full JSON (single line!)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

---

## ✅ Testing Your Setup

### Step 1: Check `.env.local`
Make sure your file looks correct. **Never commit this to Git!**

### Step 2: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Check Console Output
You should see:
```
✅ Firebase Admin initialized with individual environment variables
```

Or:
```
✅ Firebase Admin initialized with service account JSON
```

### Step 4: Try Seeding Again
Go to: `http://localhost:3000/seed-new-db`
Click the "🌱 Seed Database" button

---

## 🆘 If Still Getting Errors

### Error: "Expected double-quoted property name"
- **Cause:** JSON on multiple lines or malformed
- **Fix:** Make sure JSON is on a SINGLE line, or use Option 1 (recommended)

### Error: "private_key is required"
- **Cause:** Private key missing or incorrectly formatted
- **Fix:** Check the `\n` newlines are preserved in the key

### Error: "invalid_client"
- **Cause:** Wrong credentials or service account permissions
- **Fix:** Download fresh service account JSON from Firebase Console

### Error: No credentials found
- **Cause:** Env variables not set
- **Fix:** Restart dev server after editing `.env.local`

---

## ✅ Recommended Format (Option 1)

Here's the safest setup:

```env
# Public Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza_YourActualKeyHere
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Private Firebase Admin Credentials (Individual Variables)
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourActualKeyContentHereWithNewlines\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
```

---

## 📋 Checklist

- [ ] Downloaded service account JSON from Firebase Console
- [ ] Copied all required values to `.env.local`
- [ ] Made sure no line breaks in values (single line)
- [ ] Preserved `\n` characters in PRIVATE_KEY
- [ ] Restarted dev server
- [ ] Checked console output for "✅ Firebase Admin initialized"
- [ ] Tried seeding and got success message

---

## 💡 Pro Tips

1. **Never commit `.env.local` to Git** - It has your private keys!
2. **Use Option 1** - It's easier and more reliable
3. **Whitespace matters** - JSON must be perfectly formatted
4. **Restart after editing** - Next.js caches env vars on startup

---

## 🔗 Need More Help?

- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

You should now be able to seed your database! 🚀
