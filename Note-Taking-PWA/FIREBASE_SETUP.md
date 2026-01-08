# ClinexNotes - Setup Instructions

## Firebase Setup

To enable Gmail sign-in and cloud sync across devices, you need to set up Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Give your project a name (e.g., "ClinexNotes")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Build** > **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Google** as a sign-in provider
5. Add your authorized domains (e.g., localhost, your Vercel domain)

### 3. Create Firestore Database

1. In your Firebase project, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode**
4. Select a location closest to your users
5. Click "Enable"

### 4. Set up Firestore Security Rules

In the **Rules** tab of Firestore, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own notes
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Your Firebase Config

1. In Project Settings (gear icon), scroll to "Your apps"
2. Click the **Web** icon (</>)
3. Register your app with a nickname
4. Copy the Firebase configuration object

### 6. Update Your Project

Open `src/firebase-config.js` and replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 7. Deploy and Test

1. Deploy your app to Vercel or your hosting platform
2. Make sure to add your deployed domain to Firebase authorized domains:
   - Go to **Authentication** > **Settings** > **Authorized domains**
   - Add your domain (e.g., `your-app.vercel.app`)

## Features

### ✅ Gmail Sign-in
- Users can sign in with their Google account
- Authentication state persists across sessions

### ✅ Cloud Sync
- Notes automatically sync to Firestore when signed in
- Real-time updates across all devices
- Offline support with automatic sync when back online

### ✅ Local Persistence
- Notes are stored in IndexedDB with localStorage backup
- Persistent storage API prevents data loss
- Works offline without any account

### ✅ Cross-Device Sync
- Sign in on multiple devices to access the same notes
- Changes sync in real-time
- Conflict resolution based on timestamps

## Usage

1. **Without Account**: Notes are stored locally on your device only
2. **With Account**: 
   - Click "Sign in with Google"
   - Authorize the app
   - Your notes will sync to the cloud
   - Access them from any device by signing in

## Security

- Each user's notes are isolated in Firestore
- Security rules prevent unauthorized access
- All data is encrypted in transit (HTTPS)
- Firebase handles all authentication securely

## Troubleshooting

### "Sign in failed"
- Check that Google sign-in is enabled in Firebase Console
- Verify your domain is in authorized domains list
- Clear browser cache and try again

### "Notes not syncing"
- Check internet connection
- Verify you're signed in (user photo should be visible)
- Check browser console for errors

### "Storage quota exceeded"
- Clear old notes you don't need
- Export important notes to a file
- Notes are also backed up in localStorage

## Local Development

For local development:
1. Add `localhost` to Firebase authorized domains
2. Use `http://localhost:5173` (or your dev port)
3. Test both signed-in and signed-out states

## Production Deployment

1. Build: `npm run build`
2. Deploy the `dist` folder to your hosting
3. Add production domain to Firebase
4. Test authentication flow
5. Monitor Firestore usage in Firebase Console
