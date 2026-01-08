# 🚀 Quick Start Guide

## For Immediate Testing (Local Only)

You can test the app right now without Firebase setup:

```bash
npm run dev
```

The app will work in **local-only mode**:
- ✅ Create, edit, delete notes
- ✅ Search functionality
- ✅ Offline support
- ✅ Persistent storage
- ⚠️ No cloud sync (requires Firebase setup)

## For Full Features (Cloud Sync)

### Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "ClinexNotes" (or whatever you prefer)
4. Follow the wizard

### Step 2: Enable Authentication (2 minutes)

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Google** sign-in method
4. Add `localhost` to authorized domains

### Step 3: Create Firestore Database (2 minutes)

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your region

### Step 4: Set Security Rules (1 minute)

In Firestore Rules tab, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 5: Get Your Config (2 minutes)

1. In Project Settings (⚙️ icon), go to "Your apps"
2. Click **Web** (</>)
3. Register app
4. Copy the config object

### Step 6: Update Your Code (1 minute)

Open `src/firebase-config.js` and replace:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Paste your values here
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### Step 7: Test Locally

```bash
npm run dev
```

Now you can:
- ✅ Sign in with Google
- ✅ Create notes that sync to cloud
- ✅ Open on another device and see same notes!

### Step 8: Deploy to Vercel

```bash
npm run build
```

Deploy the `dist` folder to Vercel, then:
1. Add your Vercel domain to Firebase authorized domains
2. Test on production!

## Troubleshooting

### "Sign in failed"
- Check Firebase config is correct
- Verify Google sign-in is enabled
- Add your domain to authorized domains

### "Network error"
- Check internet connection
- Verify Firestore is created
- Check browser console

### Notes not syncing
- Make sure you're signed in (see user photo in header)
- Check network connection
- Look for errors in console

## Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## What's Different?

### Before (v1.0)
- Local storage only
- No sync across devices
- Single device usage

### After (v2.0)
- **Gmail sign-in** optional
- **Cloud sync** across all devices
- **Enhanced persistence** (won't lose data)
- **Real-time updates** across devices
- Still works **fully offline**

## Need Help?

1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed setup
2. Check [README.md](README.md) for feature overview
3. Check [CHANGES.md](CHANGES.md) for what changed
4. Check browser console for errors

---

**Ready to go!** 🎉

The app works perfectly without Firebase (local-only).  
Set up Firebase when you want cloud sync across devices.
