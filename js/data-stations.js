/**
 * DATA RESMI STASIUN CS RAIL MONITOR
 * Terurut secara terstruktur: Daop 1 s.d. Daop 9 (Jawa), disusul Divre I s.d. Divre IV (Sumatera)
 * Jalur gambar tersambung ke: assets/images/stations/[id].jpg
 */

const stationsData = [
  // ================= DAOP 1 JAKARTA =================
  {
    id: "GMR",
    name: "Gambir (GMR)",
    region: "Daop 1 Jakarta",
    city: "Jakarta Pusat",
    altitude: "+16",
    coords: [-6.1767, 106.8306],
    image: "assets/images/stations/gmr.jpg",
    review: "Stasiun pusat pemberangkatan KA Antarkota kelas Eksekutif, Panoramic, Compartment Suite, dan Luxury. Catatan CS: Stasiun Gambir TIDAK melayani KRL Commuter Line reguler. Transit KRL disarankan via Gondangdia atau Juanda.",
    facilities: ["Lounge VIP & Luxury", "Rail Transit Suite (Hotel)", "Boarding Face Recognition", "Pojok Laktasi & Kursi Roda", "Parkir Inap 24 Jam"],
    layoutGuide: "Pintu Selatan khusus drop-off dan gate boarding. Pintu Utara untuk penjemputan dan ATM. Peron berada di Lantai 3 (Elevated).",
    mapsQuery: "Stasiun+Gambir+Jakarta"
  },
  {
    id: "PSE",
    name: "Pasar Senen (PSE)",
    region: "Daop 1 Jakarta",
    city: "Jakarta Pusat",
    altitude: "+4.7",
    coords: [-6.1748, 106.8447],
    image: "assets/images/stations/pse.jpg",
    review: "Pusat KA Antarkota kelas Campuran & Ekonomi. Terhubung dengan Underpass penyeberangan KRL Commuter Line serta Halte Sentral TransJakarta Senen.",
    facilities: ["Underpass Penyeberangan Difabel", "Ruang Tunggu Luas Ber-AC", "CS Counter & Pembatalan Tiket", "Pujasera 24 Jam", "Check-in Mandiri"],
    layoutGuide: "Lobi Barat untuk keberangkatan Antarkota. Area KRL di sayap samping dengan tapping gate tersendiri.",
    mapsQuery: "Stasiun+Pasar+Senen"
  },
  {
    id: "JNG",
    name: "Jatinegara (JNG)",
    region: "Daop 1 Jakarta",
    city: "Jakarta Timur",
    altitude: "+16",
    coords: [-6.2150, 106.8683],
    image: "assets/images/stations/jng.jpg",
    review: "Stasiun percabangan utama Jakarta arah timur. Melayani pemberhentian penurunan KA Jarak Jauh tertentu serta integrasi padat KRL Cikarang Line.",
    facilities: ["Skybridge Modern", "Eskalator & Lift Difabel", "Loket CS", "Area Penjemputan"],
    layoutGuide: "Bangunan baru di lantai atas berfungsi sebagai concourse penyeberangan seluruh peron jalur 1 sampai 8.",
    mapsQuery: "Stasiun+Jatinegara"
  },

  // ================= DAOP 2 BANDUNG =================
  {
    id: "BD",
    name: "Bandung (BD)",
    region: "Daop 2 Bandung",
    city: "Bandung",
    altitude: "+709",
    coords: [-6.9125, 107.6025],
    image: "assets/images/stations/bd.jpg",
    review: "Stasiun induk Priangan. Terintegrasi KA Feeder Kereta Cepat Whoosh (Bandung - Padalarang) dan Commuter Line Bandung Raya.",
    facilities: ["Skybridge Integrasi Feeder Whoosh", "Coworking Space Stasiun", "Lounge Eksekutif", "Pos Kesehatan CS", "Charger Station"],
    layoutGuide: "Pintu Utara (Jl. Kebon Kawung) untuk KA Antarkota & Feeder Whoosh. Pintu Selatan (Jl. Stasiun Barat) untuk KA Lokal.",
    mapsQuery: "Stasiun+Bandung"
  },
  {
    id: "KAC",
    name: "Kiaracondong (KAC)",
    region: "Daop 2 Bandung",
    city: "Bandung",
    altitude: "+681",
    coords: [-6.9248, 107.6465],
    image: "assets/images/stations/kac.jpg",
    review: "Stasiun terminus keberangkatan KA Jarak Jauh kelas Ekonomi subsidi (PSO) seperti KA Kahuripan, Pasundan, Serayu, dan Kutojaya Selatan.",
    facilities: ["Ruang Tunggu Ekonomi", "Mesin Cetak Tiket", "Musala & Toilet", "Kios Makanan"],
    layoutGuide: "Pintu masuk utara Jl. Ibrahim Adjie. Peron berada di atas tanah tanpa perlu menyeberang jembatan layang.",
    mapsQuery: "Stasiun+Kiaracondong"
  },

  // ================= DAOP 3 CIREBON =================
  {
    id: "CN",
    name: "Cirebon Kejaksan (CN)",
    region: "Daop 3 Cirebon",
    city: "Cirebon",
    altitude: "+4",
    coords: [-6.7053, 108.5556],
    image: "assets/images/stations/cn.jpg",
    review: "Stasiun persimpangan utama jalur ganda utara (arah Semarang/Surabaya) dan jalur tengah (arah Purwokerto/Kroya/Yogyakarta). Melayani KA Eksekutif dan Campuran.",
    facilities: ["Ruang Tunggu VIP", "Layanan CS Aktif", "Sentra Oleh-oleh Cirebon", "Toilet Ramah Lansia"],
    layoutGuide: "Akses peron sejajar dengan ruang tunggu lobi tiket utama sehingga ramah bagi penumpang lansia dan kursi roda.",
    mapsQuery: "Stasiun+Cirebon"
  },
  {
    id: "CNP",
    name: "Cirebon Prujakan (CNP)",
    region: "Daop 3 Cirebon",
    city: "Cirebon",
    altitude: "+4",
    coords: [-6.7142, 108.5639],
    image: "assets/images/stations/cnp.jpg",
    review: "Stasiun khusus pemberhentian KA Jarak Jauh kelas Ekonomi di Kota Cirebon. Berjarak sekitar 1 km di sebelah selatan Stasiun Kejaksan.",
    facilities: ["Peron Berkanopi", "Mesin Check-In Mandiri", "Musala Bersih", "Kantin Stasiun"],
    layoutGuide: "Pintu masuk dari Jl. Nyimas Gandasari langsung mengarah ke lobi boarding.",
    mapsQuery: "Stasiun+Cirebon+Prujakan"
  },

  // ================= DAOP 4 SEMARANG =================
  {
    id: "SMT",
    name: "Semarang Tawang (SMT) Bank Jateng",
    region: "Daop 4 Semarang",
    city: "Semarang",
    altitude: "+2",
    coords: [-6.9644, 110.4281],
    image: "assets/images/stations/smt.jpg",
    review: "Stasiun cagar budaya tertua dan terbesar di Lintas Utara Jawa. Melayani KA kelas Eksekutif dan Luxury antarkota. Memiliki sistem polder penahan rob modern.",
    facilities: ["Monumen Water Wall Polder", "Lounge Eksekutif VIP", "Piano Tunggu Penumpang", "Face Recognition Gate", "Layanan Difabel"],
    layoutGuide: "Pintu utama menghadap polder Kota Lama Semarang. Emplasemen peron dinaungi kanopi lengkung megah.",
    mapsQuery: "Stasiun+Semarang+Tawang"
  },
  {
    id: "SMC",
    name: "Semarang Poncol (SMC)",
    region: "Daop 4 Semarang",
    city: "Semarang",
    altitude: "+3",
    coords: [-6.9727, 110.4150],
    image: "assets/images/stations/smc.jpg",
    review: "Stasiun utama kedua Semarang, melayani KA Ekonomi Antarkota Lintas Pantura (Airlangga, Tawang Jaya), KA Aglomerasi (Kaligung, Ambarawa Ekspres), dan KA Komuter Kedung Sepur.",
    facilities: ["Peron Tinggi Berkanopi", "Mesin Cetak Tiket Mandiri", "Customer Service On Duty", "Musala & Toilet Bersih", "Pujasera 24 Jam"],
    layoutGuide: "Pintu masuk utama berada di Jl. Imam Bonjol. Ruang tunggu ekonomi terbagi menjadi lobi luar dan lobi steril boarding peron.",
    mapsQuery: "Stasiun+Semarang+Poncol"
  },
  {
    id: "TG",
    name: "Tegal (TG)",
    region: "Daop 4 Semarang",
    city: "Tegal",
    altitude: "+4",
    coords: [-6.8681, 109.1416],
    image: "assets/images/stations/tg.jpg",
    review: "Stasiun transit strategis di perbatasan barat Jawa Tengah. Melayani pembalikan rangkaian KA dan percabangan lintas Tegal - Slawi - Prupuk.",
    facilities: ["Ruang Tunggu Ber-AC", "CS Fast Response", "Pojok Pengisian Daya", "Area Drop-off Teratur"],
    layoutGuide: "Pintu masuk menghadap Jl. Pancasila depan alun-alun. Akses boarding langsung terhubung ke peron pulau.",
    mapsQuery: "Stasiun+Tegal"
  },

  // ================= DAOP 5 PURWOKERTO =================
  {
    id: "PWT",
    name: "Purwokerto (PWT)",
    region: "Daop 5 Purwokerto",
    city: "Banyumas",
    altitude: "+75",
    coords: [-7.4194, 109.2217],
    image: "assets/images/stations/pwt.jpg",
    review: "Stasiun induk Daop 5 di kaki Gunung Slamet. Memiliki fasilitas Skybridge modern penghubung lobi barat dan timur serta depo lokomotif besar.",
    facilities: ["Skybridge Antar-Peron Modern", "Executive Lounge", "Playground Anak", "Face Recognition Gate"],
    layoutGuide: "Lobi Timur (Jl. Kober) untuk KA Eksekutif. Lobi Barat difungsikan untuk akses drop-off sekunder.",
    mapsQuery: "Stasiun+Purwokerto"
  },
  {
    id: "KYA",
    name: "Kroya (KYA)",
    region: "Daop 5 Purwokerto",
    city: "Cilacap",
    altitude: "+11",
    coords: [-7.6297, 109.2522],
    image: "assets/images/stations/kya.jpg",
    review: "Stasiun percabangan segitiga emas Lintas Selatan Jawa (menghubungkan jalur Bandung, Cirebon, dan Yogyakarta/Surabaya).",
    facilities: ["Ruang Tunggu Persilangan", "CS Counter", "Musala & Toilet", "Kios Kuliner"],
    layoutGuide: "Peron pulau luas dengan jalur langsiran lokomotif.",
    mapsQuery: "Stasiun+Kroya"
  },

  // ================= DAOP 6 YOGYAKARTA =================
  {
    id: "YK",
    name: "Yogyakarta (YK) / Tugu",
    region: "Daop 6 Yogyakarta",
    city: "Yogyakarta",
    altitude: "+113",
    coords: [-7.7891, 110.3635],
    image: "assets/images/stations/yk.jpg",
    review: "Stasiun ikonik di jantung Malioboro. Melayani KA Antarkota Eksekutif/Luxury, KA Bandara YIA Kulon Progo, dan KRL Commuter Line Yogya-Solo.",
    facilities: ["Akses Langsung Malioboro", "Peron Khusus Bandara YIA", "Lounge Anggrek VIP", "Shower and Locker", "Face Recognition Gate"],
    layoutGuide: "Pintu Timur khusus KRL & drop-off Malioboro. Pintu Barat (Pasar Kembang) untuk boarding KA Antarkota & KA Bandara YIA.",
    mapsQuery: "Stasiun+Tugu+Yogyakarta"
  },
  {
    id: "LPN",
    name: "Lempuyangan (LPN)",
    region: "Daop 6 Yogyakarta",
    city: "Yogyakarta",
    altitude: "+114",
    coords: [-7.7903, 110.3753],
    image: "assets/images/stations/lpn.jpg",
    review: "Stasiun terminus keberangkatan dan kedatangan KA Antarkota kelas Ekonomi di Yogyakarta (Progo, Bengawan, Sri Tanjung) dan KRL Solo-Jogja.",
    facilities: ["Ruang Tunggu Terbuka Ber-AC", "Jembatan Penyeberangan Penumpang", "Mesin Check-In Mandiri", "Kantin Gudeg"],
    layoutGuide: "Pintu masuk selatan (Jl. Lempuyangan) untuk boarding Antarkota dan KRL Commuter Line.",
    mapsQuery: "Stasiun+Lempuyangan"
  },
  {
    id: "SLO",
    name: "Solo Balapan (SLO)",
    region: "Daop 6 Yogyakarta",
    city: "Surakarta",
    altitude: "+93",
    coords: [-7.5574, 110.8217],
    image: "assets/images/stations/slo.jpg",
    review: "Stasiun sentral Solo Raya. Terhubung oleh Skybridge ke Terminal Bus Tirtonadi dan peron terintegrasi KA Bandara Adi Soemarmo (BIAS).",
    facilities: ["Skybridge ke Terminal Tirtonadi", "Peron Khusus KA Bandara BIAS", "KRL Palur-Jogja", "Lounge VIP", "Pos Medis"],
    layoutGuide: "Lantai 2 menghubungkan Skybridge Tirtonadi. Lantai 1 melayani boarding KA Antarkota dan KRL Commuter Line.",
    mapsQuery: "Stasiun+Solo+Balapan"
  },

  // ================= DAOP 7 MADIUN =================
  {
    id: "MN",
    name: "Madiun (MN)",
    region: "Daop 7 Madiun",
    city: "Madiun",
    altitude: "+63",
    coords: [-7.6186, 111.5244],
    image: "assets/images/stations/mn.jpg",
    review: "Stasiun pusat Daop 7 yang berdampingan langsung dengan pabrik sarana kereta api nasional PT INKA (Persero). Melayani seluruh KA Lintas Selatan.",
    facilities: ["Lobi Boarding Modern", "Lounge Eksekutif", "Monumen Lokomotif C2407", "Pos Kesehatan CS"],
    layoutGuide: "Pintu masuk menghadap Jl. Kompol Sunaryo. Peron 1-3 melayani seluruh KA Antarkota.",
    mapsQuery: "Stasiun+Madiun"
  },

  // ================= DAOP 8 SURABAYA =================
  {
    id: "SGU",
    name: "Surabaya Gubeng (SGU)",
    region: "Daop 8 Surabaya",
    city: "Surabaya",
    altitude: "+5",
    coords: [-7.2654, 112.7521],
    image: "assets/images/stations/sgu.jpg",
    review: "Stasiun kereta terbesar di Jawa Timur dan gerbang Lintas Selatan. Dibagi menjadi dua sisi: Sisi Timur (Gubeng Baru) dan Sisi Barat (Gubeng Lama).",
    facilities: ["Face Recognition Gate", "Executive Lounge", "Food Court Lengkap", "Koneksi Bus Trans Semanggi", "Parkir Inap Luas"],
    layoutGuide: "Sisi Timur (Jl. Gubeng Pojok) untuk KA Eksekutif Antarkota. Sisi Barat untuk KA Ekonomi dan Kereta Lokal Jatim.",
    mapsQuery: "Stasiun+Surabaya+Gubeng"
  },
  {
    id: "SBI",
    name: "Surabaya Pasarturi (SBI)",
    region: "Daop 8 Surabaya",
    city: "Surabaya",
    altitude: "+1",
    coords: [-7.2482, 112.7313],
    image: "assets/images/stations/sbi.jpg",
    review: "Terminus utama Lintas Utara Jawa (arah Semarang - Cirebon - Jakarta). Melayani KA Argo Bromo Anggrek, Sembrani, dan Dharmawangsa.",
    facilities: ["Lobi Boarding Ber-AC", "Layanan CS Aktif", "Executive Waiting Room", "Musala Luas", "Area Drop-off Teratur"],
    layoutGuide: "Lobi utama berada di Jl. Semarang. Jalur 1 dan 2 merupakan peron utama pemberangkatan KA Antarkota.",
    mapsQuery: "Stasiun+Surabaya+Pasarturi"
  },
  {
    id: "ML",
    name: "Malang (ML)",
    region: "Daop 8 Surabaya",
    city: "Malang",
    altitude: "+444",
    coords: [-7.9775, 112.6375],
    image: "assets/images/stations/ml.jpg",
    review: "Stasiun utama di Kota Malang dengan gedung baru megah di sisi timur yang mengusung konsep bandara ramah lingkungan.",
    facilities: ["Jembatan Penyeberangan Kaca", "Ruang Tunggu Modern Ber-AC", "Pusat Kuliner Khas Malang", "CS Counter"],
    layoutGuide: "Gedung Baru (Sisi Timur) melayani KA Antarkota. Gedung Lama (Sisi Barat) melayani KA Penataran / Kereta Lokal.",
    mapsQuery: "Stasiun+Malang"
  },

  // ================= DAOP 9 JEMBER =================
  {
    id: "JR",
    name: "Jember (JR)",
    region: "Daop 9 Jember",
    city: "Jember",
    altitude: "+89",
    coords: [-8.1650, 113.7031],
    image: "assets/images/stations/jr.jpg",
    review: "Stasiun induk paling timur di Pulau Jawa bagian tengah. Melayani KA Ranggajati, Pandalungan (rute terpanjang Gambir - Jember), dan Blambangan Ekspres.",
    facilities: ["Ruang Boarding Luas", "Loket CS", "Area Parkir Inap", "Musala & Toilet Ramah Lansia"],
    layoutGuide: "Pintu masuk utama di Jl. Wijaya Kusuma langsung terhubung ke peron jalur 1 dan 2.",
    mapsQuery: "Stasiun+Jember"
  },
  {
    id: "KTG",
    name: "Ketapang (KTG) Banyuwangi",
    region: "Daop 9 Jember",
    city: "Banyuwangi",
    altitude: "+7",
    coords: [-8.1436, 114.3972],
    image: "assets/images/stations/ktg.jpg",
    review: "Stasiun terminus paling timur di Pulau Jawa. Terletak hanya 100 meter dari Pelabuhan Penyeberangan Feri Ketapang menuju Pulau Bali.",
    facilities: ["Akses Jalan Kaki ke Pelabuhan Feri", "Ruang Tunggu Transit", "Check-in Mandiri", "Kantin Stasiun"],
    layoutGuide: "Jalur rel berakhir di sini. Pintu keluar stasiun langsung terhubung ke jalan raya pelabuhan penyeberangan Selat Bali.",
    mapsQuery: "Stasiun+Ketapang+Banyuwangi"
  },

  // ================= DIVRE I SUMATERA UTARA =================
  {
    id: "MDN",
    name: "Medan (MDN)",
    region: "Divre I Sumatera Utara",
    city: "Medan",
    altitude: "+22",
    coords: [3.5907, 98.6784],
    image: "assets/images/stations/mdn.jpg",
    review: "Stasiun modern tersibuk di Sumatera. Memiliki peron layang (elevated track) bebas perlintasan sebidang serta terintegrasi KA Bandara Kualanamu (KNO).",
    facilities: ["City Check-In Maskapai", "Elevated Platform Modern", "Eskalator & Lift Difabel", "Terhubung Lapangan Merdeka", "CS Hotline 24 Jam"],
    layoutGuide: "Lantai 1 untuk KA Antarkota (Sribilah / Putri Deli). Lantai 2 untuk peron Kereta Bandara Railink.",
    mapsQuery: "Stasiun+Kereta+Medan"
  },
  {
    id: "RAP",
    name: "Rantauprapat (RAP)",
    region: "Divre I Sumatera Utara",
    city: "Labuhanbatu",
    altitude: "+27",
    coords: [2.0953, 99.8286],
    image: "assets/images/stations/rap.jpg",
    review: "Stasiun terminal ujung lintas selatan Sumatera Utara. Menjadi terminus utama KA Sribilah Utama dari Medan.",
    facilities: ["Ruang Tunggu Ber-AC", "Loket & CS", "Musala", "Parkir Kendaraan"],
    layoutGuide: "Pintu masuk utama langsung menuju peron stasiun.",
    mapsQuery: "Stasiun+Rantauprapat"
  },

  // ================= DIVRE II SUMATERA BARAT =================
  {
    id: "PD",
    name: "Padang (PD) / Simpang Haru",
    region: "Divre II Sumatera Barat",
    city: "Padang",
    altitude: "+8",
    coords: [-0.9436, 100.3705],
    image: "assets/images/stations/pd.jpg",
    review: "Stasiun induk Divre II Sumatera Barat. Melayani KA Bandara Minangkabau Ekspres (BIM) dan KA Sibinuang rute Padang - Pariaman - Naras.",
    facilities: ["Peron KA Bandara BIM", "Ruang Tunggu Nyaman", "Layanan CS", "Parkir Mobil/Motor"],
    layoutGuide: "Pintu masuk utama berada di Jl. Stasiun Simpang Haru.",
    mapsQuery: "Stasiun+Padang+Simpang+Haru"
  },

  // ================= DIVRE III PALEMBANG =================
  {
    id: "KPT",
    name: "Kertapati (KPT)",
    region: "Divre III Palembang",
    city: "Palembang",
    altitude: "+2",
    coords: [-3.0163, 104.7573],
    image: "assets/images/stations/kpt.jpg",
    review: "Stasiun terminus penumpang di Palembang di tepi Sungai Ogan & Musi. Melayani KA Sindang Marga dan Serelo serta angkutan logistik batubara.",
    facilities: ["Ruang Tunggu Antarkota", "Layanan Porter Resmi", "Musala & Toilet", "Check-in Mandiri KAI"],
    layoutGuide: "Pintu masuk dari Jl. Ki Merogan langsung menghadap ke peron penumpang.",
    mapsQuery: "Stasiun+Kertapati+Palembang"
  },
  {
    id: "LLG",
    name: "Lubuklinggau (LLG)",
    region: "Divre III Palembang",
    city: "Lubuklinggau",
    altitude: "+130",
    coords: [-3.2941, 102.8617],
    image: "assets/images/stations/llg.jpg",
    review: "Stasiun terminus paling barat di Sumatera Selatan, berada di kaki Bukit Sulap. Menghubungkan Palembang via KA Sindang Marga dan KA Bukit Serelo.",
    facilities: ["Ruang Tunggu Penumpang", "Loket Tiket & CS", "Area Parkir", "Toilet Bersih"],
    layoutGuide: "Bangunan stasiun terletak di pusat kota Lubuklinggau menghadap peron utama.",
    mapsQuery: "Stasiun+Lubuklinggau"
  },

  // ================= DIVRE IV TANJUNGKARANG =================
  {
    id: "TNK",
    name: "Tanjung Karang (TNK)",
    region: "Divre IV Tanjungkarang",
    city: "Bandar Lampung",
    altitude: "+96",
    coords: [-5.4057, 105.2581],
    image: "assets/images/stations/tnk.jpg",
    review: "Stasiun sentral utama di Lampung, menghubungkan pintu gerbang selatan Sumatera dengan Palembang via KA Rajabasa dan KA Kuala Stabas.",
    facilities: ["Ruang Tunggu Ber-AC", "Pos Medis CS", "ATM Center", "Kantin Stasiun", "Pelataran Drop-Off"],
    layoutGuide: "Gedung penumpang di sisi timur rel kereta api dengan arus penjemputan satu arah.",
    mapsQuery: "Stasiun+Tanjung+Karang+Lampung"
  },
  {
    id: "BTA",
    name: "Baturaja (BTA)",
    region: "Divre IV Tanjungkarang",
    city: "Ogan Komering Ulu",
    altitude: "+49",
    coords: [-4.1292, 104.1706],
    image: "assets/images/stations/bta.jpg",
    review: "Stasiun persinggahan utama di tengah jalur antara Palembang dan Bandar Lampung dengan emplasemen stasiun yang luas.",
    facilities: ["Ruang Boarding", "Loket & CS", "Musala Bersih", "Kios Makanan"],
    layoutGuide: "Lobi penumpang langsung terhubung ke peron 1 untuk naik turun penumpang.",
    mapsQuery: "Stasiun+Baturaja"
  }
];
