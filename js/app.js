/**
 * KAI GIS CS & HERITAGE EXPLORER CONTROLLER
 * Versi 4.3 - Pure Canvas Track Mode (No API Key Required) & Minimalist Filter UI
 */

let map;
let currentBaseLayer = null;
let railwayOverlayLayer = null;
let stationMarkers = [];
let activeStationId = null;
let currentCategory = 'all';
let currentRegion = 'ALL';
let searchQuery = '';

// Warna Pin Kategori
const PIN_COLORS = {
  whoosh: '#dc2626',            // Merah Whoosh
  antarkota: '#2563eb',         // Biru KA Jarak Jauh
  'krl-jabodetabek': '#06b6d4',  // Cyan Jabodetabek
  'krl-jogja': '#10b981',        // Emerald KRL Jogja-Solo
  bandara: '#f59e0b',           // Amber Bandara/Feeder
  heritage: '#d97706'           // Perunggu Heritage
};

const PIN_ICONS = {
  whoosh: 'fa-bolt-lightning',
  antarkota: 'fa-train',
  'krl-jabodetabek': 'fa-train-subway',
  'krl-jogja': 'fa-train-subway',
  bandara: 'fa-plane-departure',
  heritage: 'fa-monument'
};

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderStationDirectory();
  updateStationMarkers();

  // Cegah interaksi panel navigasi tembus ke Leaflet
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

  // Buka stasiun pertama pada desktop layar lebar
  if (window.innerWidth >= 1024 && typeof STATIONS_DATA !== 'undefined' && STATIONS_DATA.length > 0) {
    selectStation(STATIONS_DATA[0].id, false);
  }
});

// Inisialisasi Peta
function initMap() {
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([-7.25, 110.15], 7);

  L.control.zoom({ position: 'topleft' }).addTo(map);

  L.control.attribution({
    position: 'bottomright',
    prefix: '<span class="text-[9px] text-slate-500">KAI GIS • OpenRailwayMap Live</span>'
  }).addTo(map);

  // Layer Rel OpenRailwayMap (Live global railway infrastructure)
  railwayOverlayLayer = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    opacity: 0.95
  });
  railwayOverlayLayer.addTo(map);

  // Default: Mode Fokus Rel Murni (Bebas API Key)
  setBaseMap('railways-only');

  map.on('click', () => {
    closeLayerMenu();
  });
}

// Pengaturan Mode Peta (Bebas Watermark & API Key)
function setBaseMap(type) {
  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer);
    currentBaseLayer = null;
  }

  // Reset indikator UI tombol
  ['railways-only', 'osm', 'satellite'].forEach(id => {
    const btn = document.getElementById(`btn-${id}`);
    const chk = document.getElementById(`check-${id}`);
    if (btn) btn.className = 'w-full p-2 border border-white/10 bg-slate-900/80 rounded-xl text-left hover:bg-slate-800 transition text-slate-300';
    if (chk) chk.classList.add('hidden');
  });

  if (type === 'railways-only') {
    // Mode Fokus Rel Murni: Tidak memuat basemap eksternal sama sekali.
    // Memanfaatkan latar kanvas gelap murni (#060911) dengan layer rel OpenRailwayMap di atasnya.
    const btn = document.getElementById('btn-railways-only');
    const chk = document.getElementById('check-railways-only');
    if (btn) btn.className = 'w-full p-2.5 rounded-xl border text-left flex items-center justify-between bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold transition';
    if (chk) chk.classList.remove('hidden');

    // Pastikan rel aktif
    if (!map.hasLayer(railwayOverlayLayer)) {
      map.addLayer(railwayOverlayLayer);
    }
    const checkRel = document.getElementById('railOverlayToggle');
    if (checkRel) checkRel.checked = true;

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

  if (railwayOverlayLayer && map.hasLayer(railwayOverlayLayer)) {
    railwayOverlayLayer.bringToFront();
  }
}

// Toggle Overlay Rel
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

// Toggle Dropdown Menu Peta
function toggleLayerMenu(event) {
  if (event) event.stopPropagation();
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

// Perbarui Marker di Peta
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
        <div id="pin-${station.id}" class="station-marker-icon ${station.id === activeStationId ? 'pin-selected' : ''}" style="background: ${pinColor}; width: 26px; height: 26px; border: 2px solid #ffffff;">
          <i class="fa-solid ${iconClass} text-[10px]"></i>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const marker = L.marker([station.lat, station.lng], { icon: customIcon });

    marker.on('click', () => {
      selectStation(station.id, true);
    });

    marker.bindTooltip(`<b>${station.name}</b> (${station.code})<br><span style="font-size:10px; color:#cbd5e1;">${station.type}</span>`, {
      direction: 'top',
      offset: [0, -13],
      className: 'bg-slate-900 text-white rounded-lg px-2 py-1 border border-white/10 text-xs shadow-xl'
    });

    marker.addTo(map);
    stationMarkers.push(marker);
  });

  const countEl = document.getElementById('stationCountDisplay');
  if (countEl) {
    countEl.innerText = `${stations.length} Titik`;
  }
}

// Render Direktori Minimalis & Rapi di Panel Kiri
function renderStationDirectory() {
  const container = document.getElementById('stationListContainer');
  if (!container) return;

  const stations = getFilteredStations();
  container.innerHTML = '';

  if (stations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs">
        <i class="fa-solid fa-magnifying-glass text-lg mb-1.5 opacity-50 block"></i>
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

    // Desain kartu bersih, ramping, tidak bertumpuk
    item.className = `px-3 py-2 rounded-xl cursor-pointer transition flex items-center justify-between gap-2.5 border ${
      isSelected
        ? 'bg-amber-500/10 border-amber-500/40'
        : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-white/10'
    }`;

    item.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="w-9 h-6 rounded flex items-center justify-center shrink-0 font-mono font-bold text-[10px] text-white" style="background: ${pinColor}">
          ${station.code}
        </span>
        <div class="min-w-0">
          <h4 class="text-xs font-medium text-slate-100 truncate">${station.name}</h4>
          <p class="text-[10px] text-slate-400 truncate">${station.city}</p>
        </div>
      </div>
      <div class="shrink-0 text-right">
        <span class="text-[9px] font-mono text-amber-400/90">${station.elevation}m</span>
      </div>
    `;

    container.appendChild(item);
  });
}

// Buka/Tutup Drawer Detail
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

// Pengisian Detail Stasiun
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
    badgeStatus.className = 'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-emerald-500/20 text-emerald-400';
  } else {
    badgeStatus.className = 'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/20 text-amber-400';
  }

  const drawerImg = document.getElementById('drawerImage');
  drawerImg.src = station.image;

  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  station.facilities.forEach(fac => {
    const item = document.createElement('div');
    item.className = 'p-2 bg-slate-900/80 border border-white/5 rounded-xl text-[11px] text-slate-300 flex items-center gap-1.5';
    item.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i> <span class="truncate">${fac}</span>`;
    facContainer.appendChild(item);
  });

  const mapsLink = document.getElementById('drawerLayoutLink');
  mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;

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
