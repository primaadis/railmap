// ========================================================
// 1. INISIALISASI PETA LEAFLET INTERAKTIF (MOBILE & DESKTOP)
// ========================================================
const map = L.map('map', {
  center: [-6.8, 108.5],
  zoom: 6,
  minZoom: 3,
  maxZoom: 19,
  zoomControl: false
});

// Pindahkan Zoom Control ke pojok kanan bawah
L.control.zoom({ position: 'bottomright' }).addTo(map);

// ========================================================
// 2. LAYER BASEMAP RESMI & BEBAS ERROR TOKEN API
// ========================================================
const baseLayers = {
  // Mode Rel Bersih (Minimalis Kontras Tanpa Nama Jalan)
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

// Overlay Jalur Rel OpenRailwayMap (ORM)
const railwayOverlay = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Rel © OpenRailwayMap'
});

// Default: Mode Fokus Rel Bersih
let activeBaseLayer = baseLayers.trackonly;
activeBaseLayer.addTo(map);
railwayOverlay.addTo(map);

function setBaseMap(modeKey) {
  map.removeLayer(activeBaseLayer);
  activeBaseLayer = baseLayers[modeKey];
  activeBaseLayer.addTo(map);

  if (map.hasLayer(railwayOverlay)) {
    railwayOverlay.bringToFront();
  }

  // Update Visual Tombol
  const btnTrack = document.getElementById('btn-trackonly');
  const checkTrack = document.getElementById('check-trackonly');
  if (modeKey === 'trackonly') {
    btnTrack.className = "w-full p-2 rounded-xl border text-left flex items-center justify-between bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold transition";
    checkTrack.classList.remove('hidden');
  } else {
    btnTrack.className = "w-full p-2 rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 hover:bg-slate-800 text-left flex items-center justify-between transition";
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

function toggleLayerMenu() {
  const menu = document.getElementById('layerMenuDropdown');
  menu.classList.toggle('hidden');
}

// ========================================================
// 3. COLOR CODE & SVG MARKER STASIUN ESTETIK
// ========================================================
function getCategoryTheme(category, status) {
  if (status === 'inactive' || category === 'heritage') {
    return {
      bg: 'bg-stone-800',
      border: 'border-amber-700/80',
      text: 'text-amber-500',
      icon: 'fa-landmark-dome',
      badge: 'Jalur Sejarah',
      badgeColor: 'bg-stone-800 text-amber-400 border-amber-800/80'
    };
  }

  switch(category) {
    case 'whoosh':
      return {
        bg: 'bg-rose-950',
        border: 'border-rose-500',
        text: 'text-rose-400',
        icon: 'fa-bolt-lightning',
        badge: 'Whoosh 350 km/h',
        badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
      };
    case 'bandara':
      return {
        bg: 'bg-amber-950',
        border: 'border-amber-400',
        text: 'text-amber-300',
        icon: 'fa-plane-departure',
        badge: 'Bandara / Feeder',
        badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
      };
    case 'commuter':
      return {
        bg: 'bg-cyan-950',
        border: 'border-cyan-400',
        text: 'text-cyan-300',
        icon: 'fa-train-tram',
        badge: 'KRL / Lokal',
        badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800'
      };
    default: // antarkota
      return {
        bg: 'bg-blue-950',
        border: 'border-blue-400',
        text: 'text-blue-300',
        icon: 'fa-train',
        badge: 'KA Antarkota',
        badgeColor: 'bg-blue-950 text-blue-300 border-blue-800'
      };
  }
}

function createCinematicPin(stn) {
  const theme = getCategoryTheme(stn.category, stn.status);
  const isHistory = stn.status === 'inactive';

  return L.divIcon({
    className: 'custom-station-pin',
    html: `
      <div class="flex flex-col items-center cursor-pointer">
        <div class="w-7 h-7 rounded-full ${theme.bg} border-2 ${theme.border} shadow-lg shadow-black/80 flex items-center justify-center ${theme.text} text-[10px]">
          <i class="fa-solid ${theme.icon}"></i>
        </div>
        <span class="${isHistory ? 'bg-stone-900 text-stone-300 border-stone-700' : 'bg-slate-900/90 text-white border-white/10'} font-mono font-bold text-[8px] px-1.5 py-0.2 rounded shadow mt-0.5 border tracking-wider whitespace-nowrap">
          ${stn.id}
        </span>
      </div>
    `,
    iconSize: [28, 42],
    iconAnchor: [14, 21]
  });
}

// ========================================================
// 4. FILTERING & DIREKTORI STASIUN
// ========================================================
const markersGroup = L.layerGroup().addTo(map);
const listContainer = document.getElementById('stationListContainer');

let selectedCategory = 'all';
let selectedRegion = 'ALL';
let searchQuery = '';

function renderDirectory(stations) {
  listContainer.innerHTML = '';
  markersGroup.clearLayers();

  document.getElementById('stationCountDisplay').innerText = `${stations.length} Titik`;

  if (stations.length === 0) {
    listContainer.innerHTML = `
      <div class="p-6 text-center text-slate-500 text-xs">
        <i class="fa-solid fa-train-slash text-2xl mb-2 text-slate-600 block"></i>
        Tidak ditemukan stasiun sesuai kriteria filter.
      </div>
    `;
    return;
  }

  // Kelompokkan per Region
  const groups = {};
  stations.forEach(stn => {
    if (!groups[stn.region]) groups[stn.region] = [];
    groups[stn.region].push(stn);
  });

  Object.keys(groups).forEach(reg => {
    const section = document.createElement('div');
    section.className = "space-y-1.5";

    const header = document.createElement('div');
    header.className = "text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5 flex justify-between items-center";
    header.innerHTML = `
      <span>${reg}</span>
      <span class="font-mono text-slate-500">${groups[reg].length}</span>
    `;
    section.appendChild(header);

    groups[reg].forEach(stn => {
      const theme = getCategoryTheme(stn.category, stn.status);

      // Tambahkan Pin ke Peta
      const marker = L.marker(stn.coords, { icon: createCinematicPin(stn) });
      marker.on('click', () => {
        openStationDrawer(stn);
      });
      marker.addTo(markersGroup);

      // Kartu di Sidebar
      const card = document.createElement('div');
      card.className = "p-2.5 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-amber-500/40 rounded-xl cursor-pointer transition flex items-center justify-between";
      card.onclick = () => {
        map.flyTo(stn.coords, 13, { duration: 1.2 });
        openStationDrawer(stn);
        // Di mobile, tutup sidebar saat stasiun dipilih
        if (window.innerWidth < 768) {
          toggleMobileSidebar();
        }
      };

      card.innerHTML = `
        <div class="truncate mr-2">
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border ${theme.badgeColor}">
              ${stn.id}
            </span>
            <span class="font-bold text-xs text-slate-200 truncate">${stn.name}</span>
          </div>
          <div class="text-[10px] text-slate-500 truncate">
            ${stn.city} • <span class="font-mono text-amber-400/80">${stn.elevation} mdpl</span>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
      `;
      section.appendChild(card);
    });

    listContainer.appendChild(section);
  });
}

function applyFilters() {
  const filtered = stationsData.filter(stn => {
    // 1. Kategori
    let matchCat = (selectedCategory === 'all');
    if (selectedCategory === 'heritage') {
      matchCat = (stn.status === 'inactive' || stn.category === 'heritage');
    } else if (selectedCategory !== 'all') {
      matchCat = (stn.category === selectedCategory && stn.status === 'active');
    }

    // 2. Region / Daop
    const matchReg = (selectedRegion === 'ALL') || (stn.region === selectedRegion);

    // 3. Pencarian
    const q = searchQuery.toLowerCase();
    const matchSearch = stn.name.toLowerCase().includes(q) ||
                        stn.id.toLowerCase().includes(q) ||
                        stn.city.toLowerCase().includes(q) ||
                        stn.region.toLowerCase().includes(q);

    return matchCat && matchReg && matchSearch;
  });

  renderDirectory(filtered);

  if (filtered.length === 1) {
    map.flyTo(filtered[0].coords, 13, { duration: 1.2 });
  }
}

function filterCategory(cat, btnEl) {
  selectedCategory = cat;
  document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const labelMap = {
    all: 'Semua Layanan',
    antarkota: 'KA Antarkota',
    whoosh: 'Whoosh Cepat',
    commuter: 'KRL / Lokal',
    bandara: 'Bandara & Feeder',
    heritage: 'Jalur Bersejarah'
  };
  document.getElementById('filterStatusLabel').innerText = labelMap[cat] || 'Kustom';

  applyFilters();
}

function handleRegionSelect(val) {
  selectedRegion = val;
  applyFilters();

  if (val !== 'ALL') {
    const target = stationsData.find(s => s.region === val);
    if (target) {
      map.flyTo(target.coords, 9, { duration: 1.4 });
    }
  }
}

function handleSearch(val) {
  searchQuery = val;
  const clearBtn = document.getElementById('clearSearchBtn');
  if (val.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
  applyFilters();
}

function clearSearch() {
  const input = document.getElementById('stationSearch');
  input.value = '';
  handleSearch('');
}

// Inisialisasi awal
renderDirectory(stationsData);

// ========================================================
// 5. DRAWER DETAIL (RESPONSIVE BOTTOM SHEET / SIDE DRAWER)
// ========================================================
function openStationDrawer(stn) {
  const theme = getCategoryTheme(stn.category, stn.status);

  // Badge Status & Tipe
  const badgeType = document.getElementById('drawerBadgeType');
  badgeType.innerText = theme.badge;
  badgeType.className = `text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${theme.badgeColor}`;

  const badgeStatus = document.getElementById('drawerBadgeStatus');
  if (stn.status === 'inactive') {
    badgeStatus.innerText = 'TIDAK AKTIF / SEJARAH';
    badgeStatus.className = 'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-700';
  } else {
    badgeStatus.innerText = 'BEROPERASI AKTIF';
    badgeStatus.className = 'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800';
  }

  document.getElementById('drawerTitle').innerText = stn.name;
  document.getElementById('drawerCity').innerText = `${stn.city} • ${stn.region}`;
  document.getElementById('drawerElevation').innerText = `Elevasi: ${stn.elevation} mdpl`;
  document.getElementById('drawerYears').innerText = `Masa Operasi: ${stn.years}`;
  document.getElementById('drawerImage').src = stn.image;
  document.getElementById('drawerReview').innerText = stn.review;
  document.getElementById('drawerLayoutGuide').innerText = stn.layoutGuide;
  document.getElementById('drawerLayoutLink').href = `https://www.google.com/maps/search/?api=1&query=${stn.mapsQuery}`;

  // Styling Card Review sesuai Tipe
  const reviewBox = document.getElementById('drawerReviewBox');
  const reviewTitle = document.getElementById('drawerReviewTitle');
  if (stn.status === 'inactive') {
    reviewBox.className = "p-3.5 rounded-2xl border bg-stone-900/60 border-amber-800/60 text-stone-300";
    reviewTitle.className = "font-bold flex items-center gap-1.5 mb-1 text-xs text-amber-400";
    reviewTitle.innerHTML = `<i class="fa-solid fa-scroll"></i> Catatan Sejarah & Warisan Kolonial:`;
    document.getElementById('drawerFacilitiesLabel').innerText = "Koleksi & Peninggalan Sejarah:";
    document.getElementById('drawerTicketBtn').classList.add('hidden'); // Sembunyikan tombol tiket untuk jalur mati
  } else {
    reviewBox.className = "p-3.5 rounded-2xl border bg-slate-900/80 border-white/10 text-slate-300";
    reviewTitle.className = "font-bold flex items-center gap-1.5 mb-1 text-xs text-amber-400";
    reviewTitle.innerHTML = `<i class="fa-solid fa-clipboard-check"></i> Ulasan & Karakteristik CS:`;
    document.getElementById('drawerFacilitiesLabel').innerText = "Fasilitas Penumpang:";
    document.getElementById('drawerTicketBtn').classList.remove('hidden');
  }

  // Render Fasilitas
  const facContainer = document.getElementById('drawerFacilities');
  facContainer.innerHTML = '';
  stn.facilities.forEach(f => {
    const badge = document.createElement('div');
    badge.className = "p-2 bg-slate-900 border border-white/5 rounded-xl text-slate-300 flex items-center gap-2";
    badge.innerHTML = `<i class="fa-solid fa-circle-check text-amber-400 text-xs shrink-0"></i> <span class="text-[11px] leading-tight">${f}</span>`;
    facContainer.appendChild(badge);
  });

  // Buka Drawer (Mobile: Slide-Up Bottom Sheet; Desktop: Slide-In Kanan)
  const drawer = document.getElementById('stationDrawer');
  if (window.innerWidth < 768) {
    drawer.classList.add('drawer-open-mobile');
  } else {
    drawer.classList.add('drawer-open-desktop');
  }
}

function closeStationDrawer() {
  const drawer = document.getElementById('stationDrawer');
  drawer.classList.remove('drawer-open-mobile', 'drawer-open-desktop');
}

// Mobile Sidebar Toggle
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebarDirectory');
  const backdrop = document.getElementById('mobileBackdrop');

  sidebar.classList.toggle('-translate-x-full');
  backdrop.classList.toggle('hidden');
}
