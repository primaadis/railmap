/**
 * KAI GIS CS & HERITAGE EXPLORER CONTROLLER
 * Versi 4.1 - OpenRailwayMap Live Tiles, Search & Drawer Responsive
 */

let map;
let currentBaseLayer;
let railwayOverlayLayer;
let stationMarkers = [];
let activeStationId = null;
let currentCategory = 'all';
let currentRegion = 'ALL';
let searchQuery = '';

// Konfigurasi Warna Pin Berdasarkan Kategori
const PIN_COLORS = {
  whoosh: '#dc2626',    // Crimson Whoosh
  antarkota: '#2563eb', // Biru Safir
  commuter: '#06b6d4',  // Cyan Commuter
  bandara: '#f59e0b',   // Amber Bandara/Feeder
  heritage: '#d97706'   // Perunggu / Cagar Budaya
};

const PIN_ICONS = {
  whoosh: 'fa-bolt-lightning',
  antarkota: 'fa-train',
  commuter: 'fa-train-subway',
  bandara: 'fa-plane-departure',
  heritage: 'fa-monument'
};

// Inisialisasi Aplikasi Saat Halaman Selesai Dimuat
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderStationDirectory();
  updateStationMarkers();
});

// Inisialisasi Peta Leaflet & Layer
function initMap() {
  // Titik tengah Pulau Jawa (default)
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([-7.25, 110.15], 7);

  // Zoom Control Posisi Kiri Atas
  L.control.zoom({ position: 'topleft' }).addTo(map);

  // Attribution Control di Kanan Bawah
  L.control.attribution({
    position: 'bottomright',
    prefix: '<span class="text-[9px] text-slate-500">KAI GIS • OpenRailwayMap</span>'
  }).addTo(map);

  // Default Basemap: CartoDB Dark Matter (Fokus visual rel dan stasiun)
  setBaseMap('dark');

  // Layer Rel Dunia OpenRailwayMap (Standard Railway Infrastructure)
  railwayOverlayLayer = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    opacity: 0.85
  });
  railwayOverlayLayer.addTo(map);

  // Tutup layer menu saat klik di luar
  map.on('click', () => {
    closeLayerMenu();
  });
}

// Pengganti Basemap Kartografi
function setBaseMap(type) {
  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer);
  }

  // Reset Indikator Tombol Menu
  ['dark', 'osm', 'satellite'].forEach(id => {
    const btn = document.getElementById(`btn-${id}`);
    const chk = document.getElementById(`check-${id}`);
    if (btn) btn.className = 'w-full p-2 border border-white/10 bg-slate-900/80 rounded-xl text-left hover:bg-slate-800 transition text-slate-300';
    if (chk) chk.classList.add('hidden');
  });

  if (type === 'dark') {
    currentBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    });
    const btn = document.getElementById('btn-dark');
    const chk = document.getElementById('check-dark');
    if (btn) btn.className = 'w-full p-2 rounded-xl border text-left flex items-center justify-between bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold transition';
    if (chk) chk.classList.remove('hidden');
  } else if (type === 'osm') {
    currentBaseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });
    const btn = document.getElementById('btn-osm');
    if (btn) btn.className = 'p-2 border border-amber-500/50 bg-amber-500/10 rounded-xl text-left text-amber-300 font-bold transition';
  } else if (type === 'satellite') {
    currentBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });
    const btn = document.getElementById('btn-satellite');
    if (btn) btn.className = 'p-2 border border-amber-500/50 bg-amber-500/10 rounded-xl text-left text-amber-300 font-bold transition';
  }

  currentBaseLayer.addTo(map);
  if (railwayOverlayLayer && map.hasLayer(railwayOverlayLayer)) {
    railwayOverlayLayer.bringToFront();
  }
}

// Toggle Layer Rel OpenRailwayMap
function toggleRailOverlay(checked) {
  if (checked) {
    if (!map.hasLayer(railwayOverlayLayer)) {
      map.addLayer(railwayOverlayLayer);
      railwayOverlayLayer.bringToFront();
    }
  } else {
    if (map.hasLayer(railwayOverlayLayer)) {
      map.removeLayer(railwayOverlayLayer);
    }
  }
}

// Toggle Dropdown Menu Layer
function toggleLayerMenu() {
  const menu = document.getElementById('layerMenuDropdown');
  menu.classList.toggle('hidden');
}

function closeLayerMenu() {
  const menu = document.getElementById('layerMenuDropdown');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
}

// Filter Data Stasiun
function getFilteredStations() {
  return STATIONS_DATA.filter(station => {
    // Kategori
    const matchCat = (currentCategory === 'all') || (station.category === currentCategory);

    // Daop / Divre
    const matchRegion = (currentRegion === 'ALL') || (station.region === currentRegion);

    // Pencarian Teks
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || (
      station.name.toLowerCase().includes(q) ||
      station.code.toLowerCase().includes(q) ||
      station.city.toLowerCase().includes(q) ||
      station.region.toLowerCase().includes(q)
    );

    return matchCat && matchRegion && matchSearch;
  });
}

// Render Pin / Marker di Peta
function updateStationMarkers() {
  // Hapus marker lama
  stationMarkers.forEach(m => map.removeLayer(m));
  stationMarkers = [];

  const stations = getFilteredStations();

  stations.forEach(station => {
    const pinColor = PIN_COLORS[station.category] || '#f59e0b';
    const iconClass = PIN_ICONS[station.category] || 'fa-train';

    const customIcon = L.divIcon({
      className: 'custom-station-pin',
      html: `
        <div id="pin-${station.id}" class="station-marker-icon ${station.id === activeStationId ? 'pin-selected' : ''}" style="background: ${pinColor}; width: 28px; height: 28px; border: 2px solid #ffffff;">
          <i class="fa-solid ${iconClass} text-[11px]"></i>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([station.lat, station.lng], { icon: customIcon });

    marker.on('click', () => {
      selectStation(station.id, true);
    });

    marker.bindTooltip(`<b>${station.name}</b> (${station.code})<br><span style="font-size:10px; color:#cbd5e1;">${station.type}</span>`, {
      direction: 'top',
      offset: [0, -14],
      className: 'bg-slate-900 text-white rounded-lg px-2 py-1 border border-white/10 text-xs shadow-xl'
    });

    marker.addTo(map);
    stationMarkers.push(marker);
  });

  // Perbarui total counter di sidebar
  const countEl = document.getElementById('stationCountDisplay');
  if (countEl) {
    countEl.innerText = `${stations.length} Titik`;
  }
}

// Render Direktori Stasiun di Sidebar
function renderStationDirectory() {
  const container = document.getElementById('stationListContainer');
  if (!container) return;

  const stations = getFilteredStations();
  container.innerHTML = '';

  if (stations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs">
        <i class="fa-solid fa-triangle-exclamation text-xl mb-2 text-amber-500/50 block"></i>
        Tidak ada stasiun yang cocok dengan kriteria pencarian.
      </div>
    `;
    return;
  }

  stations.forEach(station => {
    const isSelected = (station.id === activeStationId);
    const pinColor = PIN_COLORS[station.category] || '#f59e0b';

    const card = document.createElement('div');
    card.id = `card-${station.id}`;
    card.onclick = () => {
      selectStation(station.id, true);
      // Di mobile, tutup sidebar katalog saat stasiun dipilih
      if (window.innerWidth < 768) {
        toggleMobileSidebar();
      }
    };

    card.className = `p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
      isSelected
        ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-950/20'
        : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/80 hover:border-white/10'
    }`;

    card.innerHTML = `
      <div class="flex items-center gap-2.5 overflow-hidden">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-mono font-bold text-[10px]" style="background: ${pinColor}">
          ${station.code}
        </div>
        <div class="truncate">
          <h4 class="text-xs font-semibold text-white truncate">${station.name}</h4>
          <p class="text-[10px] text-slate-400 truncate">${station.city}</p>
        </div>
      </div>
      <div class="text-right shrink-0">
        <span class="text-[9px] font-mono block text-amber-400">${station.elevation} mdpl</span>
        <span class="text-[9px] text-slate-500">${station.status}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// Seleksi Stasiun & Buka Lembar Detail (Drawer)
function selectStation(stationId, shouldPan = true) {
  const station = STATIONS_DATA.find(s => s.id === stationId);
  if (!station) return;

  activeStationId = stationId;

  // Sorot pin di peta
  document.querySelectorAll('.station-marker-icon').forEach(el => el.classList.remove('pin-selected'));
  const pinEl = document.getElementById(`pin-${stationId}`);
  if (pinEl) pinEl.classList.add('pin-selected');

  // Perbarui tampilan item direktori
  renderStationDirectory();

  // Bawa peta ke titik lokasi stasiun
  if (shouldPan && map) {
    map.flyTo([station.lat, station.lng], 14, {
      duration: 1.0,
      easeLinearity: 0.25
    });
  }

  // Isi data ke drawer
  populateDrawer(station);

  // Buka Drawer
  openStationDrawer();
}

// Buka & Tutup Drawer
function openStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  if (drawer) {
    drawer.classList.add('drawer-active');
  }
}

function closeStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  if (drawer) {
    drawer.classList.remove('drawer-active');
  }
  activeStationId = null;
  document.querySelectorAll('.station-marker-icon').forEach(el => el.classList.remove('pin-selected'));
  renderStationDirectory();
}

// Isi Konten Drawer
function populateDrawer(station) {
  document.getElementById('drawerTitle').innerText = `${station.name} (${station.code})`;
  document.getElementById('drawerCity').innerText = station.city;
  document.getElementById('drawerElevation').innerText = `Elevasi: ${station.elevation} mdpl`;
  document.getElementById('drawerYears').innerText = station.operationalYears || station.status;
  document.getElementById('drawerReview').innerText = station.review;
  document.getElementById('drawerLayoutGuide').innerText = station.layout;

  // Badge Tipe & Status
  const badgeType = document.getElementById('drawerBadgeType');
  badgeType.innerText = station.type;
  badgeType.style.backgroundColor = `${PIN_COLORS[station.category]}25`;
  badgeType.style.color = PIN_COLORS[station.category];

  const badgeStatus = document.getElementById('drawerBadgeStatus');
  badgeStatus.innerText = station.status;
  if (station.status.includes('Aktif')) {
    badgeStatus.className = 'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-emerald-500/20 text-emerald-400';
  } else {
    badgeStatus.className = 'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/20 text-amber-400';
  }

  // Foto Stasiun
  const drawerImg = document.getElementById('drawerImage');
  drawerImg.src = station.image;

  // Fasilitas
  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  station.facilities.forEach(fac => {
    const item = document.createElement('div');
    item.className = 'p-2 bg-slate-900/80 border border-white/5 rounded-xl text-[11px] text-slate-300 flex items-center gap-1.5';
    item.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i> <span class="truncate">${fac}</span>`;
    facContainer.appendChild(item);
  });

  // Tautan Google Maps Akurat
  const mapsLink = document.getElementById('drawerLayoutLink');
  mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;

  // Link Tiket KAI
  const ticketBtn = document.getElementById('drawerTicketBtn');
  if (station.category === 'whoosh') {
    ticketBtn.href = 'https://ticket.kcic.co.id';
    ticketBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning mr-1.5"></i> Cek Tiket Whoosh (KCIC)';
  } else {
    ticketBtn.href = 'https://booking.kai.id';
    ticketBtn.innerHTML = '<i class="fa-solid fa-ticket mr-1.5"></i> Cek Tiket di Access by KAI';
  }
}

// Handlers Filter Kategori
function filterCategory(cat, element) {
  currentCategory = cat;

  // Ubah status visual tombol pill
  document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }

  const label = document.getElementById('filterStatusLabel');
  if (label) {
    label.innerText = cat === 'all' ? 'Semua' : cat.toUpperCase();
  }

  updateStationMarkers();
  renderStationDirectory();
}

// Handler Dropdown Daop / Divre
function handleRegionSelect(region) {
  currentRegion = region;
  updateStationMarkers();
  renderStationDirectory();
}

// Handler Pencarian Input
function handleSearch(val) {
  searchQuery = val;
  const clearBtn = document.getElementById('clearSearchBtn');
  if (val && val.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }

  updateStationMarkers();
  renderStationDirectory();
}

function clearSearch() {
  const searchInput = document.getElementById('stationSearch');
  searchInput.value = '';
  handleSearch('');
}

// Toggle Sidebar Khusus Mobile
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebarDirectory');
  const backdrop = document.getElementById('mobileBackdrop');

  const isClosed = sidebar.classList.contains('-translate-x-full');
  if (isClosed) {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }

  // Pastikan Leaflet menyesuaikan ukuran saat drawer terbuka/tutup
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 350);
}

// Handle Resize Window
window.addEventListener('resize', () => {
  if (map) map.invalidateSize();
});
