/**
 * =============================================
 *  ROOMS.JS - Rooms Listing Page
 * =============================================
 * Filter, search, sort, paginate rooms.
 */

let currentPage = 1;
let searchTimer = null;
let allFilters  = {};
let maxPrice    = 25000;

document.addEventListener('DOMContentLoaded', () => {

  loadRooms();
});

// ── Load rooms with current filters ──────────────────────────────────────────
async function loadRooms() {
  const grid   = document.getElementById('roomsGrid');
  const paging = document.getElementById('pagination');

  grid.innerHTML  = '<div class="room-skeleton"></div>'.repeat(6);

  try {
    const params = { page: currentPage, limit: 9, sort: '-createdAt' };
    const data   = await RoomsAPI.getAll(params);

    const rooms = data.rooms || [];
    renderRooms(rooms);
    renderPagination(data.totalPages || 1, data.currentPage || 1);
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:4rem 0;">
      <div style="font-size:3rem;margin-bottom:1rem;">🔌</div>
      <p>Could not load rooms. Please try again.</p>
      <p style="margin-top:.5rem;font-size:.85rem;">Or <a href="index.html#contact" style="color:var(--gold)">contact us</a> to check availability.</p>
    </div>`;
  }
}



function renderRooms(rooms) {
  const grid = document.getElementById('roomsGrid');
  if (!rooms.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--text-muted);">
      <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
      <p>No rooms match your filters.</p>
      <button class="btn btn-outline" style="margin-top:1rem;" onclick="clearFilters()">Clear Filters</button>
    </div>`;
    return;
  }

  grid.innerHTML = '';
  rooms.forEach(room => {
    const card = createRoomCard(room);
    grid.appendChild(card);
  });
}

// Reuse card builder from main.js (already in global scope via api.js/main.js)
// If not loaded, define locally
if (typeof createRoomCard === 'undefined') {
  function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.onclick = () => window.location.href = `/room-detail.html?id=${room._id}`;
    const img  = room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
    const amenMap = { wifi:'📶 WiFi', ac:'❄️ AC', tv:'📺 TV', breakfast:'🍳 Breakfast', balcony:'🌅 Balcony', jacuzzi:'🛁 Jacuzzi' };
    const tags = Object.entries(room.amenities||{}).filter(([,v])=>v).slice(0,4).map(([k])=>`<span class="amenity-tag">${amenMap[k]||k}</span>`).join('');
    card.innerHTML = `
      <div class="room-card-img">
        <img src="${img}" alt="${room.name}" loading="lazy"/>
        <span class="room-type-badge">${room.roomType}</span>
      </div>
      <div class="room-card-body">
        <h3 class="room-card-title">${room.name}</h3>
        <div class="room-card-rating">
          <span class="room-rating-stars">${'⭐'.repeat(Math.round(room.ratings||0))}</span>
          <span class="room-rating-num">${(room.ratings||0).toFixed(1)} (${room.numOfReviews||0})</span>
        </div>
        <div class="room-card-amenities">${tags}</div>
        <div class="room-card-footer">
          <div class="room-price">₹${Number(room.pricePerNight).toLocaleString('en-IN')} <span>/ night</span></div>
          <button class="btn btn-gold" onclick="event.stopPropagation();window.location.href='/room-detail.html?id=${room._id}'">Book</button>
        </div>
      </div>`;
    return card;
  }
}

function renderPagination(totalPages, currentPg) {
  const paging = document.getElementById('pagination');
  paging.innerHTML = '';
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn${i === currentPg ? ' active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; loadRooms(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    paging.appendChild(btn);
  }
}

