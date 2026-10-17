/**
 * DATABASE JADWAL & RUTE PERJALANAN KA (GAPEKA RESMI)
 * Format waktu: "HH:MM" (24 Jam)
 */

const trainsScheduleData = [
  {
    id: "KA 1",
    name: "Argo Bromo Anggrek",
    type: "Eksekutif & Luxury",
    route: "Surabaya Pasarturi -> Gambir",
    depTime: "09:15",
    arrTime: "17:20",
    speed: "120 km/jam",
    waypoints: [
      [-7.2482, 112.7313], // Surabaya Pasarturi
      [-7.1500, 111.8800], // Bojonegoro
      [-6.9644, 110.4281], // Semarang Tawang
      [-6.8833, 109.1333], // Tegal
      [-6.7053, 108.5556], // Cirebon
      [-6.2371, 107.0016], // Bekasi
      [-6.1767, 106.8306]  // Gambir
    ]
  },
  {
    id: "KA 44",
    name: "Argo Parahyangan",
    type: "Eksekutif & Ekonomi",
    route: "Gambir -> Bandung",
    depTime: "06:30",
    arrTime: "09:15",
    speed: "95 km/jam",
    waypoints: [
      [-6.1767, 106.8306], // Gambir
      [-6.2150, 106.8683], // Jatinegara
      [-6.5500, 107.4500], // Purwakarta
      [-6.8750, 107.5400], // Cimahi
      [-6.9125, 107.6025]  // Bandung
    ]
  },
  {
    id: "KA 68",
    name: "Taksaka",
    type: "Eksekutif & Hype Trip",
    route: "Gambir -> Yogyakarta",
    depTime: "09:20",
    arrTime: "15:30",
    speed: "110 km/jam",
    waypoints: [
      [-6.1767, 106.8306], // Gambir
      [-6.7053, 108.5556], // Cirebon
      [-7.4194, 109.2217], // Purwokerto
      [-7.6700, 109.6500], // Kebumen
      [-7.7150, 109.9050], // Kutoarjo
      [-7.7891, 110.3635]  // Yogyakarta
    ]
  },
  {
    id: "KA 235",
    name: "Airlangga",
    type: "Ekonomi PSO",
    route: "Surabaya Pasarturi -> Pasar Senen via Semarang Poncol",
    depTime: "12:25",
    arrTime: "23:45",
    speed: "90 km/jam",
    waypoints: [
      [-7.2482, 112.7313], // Surabaya Pasarturi
      [-7.1167, 112.4167], // Lamongan
      [-7.1500, 111.8800], // Bojonegoro
      [-6.9727, 110.4150], // Semarang Poncol
      [-6.8833, 109.1333], // Tegal
      [-6.7142, 108.5639], // Cirebon Prujakan
      [-6.1748, 106.8447]  // Pasar Senen
    ]
  },
  {
    id: "KA U52",
    name: "Sribilah Utama",
    type: "Eksekutif & Bisnis",
    route: "Medan -> Rantauprapat",
    depTime: "15:00",
    arrTime: "21:10",
    speed: "80 km/jam",
    waypoints: [
      [3.5907, 98.6784],  // Medan
      [3.3283, 99.1625],  // Tebing Tinggi
      [2.9817, 99.6200],  // Kisaran
      [2.0953, 99.8286]   // Rantauprapat
    ]
  },
  {
    id: "KA S12",
    name: "Rajabasa",
    type: "Ekonomi",
    route: "Kertapati -> Tanjungkarang",
    depTime: "08:30",
    arrTime: "17:45",
    speed: "75 km/jam",
    waypoints: [
      [-3.0163, 104.7573], // Kertapati
      [-3.4400, 104.2400], // Prabumulih
      [-4.1300, 104.1700], // Baturaja
      [-4.8200, 104.8800], // Kotabumi
      [-5.4057, 105.2581]  // Tanjung Karang
    ]
  }
];

// Helper: Konversi "HH:MM" ke menit total dari jam 00:00
function timeToMinutes(timeStr) {
  const [hours, mins] = timeStr.split(':').map(Number);
  return hours * 60 + mins;
}

// Cek apakah kereta sedang berjalan saat ini
function isTrainCurrentlyRunning(train, currentMinutes) {
  const dep = timeToMinutes(train.depTime);
  const arr = timeToMinutes(train.arrTime);
  
  if (dep <= arr) {
    return currentMinutes >= dep && currentMinutes <= arr;
  } else {
    // Lewat tengah malam (overnight train)
    return currentMinutes >= dep || currentMinutes <= arr;
  }
}

// Hitung persentase progress perjalanan (0.0 sampai 1.0)
function calculateTrainProgress(train, currentMinutes) {
  const dep = timeToMinutes(train.depTime);
  const arr = timeToMinutes(train.arrTime);

  let totalDuration = arr - dep;
  if (totalDuration < 0) totalDuration += 1440; // 24 jam

  let elapsed = currentMinutes - dep;
  if (elapsed < 0) elapsed += 1440;

  return Math.min(Math.max(elapsed / totalDuration, 0), 1);
}
