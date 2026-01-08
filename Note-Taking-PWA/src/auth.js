// Authentication module
import { auth } from './firebase-config.js';

let currentUser = null;

// Set up auth state listener
export function initAuth(onAuthChange) {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        if (onAuthChange) {
            onAuthChange(user);
        }
    });
}

// Sign in with Google
export async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        return result.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

// Sign out
export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Get current user
export function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
export function isAuthenticated() {
    return currentUser !== null;
}
