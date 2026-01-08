# ClinexNotes - Enhanced with Cloud Sync

A cosmic, offline-first Progressive Web App (PWA) for taking notes with Google Sign-in and cross-device sync!

## 🆕 New Features

### 🔐 Gmail Authentication
- **Sign in with Google** to sync your notes across all devices
- Secure authentication powered by Firebase
- Works seamlessly offline and online

### ☁️ Cloud Sync
- **Automatic sync** when signed in with Gmail
- Access your notes from any device
- Real-time updates across all devices
- Conflict resolution based on timestamps

### 💾 Enhanced Local Storage
- **Persistent storage** - Notes won't be deleted by the browser
- **Dual backup** - IndexedDB + localStorage for extra safety
- **Works offline** - Full functionality without internet
- Notes persist even without an account

## 📱 How It Works

### Without Signing In
- Notes are stored **only on your device**
- Uses IndexedDB with localStorage backup
- Persistent storage prevents browser from clearing data
- Perfect for privacy-focused users

### With Gmail Sign-in
- Notes sync to **Firebase Firestore** in the cloud
- Access from **any device** by signing in
- Real-time sync across devices
- Local copy always available offline
- When you come back online, changes sync automatically

## 🚀 Getting Started

### For Users
1. Open the app
2. Click **"Sign in with Google"** (optional)
3. Start creating notes!
4. Your notes are automatically saved and synced

### For Developers
1. Follow the setup guide in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Create a Firebase project
3. Enable Google Authentication
4. Set up Firestore Database
5. Update `src/firebase-config.js` with your credentials
6. Deploy and enjoy!

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Storage**: IndexedDB + localStorage
- **Cloud**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-in)
- **Build Tool**: Vite
- **Hosting**: Vercel

## 📦 Project Structure

```
├── src/
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication module
│   ├── cloud-sync.js       # Cloud sync functionality
│   ├── firebase-config.js  # Firebase configuration
│   ├── idb.js              # IndexedDB with persistence
│   ├── style.css           # Styles
│   ├── sw.js               # Service worker
│   └── manifest.json       # PWA manifest
├── index.html              # Entry point
├── FIREBASE_SETUP.md       # Setup instructions
└── package.json
```

## 🎯 Features

- ✅ **Three note types**: Short, Long, and Key notes
- ✅ **Search functionality**: Find notes instantly
- ✅ **Offline-first**: Works without internet
- ✅ **Gmail sign-in**: Optional cloud sync
- ✅ **Cross-device sync**: Access everywhere
- ✅ **Real-time updates**: See changes immediately
- ✅ **Persistent storage**: Notes never disappear
- ✅ **Responsive design**: Works on all devices
- ✅ **PWA**: Install as an app

## 🔒 Privacy & Security

- **Local-first**: Works fully offline without account
- **User isolation**: Each user's notes are private
- **Secure authentication**: Firebase handles security
- **HTTPS only**: All data encrypted in transit
- **No tracking**: Your data belongs to you

## 💡 Usage Tips

1. **Backup**: Sign in with Google to backup notes to cloud
2. **Multi-device**: Access same notes on phone, tablet, and computer
3. **Offline**: Continue working without internet, syncs when back online
4. **Privacy**: Don't sign in to keep notes local-only
5. **Export**: Always keep local backups of important notes

## 🐛 Known Issues

- First sync after sign-in may take a few seconds
- Multiple tabs must share persistence (only one gets it)
- Large number of notes (>1000) may slow sync

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

MIT License - feel free to use for any purpose

## 👤 Author

Ilekuba Collins (Clinex)

---

**Note**: Remember to set up Firebase before deploying. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for details.
