// Enhanced IndexedDB wrapper with persistence and localStorage fallback

const DB_NAME = 'ClinexNotes';
const DB_VERSION = 2;

export async function openDB(name = DB_NAME, version = DB_VERSION) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      // Request persistent storage
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(granted => {
          if (granted) {
            console.log('Persistent storage granted');
          }
        });
      }
      resolve(db);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function put(store, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => {
        // Also backup to localStorage for extra persistence
        backupToLocalStorage(store, value);
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('IndexedDB error, falling back to localStorage:', error);
    backupToLocalStorage(store, value);
    return true;
  }
}

export async function getAll(store) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error('IndexedDB error, falling back to localStorage:', error);
    return getFromLocalStorage(store);
  }
}

export async function del(store, id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => {
        // Also remove from localStorage backup
        removeFromLocalStorage(store, id);
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('IndexedDB error, falling back to localStorage:', error);
    removeFromLocalStorage(store, id);
    return true;
  }
}

// localStorage backup functions
function backupToLocalStorage(store, value) {
  try {
    const key = `${DB_NAME}_${store}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const index = existing.findIndex(item => item.id === value.id);

    if (index >= 0) {
      existing[index] = value;
    } else {
      existing.push(value);
    }

    localStorage.setItem(key, JSON.stringify(existing));
  } catch (error) {
    console.error('localStorage backup failed:', error);
  }
}

function getFromLocalStorage(store) {
  try {
    const key = `${DB_NAME}_${store}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('localStorage read failed:', error);
    return [];
  }
}

function removeFromLocalStorage(store, id) {
  try {
    const key = `${DB_NAME}_${store}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
    console.error('localStorage remove failed:', error);
  }
}

// Request persistent storage on load
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    if (granted) {
      console.log('Storage will not be cleared except by explicit user action');
    }
  });
}

// Check storage quota
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(estimate => {
    const percentUsed = (estimate.usage / estimate.quota) * 100;
    console.log(`Using ${percentUsed.toFixed(2)}% of storage quota`);
  });
}
