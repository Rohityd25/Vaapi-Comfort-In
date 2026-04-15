/**
 * =============================================
 *  VAAPI COMFORT INN - Server (No Database)
 *  Simple static file server + inquiry webhook
 * =============================================
 */

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const path     = require('path');

const app = express();

// ── Security & Middleware ───────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Serve Frontend ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── Static Room Data ────────────────────────────────────────────────────────────
const rooms = [
  {
    _id: '1',
    name: 'Deluxe Pool Side Room',
    roomType: 'Deluxe',
    description: 'Enjoy breathtaking views of our infinity pool from your private balcony. Featuring king-sized bed, luxury bathroom, and modern amenities.',
    pricePerNight: 4500,
    capacity: 2,
    ratings: 4.8,
    numOfReviews: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80' }],
    amenities: { wifi: true, ac: true, tv: true, breakfast: true, balcony: true, parking: true },
    roomNumber: 101,
    isAvailable: true,
  },
  {
    _id: '2',
    name: 'Executive Business Suite',
    roomType: 'Suite',
    description: 'Perfect for the modern business traveller. Spacious lounge area, dedicated work desk, high-speed WiFi, and premium bath products.',
    pricePerNight: 8500,
    capacity: 2,
    ratings: 4.9,
    numOfReviews: 18,
    images: [{ url: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80' }],
    amenities: { wifi: true, ac: true, tv: true, breakfast: true, jacuzzi: true, parking: true },
    roomNumber: 201,
    isAvailable: true,
  },
  {
    _id: '3',
    name: 'Family Comfort Room',
    roomType: 'Family',
    description: 'Spacious room designed for families. Two separate sleeping areas, bunk beds for children, kitchenette, and all family essentials.',
    pricePerNight: 5500,
    capacity: 4,
    ratings: 4.7,
    numOfReviews: 31,
    images: [{ url: 'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80' }],
    amenities: { wifi: true, ac: true, tv: true, breakfast: true, parking: true },
    roomNumber: 102,
    isAvailable: true,
  },
  {
    _id: '4',
    name: 'Presidential Suite',
    roomType: 'Presidential',
    description: 'The pinnacle of luxury. Private terrace, butler service, jacuzzi, separate living and dining rooms, and panoramic views of Vapi.',
    pricePerNight: 18000,
    capacity: 4,
    ratings: 5.0,
    numOfReviews: 9,
    images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80' }],
    amenities: { wifi: true, ac: true, tv: true, breakfast: true, balcony: true, jacuzzi: true, gym: true, parking: true },
    roomNumber: 501,
    isAvailable: true,
  },
  {
    _id: '5',
    name: 'Standard Comfort Room',
    roomType: 'Standard',
    description: 'Clean, comfortable, and value-for-money. Queen bed, en-suite bathroom, cable TV, and complimentary WiFi.',
    pricePerNight: 2200,
    capacity: 2,
    ratings: 4.5,
    numOfReviews: 47,
    images: [{ url: 'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80' }],
    amenities: { wifi: true, ac: true, tv: true, parking: true },
    roomNumber: 103,
    isAvailable: true,
  },
  {
    _id: '6',
    name: 'Honeymoon Suite',
    roomType: 'Suite',
    description: 'Romantic retreat with rose petal setup, private jacuzzi, champagne welcome, king bed with canopy, and city view balcony.',
    pricePerNight: 12000,
    capacity: 2,
    ratings: 4.9,
    numOfReviews: 14,
    images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80' }],
    amenities: { wifi: true, ac: true, tv: true, breakfast: true, balcony: true, jacuzzi: true },
    roomNumber: 301,
    isAvailable: true,
  },
];

// ── API: Get All Rooms ──────────────────────────────────────────────────────────
app.get('/api/rooms', (req, res) => {
  let result = [...rooms];
  const { roomType, capacity, minPrice, maxPrice, sort, limit = 10, page = 1, search } = req.query;

  if (roomType) result = result.filter(r => r.roomType.toLowerCase() === roomType.toLowerCase());
  if (capacity) result = result.filter(r => r.capacity >= parseInt(capacity));
  if (minPrice)  result = result.filter(r => r.pricePerNight >= parseInt(minPrice));
  if (maxPrice)  result = result.filter(r => r.pricePerNight <= parseInt(maxPrice));
  if (search)    result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  if (sort === 'pricePerNight')  result.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === '-pricePerNight') result.sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === '-ratings')       result.sort((a, b) => b.ratings - a.ratings);

  const total = result.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = result.slice(start, start + parseInt(limit));

  res.json({ success: true, totalRooms: total, rooms: paged, currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

// ── API: Get Single Room ────────────────────────────────────────────────────────
app.get('/api/rooms/:id', (req, res) => {
  const room = rooms.find(r => r._id === req.params.id);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  res.json({ success: true, room });
});

// ── API: Room Availability (always available in static mode) ───────────────────
app.get('/api/rooms/:id/availability', (req, res) => {
  const room = rooms.find(r => r._id === req.params.id);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  res.json({ success: true, isAvailable: true });
});

// ── API: Inquiry Webhook (forwards to Web3Forms) ───────────────────────────────
app.post('/api/inquiry', async (req, res) => {
  try {
    const { name, email, phone, subject, message, roomName, checkIn, checkOut, guests } = req.body;

    const W3F_KEY = process.env.WEB3FORMS_KEY || '';
    if (!W3F_KEY) {
      // No key configured — just acknowledge
      return res.json({ success: true, message: 'Inquiry received!' });
    }

    const payload = {
      access_key: W3F_KEY,
      subject: subject || `New Inquiry from ${name} — Vaapi Comfort Inn`,
      from_name: 'Vaapi Comfort Inn Website',
      name, email, phone: phone || 'Not provided',
      message: message || '',
      room: roomName || 'General Inquiry',
      check_in: checkIn || 'Not specified',
      check_out: checkOut || 'Not specified',
      guests: guests || 'Not specified',
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.success) {
      res.json({ success: true, message: 'Your inquiry has been sent!' });
    } else {
      res.status(400).json({ success: false, message: 'Could not send inquiry. Try again.' });
    }
  } catch (err) {
    console.error('Inquiry error:', err.message);
    res.json({ success: true, message: 'Inquiry received!' }); // graceful fallback
  }
});

// ── Health Check ────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Vaapi Comfort Inn API is running!', mode: 'static' });
});

// ── SPA Fallback ────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ── Start ───────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🏨 Vaapi Comfort Inn Server running!`);
    console.log(`🚀 http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`✅ Mode: Static (no database needed)\n`);
  });
}

// Required for Vercel Serverless
module.exports = app;
