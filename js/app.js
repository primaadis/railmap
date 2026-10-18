/**
 * KAI GIS CS & HERITAGE EXPLORER CONTROLLER
 * Versi 4.5 - Dual-Theme Mode (Siang & Malam), Route Polylines & High-Legibility Typography
 */

let map;
let currentBaseLayer = null;
let railwayOverlayLayer = null;
let currentBasemapType = 'canvas-theme';
let stationMarkers = [];
let routeLayers = {};
let activeStationId = null;
let currentCategory = 'all';
let currentRegion = 'ALL';
let searchQuery = '';

// Pengaturan Tema Default / Mengambil dari Penyimpanan Lokal
let currentTheme = localStorage.getItem('kai_gis_theme') || 'dark';

// Warna Pin Stasiun
const PIN_COLORS = {
  whoosh: '#dc2626',            // Merah Whoosh
  antarkota: '#2563eb',         // Biru KA Antarkota
  'krl-jabodetabek': '#06b6d4',  // Cyan KRL Jabodetabek
  'krl-jogja': '#10b981',        // Emerald KRL Jogja-Solo
  'lokal-kci': '#f59e0b',        // Amber Lokal KCI
  'lokal-kai': '#a855f7',        // Ungu Lokal KAI
  bandara: '#d97706',           // Oranye Bandara
  heritage: '#854d0e'           // Cokelat Heritage
};

const PIN_ICONS = {
  whoosh: 'fa-bolt-lightning',
  antarkota: 'fa-train',
  'krl-jabodetabek': 'fa-train-subway',
  'krl-jogja': 'fa-train-subway',
  'lokal-kci': 'fa-train-tram',
  'lokal-kai': 'fa-train',
  bandara: 'fa-plane-departure',
  heritage: 'fa-monument'
};

document.addEventListener('DOMContentLoaded', () => {
  // Terapkan tema awal
  applyTheme(currentTheme, false);

  initMap();
  initRailwayRoutes();
  renderStationDirectory();
  updateStationMarkers();

  // Cegah interaksi dropdown dan drawer tembus ke peta Leaflet
  const rightControls = document.getElementById('rightControlsBar');
  if (rightControls) {
    L.DomEvent.disableClickPropagation(rightControls);
    L.DomEvent.disableScrollPropagation(rightControls);
  }

  const drawer = document.getElementById('stationDrawer');
  if (drawer) {
    L.DomEvent.disableClickPropagation(drawer);
    L.DomEvent.disableScrollPropagation(drawer);
  }

  const routeDropdown = document.getElementById('routeMenuDropdown');
  if (routeDropdown) {
    L.DomEvent.disableClickPropagation(routeDropdown);
    L.DomEvent.disableScrollPropagation(routeDropdown);
  }

  const layerDropdown = document.getElementById('layerMenuDropdown');
  if (layerDropdown) {
    L.DomEvent.disableClickPropagation(layerDropdown);
    L.DomEvent.disableScrollPropagation(layerDropdown);
  }

  // Pada PC (Layar Lebar), tampilkan stasiun pertama secara otomatis
  if (window.innerWidth >= 1024 && typeof STATIONS_DATA !== 'undefined' && STATIONS_DATA.length > 0) {
    selectStation(STATIONS_DATA[0].id, false);
  }
});

// ========================================================
// SISTEM MODE SIANG / MALAM (THEME SWITCHER)
// ========================================================
function toggleTheme() {
  const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
  applyTheme(newTheme, true);
}

function applyTheme(theme, updateBasemap = true) {
  currentTheme = theme;
  localStorage.setItem('kai_gis_theme', theme);

  const body = document.getElementById('appBody');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const themeIconMobile = document.getElementById('themeIconMobile');
  const canvasDesc = document.getElementById('canvasThemeDesc');

  if (theme === 'light') {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');

    if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-indigo-600';
    if (themeLabel) themeLabel.innerText = 'Mode Malam';
    if (themeIconMobile) themeIconMobile.className = 'fa-solid fa-moon text-indigo-600';
    if (canvasDesc) canvasDesc.innerText = 'Esri Light Canvas (Mode Siang Terang)';
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');

    if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-amber-500';
    if (themeLabel) themeLabel.innerText = 'Mode Siang';
    if (themeIconMobile) themeIconMobile.className = 'fa-solid fa-sun text-amber-500';
    if (canvasDesc) canvasDesc.innerText = 'Esri Dark Canvas (Mode Malam Gelap)';
  }

  // Jika basemap saat ini adalah jenis kanvas tema, perbarui lapisannya
  if (updateBasemap && map && currentBasemapType === 'canvas-theme') {
    setBaseMap('canvas-theme');
  }

  // Render ulang direktori stasiun agar kartu mendapat gaya kelas tema yang tepat
  renderStationDirectory();
}

// Inisialisasi Peta Leaflet
function initMap() {
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([-7.25, 110.15], 7);

  L.control.zoom({ position: 'topleft' }).addTo(map);

  L.control.attribution({
    position: 'bottomright',
    prefix: '<span class="text-[10px] opacity-75">KAI GIS • OpenRailwayMap Live</span>'
  }).addTo(map);

  // Layer Rel OpenRailwayMap Standar
  railwayOverlayLayer = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    opacity: 0.88
  });
  railwayOverlayLayer.addTo(map);

  // Pasang basemap awal sesuai tema aktif
  setBaseMap('canvas-theme');

  map.on('click', () => {
    closeLayerMenu();
    closeRouteMenu();
  });
}

// Polylines Jalur KA Interaktif
function initRailwayRoutes() {
  if (typeof RAILWAY_ROUTES === 'undefined') return;

  Object.keys(RAILWAY_ROUTES).forEach(key => {
    const route = RAILWAY_ROUTES[key];
    const polyline = L.polyline(route.coords, {
      color: route.color,
      weight: route.weight || 4,
      opacity: 0.85,
      smoothFactor: 1.5,
      className: 'railway-route-line'
    });

    polyline.bindTooltip(`<b>${route.name}</b>`, {
      sticky: true,
      className: 'bg-slate-900 text-white rounded-lg px-2.5 py-1 text-xs border border-white/10 shadow-xl'
    });

    polyline.on('click', () => {
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    });

    polyline.addTo(map);
    routeLayers[key] = polyline;
  });
}

// Toggle Jalur Rel
function toggleRouteLayer(key, isChecked) {
  if (!routeLayers[key]) return;
  if (isChecked) {
    if (!map.hasLayer(routeLayers[key])) {
      map.addLayer(routeLayers[key]);
    }
  } else {
    if (map.hasLayer(routeLayers[key])) {
      map.removeLayer(routeLayers[key]);
    }
  }
}

function toggleAllRoutes(forceState) {
  Object.keys(routeLayers).forEach(key => {
    const checkbox = document.getElementById(`route-${key}`);
    if (checkbox) checkbox.checked = forceState;
    toggleRouteLayer(key, forceState);
  });
}

// Basemap Switcher (Mendukung Kanvas Siang & Kanvas Malam)
function setBaseMap(type) {
  currentBasemapType = type;

  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer);
    currentBaseLayer = null;
  }

  // Reset kelas tombol basemap
  ['canvas-theme', 'osm', 'satellite'].forEach(id => {
    const btn = document.getElementById(`btn-${id}`);
    const chk = document.getElementById(`check-${id}`);
    if (btn) {
      btn.classList.remove('app-basemap-active');
      btn.classList.add('app-basemap-btn');
    }
    if (chk) chk.classList.add('hidden');
  });

  if (type === 'canvas-theme') {
    // Mode Kanvas Bersih: Di Mode Malam memakai Dark Gray, di Mode Siang memakai Light Gray
    const esriUrl = (currentTheme === 'light')
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    currentBaseLayer = L.tileLayer(esriUrl, { maxZoom: 16 });
    currentBaseLayer.addTo(map);

    const btn = document.getElementById('btn-canvas-theme');
    const chk = document.getElementById('check-canvas-theme');
    if (btn) {
      btn.classList.remove('app-basemap-btn');
      btn.classList.add('app-basemap-active');
    }
    if (chk) chk.classList.remove('hidden');

  } else if (type === 'osm') {
    currentBaseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
    currentBaseLayer.addTo(map);
    const btn = document.getElementById('btn-osm');
    if (btn) btn.classList.add('app-basemap-active');

  } else if (type === 'satellite') {
    currentBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
    currentBaseLayer.addTo(map);
    const btn = document.getElementById('btn-satellite');
    if (btn) btn.classList.add('app-basemap-active');
  }

  // Pastikan overlay rel dan rute berada di depan basemap
  if (railwayOverlayLayer && map.hasLayer(railwayOverlayLayer)) {
    railwayOverlayLayer.bringToFront();
  }
  Object.keys(routeLayers).forEach(key => {
    if (map.hasLayer(routeLayers[key])) {
      routeLayers[key].bringToFront();
    }
  });
}

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

// Kontrol Dropdown
function toggleRouteMenu(event) {
  if (event) event.stopPropagation();
  closeLayerMenu();
  const menu = document.getElementById('routeMenuDropdown');
  if (menu) menu.classList.toggle('hidden');
}

function closeRouteMenu() {
  const menu = document.getElementById('routeMenuDropdown');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
}

function toggleLayerMenu(event) {
  if (event) event.stopPropagation();
  closeRouteMenu();
  const menu = document.getElementById('layerMenuDropdown');
  if (menu) menu.classList.toggle('hidden');
}

function closeLayerMenu() {
  const menu = document.getElementById('layerMenuDropdown');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
}

function resetMapView() {
  if (!map) return;
  map.flyTo([-7.25, 110.15], 7, { duration: 1.0 });
}

// Filter Data
function getFilteredStations() {
  if (typeof STATIONS_DATA === 'undefined') return [];
  return STATIONS_DATA.filter(station => {
    const matchCat = (currentCategory === 'all') || (station.category === currentCategory);
    const matchRegion = (currentRegion === 'ALL') || (station.region === currentRegion);
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

function updateStationMarkers() {
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

    marker.bindTooltip(`<b>${station.name}</b> (${station.code})<br><span style="font-size:11px; opacity:0.9;">${station.type}</span>`, {
      direction: 'top',
      offset: [0, -14],
      className: 'bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-white/10 text-xs shadow-xl'
    });

    marker.addTo(map);
    stationMarkers.push(marker);
  });

  const countEl = document.getElementById('stationCountDisplay');
  if (countEl) {
    countEl.innerText = `${stations.length} Titik`;
  }
}

// Render Direktori Kiri Sesuai Tema
function renderStationDirectory() {
  const container = document.getElementById('stationListContainer');
  if (!container) return;

  const stations = getFilteredStations();
  container.innerHTML = '';

  if (stations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-400 text-xs md:text-sm">
        <i class="fa-solid fa-magnifying-glass text-xl mb-2 opacity-50 block"></i>
        Tidak ditemukan stasiun yang cocok.
      </div>
    `;
    return;
  }

  const isLight = (currentTheme === 'light');

  stations.forEach(station => {
    const isSelected = (station.id === activeStationId);
    const pinColor = PIN_COLORS[station.category] || '#f59e0b';

    const item = document.createElement('div');
    item.id = `card-${station.id}`;
    item.onclick = () => {
      selectStation(station.id, true);
      if (window.innerWidth < 768) {
        toggleMobileSidebar();
      }
    };

    let cardClasses = 'px-3.5 py-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 border ';
    if (isLight) {
      cardClasses += isSelected ? 'station-card-active ' : 'station-card-default ';
    } else {
      cardClasses += isSelected
        ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-950/20 '
        : 'bg-slate-900/50 border-white/5 hover:bg-slate-800/70 hover:border-white/10 ';
    }

    item.className = cardClasses;

    item.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-10 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs text-white shadow-sm" style="background: ${pinColor}">
          ${station.code}
        </span>
        <div class="min-w-0">
          <h4 class="text-xs md:text-sm font-semibold truncate ${isLight ? 'station-card-title' : 'text-slate-100'}">${station.name}</h4>
          <p class="text-[11px] md:text-xs truncate ${isLight ? 'station-card-sub' : 'text-slate-400'}">${station.city}</p>
        </div>
      </div>
      <div class="shrink-0 text-right">
        <span class="text-xs font-mono font-semibold ${isLight ? 'station-card-elev' : 'text-amber-400'}">${station.elevation}m</span>
      </div>
    `;

    container.appendChild(item);
  });
}

// Buka / Tutup Drawer Detail
function toggleStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  if (drawer.classList.contains('drawer-active')) {
    closeStationDrawer();
  } else {
    if (!activeStationId && typeof STATIONS_DATA !== 'undefined' && STATIONS_DATA.length > 0) {
      selectStation(STATIONS_DATA[0].id, true);
    } else {
      openStationDrawer();
    }
  }
}

function openStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  if (drawer) {
    drawer.classList.add('drawer-active');
    document.body.classList.add('drawer-is-open');
  }
  const detailBtn = document.getElementById('toggleDetailBtn');
  if (detailBtn) {
    detailBtn.classList.add('border-amber-500', 'bg-amber-500/15');
  }
}

function closeStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  if (drawer) {
    drawer.classList.remove('drawer-active');
    document.body.classList.remove('drawer-is-open');
  }
  const detailBtn = document.getElementById('toggleDetailBtn');
  if (detailBtn) {
    detailBtn.classList.remove('border-amber-500', 'bg-amber-500/15');
  }
  activeStationId = null;
  document.querySelectorAll('.station-marker-icon').forEach(el => el.classList.remove('pin-selected'));
  renderStationDirectory();
}

// Seleksi Stasiun
function selectStation(stationId, shouldPan = true) {
  if (typeof STATIONS_DATA === 'undefined') return;
  const station = STATIONS_DATA.find(s => s.id === stationId);
  if (!station) return;

  activeStationId = stationId;

  document.querySelectorAll('.station-marker-icon').forEach(el => el.classList.remove('pin-selected'));
  const pinEl = document.getElementById(`pin-${stationId}`);
  if (pinEl) pinEl.classList.add('pin-selected');

  renderStationDirectory();

  if (shouldPan && map) {
    map.flyTo([station.lat, station.lng], 14, {
      duration: 1.0,
      easeLinearity: 0.25
    });
  }

  populateDrawer(station);
  openStationDrawer();
}

function populateDrawer(station) {
  document.getElementById('drawerTitle').innerText = `${station.name} (${station.code})`;
  document.getElementById('drawerCity').innerText = station.city;
  document.getElementById('drawerElevation').innerText = `Elevasi: ${station.elevation} mdpl`;
  document.getElementById('drawerYears').innerText = station.operationalYears || station.status;
  document.getElementById('drawerReview').innerText = station.review;
  document.getElementById('drawerLayoutGuide').innerText = station.layout;

  const isLight = (currentTheme === 'light');

  // Badge Tipe
  const badgeType = document.getElementById('drawerBadgeType');
  badgeType.innerText = station.type;
  if (isLight) {
    badgeType.style.backgroundColor = `${PIN_COLORS[station.category]}20`;
    badgeType.style.color = PIN_COLORS[station.category];
    badgeType.style.border = `1px solid ${PIN_COLORS[station.category]}50`;
  } else {
    badgeType.style.backgroundColor = `${PIN_COLORS[station.category]}25`;
    badgeType.style.color = PIN_COLORS[station.category];
    badgeType.style.border = 'none';
  }

  // Badge Status
  const badgeStatus = document.getElementById('drawerBadgeStatus');
  badgeStatus.innerText = station.status;
  if (station.status.includes('Aktif')) {
    badgeStatus.className = isLight
      ? 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300'
      : 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  } else {
    badgeStatus.className = isLight
      ? 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300'
      : 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30';
  }

  const drawerImg = document.getElementById('drawerImage');
  drawerImg.src = station.image;

  // Fasilitas
  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  station.facilities.forEach(fac => {
    const item = document.createElement('div');
    item.className = isLight
      ? 'p-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 flex items-center gap-2 font-medium shadow-sm'
      : 'p-2.5 bg-slate-900/80 border border-white/5 rounded-xl text-xs md:text-sm text-slate-200 flex items-center gap-2 font-medium';
    item.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500 text-xs shrink-0"></i> <span class="truncate">${fac}</span>`;
    facContainer.appendChild(item);
  });

  const mapsLink = document.getElementById('drawerLayoutLink');
  mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;

  const ticketBtn = document.getElementById('drawerTicketBtn');
  if (station.category === 'whoosh') {
    ticketBtn.href = 'https://ticket.kcic.co.id';
    ticketBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning mr-2"></i> Cek Tiket Whoosh (KCIC)';
  } else {
    ticketBtn.href = 'https://booking.kai.id';
    ticketBtn.innerHTML = '<i class="fa-solid fa-ticket mr-2"></i> Cek Tiket di Access by KAI';
  }
}

// Handlers Filter Kategori
function filterCategory(cat, element) {
  currentCategory = cat;
  document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');

  updateStationMarkers();
  renderStationDirectory();
}

function handleRegionSelect(region) {
  currentRegion = region;
  updateStationMarkers();
  renderStationDirectory();
}

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

  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 350);
}

window.addEventListener('resize', () => {
  if (map) map.invalidateSize();
});
