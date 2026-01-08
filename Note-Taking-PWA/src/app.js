import { put, getAll, del } from './idb.js';
import { initAuth, signInWithGoogle, signOut, isAuthenticated } from './auth.js';
import {
  syncNoteToCloud,
  deleteNoteFromCloud,
  syncAllNotesToCloud,
  syncCloudNotesToLocal,
  setupCloudListener
} from './cloud-sync.js';

const form = document.getElementById('noteForm');
const notesEl = document.getElementById('notes');
const statusEl = document.getElementById('status');
const searchEl = document.getElementById('search');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');

let cloudListener = null;

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).catch(console.error);
}
window.addEventListener('appinstalled', () => {
  // Send event to Google Analytics
  gtag('event', 'ClinexNotesInstalled', {
    event_category: 'engagement',
    event_label: 'Clinex Notes Installed'
  });
});


// Initialize authentication
initAuth(async (user) => {
  if (user) {
    // User is signed in
    loginBtn.hidden = true;
    userInfo.hidden = false;
    userName.textContent = user.displayName || user.email;
    userPhoto.src = user.photoURL || '/public/Note.png';

    setStatus('Syncing notes from cloud...');
    await syncCloudNotesToLocal();
    await renderNotes(searchEl.value.trim());

    // Set up real-time listener
    cloudListener = setupCloudListener(() => {
      renderNotes(searchEl.value.trim());
    });

    setStatus('Signed in and synced!');
  } else {
    // User is signed out
    loginBtn.hidden = false;
    userInfo.hidden = true;

    // Stop cloud listener
    if (cloudListener) {
      cloudListener();
      cloudListener = null;
    }

    await renderNotes(searchEl.value.trim());
    setStatus('Signed out. Notes are stored locally.');
  }
});

// Login/Logout handlers
loginBtn.addEventListener('click', async () => {
  try {
    setStatus('Signing in...');
    await signInWithGoogle();

    // Send event to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'google_sign_in', {
        event_category: 'authentication',
        event_label: 'user_signed_in'
      });
    }
  } catch (error) {
    setStatus('Sign in failed. Please try again.');
    console.error(error);
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut();
  } catch (error) {
    setStatus('Sign out failed.');
    console.error(error);
  }
});

// Online/offline UI feedback
function setStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => {
    if (statusEl.textContent === text) {
      statusEl.textContent = '';
    }
  }, 3000);
}

window.addEventListener('online', async () => {
  setStatus('Back online.');
  if (isAuthenticated()) {
    setStatus('Back online. Syncing to cloud...');
    await syncAllNotesToCloud();
    setStatus('Synced to cloud.');
  }
});

window.addEventListener('offline', () => {
  setStatus('Offline. Notes will be saved locally.');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = form.title.value.trim();
  const content = form.content.value.trim();
  const type = form.type.value;
  if (!title || !content) return;

  const note = { id: crypto.randomUUID(), title, content, type, updatedAt: Date.now() };

  // Save locally
  await put('notes', note);

  // Sync to cloud if authenticated
  if (isAuthenticated()) {
    await syncNoteToCloud(note);
    setStatus('Saved and synced to cloud.');
  } else {
    setStatus('Saved locally.');
  }

  renderNotes(searchEl.value.trim());
  form.reset();
});

form.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

async function renderNotes(filter = '') {
  const allNotes = (await getAll('notes')).sort((a, b) => b.updatedAt - a.updatedAt);
  const notes = filter ? allNotes.filter(n => n.title.toLowerCase().includes(filter.toLowerCase()) || n.content.toLowerCase().includes(filter.toLowerCase())) : allNotes;
  notesEl.innerHTML = '';
  for (const n of notes) {
    const li = document.createElement('li');
    li.className = `note ${n.type}`;
    li.innerHTML = `
      <h3>${escapeHTML(n.title)} <span class="note-type-badge">${n.type}</span></h3>
      <p>${escapeHTML(n.content)}</p>
      <span class="badge">${new Date(n.updatedAt).toLocaleString()}</span>
      <div class="row">
        <button class="btn" data-id="${n.id}" data-action="edit">Edit</button>
        <button class="btn" data-id="${n.id}" data-action="key">Key Note</button>
        <button class="btn" data-id="${n.id}" data-action="delete">Delete</button>
      </div>
    `;
    notesEl.appendChild(li);
  }
}

notesEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === 'delete') {
    await del('notes', id);

    // Delete from cloud if authenticated
    if (isAuthenticated()) {
      await deleteNoteFromCloud(id);
      setStatus('Deleted and synced to cloud.');
    } else {
      setStatus('Deleted locally.');
    }

    renderNotes(searchEl.value.trim());
  }
  if (action === 'key') {
    const all = await getAll('notes');
    const note = all.find(n => n.id === id);
    if (!note) return;
    form.type.value = 'key';
    form.title.value = `Key: ${note.title}`;
    form.content.focus();
  }
  if (action === 'edit') {
    const all = await getAll('notes');
    const note = all.find(n => n.id === id);
    if (!note) return;
    form.title.value = note.title;
    form.content.value = note.content;
    form.type.value = note.type;
    // Replace on submit
    const handler = async (ev) => {
      ev.preventDefault();
      const updated = {
        id,
        title: form.title.value.trim(),
        content: form.content.value.trim(),
        type: form.type.value,
        updatedAt: Date.now()
      };
      await put('notes', updated);

      // Sync to cloud if authenticated
      if (isAuthenticated()) {
        await syncNoteToCloud(updated);
        setStatus('Updated and synced to cloud.');
      } else {
        setStatus('Updated locally.');
      }

      renderNotes(searchEl.value.trim());
      form.reset();
      form.removeEventListener('submit', handler);
      form.addEventListener('submit', submitDefault, { once: true });
    };
    const submitDefault = form._defaultSubmit || (ev => { });
    form._defaultSubmit = submitDefault;
    form.removeEventListener('submit', submitDefault);
    form.addEventListener('submit', handler, { once: true });
  }
});

function escapeHTML(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

searchEl.addEventListener('input', () => {
  renderNotes(searchEl.value.trim());
});

// Initial render
renderNotes();
