/**
 * KAI GIS CS & HERITAGE EXPLORER CONTROLLER
 * Versi 4.4 - Esri Dark GIS (Bebas API Key), Interactive Route Polylines & High-Legibility PC UI
 */

let map;
let currentBaseLayer = null;
let railwayOverlayLayer = null;
let stationMarkers = [];
let routeLayers = {};
let activeStationId = null;
let currentCategory = 'all';
let currentRegion = 'ALL';
let searchQuery = '';

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
  initMap();
  initRailwayRoutes();
  renderStationDirectory();
  updateStationMarkers();

  // Cegah interaksi panel navigasi dan drawer tembus ke peta Leaflet
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

  // Pada PC (Layar Lebar), tampilkan stasiun pertama secara otomatis
  if (window.innerWidth >= 1024 && typeof STATIONS_DATA !== 'undefined' && STATIONS_DATA.length > 0) {
    selectStation(STATIONS_DATA[0].id, false);
  }
});

// Inisialisasi Peta Leaflet
function initMap() {
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([-7.25, 110.15], 7);

  L.control.zoom({ position: 'topleft' }).addTo(map);

  L.control.attribution({
    position: 'bottomright',
    prefix: '<span class="text-[10px] text-slate-400">KAI GIS • Esri Canvas & OpenRailwayMap</span>'
  }).addTo(map);

  // Default Basemap: Esri Dark Gray Canvas (Menampilkan pulau, laut, batas wilayah jelas tanpa jalan raya & bebas API Key)
  setBaseMap('esri-dark');

  // Layer Rel OpenRailwayMap Standar
  railwayOverlayLayer = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    opacity: 0.85
  });
  railwayOverlayLayer.addTo(map);

  map.on('click', () => {
    closeLayerMenu();
    closeRouteMenu();
  });
}

// Inisialisasi Polylines Jalur KA Interaktif
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

// Toggle Masing-Masing Jalur Rel
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

// Toggle Seluruh Jalur
function toggleAllRoutes(forceState) {
  Object.keys(routeLayers).forEach(key => {
    const checkbox = document.getElementById(`route-${key}`);
    if (checkbox) checkbox.checked = forceState;
    toggleRouteLayer(key, forceState);
  });
}

// Mode Basemap Kartografi
function setBaseMap(type) {
  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer);
    currentBaseLayer = null;
  }

  ['esri-dark', 'osm', 'satellite'].forEach(id => {
    const btn = document.getElementById(`btn-${id}`);
    const chk = document.getElementById(`check-${id}`);
    if (btn) btn.className = 'w-full p-2 border border-white/10 bg-slate-900/80 rounded-xl text-left hover:bg-slate-800 transition text-slate-300';
    if (chk) chk.classList.add('hidden');
  });

  if (type === 'esri-dark') {
    // Esri Dark Gray Canvas: Memiliki garis pantai & pulau lengkap tanpa polusi jalan / gedung (Bebas API Key)
    currentBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16
    });
    currentBaseLayer.addTo(map);

    const btn = document.getElementById('btn-esri-dark');
    const chk = document.getElementById('check-esri-dark');
    if (btn) btn.className = 'w-full p-2.5 rounded-xl border text-left flex items-center justify-between bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold transition';
    if (chk) chk.classList.remove('hidden');

  } else if (type === 'osm') {
    currentBaseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });
    currentBaseLayer.addTo(map);
    const btn = document.getElementById('btn-osm');
    if (btn) btn.className = 'p-2 border border-amber-500/50 bg-amber-500/10 rounded-xl text-left text-amber-300 font-bold transition';

  } else if (type === 'satellite') {
    currentBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });
    currentBaseLayer.addTo(map);
    const btn = document.getElementById('btn-satellite');
    if (btn) btn.className = 'p-2 border border-amber-500/50 bg-amber-500/10 rounded-xl text-left text-amber-300 font-bold transition';
  }

  // Pastikan layer rel dan polyline tetap berada di atas basemap
  if (railwayOverlayLayer && map.hasLayer(railwayOverlayLayer)) {
    railwayOverlayLayer.bringToFront();
  }
  Object.keys(routeLayers).forEach(key => {
    if (map.hasLayer(routeLayers[key])) {
      routeLayers[key].bringToFront();
    }
  });
}

// Toggle Overlay Rel OpenRailwayMap
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

// Kontrol Dropdown Menu
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

// Filter Stasiun
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

// Render Pin di Peta
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

    marker.bindTooltip(`<b>${station.name}</b> (${station.code})<br><span style="font-size:11px; color:#cbd5e1;">${station.type}</span>`, {
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

// Render Panel Direktori Kiri (Rapi, Luas, Tipografi Nyaman)
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

    item.className = `px-3.5 py-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 border ${
      isSelected
        ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-950/20'
        : 'bg-slate-900/50 border-white/5 hover:bg-slate-800/70 hover:border-white/10'
    }`;

    item.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-10 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs text-white shadow-sm" style="background: ${pinColor}">
          ${station.code}
        </span>
        <div class="min-w-0">
          <h4 class="text-xs md:text-sm font-semibold text-slate-100 truncate">${station.name}</h4>
          <p class="text-[11px] md:text-xs text-slate-400 truncate">${station.city}</p>
        </div>
      </div>
      <div class="shrink-0 text-right">
        <span class="text-xs font-mono font-medium text-amber-400">${station.elevation}m</span>
      </div>
    `;

    container.appendChild(item);
  });
}

// Buka/Tutup Drawer Info Detail
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
    detailBtn.classList.add('border-amber-500/50', 'bg-amber-500/15', 'text-amber-300');
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
    detailBtn.classList.remove('border-amber-500/50', 'bg-amber-500/15', 'text-amber-300');
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

// Isi Detail Stasiun dengan Teks Besar & Jelas di PC
function populateDrawer(station) {
  document.getElementById('drawerTitle').innerText = `${station.name} (${station.code})`;
  document.getElementById('drawerCity').innerText = station.city;
  document.getElementById('drawerElevation').innerText = `Elevasi: ${station.elevation} mdpl`;
  document.getElementById('drawerYears').innerText = station.operationalYears || station.status;
  document.getElementById('drawerReview').innerText = station.review;
  document.getElementById('drawerLayoutGuide').innerText = station.layout;

  const badgeType = document.getElementById('drawerBadgeType');
  badgeType.innerText = station.type;
  badgeType.style.backgroundColor = `${PIN_COLORS[station.category]}25`;
  badgeType.style.color = PIN_COLORS[station.category];

  const badgeStatus = document.getElementById('drawerBadgeStatus');
  badgeStatus.innerText = station.status;
  if (station.status.includes('Aktif')) {
    badgeStatus.className = 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-emerald-500/20 text-emerald-400';
  } else {
    badgeStatus.className = 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/20 text-amber-400';
  }

  const drawerImg = document.getElementById('drawerImage');
  drawerImg.src = station.image;

  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  station.facilities.forEach(fac => {
    const item = document.createElement('div');
    item.className = 'p-2.5 bg-slate-900/80 border border-white/5 rounded-xl text-xs md:text-sm text-slate-200 flex items-center gap-2';
    item.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-xs"></i> <span class="truncate">${fac}</span>`;
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
