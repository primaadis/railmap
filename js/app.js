/**
 * KAI GIS CS & HERITAGE EXPLORER CONTROLLER
 * Versi 5.1 - Integrated Tools, Clean Zen Mode, Route Calculation & SVG Elevation
 */

let map;
let currentBaseLayer = null;
let railwayOverlayLayer = null;
let currentBasemapType = 'canvas-theme';
let stationMarkers = [];
let routeLayers = {};
let landmarkMarkers = [];
let activeStationId = null;
let currentCategory = 'all';
let currentRegion = 'ALL';
let searchQuery = '';
let activeHighlightedPolyline = null;
let isCleanFocusMode = false;

// Cache memory cuaca agar tidak berulang kali memanggil network di HP
const weatherCache = {};

// Pengaturan Tema
let currentTheme = localStorage.getItem('kai_gis_theme') || 'dark';

const INTERMODAL_CONFIG = {
  lrt: { label: "LRT", icon: "fa-train-subway", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  mrt: { label: "MRT", icon: "fa-train-subway", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  brt: { label: "Transjakarta / BRT", icon: "fa-bus", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  bus: { label: "Terminal Bus / Teman Bus", icon: "fa-bus-simple", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  krl: { label: "KRL Commuter", icon: "fa-train-subway", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  ferry: { label: "Pelabuhan Feri ASDP", icon: "fa-ship", color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  feeder: { label: "KA Feeder KCJB", icon: "fa-bolt", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  shuttle: { label: "Shuttle Kawasan", icon: "fa-van-shuttle", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  "airport-rail": { label: "KA Bandara", icon: "fa-plane-departure", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  "airport-plane": { label: "Bandara Internasional", icon: "fa-plane", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  angkot: { label: "Angkot / Mikrotrans", icon: "fa-car-side", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  "heritage-tour": { label: "KA Wisata Uap", icon: "fa-train", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
  "historical-site": { label: "Situs Sejarah", icon: "fa-monument", color: "bg-amber-800/20 text-amber-300 border-amber-800/30" }
};

const PIN_COLORS = {
  whoosh: '#dc2626',
  antarkota: '#2563eb',
  'krl-jabodetabek': '#06b6d4',
  'krl-jogja': '#10b981',
  'lokal-kci': '#f59e0b',
  'lokal-kai': '#a855f7',
  bandara: '#d97706',
  heritage: '#854d0e'
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
  applyTheme(currentTheme, false);
  initMap();
  initRailwayRoutes();
  initCivilLandmarks();
  initRouteFinderOptions();
  renderStationDirectory();
  updateStationMarkers();

  ['rightControlsBar', 'stationDrawer', 'toolsMenuDropdown', 'layerMenuDropdown'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      L.DomEvent.disableClickPropagation(el);
      L.DomEvent.disableScrollPropagation(el);
    }
  });

  if (window.innerWidth >= 1024 && typeof STATIONS_DATA !== 'undefined' && STATIONS_DATA.length > 0) {
    selectStation(STATIONS_DATA[0].id, false);
  }
});

// ========================================================
// SISTEM TEMA DUAL-MODE
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
  const themeIconMobile = document.getElementById('themeIconMobile');
  const canvasDesc = document.getElementById('canvasThemeDesc');

  if (theme === 'light') {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-indigo-600';
    if (themeIconMobile) themeIconMobile.className = 'fa-solid fa-moon text-indigo-600';
    if (canvasDesc) canvasDesc.innerText = 'Esri Light Canvas (Mode Siang Terang)';
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-amber-500';
    if (themeIconMobile) themeIconMobile.className = 'fa-solid fa-sun text-amber-500';
    if (canvasDesc) canvasDesc.innerText = 'Esri Dark Canvas (Mode Malam Gelap)';
  }

  if (updateBasemap && map && currentBasemapType === 'canvas-theme') {
    setBaseMap('canvas-theme');
  }

  renderStationDirectory();
}

// Inisialisasi Peta
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

  railwayOverlayLayer = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    opacity: 0.88
  });
  railwayOverlayLayer.addTo(map);

  setBaseMap('canvas-theme');

  map.on('click', () => {
    closeLayerMenu();
    closeToolsMenu();
  });
}

// Inisialisasi Polylines Jalur
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

    polyline.bindTooltip(`<b>${route.name}</b><br><span style="font-size:10px; opacity:0.8;">Klik untuk profil elevasi</span>`, {
      sticky: true,
      className: 'bg-slate-900 text-white rounded-lg px-2.5 py-1 text-xs border border-white/10 shadow-xl'
    });

    polyline.on('click', () => {
      openElevationWidget(key);
    });

    polyline.addTo(map);
    routeLayers[key] = polyline;
  });
}

// Inisialisasi Landmark Terowongan & Jembatan
function initCivilLandmarks() {
  if (typeof CIVIL_LANDMARKS === 'undefined') return;

  CIVIL_LANDMARKS.forEach(lm => {
    const icon = L.divIcon({
      className: 'landmark-marker-pin',
      html: `
        <div class="landmark-marker-icon" style="background: ${lm.color}; width: 24px; height: 24px; border: 2px solid #ffffff;">
          <i class="fa-solid ${lm.icon} text-[10px]"></i>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([lm.lat, lm.lng], { icon: icon });
    marker.landmarkType = lm.type;

    marker.bindTooltip(`
      <b style="color:${lm.color};">${lm.name}</b> (${lm.length})<br>
      <span style="font-size:10px; opacity:0.8;">${lm.location} • Tahun: ${lm.year}</span><br>
      <p style="font-size:10px; margin-top:3px; max-width:200px; line-height:1.3;">${lm.desc}</p>
    `, {
      direction: 'top',
      offset: [0, -12],
      className: 'bg-slate-900 text-white rounded-xl p-2.5 border border-white/10 text-xs shadow-2xl'
    });

    marker.addTo(map);
    landmarkMarkers.push(marker);
  });
}

function toggleLandmarkCategory(type, isChecked) {
  landmarkMarkers.forEach(m => {
    if (m.landmarkType === type) {
      if (isChecked) {
        if (!map.hasLayer(m)) map.addLayer(m);
      } else {
        if (map.hasLayer(m)) map.removeLayer(m);
      }
    }
  });
}

// ========================================================
// MODE TAMPILAN BERSIH (ZEN CLEAN FOCUS MODE)
// ========================================================
function toggleCleanFocusMode() {
  isCleanFocusMode = !isCleanFocusMode;
  const btn = document.getElementById('cleanModeBtn');

  if (isCleanFocusMode) {
    // Sembunyikan seluruh garis rute dan landmark
    toggleAllRoutes(false);
    toggleLandmarkCategory('tunnel', false);
    toggleLandmarkCategory('bridge', false);
    closeElevationWidget();

    const tChk = document.getElementById('tunnelOverlayToggle');
    const bChk = document.getElementById('bridgeOverlayToggle');
    if (tChk) tChk.checked = false;
    if (bChk) bChk.checked = false;

    if (btn) {
      btn.innerText = 'Matikan';
      btn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 text-white transition';
    }
  } else {
    // Kembalikan ke tampilan normal
    toggleAllRoutes(true);
    toggleLandmarkCategory('tunnel', true);
    toggleLandmarkCategory('bridge', true);

    const tChk = document.getElementById('tunnelOverlayToggle');
    const bChk = document.getElementById('bridgeOverlayToggle');
    if (tChk) tChk.checked = true;
    if (bChk) bChk.checked = true;

    if (btn) {
      btn.innerText = 'Aktifkan';
      btn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition';
    }
  }
}

// Basemap Switcher
function setBaseMap(type) {
  currentBasemapType = type;

  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer);
    currentBaseLayer = null;
  }

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

  if (railwayOverlayLayer && map.hasLayer(railwayOverlayLayer)) {
    railwayOverlayLayer.bringToFront();
  }
  Object.keys(routeLayers).forEach(key => {
    if (map.hasLayer(routeLayers[key])) routeLayers[key].bringToFront();
  });
}

function toggleRailOverlay(checked) {
  if (checked) {
    if (!map.hasLayer(railwayOverlayLayer)) {
      map.addLayer(railwayOverlayLayer);
      railwayOverlayLayer.bringToFront();
    }
  } else {
    if (map.hasLayer(railwayOverlayLayer)) map.removeLayer(railwayOverlayLayer);
  }
}

// Kontrol Dropdown Menus
function toggleToolsMenu(event) {
  if (event) event.stopPropagation();
  closeLayerMenu();
  const menu = document.getElementById('toolsMenuDropdown');
  if (menu) menu.classList.toggle('hidden');
}

function closeToolsMenu() {
  const menu = document.getElementById('toolsMenuDropdown');
  if (menu && !menu.classList.contains('hidden')) menu.classList.add('hidden');
}

function toggleLayerMenu(event) {
  if (event) event.stopPropagation();
  closeToolsMenu();
  const menu = document.getElementById('layerMenuDropdown');
  if (menu) menu.classList.toggle('hidden');
}

function closeLayerMenu() {
  const menu = document.getElementById('layerMenuDropdown');
  if (menu && !menu.classList.contains('hidden')) menu.classList.add('hidden');
}

function resetMapView() {
  if (!map) return;
  map.flyTo([-7.25, 110.15], 7, { duration: 1.0 });
}

function toggleRouteLayer(key, isChecked) {
  if (!routeLayers[key]) return;
  if (isChecked) {
    if (!map.hasLayer(routeLayers[key])) map.addLayer(routeLayers[key]);
  } else {
    if (map.hasLayer(routeLayers[key])) map.removeLayer(routeLayers[key]);
  }
}

function toggleAllRoutes(forceState) {
  Object.keys(routeLayers).forEach(key => {
    const checkbox = document.getElementById(`route-${key}`);
    if (checkbox) checkbox.checked = forceState;
    toggleRouteLayer(key, forceState);
  });
}

// ========================================================
// RUTE & TRANSIT FINDER
// ========================================================
function initRouteFinderOptions() {
  const originSel = document.getElementById('routeOriginSelect');
  const destSel = document.getElementById('routeDestSelect');
  if (!originSel || !destSel || typeof STATIONS_DATA === 'undefined') return;

  originSel.innerHTML = '';
  destSel.innerHTML = '';

  const activeStations = STATIONS_DATA.filter(s => !s.status.includes('Non-Aktif'));

  activeStations.forEach(s => {
    originSel.add(new Option(`${s.name} (${s.code}) - ${s.city}`, s.id));
    destSel.add(new Option(`${s.name} (${s.code}) - ${s.city}`, s.id));
  });

  originSel.value = "gmr";
  destSel.value = "sbi";
}

function toggleRouteFinderModal() {
  const modal = document.getElementById('routeFinderModal');
  modal.classList.toggle('hidden');
}

function calculateSelectedRoute() {
  const originId = document.getElementById('routeOriginSelect').value;
  const destId = document.getElementById('routeDestSelect').value;

  if (originId === destId) {
    alert("Silahkan pilih stasiun asal dan tujuan yang berbeda.");
    return;
  }

  const sOrigin = STATIONS_DATA.find(s => s.id === originId);
  const sDest = STATIONS_DATA.find(s => s.id === destId);
  if (!sOrigin || !sDest) return;

  const resultBox = document.getElementById('routeResultBox');
  resultBox.classList.remove('hidden');

  document.getElementById('resultRouteTitle').innerText = `${sOrigin.name} ➔ ${sDest.name}`;

  const distKm = Math.round(calcDistanceKm(sOrigin.lat, sOrigin.lng, sDest.lat, sDest.lng) * 1.25);
  document.getElementById('resultDistance').innerText = `± ${distKm} km`;

  let speedKmH = 80;
  if (sOrigin.category === 'whoosh' && sDest.category === 'whoosh') speedKmH = 250;
  else if (sOrigin.category.includes('krl') && sDest.category.includes('krl')) speedKmH = 45;

  const hours = Math.floor(distKm / speedKmH);
  const mins = Math.round(((distKm / speedKmH) - hours) * 60);
  document.getElementById('resultDuration').innerText = `~ ${hours > 0 ? hours + ' Jam ' : ''}${mins} Menit`;

  let transitInfo = "Langsung (Tanpa Transit)";
  if (sOrigin.category === 'krl-jabodetabek' && sDest.category === 'krl-jogja') {
    transitInfo = "Transit di Pasar Senen / Gambir (Menyambung KA Antarkota)";
  } else if (sOrigin.category === 'whoosh' && sDest.category !== 'whoosh') {
    transitInfo = "Transit di Stasiun Padalarang (Menyambung KA Feeder KCJB)";
  } else if (sOrigin.region !== sDest.region && !sOrigin.category.includes('antarkota')) {
    transitInfo = "Transit di Stasiun Sentral Manggarai";
  }
  document.getElementById('resultTransit').innerText = transitInfo;

  const trainBadges = document.getElementById('resultTrainBadges');
  trainBadges.innerHTML = '';
  let trains = ["KA Jarak Jauh Reguler", "Access by KAI"];
  if (sOrigin.category === 'whoosh' || sDest.category === 'whoosh') {
    trains = ["KCIC Whoosh G1200", "KA Feeder Padalarang"];
  } else if (sOrigin.category === 'krl-jabodetabek' || sDest.category === 'krl-jabodetabek') {
    trains = ["Commuter Line Bogor", "Commuter Line Cikarang Loop"];
  } else if (distKm > 400) {
    trains = ["Argo Bromo Anggrek", "Argo Wilis", "Bima Luxury", "Gajayana", "Jayabaya"];
  }
  trains.forEach(t => {
    const badge = document.createElement('span');
    badge.className = 'px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-semibold';
    badge.innerText = t;
    trainBadges.appendChild(badge);
  });

  activeHighlightedPolyline = [ [sOrigin.lat, sOrigin.lng], [sDest.lat, sDest.lng] ];
}

function highlightRouteOnMap() {
  if (!activeHighlightedPolyline || !map) return;
  toggleRouteFinderModal();

  map.fitBounds(activeHighlightedPolyline, { padding: [80, 80] });

  const tempLine = L.polyline(activeHighlightedPolyline, {
    color: '#f59e0b',
    weight: 6,
    dashArray: '10, 10',
    opacity: 0.95
  }).addTo(map);

  setTimeout(() => {
    map.removeLayer(tempLine);
  }, 10000);
}

function calcDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ========================================================
// PETA DIAGRAM SKEMATIK
// ========================================================
function toggleSchematicView() {
  const modal = document.getElementById('schematicModal');
  modal.classList.toggle('hidden');

  if (!modal.classList.contains('hidden')) {
    renderSchematicDiagram();
  }
}

function renderSchematicDiagram() {
  const container = document.getElementById('schematicDiagramContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="flex items-center gap-2 mb-2 font-bold text-red-400 text-xs md:text-sm">
          <span class="w-3 h-3 rounded-full bg-red-600"></span>
          <span>KORIDOR KERETA CEPAT WHOOSH (142 KM)</span>
        </div>
        <div class="flex items-center justify-between relative py-3 overflow-x-auto no-scrollbar">
          <div class="absolute left-0 right-0 h-2 bg-red-600 rounded-full z-0 top-1/2 -translate-y-1/2"></div>
          ${renderSchematicNodes([
            { name: "Halim", code: "HLM", transit: "LRT" },
            { name: "Karawang", code: "KRW" },
            { name: "Padalarang", code: "PDL", transit: "Feeder" },
            { name: "Tegalluar", code: "TGL", transit: "Shuttle" }
          ], '#ef4444')}
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-2 font-bold text-cyan-400 text-xs md:text-sm">
          <span class="w-3 h-3 rounded-full bg-cyan-500"></span>
          <span>COMMUTER LINE BOGOR (JAKARTA KOTA - BOGOR)</span>
        </div>
        <div class="flex items-center justify-between relative py-3 overflow-x-auto no-scrollbar">
          <div class="absolute left-0 right-0 h-2 bg-cyan-500 rounded-full z-0 top-1/2 -translate-y-1/2"></div>
          ${renderSchematicNodes([
            { name: "Jakarta Kota", code: "JAKK" },
            { name: "Juanda", code: "JUA", transit: "BRT" },
            { name: "Manggarai", code: "MRI", transit: "Sentral Hub" },
            { name: "Cawang", code: "CW", transit: "LRT" },
            { name: "Depok", code: "DP" },
            { name: "Bojonggede", code: "BJD" },
            { name: "Bogor", code: "BOO", transit: "Biskita" }
          ], '#06b6d4')}
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-2 font-bold text-emerald-400 text-xs md:text-sm">
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>COMMUTER LINE YOGYAKARTA - SOLO BALAPAN - PALUR</span>
        </div>
        <div class="flex items-center justify-between relative py-3 overflow-x-auto no-scrollbar">
          <div class="absolute left-0 right-0 h-2 bg-emerald-500 rounded-full z-0 top-1/2 -translate-y-1/2"></div>
          ${renderSchematicNodes([
            { name: "Yogyakarta", code: "YK", transit: "KA Bandara" },
            { name: "Lempuyangan", code: "LPN" },
            { name: "Maguwo", code: "MGW", transit: "Bandara" },
            { name: "Klaten", code: "KT" },
            { name: "Purwosari", code: "PWS" },
            { name: "Solo Balapan", code: "SLO", transit: "Terminal Bus" },
            { name: "Palur", code: "PL" }
          ], '#10b981')}
        </div>
      </div>
    </div>
  `;
}

function renderSchematicNodes(nodes, color) {
  return nodes.map(n => `
    <div class="relative z-10 flex flex-col items-center cursor-pointer group bg-slate-900/90 p-2 rounded-xl border border-white/10 shrink-0 min-w-[90px]">
      <div class="w-4 h-4 rounded-full border-2 border-white shadow" style="background: ${color}"></div>
      <span class="font-bold text-xs text-white mt-1.5">${n.name}</span>
      <span class="text-[9px] font-mono text-amber-400">${n.code}</span>
      ${n.transit ? `<span class="mt-1 px-1.5 py-0.2 rounded text-[8px] bg-white/20 text-slate-200 font-semibold">${n.transit}</span>` : ''}
    </div>
  `).join('');
}

// ========================================================
// WIDGET PROFIL ELEVASI (SVG)
// ========================================================
function openElevationWidget(routeKey) {
  const route = RAILWAY_ROUTES[routeKey];
  if (!route || !route.elevations) return;

  const widget = document.getElementById('elevationProfileWidget');
  widget.classList.remove('hidden');

  document.getElementById('elevationRouteName').innerText = `Profil Elevasi: ${route.name}`;

  const minElev = Math.min(...route.elevations);
  const maxElev = Math.max(...route.elevations);
  document.getElementById('elevationMinLabel').innerText = `Min: ${minElev} mdpl`;
  document.getElementById('elevationMaxLabel').innerText = `Max: ${maxElev} mdpl`;

  renderSvgElevationChart(route);
}

function closeElevationWidget() {
  const widget = document.getElementById('elevationProfileWidget');
  widget.classList.add('hidden');
}

function renderSvgElevationChart(route) {
  const container = document.getElementById('elevationChartContainer');
  const w = container.clientWidth || 500;
  const h = container.clientHeight || 120;
  const pad = 25;

  const min = Math.min(...route.elevations);
  const max = Math.max(...route.elevations);
  const range = (max - min) || 1;

  const pts = route.elevations.map((elev, idx) => {
    const x = pad + (idx / (route.elevations.length - 1)) * (w - 2 * pad);
    const y = (h - pad) - ((elev - min) / range) * (h - 2 * pad);
    return { x, y, elev, name: route.stations[idx] };
  });

  const pathD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${h - pad} L ${pts[0].x} ${h - pad} Z`;

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" class="overflow-visible">
      <defs>
        <linearGradient id="elevGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#elevGrad)"/>
      <path d="${pathD}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      ${pts.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ffffff" stroke="#f59e0b" stroke-width="2.5" class="cursor-pointer hover:scale-150 transition" 
          onmouseover="showElevationScrub('${p.name}', ${p.elev})"
        />
        <text x="${p.x}" y="${h - 5}" font-size="9" fill="#94a3b8" text-anchor="middle">${p.name}</text>
      `).join('')}
    </svg>
  `;
}

function showElevationScrub(name, elev) {
  const scrubEl = document.getElementById('elevationScrubInfo');
  if (scrubEl) scrubEl.innerText = `Stasiun ${name}: ${elev} mdpl`;
}

// ========================================================
// CUACA REAL-TIME (DENGAN CACHING HEMAT MEMORI)
// ========================================================
async function fetchStationWeather(lat, lng) {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const tempEl = document.getElementById('weatherTemp');
  const condEl = document.getElementById('weatherCondition');
  const iconEl = document.getElementById('weatherIcon');

  if (weatherCache[cacheKey]) {
    applyWeatherData(weatherCache[cacheKey]);
    return;
  }

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
    const data = await res.json();
    if (data && data.current_weather) {
      weatherCache[cacheKey] = data.current_weather;
      applyWeatherData(data.current_weather);
    }
  } catch (err) {
    tempEl.innerText = "Cuaca Normal";
    condEl.innerText = "Data tersimpan offline";
  }
}

function applyWeatherData(cw) {
  const tempEl = document.getElementById('weatherTemp');
  const condEl = document.getElementById('weatherCondition');
  const iconEl = document.getElementById('weatherIcon');

  tempEl.innerText = `${cw.temperature}°C`;
  const code = cw.weathercode;
  if (code === 0) {
    condEl.innerText = "Cerah Berawan";
    iconEl.innerHTML = `<i class="fa-solid fa-sun text-amber-500"></i>`;
  } else if (code <= 3) {
    condEl.innerText = "Berawan";
    iconEl.innerHTML = `<i class="fa-solid fa-cloud text-slate-400"></i>`;
  } else if (code <= 67) {
    condEl.innerText = "Hujan Ringan";
    iconEl.innerHTML = `<i class="fa-solid fa-cloud-rain text-blue-400"></i>`;
  } else {
    condEl.innerText = "Hujan Deras";
    iconEl.innerHTML = `<i class="fa-solid fa-cloud-bolt text-indigo-400"></i>`;
  }
}

// ========================================================
// FOTO BEFORE / AFTER HERITAGE
// ========================================================
let currentActiveStationHeritage = null;

function setupHeritagePhotoSwitch(station) {
  const switchBox = document.getElementById('drawerHeritageSwitch');
  currentActiveStationHeritage = station;

  if (station.pastImage) {
    switchBox.classList.remove('hidden');
    switchHeritagePhoto('now');
  } else {
    switchBox.classList.add('hidden');
  }
}

function switchHeritagePhoto(type) {
  if (!currentActiveStationHeritage) return;
  const imgEl = document.getElementById('drawerImage');
  const btnNow = document.getElementById('btnPhotoNow');
  const btnPast = document.getElementById('btnPhotoPast');

  if (type === 'past') {
    imgEl.src = currentActiveStationHeritage.pastImage;
    btnPast.className = 'px-2 py-0.5 rounded bg-amber-600 text-white';
    btnNow.className = 'px-2 py-0.5 rounded text-slate-300 hover:text-white';
  } else {
    imgEl.src = currentActiveStationHeritage.image;
    btnNow.className = 'px-2 py-0.5 rounded bg-amber-600 text-white';
    btnPast.className = 'px-2 py-0.5 rounded text-slate-300 hover:text-white';
  }
}

// ========================================================
// PENGENDALI DIREKTORI & DRAWER DETAIL
// ========================================================
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
      if (window.innerWidth < 768) toggleMobileSidebar();
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
    map.flyTo([station.lat, station.lng], 14, { duration: 1.0, easeLinearity: 0.25 });
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

  const badgeType = document.getElementById('drawerBadgeType');
  badgeType.innerText = station.type;
  badgeType.style.backgroundColor = `${PIN_COLORS[station.category]}20`;
  badgeType.style.color = PIN_COLORS[station.category];

  const badgeStatus = document.getElementById('drawerBadgeStatus');
  badgeStatus.innerText = station.status;
  badgeStatus.className = station.status.includes('Aktif')
    ? 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    : 'text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30';

  const drawerImg = document.getElementById('drawerImage');
  drawerImg.src = station.image;
  setupHeritagePhotoSwitch(station);

  fetchStationWeather(station.lat, station.lng);

  const intermodalContainer = document.getElementById('drawerIntermodalBadges');
  intermodalContainer.innerHTML = '';
  if (station.intermodal && station.intermodal.length > 0) {
    station.intermodal.forEach(key => {
      const cfg = INTERMODAL_CONFIG[key];
      if (cfg) {
        const badge = document.createElement('span');
        badge.className = `px-2 py-0.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${cfg.color}`;
        badge.innerHTML = `<i class="fa-solid ${cfg.icon}"></i> ${cfg.label}`;
        intermodalContainer.appendChild(badge);
      }
    });
  } else {
    intermodalContainer.innerHTML = `<span class="text-xs text-slate-400">Akses langsung transportasi lokal & taksi</span>`;
  }

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
}

function closeStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  if (drawer) {
    drawer.classList.remove('drawer-active');
    document.body.classList.remove('drawer-is-open');
  }
  activeStationId = null;
  document.querySelectorAll('.station-marker-icon').forEach(el => el.classList.remove('pin-selected'));
  renderStationDirectory();
}

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
  if (countEl) countEl.innerText = `${stations.length} Titik`;
}

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
  if (val && val.length > 0) clearBtn.classList.remove('hidden');
  else clearBtn.classList.add('hidden');

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
