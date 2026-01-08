// Firebase Configuration
// Replace with your Firebase project credentials from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAWK6ciaHflSryBN-H7QvXcvDjOMuYybmM",
    authDomain: "clinexnotes.firebaseapp.com",
    projectId: "clinexnotes",
    storageBucket: "clinexnotes.firebasestorage.app",
    messagingSenderId: "796124369006",
    appId: "1:796124369006:web:93ca4b39caf75928d0167f",
    measurementId: "G-D8Q3QW53LF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support offline persistence');
        }
    });
