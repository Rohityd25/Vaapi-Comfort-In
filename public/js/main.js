/**
 * =============================================
 *  MAIN.JS - Homepage Logic
 * =============================================
 * Handles: hero animations, stats counter,
 * featured rooms, testimonials slider, contact.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  setTodayDates();
  loadFeaturedRooms();
  initStatsCounter();
  initTestimonialsAutoSlide();
  initParticles();
  initHeroSlideshow();
  
  // Read room param from URL if present
  const params = new URLSearchParams(window.location.search);
  const rType = params.get('room');
  if (rType) {
    const sel = document.getElementById('contactRoomType');
    if (sel) sel.value = rType;
  }

  // Ensure hash navigation reaches its target even after layout shifts
  if (window.location.hash === '#contact') {
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  }
});

// ── Booking Redirect Helper ───────────────────────────────────────────────────
window.handleBookingRedirect = function(roomType = '') {
  if (roomType) {
    const sel = document.getElementById('contactRoomType');
    if (sel) sel.value = roomType;
  }
  
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash
      window.history.pushState(null, null, '#contact');

      // Re-scroll gracefully to outrun lazy-load layout jumps
      setTimeout(() => contactSec.scrollIntoView({ behavior: 'smooth' }), 100);
      setTimeout(() => contactSec.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  } else {
    window.location.href = `/?room=${encodeURIComponent(roomType)}#contact`;
  }
};

// ── Set today and tomorrow as default dates ───────────────────────────────────
function setTodayDates() {
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (typeof flatpickr !== 'undefined') {
    flatpickr("#contactCheckIn", { defaultDate: today, minDate: "today", altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d" });
    flatpickr("#contactCheckOut", { defaultDate: tomorrow, minDate: "today", altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d" });
    // Also upgrade the hero forms if they exist in templates
    flatpickr("#heroCheckIn", { defaultDate: today, minDate: "today", altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d" });
    flatpickr("#heroCheckOut", { defaultDate: tomorrow, minDate: "today", altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d" });
  } else {
    const fmt = (d) => d.toISOString().split('T')[0];
    const ci = document.getElementById('heroCheckIn');
    const co = document.getElementById('heroCheckOut');
    if (ci) { ci.value = fmt(today);    ci.min = fmt(today); }
    if (co) { co.value = fmt(tomorrow); co.min = fmt(tomorrow); }
    const contactCi = document.getElementById('contactCheckIn');
    const contactCo = document.getElementById('contactCheckOut');
    if (contactCi) { contactCi.value = fmt(today);    contactCi.min = fmt(today); }
    if (contactCo) { contactCo.value = fmt(tomorrow); contactCo.min = fmt(tomorrow); }
  }
}

// ── Search rooms (redirect to rooms.html with params) ────────────────────────
function searchRooms() {
  const checkIn  = document.getElementById('heroCheckIn')?.value;
  const checkOut = document.getElementById('heroCheckOut')?.value;
  const guests   = document.getElementById('heroGuests')?.value;

  if (!checkIn || !checkOut) {
    showToast('Please select check-in and check-out dates.', 'warning');
    return;
  }

  const params = new URLSearchParams({ checkIn, checkOut, capacity: guests });
  window.location.href = `/rooms.html?${params}`;
}

// ── Load Featured Rooms (first 3 from API) ─────────────────────────────────
async function loadFeaturedRooms() {
  const grid = document.getElementById('featuredRoomsGrid');
  if (!grid) return;

  try {
    const data = await RoomsAPI.getAll({ limit: 3, sort: '-ratings' });
    grid.innerHTML = '';

    if (!data.rooms?.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">No rooms available yet.</p>';
      return;
    }

    data.rooms.forEach(room => {
      grid.appendChild(createRoomCard(room));
    });
  } catch (err) {
    // Show placeholder cards if backend not connected
    grid.innerHTML = getFallbackRooms();
  }
}

// ── Build a Room Card element ─────────────────────────────────────────────────
function createRoomCard(room) {
  const card = document.createElement('div');
  card.className = 'room-card';
  card.onclick = () => window.handleBookingRedirect(room.roomType);

  const img    = room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
  const stars  = '⭐'.repeat(Math.round(room.ratings || 0));
  const amenTags = buildAmenityTags(room.amenities);

  card.innerHTML = `
    <div class="room-card-img">
      <img src="${img}" alt="${room.name}" loading="lazy" />
      <span class="room-type-badge">${room.roomType}</span>
    </div>
    <div class="room-card-body">
      <h3 class="room-card-title">${room.name}</h3>
      <div class="room-card-rating">
        <span class="room-rating-stars">${stars || '☆☆☆☆☆'}</span>
        <span class="room-rating-num">${room.ratings?.toFixed(1) || '0.0'} (${room.numOfReviews || 0} reviews)</span>
      </div>
      <div class="room-card-amenities">${amenTags}</div>
      <div class="room-card-footer">
        <div class="room-price">₹${Number(room.pricePerNight).toLocaleString('en-IN')} <span>/ night</span></div>
        <button class="btn btn-gold" onclick="event.stopPropagation();window.handleBookingRedirect('${room.roomType}')">Book Now</button>
      </div>
    </div>
  `;
  return card;
}

function buildAmenityTags(amenities = {}) {
  const map = { wifi: '📶 WiFi', ac: '❄️ AC', tv: '📺 TV', breakfast: '🍳 Breakfast', balcony: '🌅 Balcony', jacuzzi: '🛁 Jacuzzi', gym: '🏋️ Gym', parking: '🚗 Parking' };
  return Object.entries(amenities)
    .filter(([, v]) => v)
    .slice(0, 4)
    .map(([k]) => `<span class="amenity-tag">${map[k] || k}</span>`)
    .join('');
}

function getFallbackRooms() {
  const rooms = [
    { name: 'Deluxe Pool Side', type: 'Deluxe', price: '4,500', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600', stars: 5 },
    { name: 'Executive Suite',  type: 'Suite',   price: '8,500', img: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600', stars: 5 },
    { name: 'Family Comfort',   type: 'Family',  price: '5,500', img: 'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=600', stars: 4 },
  ];
  return rooms.map(r => `
    <div class="room-card" onclick="window.location.href='/rooms.html'">
      <div class="room-card-img">
        <img src="${r.img}" alt="${r.name}" loading="lazy"/>
        <span class="room-type-badge">${r.type}</span>
      </div>
      <div class="room-card-body">
        <h3 class="room-card-title">${r.name}</h3>
        <div class="room-card-rating">
          <span class="room-rating-stars">${'⭐'.repeat(r.stars)}</span>
          <span class="room-rating-num">${r.stars}.0</span>
        </div>
        <div class="room-card-amenities">
          <span class="amenity-tag">📶 WiFi</span><span class="amenity-tag">❄️ AC</span><span class="amenity-tag">🍳 Breakfast</span>
        </div>
        <div class="room-card-footer">
          <div class="room-price">₹${r.price} <span>/ night</span></div>
          <button class="btn btn-gold">Book Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Animated Stats Counter ────────────────────────────────────────────────────
function initStatsCounter() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => observer.observe(el));
}

// ── Testimonials Auto Slider ──────────────────────────────────────────────────
let currentSlide = 0;
function goToSlide(index) {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots  = document.querySelectorAll('.dot');
  if (!cards.length) return;

  cards.forEach(c => c.classList.remove('active'));
  dots.forEach(d  => d.classList.remove('active'));
  currentSlide = (index + cards.length) % cards.length;
  cards[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function initTestimonialsAutoSlide() {
  setInterval(() => goToSlide(currentSlide + 1), 5000);
}

// ── Particles background (hero) ───────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute; width:${Math.random()*3+1}px; height:${Math.random()*3+1}px;
      background:rgba(201,169,110,${Math.random()*0.4+0.1}); border-radius:50%;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      animation: float${i % 3} ${Math.random()*10+8}s infinite ease-in-out;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
    @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
    @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
  `;
  document.head.appendChild(style);
}

// ── Contact Form → Webhook ────────────────────────────────────────────────────
async function submitContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending... ⏳';

  // We are communicating directly to Web3Forms to eliminate backend dependencies.
  // Replace YOUR_WEB3FORMS_KEY with your actual access key from web3forms.com
  const payload = {
    access_key: "YOUR_WEB3FORMS_KEY", 
    subject: "New Booking Request",
    name:     document.getElementById('contactName')?.value,
    phone:    document.getElementById('contactPhone')?.value,
    email:    document.getElementById('contactEmail')?.value,
    checkIn:  document.getElementById('contactCheckIn')?.value,
    checkOut: document.getElementById('contactCheckOut')?.value,
    guests:   document.getElementById('contactGuests')?.value,
    roomType: document.getElementById('contactRoomType')?.value,
    message:  document.getElementById('contactMessage')?.value,
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('✅ Booking Request Sent! We will contact you soon.', 'success');
      e.target.reset();
      
      // Reset dates back to default
      if (typeof setTodayDates === 'function') setTodayDates();
    } else {
      // Fallback if access_key is fake and fails
      console.warn('Web3Forms error:', data.message);
      showToast('⚠️ Remember to add your Web3Forms Access Key in main.js!', 'warning');
    }
  } catch (err) {
    showToast('Network error. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

// ── Hero Background Slideshow ─────────────────────────────────────────────────
function initHeroSlideshow() {
  const slides   = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroSlideDots');
  if (!slides.length || !dotsWrap) return;

  let current    = 0;
  let timer      = null;
  const INTERVAL = 5000;

  // Set initial state via style (bypasses CSS cascade)
  slides.forEach((s, i) => { s.style.opacity = i === 0 ? '1' : '0'; });

  // Build indicator dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goSlide(i));
    dotsWrap.appendChild(dot);
  });

  function goSlide(index) {
    // Fade out current
    slides[current].style.opacity       = '0';
    dotsWrap.children[current]?.classList.remove('active');

    // Fade in next
    current = (index + slides.length) % slides.length;
    slides[current].style.opacity       = '1';
    dotsWrap.children[current]?.classList.add('active');
  }

  function nextSlide() { goSlide(current + 1); }

  function startTimer() { stopTimer(); timer = setInterval(nextSlide, INTERVAL); }
  function stopTimer()  { if (timer) { clearInterval(timer); timer = null; } }

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
  }

  startTimer();
}

// ── Mobile Menu Toggle ────────────────────────────────────────────────────────
window.toggleMobileMenu = function() {
  const links = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  if(links) links.classList.toggle('open');
  if(ham) ham.classList.toggle('open');
};

// ── Premium Scroll Reveal Animations ──────────────────────────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.amenity-card, .room-cat-card, .gallery-item, .testimonial-card, .contact-info, .contact-form-wrap, .instagram-item, .section-header.reveal-up');
  revealElements.forEach(el => el.classList.add('reveal-up'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => observer.observe(el));
}
