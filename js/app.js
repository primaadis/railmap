// ==========================================
// 1. INIT PETA LEAFLET (DIBATASI HANYA JAWA & SUMATERA)
// ==========================================
const indonesiaBounds = [
  [-11.5, 94.5], // Sudut Barat Daya (Selatan Jawa / Barat Sumatera)
  [6.5, 116.5]   // Sudut Timur Laut (Aceh / Selat Bali)
];

const map = L.map('map', {
  center: [-6.9, 109.5],
  zoom: 7,
  minZoom: 5,
  maxZoom: 18,
  maxBounds: indonesiaBounds,
  maxBoundsViscosity: 1.0, // Mengunci agar peta tidak keluar wilayah
  zoomControl: false
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

// ==========================================
// 2. LAYER BASEMAP (BEBAS TOKEN API)
// ==========================================
const baseLayers = {
  // Mode Fokus Rel (Kanvas Polos Abu-abu Esri Tanpa Label Jalan)
  trackonly: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    bounds: indonesiaBounds,
    attribution: '© Esri Canvas'
  }),
  // Mode Standar (OpenStreetMap)
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    bounds: indonesiaBounds,
    attribution: '© OpenStreetMap'
  }),
  // Mode Citra Satelit (Esri World Imagery)
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    bounds: indonesiaBounds,
    attribution: 'Tiles © Esri'
  })
};

// Layer Jalur Rel Resmi Sedunia (OpenRailwayMap)
const railwayOverlay = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  bounds: indonesiaBounds,
  attribution: 'Rel © OpenRailwayMap'
});

// Default Mode: Fokus Jalur Rel
let activeBaseLayer = baseLayers.trackonly;
activeBaseLayer.addTo(map);
railwayOverlay.addTo(map);

function setBaseMap(mode) {
  map.removeLayer(activeBaseLayer);
  activeBaseLayer = baseLayers[mode];
  activeBaseLayer.addTo(map);

  if (map.hasLayer(railwayOverlay)) {
    railwayOverlay.bringToFront();
  }

  // Update Tampilan Tombol
  const btnTrack = document.getElementById('btn-mode-trackonly');
  const checkTrack = document.getElementById('check-trackonly');
  if (mode === 'trackonly') {
    btnTrack.className = "w-full mb-2 p-2 rounded-lg border text-left flex items-center justify-between bg-orange-50 border-orange-400 font-bold text-orange-950";
    checkTrack.classList.remove('hidden');
  } else {
    btnTrack.className = "w-full mb-2 p-2 rounded-lg border text-left flex items-center justify-between bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
    checkTrack.classList.add('hidden');
  }
}

function toggleRailOverlay(isChecked) {
  if (isChecked) {
    map.addLayer(railwayOverlay);
    railwayOverlay.bringToFront();
  } else {
    map.removeLayer(railwayOverlay);
  }
}

// ==========================================
// 3. RENDER STASIUN KE PETA & SIDEBAR
// ==========================================
const stationMarkerGroup = L.layerGroup().addTo(map);
const stationListContainer = document.getElementById('stationListContainer');

function createStationIcon(code) {
  return L.divIcon({
    className: 'station-marker',
    html: `
      <div class="flex flex-col items-center cursor-pointer">
        <div class="w-7 h-7 rounded-full bg-slate-900 border-2 border-orange-500 shadow-md flex items-center justify-center text-white text-[10px] font-bold">
          <i class="fa-solid fa-train-subway text-orange-400"></i>
        </div>
        <span class="bg-slate-900/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap border border-slate-700">
          ${code}
        </span>
      </div>
    `,
    iconSize: [28, 42],
    iconAnchor: [14, 21]
  });
}

stationsData.forEach(stn => {
  // Marker di Peta
  const marker = L.marker(stn.coords, { icon: createStationIcon(stn.id) });
  marker.on('click', () => openStationDrawer(stn));
  marker.addTo(stationMarkerGroup);

  // Card di Sidebar
  const card = document.createElement('div');
  card.className = "p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-orange-400 hover:bg-orange-50/60 cursor-pointer transition";
  card.onclick = () => {
    map.flyTo(stn.coords, 14, { duration: 1.2 });
    openStationDrawer(stn);
  };
  card.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-bold text-xs text-slate-800">${stn.name}</span>
      <span class="text-[9px] text-orange-700 bg-orange-100 font-bold px-1.5 py-0.5 rounded">${stn.id}</span>
    </div>
    <p class="text-[10px] text-slate-500">${stn.region} • ${stn.city}</p>
  `;
  stationListContainer.appendChild(card);
});

// ==========================================
// 4. ANIMASI MINI CARTOON TRAIN (OPT-IN)
// ==========================================
const trainMarkerGroup = L.layerGroup(); // Tidak langsung dimasukkan ke map (Default: Off)
let trainInstances = [];
let trainAnimationTimer = null;

// Template SVG Kartun Kereta Lucu Mini
function createCuteCartoonTrainIcon(train) {
  return L.divIcon({
    className: 'mini-train-icon-wrapper',
    html: `
      <div class="mini-train-container">
        <div class="smoke-cloud"></div>
        <svg viewBox="0 0 40 28" class="mini-train-svg">
          <!-- Badan Lokomotif Chibi -->
          <rect x="4" y="6" width="28" height="15" rx="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <rect x="22" y="3" width="10" height="7" rx="2" fill="#c2410c"/>
          <!-- Jendela Kabin -->
          <circle cx="10" cy="13" r="2.5" fill="#ffffff"/>
          <circle cx="17" cy="13" r="2.5" fill="#ffffff"/>
          <rect x="24" y="8" width="6" height="5" rx="1" fill="#bae6fd"/>
          <!-- Lampu Depan Menyala -->
          <circle cx="4" cy="15" r="2" fill="#fde047"/>
          <!-- Roda Kereta Mini -->
          <circle cx="9" cy="22" r="3" fill="#1e293b" stroke="#ffffff" stroke-width="1"/>
          <circle cx="19" cy="22" r="3" fill="#1e293b" stroke="#ffffff" stroke-width="1"/>
          <circle cx="28" cy="22" r="3" fill="#1e293b" stroke="#ffffff" stroke-width="1"/>
        </svg>
        <div class="mini-train-label">${train.name}</div>
      </div>
    `,
    iconSize: [34, 30],
    iconAnchor: [17, 15]
  });
}

// Inisialisasi Armada Kereta
trainsScheduleData.forEach(train => {
  const marker = L.marker(train.waypoints[0], { icon: createCuteCartoonTrainIcon(train) });
  
  marker.bindPopup(`
    <div class="p-1 text-xs">
      <span class="bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded text-[10px]">${train.id}</span>
      <h4 class="font-bold text-slate-800 text-sm mt-1">${train.name}</h4>
      <p class="text-slate-500 text-[11px]">${train.route}</p>
      <div class="border-t mt-1.5 pt-1 space-y-0.5 text-slate-600">
        <div>Jadwal: <b>${train.depTime} - ${train.arrTime} WIB</b></div>
        <div>Tipe: <b>${train.type}</b> (${train.speed})</div>
      </div>
    </div>
  `);

  trainInstances.push({
    train: train,
    marker: marker,
    currentStep: 0
  });
});

// Interpolasi koordinat di sepanjang waypoints lintasan rel
function interpolatePath(waypoints, progress) {
  const segments = waypoints.length - 1;
  const scaled = progress * segments;
  const index = Math.floor(scaled);
  const frac = scaled - index;

  if (index >= segments) return waypoints[segments];

  const p1 = waypoints[index];
  const p2 = waypoints[index + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * frac;
  const lng = p1[1] + (p2[1] - p1[1]) * frac;
  return [lat, lng];
}

// Engine Pergerakan Kereta
function runTrainLoop() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Update display jam di panel kontrol
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
  document.getElementById('clockDisplay').innerText = timeStr;

  const onlyActive = document.getElementById('onlyActiveHoursCheckbox').checked;
  let activeCount = 0;

  trainInstances.forEach(item => {
    const isRunning = isTrainCurrentlyRunning(item.train, currentMinutes);
    
    if (isRunning) {
      activeCount++;
      // Hitung posisi proporsional tepat berdasarkan jam sekarang
      const progress = calculateTrainProgress(item.train, currentMinutes);
      const coord = interpolatePath(item.train.waypoints, progress);
      item.marker.setLatLng(coord);

      if (!trainMarkerGroup.hasLayer(item.marker)) {
        trainMarkerGroup.addLayer(item.marker);
      }
    } else {
      if (onlyActive) {
        if (trainMarkerGroup.hasLayer(item.marker)) {
          trainMarkerGroup.removeLayer(item.marker);
        }
      } else {
        // Jika opsi "Hanya KA Jam Ini" dimatikan, tampilkan kereta berpatroli simulasi
        item.currentStep = (item.currentStep + 0.002) % 1.0;
        const coord = interpolatePath(item.train.waypoints, item.currentStep);
        item.marker.setLatLng(coord);
        if (!trainMarkerGroup.hasLayer(item.marker)) {
          trainMarkerGroup.addLayer(item.marker);
        }
      }
    }
  });

  document.getElementById('trainStatusIndicator').innerText = `${activeCount} KA Sedang Berjalan`;
}

// Kontrol Toggle Live Train Menu
function toggleLiveTrainMenu(isTurnedOn) {
  const panel = document.getElementById('trainFilterPanel');
  if (isTurnedOn) {
    panel.classList.remove('hidden');
    map.addLayer(trainMarkerGroup);
    runTrainLoop();
    trainAnimationTimer = setInterval(runTrainLoop, 1500);
  } else {
    panel.classList.add('hidden');
    map.removeLayer(trainMarkerGroup);
    if (trainAnimationTimer) clearInterval(trainAnimationTimer);
  }
}

function updateTrainVisibility() {
  runTrainLoop();
}

// ==========================================
// 5. DRAWER DETAIL STASIUN
// ==========================================
function openStationDrawer(stn) {
  document.getElementById('drawerBadge').innerText = stn.region;
  document.getElementById('drawerTitle').innerText = stn.name;
  document.getElementById('drawerCity').innerText = `${stn.city} • ${stn.region}`;
  document.getElementById('drawerImage').src = stn.image;
  document.getElementById('drawerImagePath').innerText = stn.image;
  document.getElementById('drawerReview').innerText = stn.review;
  document.getElementById('drawerLayoutGuide').innerText = stn.layoutGuide;
  document.getElementById('drawerLayoutLink').href = `https://www.google.com/maps/search/?api=1&query=${stn.mapsQuery}`;

  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  stn.facilities.forEach(fac => {
    const item = document.createElement('div');
    item.className = "p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700 flex items-center gap-1.5";
    item.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i> <span class="text-[11px]">${fac}</span>`;
    facContainer.appendChild(item);
  });

  document.getElementById('stationDrawer').classList.add('drawer-open');
}

function closeStationDrawer() {
  document.getElementById('stationDrawer').classList.remove('drawer-open');
}

function flyToRegion(coords, zoom) {
  closeStationDrawer();
  map.flyTo(coords, zoom, { duration: 1.3 });
}

// Pencarian Stasiun di Sidebar
function handleStationSearch(val) {
  const q = val.toLowerCase();
  stationsData.forEach((stn, index) => {
    const isMatch = stn.name.toLowerCase().includes(q) || 
                    stn.city.toLowerCase().includes(q) || 
                    stn.region.toLowerCase().includes(q) ||
                    stn.id.toLowerCase().includes(q);

    if (stationListContainer.children[index + 1]) {
      stationListContainer.children[index + 1].style.display = isMatch ? 'block' : 'none';
    }
  });
}
