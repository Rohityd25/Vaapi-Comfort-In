# 🏨 Vaapi Comfort Inn

> *Where Mountains Meet Luxury*

A modern, full-featured hotel website for **Vaapi Comfort Inn** — built with Node.js, Express, and Vanilla HTML/CSS/JS. No database required.

![Vaapi Comfort Inn](public/hotel-day.jpg)

---

## ✨ Features

- 🖼️ **Hero Slideshow** — Auto-cycling through 3 real hotel photos (day, aerial, night)
- 🛏️ **Room Categories** — 6 premium room types with pricing (Standard, Deluxe, Suite, Family, Presidential, Honeymoon)
- 🏅 **Amenities Section** — Infinity Pool, Fine Dining, Luxury Spa, Fitness Center & more
- 🖼️ **Gallery** — Masonry-style photo gallery with lightbox
- 📩 **Contact Form** — Powered by Web3Forms (no database needed, delivers to email)
- 📱 **Fully Responsive** — Mobile-first design
- 🌙 **Dark Luxury Theme** — Gold accents, Playfair Display typography

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+

### Installation

```bash
# Clone the repo
git clone https://github.com/Rohityd25/Vaapi-Comfort-In.git
cd Vaapi-Comfort-In

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Web3Forms key

# Start the server
npm start
```

Visit: **http://localhost:5000**

---

## 📁 Project Structure

```
Vaapi-Comfort-In/
├── public/
│   ├── index.html          # Homepage with hero slideshow
│   ├── rooms.html          # Room listing & filter page
│   ├── css/
│   │   └── style.css       # Dark luxury design system
│   ├── js/
│   │   ├── main.js         # Homepage logic & slideshow
│   │   ├── rooms.js        # Rooms filter & pagination
│   │   └── api.js          # API helper functions
│   ├── hotel-day.jpg       # Hero image 1
│   ├── hotel-aerial.jpg    # Hero image 2
│   ├── hotel-night.jpg     # Hero image 3
│   └── vaapi-logo.png      # Hotel logo
├── server.js               # Express server + static room data
├── .env.example            # Environment variable template
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file with:

```env
PORT=5000
WEB3FORMS_KEY=your_web3forms_access_key_here
```

Get your free Web3Forms key at: [web3forms.com](https://web3forms.com)

---

## 🛏️ Room Categories

| Room | Price/Night |
|------|-------------|
| Standard Comfort | ₹2,200 |
| Deluxe Pool Side | ₹4,500 |
| Family Room | ₹5,500 |
| Honeymoon Suite | ₹12,000 |
| Executive Suite | ₹8,500 |
| Presidential Suite | ₹18,000 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Server | Node.js + Express |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | Google Fonts (Playfair Display, Inter) |
| Email | Web3Forms API |
| Hosting | Any Node.js host (Railway, Render, etc.) |

---

## 📞 Contact

**Vaapi Comfort Inn**  
📍 Vapi, Gujarat, India  
📞 Call Us for bookings  
🌐 [github.com/Rohityd25/Vaapi-Comfort-In](https://github.com/Rohityd25/Vaapi-Comfort-In)

---

## 📄 License

This project is private — all rights reserved © Vaapi Comfort Inn.
