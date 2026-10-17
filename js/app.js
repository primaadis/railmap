// ========================================================
// 1. INISIALISASI PETA LEAFLET (PETA UTUH TANPA POTONGAN)
// ========================================================
const map = L.map('map', {
  center: [-4.0, 108.0], // Fokus awal di antara Jawa & Sumatera
  zoom: 6,
  minZoom: 3,            // Bebas zoom out penuh
  maxZoom: 19,           // Zoom mendetail hingga level bantalan rel
  zoomControl: false     // Pindah ke posisi kanan bawah
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

// ========================================================
// 2. LAYER BASEMAP RESMI & BEBAS ERROR TOKEN API
// ========================================================
const baseLayers = {
  // Mode Rel Bersih (Fokus Operasional CS - Latar Abu-abu Polos)
  trackonly: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: '© Esri Canvas'
  }),
  // Mode Standar (OpenStreetMap)
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }),
  // Mode Citra Satelit Esri Asli
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles © Esri'
  })
};

// Layer Detail Rel Kereta Global (OpenRailwayMap)
const railwayOverlay = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Rel © OpenRailwayMap'
});

// Default Mode: Fokus Rel Bersih + Overlay ORM
let currentBase = baseLayers.trackonly;
currentBase.addTo(map);
railwayOverlay.addTo(map);

function setBaseMap(modeKey) {
  map.removeLayer(currentBase);
  currentBase = baseLayers[modeKey];
  currentBase.addTo(map);

  if (map.hasLayer(railwayOverlay)) {
    railwayOverlay.bringToFront();
  }

  // Update Visual Tombol Aktif
  const btnTrack = document.getElementById('btn-mode-trackonly');
  const checkTrack = document.getElementById('check-trackonly');
  if (modeKey === 'trackonly') {
    btnTrack.className = "w-full mb-2 p-2 rounded-xl border text-left flex items-center justify-between bg-cyan-950/60 border-cyan-500/80 text-cyan-300 font-bold transition";
    checkTrack.classList.remove('hidden');
  } else {
    btnTrack.className = "w-full mb-2 p-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 text-left flex items-center justify-between transition";
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

// ========================================================
// 3. RENDER STASIUN TERSTRUKTUR DAOP 1 - DIVRE IV
// ========================================================
const markersLayer = L.layerGroup().addTo(map);
const listContainer = document.getElementById('stationListContainer');
let activeMarkerList = [];

// Desain Pin Marker Stasiun Futuristik
function createFuturisticPin(code) {
  return L.divIcon({
    className: 'station-pin',
    html: `
      <div class="flex flex-col items-center cursor-pointer">
        <div class="w-8 h-8 rounded-xl bg-slate-950/90 border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
          <i class="fa-solid fa-train"></i>
        </div>
        <span class="bg-slate-900/95 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded-md shadow-md mt-1 border border-slate-700 tracking-wider">
          ${code}
        </span>
      </div>
    `,
    iconSize: [32, 48],
    iconAnchor: [16, 24]
  });
}

// Fungsi Render Daftar Berkelompok (Grouped by Daop/Divre)
function renderStationList(filteredData) {
  listContainer.innerHTML = '';
  markersLayer.clearLayers();
  activeMarkerList = [];

  document.getElementById('stationCountDisplay').innerText = `${filteredData.length} Titik`;

  if (filteredData.length === 0) {
    listContainer.innerHTML = `
      <div class="p-6 text-center text-slate-500 text-xs">
        <i class="fa-solid fa-circle-question text-2xl mb-2 text-slate-600 block"></i>
        Tidak ada stasiun yang cocok dengan filter atau kata kunci.
      </div>
    `;
    return;
  }

  // Mengelompokkan stasiun berdasarkan Region (Daop / Divre)
  const grouped = {};
  filteredData.forEach(stn => {
    if (!grouped[stn.region]) grouped[stn.region] = [];
    grouped[stn.region].push(stn);
  });

  // Render per grup Daop/Divre
  Object.keys(grouped).forEach(regionName => {
    const groupWrapper = document.createElement('div');
    groupWrapper.className = "space-y-1.5";

    const header = document.createElement('div');
    header.className = "text-[10px] uppercase font-bold tracking-wider text-cyan-400/90 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/80 flex justify-between items-center";
    header.innerHTML = `
      <span><i class="fa-solid fa-building-columns mr-1 text-[9px]"></i> ${regionName}</span>
      <span class="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">${grouped[regionName].length} Stasiun</span>
    `;
    groupWrapper.appendChild(header);

    grouped[regionName].forEach(stn => {
      // Marker Peta
      const marker = L.marker(stn.coords, { icon: createFuturisticPin(stn.id) });
      marker.on('click', () => openDrawer(stn));
      marker.addTo(markersLayer);
      activeMarkerList.push({ stn, marker });

      // Kartu Stasiun di Sidebar
      const card = document.createElement('div');
      card.className = "p-2.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group";
      card.onclick = () => {
        map.flyTo(stn.coords, 14, { duration: 1.4 });
        openDrawer(stn);
      };

      card.innerHTML = `
        <div class="truncate mr-2">
          <div class="font-bold text-xs text-slate-200 group-hover:text-cyan-300 transition truncate">${stn.name}</div>
          <div class="text-[10px] text-slate-500 mt-0.5 truncate">${stn.city} • <span class="font-mono text-cyan-400/80">${stn.altitude} mdpl</span></div>
        </div>
        <div class="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center shrink-0 border border-slate-700/60 transition">
          <i class="fa-solid fa-angle-right text-xs"></i>
        </div>
      `;
      groupWrapper.appendChild(card);
    });

    listContainer.appendChild(groupWrapper);
  });
}

// Inisialisasi awal render semua stasiun
renderStationList(stationsData);

// ========================================================
// 4. FILTER WILAYAH & PENCARIAN STASIUN
// ========================================================
let currentFilterRegion = "ALL";
let currentSearchQuery = "";

function applyCombinedFilters() {
  const filtered = stationsData.filter(stn => {
    const matchRegion = (currentFilterRegion === "ALL") || (stn.region === currentFilterRegion);
    const q = currentSearchQuery.toLowerCase();
    const matchSearch = stn.name.toLowerCase().includes(q) ||
                        stn.id.toLowerCase().includes(q) ||
                        stn.city.toLowerCase().includes(q) ||
                        stn.region.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  renderStationList(filtered);

  // Jika hasil filter hanya 1 stasiun (misal pencarian spesifik), langsung arahkan kamera
  if (filtered.length === 1) {
    map.flyTo(filtered[0].coords, 13, { duration: 1.2 });
  }
}

function handleRegionFilter(regionValue) {
  currentFilterRegion = regionValue;
  applyCombinedFilters();

  // Otomatis arahkan pandangan kamera ke stasiun pertama di Daop tersebut
  if (regionValue !== "ALL") {
    const firstInRegion = stationsData.find(s => s.region === regionValue);
    if (firstInRegion) {
      map.flyTo(firstInRegion.coords, 10, { duration: 1.5 });
    }
  }
}

function handleSearch(query) {
  currentSearchQuery = query;
  const clearBtn = document.getElementById('clearSearchBtn');
  if (query.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
  applyCombinedFilters();
}

function clearSearch() {
  const searchInput = document.getElementById('stationSearch');
  searchInput.value = '';
  handleSearch('');
}

// ========================================================
// 5. DRAWER DETAIL & REVIEW STASIUN
// ========================================================
function openDrawer(stn) {
  document.getElementById('drawerBadge').innerText = stn.region;
  document.getElementById('drawerTitle').innerText = stn.name;
  document.getElementById('drawerCity').innerText = `${stn.city} • ${stn.region}`;
  document.getElementById('drawerAltitude').innerText = `Ketinggian: ${stn.altitude} mdpl`;
  document.getElementById('drawerImage').src = stn.image;
  document.getElementById('drawerFileRef').innerText = stn.image;
  document.getElementById('drawerReview').innerText = stn.review;
  document.getElementById('drawerLayoutGuide').innerText = stn.layoutGuide;
  document.getElementById('drawerLayoutLink').href = `https://www.google.com/maps/search/?api=1&query=${stn.mapsQuery}`;

  // Fasilitas
  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  stn.facilities.forEach(fac => {
    const badge = document.createElement('div');
    badge.className = "p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2";
    badge.innerHTML = `<i class="fa-solid fa-circle-check text-cyan-400 text-xs shrink-0"></i> <span class="text-[11px] leading-tight">${fac}</span>`;
    facContainer.appendChild(badge);
  });

  document.getElementById('stationDrawer').classList.add('drawer-open');
}

function closeDrawer() {
  document.getElementById('stationDrawer').classList.remove('drawer-open');
}
