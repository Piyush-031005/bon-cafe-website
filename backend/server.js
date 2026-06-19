/* ================================================================
   BON CAFÉ & SWEETS — DEMO BACKEND SERVER
   Simple Express server with JSON file storage (no database)
   Run: node backend/server.js
   ================================================================ */

'use strict';

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ──────────────────────────────────────── */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the frontend files
app.use(express.static(path.join(__dirname, '..')));

/* ── Helpers: JSON file storage ──────────────────────── */
const DATA_DIR = path.join(__dirname, 'data');

function readJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  try {
    const raw = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ================================================================
   ROUTES
   ================================================================ */

/* ── Health Check ───────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bon Café Backend is running! ☕', timestamp: new Date().toISOString() });
});

/* ── CONTACT FORM ───────────────────────────────────── */
// POST /api/contact  — save message
app.post('/api/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !message || !subject) {
    return res.status(400).json({ success: false, error: 'Name, subject and message are required.' });
  }

  const contacts = readJSON('contacts.json');
  const entry = {
    id:        generateId(),
    name:      name.trim(),
    phone:     (phone || '').trim(),
    email:     (email || '').trim(),
    subject:   subject.trim(),
    message:   message.trim(),
    createdAt: new Date().toISOString(),
    read:      false,
  };
  contacts.push(entry);
  writeJSON('contacts.json', contacts);

  console.log(`📩 New contact message from ${entry.name} [${entry.subject}]`);
  res.json({ success: true, message: 'Your message has been received! We\'ll get back to you soon.', id: entry.id });
});

// GET /api/contact  — admin: list all messages
app.get('/api/contact', (req, res) => {
  const contacts = readJSON('contacts.json');
  res.json({ success: true, total: contacts.length, data: contacts.reverse() });
});

/* ── BIRTHDAY BOOKINGS ──────────────────────────────── */
// POST /api/bookings/birthday  — save birthday booking
app.post('/api/bookings/birthday', (req, res) => {
  const { name, phone, email, date, time, guests, theme, specialRequests } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, error: 'Name, phone, date, time and guests are required.' });
  }

  const bookings = readJSON('birthday_bookings.json');
  const booking = {
    id:              generateId(),
    type:            'birthday',
    name:            name.trim(),
    phone:           phone.trim(),
    email:           (email || '').trim(),
    date:            date,
    time:            time,
    guests:          parseInt(guests) || 1,
    theme:           theme || 'Classic',
    specialRequests: (specialRequests || '').trim(),
    status:          'pending',   // pending | confirmed | cancelled
    createdAt:       new Date().toISOString(),
  };
  bookings.push(booking);
  writeJSON('birthday_bookings.json', bookings);

  console.log(`🎂 New birthday booking: ${booking.name} on ${booking.date} (${booking.guests} guests)`);
  res.json({
    success: true,
    message: `Birthday booking confirmed! We'll call you shortly to finalize details.`,
    bookingId: booking.id,
    booking,
  });
});

// GET /api/bookings/birthday  — admin: list all birthday bookings
app.get('/api/bookings/birthday', (req, res) => {
  const bookings = readJSON('birthday_bookings.json');
  res.json({ success: true, total: bookings.length, data: bookings.reverse() });
});

/* ── ROOM / HALL BOOKINGS ───────────────────────────── */
// POST /api/bookings/room  — save room booking
app.post('/api/bookings/room', (req, res) => {
  const { name, phone, email, room, date, startTime, endTime, guests, occasion, specialRequests } = req.body;

  if (!name || !phone || !room || !date) {
    return res.status(400).json({ success: false, error: 'Name, phone, room and date are required.' });
  }

  const bookings = readJSON('room_bookings.json');
  const booking = {
    id:              generateId(),
    type:            'room',
    name:            name.trim(),
    phone:           phone.trim(),
    email:           (email || '').trim(),
    room:            room.trim(),
    date:            date,
    startTime:       startTime || '',
    endTime:         endTime || '',
    guests:          parseInt(guests) || 1,
    occasion:        (occasion || '').trim(),
    specialRequests: (specialRequests || '').trim(),
    status:          'pending',
    createdAt:       new Date().toISOString(),
  };
  bookings.push(booking);
  writeJSON('room_bookings.json', bookings);

  console.log(`🏨 New room booking: ${booking.name} — ${booking.room} on ${booking.date}`);
  res.json({
    success: true,
    message: 'Room booking received! We\'ll confirm your reservation shortly.',
    bookingId: booking.id,
    booking,
  });
});

// GET /api/bookings/room  — admin: list all room bookings
app.get('/api/bookings/room', (req, res) => {
  const bookings = readJSON('room_bookings.json');
  res.json({ success: true, total: bookings.length, data: bookings.reverse() });
});

/* ── ALL BOOKINGS (combined) ────────────────────────── */
app.get('/api/bookings', (req, res) => {
  const bday  = readJSON('birthday_bookings.json').map(b => ({ ...b, type: 'birthday' }));
  const rooms = readJSON('room_bookings.json').map(b => ({ ...b, type: 'room' }));
  const all   = [...bday, ...rooms].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, total: all.length, data: all });
});

/* ── UPDATE BOOKING STATUS (admin action) ───────────── */
app.patch('/api/bookings/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const { status } = req.body;
  const filename = type === 'birthday' ? 'birthday_bookings.json' : 'room_bookings.json';
  const bookings = readJSON(filename);
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Booking not found' });
  bookings[idx].status = status;
  bookings[idx].updatedAt = new Date().toISOString();
  writeJSON(filename, bookings);
  res.json({ success: true, booking: bookings[idx] });
});

/* ── ADMIN DASHBOARD (serve HTML) ──────────────────── */
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

/* ── STATS ──────────────────────────────────────────── */
app.get('/api/stats', (req, res) => {
  const contacts  = readJSON('contacts.json');
  const bdays     = readJSON('birthday_bookings.json');
  const rooms     = readJSON('room_bookings.json');
  res.json({
    success: true,
    stats: {
      totalContacts:       contacts.length,
      unreadContacts:      contacts.filter(c => !c.read).length,
      totalBirthdayBooks:  bdays.length,
      pendingBirthdays:    bdays.filter(b => b.status === 'pending').length,
      confirmedBirthdays:  bdays.filter(b => b.status === 'confirmed').length,
      totalRoomBooks:      rooms.length,
      pendingRooms:        rooms.filter(r => r.status === 'pending').length,
      confirmedRooms:      rooms.filter(r => r.status === 'confirmed').length,
    }
  });
});

/* ── Fallback: serve index.html for any unknown route ─ */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

/* ── Start Server ───────────────────────────────────── */
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   BON CAFÉ & SWEETS — Backend Running    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`\n🌐  Website:  http://localhost:${PORT}`);
  console.log(`📊  Admin:    http://localhost:${PORT}/admin`);
  console.log(`🔌  API:      http://localhost:${PORT}/api/health`);
  console.log('\n✅  All routes ready. Saving data to /backend/data/\n');
});
