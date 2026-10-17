/**
 * DATABASE STASIUN RESMI CS RAIL MONITOR
 * Anda dapat mengedit / menambahkan stasiun baru dengan menyalin struktur objek di bawah ini.
 * Gambar dapat diletakkan di: assets/images/stations/[id_stasiun].jpg
 */

const stationsData = [
  // --- DAOP 4 SEMARANG (Mencakup Semarang Tawang & Semarang Poncol) ---
  {
    id: "SMC",
    name: "Semarang Poncol (SMC)",
    region: "Daop 4 Semarang",
    city: "Semarang (Semarang Tengah)",
    coords: [-6.9727, 110.4150],
    image: "assets/images/stations/smc.jpg",
    review: "Stasiun utama kedua di Semarang yang difokuskan untuk KA Antarkota kelas Ekonomi Lintas Pantura (seperti KA Airlangga, Tawang Jaya, Kertajaya), KA Aglomerasi (Ambarawa Ekspres, Kaligung), dan KA Komuter Kedung Sepur. Emplasemen telah dilengkapi kanopi tertutup.",
    facilities: ["Peron Tinggi Berkanopi", "Mesin Cetak Tiket Mandiri", "Customer Service On Duty", "Musala & Toilet Ramah Lansia", "Pujasera Stasiun 24 Jam", "Parkir Mobil & Motor"],
    layoutGuide: "Pintu masuk utama berada di Jl. Imam Bonjol. Ruang tunggu ekonomi terbagi menjadi lobi luar dan lobi steril boarding peron. Jalur 1-3 melayani kedatangan dan keberangkatan.",
    mapsQuery: "Stasiun+Semarang+Poncol"
  },
  {
    id: "SMT",
    name: "Semarang Tawang (SMT) Bank Jateng",
    region: "Daop 4 Semarang",
    city: "Semarang (Kota Lama)",
    coords: [-6.9644, 110.4281],
    image: "assets/images/stations/smt.jpg",
    review: "Stasiun tertua dan terbesar di Lintas Utara Jawa. Melayani seluruh KA kelas Eksekutif dan Luxury antarkota. Memiliki arsitektur kolonial indah dengan kubah besar dan sistem polder penahan rob modern.",
    facilities: ["Water Wall Monumen Polder", "Lounge Eksekutif VIP", "Piano Tunggu Penumpang", "Face Recognition Boarding Gate", "Pojok Laktasi & Kursi Roda"],
    layoutGuide: "Pintu utama langsung menghadap danau buatan polder Kota Lama Semarang. Emplasemen peron beratap kubah luas untuk jalur 1 sampai 6.",
    mapsQuery: "Stasiun+Semarang+Tawang"
  },
  {
    id: "TG",
    name: "Tegal (TG)",
    region: "Daop 4 Semarang",
    city: "Tegal",
    coords: [-6.8681, 109.1416],
    image: "assets/images/stations/tg.jpg",
    review: "Stasiun transit dan pembalik rute strategis di ujung barat Jawa Tengah. Melayani seluruh perjalanan KA Lintas Utara dan percabangan arah selatan (Prupuk/Purwokerto).",
    facilities: ["Ruang Tunggu Ber-AC", "Customer Service", "Pojok Pengisian Baterai", "Area Penjemputan Teratur"],
    layoutGuide: "Pintu masuk menghadap Jl. Pancasila di depan alun-alun kota. Akses boarding langsung terhubung ke peron pulau.",
    mapsQuery: "Stasiun+Tegal"
  },

  // --- DAOP 1 JAKARTA ---
  {
    id: "GMR",
    name: "Gambir (GMR)",
    region: "Daop 1 Jakarta",
    city: "Jakarta Pusat",
    coords: [-6.1767, 106.8306],
    image: "assets/images/stations/gmr.jpg",
    review: "Pusat keberangkatan KA Antarkota Eksekutif, Panoramic, dan Luxury ibu kota. Catatan CS: Stasiun Gambir TIDAK melayani naik/turun KRL Commuter Line reguler (transit KRL terdekat via Gondangdia/Juanda).",
    facilities: ["Lounge VIP & Luxury", "Hotel Transit (Rail Transit Suite)", "Boarding Face Recognition", "Pojok Laktasi & Kursi Roda", "Parkir Inap 24 Jam"],
    layoutGuide: "Pintu Selatan khusus drop-off dan boarding pass. Pintu Utara untuk penjemputan dan ATM Center. Peron kereta berada di Lantai 3 (Layang).",
    mapsQuery: "Stasiun+Gambir+Jakarta"
  },
  {
    id: "PSE",
    name: "Pasar Senen (PSE)",
    region: "Daop 1 Jakarta",
    city: "Jakarta Pusat",
    coords: [-6.1748, 106.8447],
    image: "assets/images/stations/pse.jpg",
    review: "Terminus utama KA Jarak Jauh kelas Campuran & Ekonomi di Jakarta. Terkoneksi langsung dengan Underpass penyeberangan KRL Commuter Line dan Halte Sentral TransJakarta Senen.",
    facilities: ["Underpass Penyeberangan Difabel", "Ruang Tunggu Luas Ber-AC", "Customer Service Counter", "Food Court 24 Jam", "Mesin Check-In Mandiri"],
    layoutGuide: "Lobi Barat untuk boarding KA Antarkota. Area KRL berada di sayap samping dengan gerbang tapping kartu tiket elektronik terpisah.",
    mapsQuery: "Stasiun+Pasar+Senen"
  },

  // --- DAOP 2 BANDUNG ---
  {
    id: "BD",
    name: "Bandung (BD)",
    region: "Daop 2 Bandung",
    city: "Bandung",
    coords: [-6.9125, 107.6025],
    image: "assets/images/stations/bd.jpg",
    review: "Stasiun induk Priangan. Terhubung langsung dengan KA Feeder Kereta Cepat Whoosh (Bandung - Padalarang) serta Commuter Line Bandung Raya.",
    facilities: ["Skybridge Modern Antar-Peron", "Integrasi KA Feeder Whoosh", "Coworking Space", "Pos Medis CS", "Lounge Eksekutif"],
    layoutGuide: "Pintu Utara (Jl. Kebon Kawung) untuk KA Antarkota & Feeder Whoosh. Pintu Selatan (Jl. Stasiun Barat) untuk KA Lokal Bandung Raya.",
    mapsQuery: "Stasiun+Bandung"
  },
  {
    id: "KAC",
    name: "Kiaracondong (KAC)",
    region: "Daop 2 Bandung",
    city: "Bandung (Kiaracondong)",
    coords: [-6.9248, 107.6465],
    image: "assets/images/stations/kac.jpg",
    review: "Stasiun pemberangkatan khusus KA Antarkota kelas Ekonomi bersubsidi (PSO) seperti KA Kahuripan, Pasundan, Kutojaya Selatan, dan Serayu.",
    facilities: ["Loket CS & Pembatalan Tiket", "Ruang Tunggu Ekonomi", "Musala & Toilet", "Charger Corner"],
    layoutGuide: "Pintu masuk utara terletak di Jl. Ibrahim Adjie. Seluruh peron berada di satu bidang tanah tanpa jembatan penyeberangan tinggi.",
    mapsQuery: "Stasiun+Kiaracondong"
  },

  // --- DAOP 3 CIREBON ---
  {
    id: "CN",
    name: "Cirebon Kejaksan (CN)",
    region: "Daop 3 Cirebon",
    city: "Cirebon",
    coords: [-6.7053, 108.5556],
    image: "assets/images/stations/cn.jpg",
    review: "Stasiun persimpangan utama jalur ganda utara (arah Semarang/Surabaya) dan jalur tengah (arah Purwokerto/Kroya/Yogyakarta). Melayani KA Eksekutif dan Campuran.",
    facilities: ["Ruang Tunggu VIP", "Layanan CS Fast Response", "Musholla Nyaman", "Pusat Oleh-oleh Cirebon", "Toilet Ramah Lansia"],
    layoutGuide: "Lobi depan langsung menghadap ruang boarding. Akses ke peron datar tanpa tangga tinggi sehingga ramah untuk lansia dan kursi roda.",
    mapsQuery: "Stasiun+Cirebon"
  },
  {
    id: "CNP",
    name: "Cirebon Prujakan (CNP)",
    region: "Daop 3 Cirebon",
    city: "Cirebon",
    coords: [-6.7142, 108.5639],
    image: "assets/images/stations/cnp.jpg",
    review: "Stasiun khusus pemberhentian KA kelas Ekonomi di Cirebon. Terletak sekitar 1 km di selatan Stasiun Cirebon Kejaksan.",
    facilities: ["Ruang Tunggu Berkanopi", "Mesin Check-In Mandiri", "Musala Bersih", "Kantin Stasiun"],
    layoutGuide: "Pintu masuk dari Jl. Nyimas Gandasari langsung menuju lobi boarding.",
    mapsQuery: "Stasiun+Cirebon+Prujakan"
  },

  // --- DAOP 6 YOGYAKARTA ---
  {
    id: "YK",
    name: "Yogyakarta (YK) / Tugu",
    region: "Daop 6 Yogyakarta",
    city: "Yogyakarta",
    coords: [-7.7891, 110.3635],
    image: "assets/images/stations/yk.jpg",
    review: "Stasiun legendaris di jantung Malioboro. Melayani KA Antarkota Eksekutif/Luxury, KA Bandara Internasional YIA Kulon Progo, dan KRL Commuter Line Yogya-Solo.",
    facilities: ["Akses Langsung Malioboro", "Peron Khusus Bandara YIA", "Lounge Anggrek VIP", "Shower and Locker", "Face Recognition Gate"],
    layoutGuide: "Pintu Timur khusus KRL & drop-off Malioboro. Pintu Barat (Pasar Kembang) untuk boarding KA Antarkota & KA Bandara YIA.",
    mapsQuery: "Stasiun+Tugu+Yogyakarta"
  },
  {
    id: "LPN",
    name: "Lempuyangan (LPN)",
    region: "Daop 6 Yogyakarta",
    city: "Yogyakarta",
    coords: [-7.7903, 110.3753],
    image: "assets/images/stations/lpn.jpg",
    review: "Stasiun terminus keberangkatan dan kedatangan KA Antarkota kelas Ekonomi (seperti KA Progo, Bengawan, Sri Tanjung) dan KRL Solo-Jogja.",
    facilities: ["Ruang Tunggu Terbuka Ber-AC", "Jembatan Penyeberangan Penumpang", "Mesin Check-In", "Pujasera Gudeg"],
    layoutGuide: "Pintu masuk selatan (Jl. Lempuyangan) untuk boarding Antarkota dan KRL Commuter Line.",
    mapsQuery: "Stasiun+Lempuyangan"
  },
  {
    id: "SLO",
    name: "Solo Balapan (SLO)",
    region: "Daop 6 Yogyakarta",
    city: "Surakarta",
    coords: [-7.5574, 110.8217],
    image: "assets/images/stations/slo.jpg",
    review: "Stasiun sentral Solo Raya. Terhubung oleh Skybridge ke Terminal Bus Tirtonadi dan peron terintegrasi KA Bandara Adi Soemarmo (BIAS).",
    facilities: ["Skybridge ke Terminal Tirtonadi", "Peron Khusus KA Bandara BIAS", "KRL Palur-Jogja", "Lounge VIP", "Pos Medis"],
    layoutGuide: "Lantai 2 menghubungkan Skybridge Tirtonadi. Lantai 1 melayani boarding KA Antarkota dan KRL Commuter Line.",
    mapsQuery: "Stasiun+Solo+Balapan"
  },

  // --- DAOP 8 SURABAYA ---
  {
    id: "SGU",
    name: "Surabaya Gubeng (SGU)",
    region: "Daop 8 Surabaya",
    city: "Surabaya",
    coords: [-7.2654, 112.7521],
    image: "assets/images/stations/sgu.jpg",
    review: "Stasiun terbesar di Jawa Timur dan gerbang Lintas Selatan. Dibagi menjadi dua sisi: Sisi Timur (Gubeng Baru) dan Sisi Barat (Gubeng Lama).",
    facilities: ["Face Recognition Gate", "Executive Lounge", "Food Court Lengkap", "Koneksi Bus Trans Semanggi", "Parkir Inap Luas"],
    layoutGuide: "Sisi Timur (Jl. Gubeng Pojok) untuk KA Eksekutif Antarkota. Sisi Barat untuk KA Ekonomi dan Kereta Lokal Jatim.",
    mapsQuery: "Stasiun+Surabaya+Gubeng"
  },
  {
    id: "SBI",
    name: "Surabaya Pasarturi (SBI)",
    region: "Daop 8 Surabaya",
    city: "Surabaya",
    coords: [-7.2482, 112.7313],
    image: "assets/images/stations/sbi.jpg",
    review: "Terminus utama Lintas Utara Jawa (arah Semarang - Cirebon - Jakarta). Melayani KA Argo Bromo Anggrek, Sembrani, dan Dharmawangsa.",
    facilities: ["Lobi Boarding Ber-AC", "Layanan CS Aktif", "Executive Waiting Room", "Musala Luas", "Area Drop-off Teratur"],
    layoutGuide: "Lobi utama berada di Jl. Semarang. Jalur 1 dan 2 merupakan peron utama pemberangkatan KA Antarkota.",
    mapsQuery: "Stasiun+Surabaya+Pasarturi"
  },

  // --- SUMATERA UTARA (DIVRE I) ---
  {
    id: "MDN",
    name: "Medan (MDN)",
    region: "Divre I Sumatera Utara",
    city: "Medan",
    coords: [3.5907, 98.6784],
    image: "assets/images/stations/mdn.jpg",
    review: "Stasiun modern tersibuk di Sumatera. Memiliki peron layang (elevated track) bebas perlintasan sebidang serta terintegrasi KA Bandara Kualanamu (KNO).",
    facilities: ["City Check-In Maskapai", "Elevated Platform Modern", "Eskalator & Lift Difabel", "Terhubung Lapangan Merdeka", "CS Hotline 24 Jam"],
    layoutGuide: "Lantai 1 untuk KA Antarkota (Sribilah / Putri Deli). Lantai 2 untuk peron Kereta Bandara Railink.",
    mapsQuery: "Stasiun+Kereta+Medan"
  },

  // --- SUMATERA SELATAN & LAMPUNG (DIVRE III & IV) ---
  {
    id: "KPT",
    name: "Kertapati (KPT)",
    region: "Divre III Palembang",
    city: "Palembang",
    coords: [-3.0163, 104.7573],
    image: "assets/images/stations/kpt.jpg",
    review: "Stasiun terminal ujung di tepi Sungai Ogan & Musi Palembang. Melayani KA Penumpang Sindang Marga dan KA Serelo serta angkutan logistik batubara.",
    facilities: ["Ruang Tunggu Antarkota", "Layanan Porter Resmi", "Musala & Toilet", "Check-in Mandiri KAI"],
    layoutGuide: "Pintu masuk dari Jl. Ki Merogan langsung menghadap ke peron utama penumpang.",
    mapsQuery: "Stasiun+Kertapati+Palembang"
  },
  {
    id: "TNK",
    name: "Tanjung Karang (TNK)",
    region: "Divre IV Tj. Karang",
    city: "Bandar Lampung",
    coords: [-5.4057, 105.2581],
    image: "assets/images/stations/tnk.jpg",
    review: "Stasiun induk di Lampung penghubung Lintas Sumatera bagian selatan melalui KA Rajabasa dan KA Kuala Stabas.",
    facilities: ["Ruang Tunggu Ber-AC", "Pos Medis CS", "ATM Center", "Kantin Stasiun", "Pelataran Drop-Off"],
    layoutGuide: "Gedung penumpang berada di sisi timur rel kereta api dengan arus penjemputan satu arah.",
    mapsQuery: "Stasiun+Tanjung+Karang+Lampung"
  }
];
