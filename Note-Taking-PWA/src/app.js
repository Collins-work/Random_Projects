import { put, getAll, del } from './idb.js';

const form = document.getElementById('noteForm');
const notesEl = document.getElementById('notes');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('installBtn');
const searchEl = document.getElementById('search');

let deferredPrompt = null;

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/public/sw.js', {
    scope: '/'
  }).catch(console.error);
}

// Install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  installBtn.hidden = true;
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
});

// Online/offline UI feedback
function setStatus(text) {
  statusEl.textContent = text;
}
window.addEventListener('online', async () => {
  setStatus('Back online. Syncing…');
  await syncOutbox();
  setStatus('Synced.');
});
window.addEventListener('offline', () => setStatus('Offline. Changes will sync later.'));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = form.title.value.trim();
  const content = form.content.value.trim();
  const type = form.type.value;
  if (!title || !content) return;

  const note = { id: crypto.randomUUID(), title, content, type, updatedAt: Date.now() };
  await put('notes', note);
  renderNotes(searchEl.value.trim());

  // Queue for sync (simulate server)
  await put('outbox', { ...note, op: 'upsert' });
  form.reset();
  setStatus(navigator.onLine ? 'Saved and synced.' : 'Saved offline. Will sync when online.');
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
    await put('outbox', { id, op: 'delete' });
    renderNotes(searchEl.value.trim());
    setStatus(navigator.onLine ? 'Deleted and synced.' : 'Deleted offline. Will sync later.');
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
      await put('outbox', { ...updated, op: 'upsert' });
      renderNotes(searchEl.value.trim());
      setStatus(navigator.onLine ? 'Updated and synced.' : 'Updated offline. Will sync later.');
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

async function syncOutbox() {
  const items = await getAll('outbox');
  if (!items.length) return;

  // Simulate syncing with server by waiting, then clearing
  await new Promise(res => setTimeout(res, 400));
  // In real app, send to API and on success, clear from outbox
  for (const item of items) {
    await del('outbox', item.id);
  }
}

function escapeHTML(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

searchEl.addEventListener('input', () => {
  renderNotes(searchEl.value.trim());
});
