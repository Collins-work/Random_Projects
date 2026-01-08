// Cloud sync module using Firestore
import { db } from './firebase-config.js';
import { getCurrentUser } from './auth.js';
import { put, getAll, del } from './idb.js';

// Sync notes to Firestore
export async function syncNoteToCloud(note) {
    const user = getCurrentUser();
    if (!user) return;

    try {
        await db.collection('users')
            .doc(user.uid)
            .collection('notes')
            .doc(note.id)
            .set(note);
        return true;
    } catch (error) {
        console.error('Error syncing note to cloud:', error);
        return false;
    }
}

// Delete note from Firestore
export async function deleteNoteFromCloud(noteId) {
    const user = getCurrentUser();
    if (!user) return;

    try {
        await db.collection('users')
            .doc(user.uid)
            .collection('notes')
            .doc(noteId)
            .delete();
        return true;
    } catch (error) {
        console.error('Error deleting note from cloud:', error);
        return false;
    }
}

// Fetch all notes from Firestore
export async function fetchNotesFromCloud() {
    const user = getCurrentUser();
    if (!user) return [];

    try {
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('notes')
            .get();

        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching notes from cloud:', error);
        return [];
    }
}

// Sync all local notes to cloud
export async function syncAllNotesToCloud() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const localNotes = await getAll('notes');
        const batch = db.batch();

        localNotes.forEach(note => {
            const noteRef = db.collection('users')
                .doc(user.uid)
                .collection('notes')
                .doc(note.id);
            batch.set(noteRef, note);
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error syncing all notes to cloud:', error);
        return false;
    }
}

// Sync cloud notes to local storage
export async function syncCloudNotesToLocal() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const cloudNotes = await fetchNotesFromCloud();
        const localNotes = await getAll('notes');

        // Create a map of local notes by ID
        const localNotesMap = new Map(localNotes.map(n => [n.id, n]));

        // Merge logic: keep the most recent version
        for (const cloudNote of cloudNotes) {
            const localNote = localNotesMap.get(cloudNote.id);

            if (!localNote || cloudNote.updatedAt > localNote.updatedAt) {
                // Cloud version is newer or note doesn't exist locally
                await put('notes', cloudNote);
            } else if (localNote.updatedAt > cloudNote.updatedAt) {
                // Local version is newer, push to cloud
                await syncNoteToCloud(localNote);
            }
        }

        return true;
    } catch (error) {
        console.error('Error syncing cloud notes to local:', error);
        return false;
    }
}

// Set up real-time listener for cloud notes
export function setupCloudListener(onUpdate) {
    const user = getCurrentUser();
    if (!user) return null;

    return db.collection('users')
        .doc(user.uid)
        .collection('notes')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                const note = change.doc.data();

                if (change.type === 'added' || change.type === 'modified') {
                    await put('notes', note);
                } else if (change.type === 'removed') {
                    await del('notes', note.id);
                }
            });

            if (onUpdate) {
                onUpdate();
            }
        }, (error) => {
            console.error('Error in cloud listener:', error);
        });
}
