/**
 * DATA RESMI STASIUN & JALUR REL (JAWA & SUMATERA)
 * Lengkap dengan Antarkota, Whoosh, KRL Jabodetabek & Yogya-Solo, KA Lokal KCI, dan KA Lokal KAI
 */
const STATIONS_DATA = [
  // ========================== WHOOSH KERETA CEPAT ==========================
  {
    id: "hlm",
    name: "Halim (Whoosh)",
    code: "HLM",
    category: "whoosh",
    region: "KCIC Whoosh",
    city: "Jakarta Timur",
    lat: -6.2444,
    lng: 106.8833,
    elevation: 32,
    status: "Aktif",
    type: "Kereta Cepat (High Speed)",
    image: "assets/images/stations/hlm.jpg",
    review: "Stasiun terminus barat KCIC Whoosh Jakarta-Bandung. Terintegrasi langsung dengan skybridge tertutup menuju Stasiun LRT Jabodebek Halim.",
    facilities: ["Integrasi LRT Jabodebek", "Lounge Eksekutif", "Ruang Tunggu VIP", "Komersial & Tenant Modern"],
    layout: "Lantai 1 Hall Kedatangan & Drop-off, Lantai 2 Concourse & Tiket, Lantai 3 Peron KA Cepat.",
    operationalYears: "2023 - Sekarang"
  },
  {
    id: "pdl-whoosh",
    name: "Padalarang (Whoosh & KAI)",
    code: "PDL",
    category: "whoosh",
    region: "KCIC Whoosh",
    city: "Bandung Barat",
    lat: -6.8427,
    lng: 107.4975,
    elevation: 673,
    status: "Aktif",
    type: "Kereta Cepat & Hub Feeder",
    image: "assets/images/stations/pdl.jpg",
    review: "Hub pertukaran utama antara KA Cepat Whoosh dan KA Feeder KCJB menuju pusat Kota Bandung dengan waktu tempuh 19 menit.",
    facilities: ["Integrasi KA Feeder KCJB", "Commuter Line Bandung Raya", "Gate Tiket Otomatis", "Skybridge"],
    layout: "Gedung utara peron Whoosh terhubung skybridge ke peron KA Feeder dan KA Lokal.",
    operationalYears: "2023 - Sekarang"
  },
  {
    id: "tgl",
    name: "Tegalluar Summarecon",
    code: "TGL",
    category: "whoosh",
    region: "KCIC Whoosh",
    city: "Kabupaten Bandung",
    lat: -6.9664,
    lng: 107.7126,
    elevation: 668,
    status: "Aktif",
    type: "Kereta Cepat Terminus",
    image: "assets/images/stations/tgl.jpg",
    review: "Stasiun ujung timur KCIC Whoosh berdekatan dengan Stadion GBLA, Masjid Al-Jabbar, dan kawasan terpadu Summarecon Bandung.",
    facilities: ["Shuttle Bus Summarecon", "Area Parkir Luas", "Lounge Modern", "Mesin Tiket Mandiri"],
    layout: "Bangunan modern dengan concourse lantai dasar dan peron sejajar.",
    operationalYears: "2023 - Sekarang"
  },

  // ========================== KA ANTARKOTA UTAMA ==========================
  {
    id: "gmr",
    name: "Gambir",
    code: "GMR",
    category: "antarkota",
    region: "Daop 1 Jakarta",
    city: "Jakarta Pusat",
    lat: -6.1767,
    lng: 106.8306,
    elevation: 16,
    status: "Aktif",
    type: "Stasiun Besar Eksekutif",
    image: "assets/images/stations/gmr.jpg",
    review: "Stasiun layang termegah melayani keberangkatan utama KA Eksekutif dan Luxury ke berbagai kota di Pulau Jawa.",
    facilities: ["Coworking Space", "Lounge Luxury", "Tenant Kuliner", "Akses Transjakarta"],
    layout: "Lantai 1 gerai komersial, Lantai 2 ruang boarding, Lantai 3 peron jalur rel layang.",
    operationalYears: "1884 (Modern 1992) - Sekarang"
  },
  {
    id: "pse",
    name: "Pasar Senen",
    code: "PSE",
    category: "antarkota",
    region: "Daop 1 Jakarta",
    city: "Jakarta Pusat",
    lat: -6.1747,
    lng: 106.8447,
    elevation: 4.7,
    status: "Aktif",
    type: "Stasiun Besar Antarkota & KRL",
    image: "assets/images/stations/pse.jpg",
    review: "Stasiun terminus keberangkatan KA Jarak Jauh kelas Ekonomi dan Campuran tersibuk di Jabodetabek berpadu integrasi KRL.",
    facilities: ["Underpass Penumpang", "Face Recognition Gate", "Ruang Menyusui", "Integrasi Bus Transjakarta"],
    layout: "Jalur 1-4 untuk KA Antarkota, Jalur 5-6 untuk Commuter Line.",
    operationalYears: "1925 - Sekarang"
  },
  {
    id: "bd",
    name: "Bandung (Tugu Hall)",
    code: "BD",
    category: "antarkota",
    region: "Daop 2 Bandung",
    city: "Kota Bandung",
    lat: -6.9144,
    lng: 107.6025,
    elevation: 709,
    status: "Aktif",
    type: "Stasiun Besar Preservasi",
    image: "assets/images/stations/bd.jpg",
    review: "Stasiun utama di Kota Kembang sekaligus kantor pusat KAI dengan dua pintu masuk megah (Utara Jl. Kebon Kawung dan Selatan Jl. Stasiun Barat).",
    facilities: ["Skybridge Penyeberangan", "Lounge Eksekutif", "Customer Service On Station", "Sentra Oleh-oleh"],
    layout: "Skybridge kaca melintasi 6 peron rel menghubungkan hall utara dan selatan.",
    operationalYears: "1884 - Sekarang"
  },
  {
    id: "cn",
    name: "Cirebon (Kejaksan)",
    code: "CN",
    category: "antarkota",
    region: "Daop 3 Cirebon",
    city: "Kota Cirebon",
    lat: -6.7061,
    lng: 108.5557,
    elevation: 4,
    status: "Aktif",
    type: "Stasiun Besar Cagar Budaya",
    image: "assets/images/stations/cn.jpg",
    review: "Titik temu penting jalur ganda utara dan lintas tengah Jawa dengan arsitektur art-nouveau peninggalan kolonial Belanda.",
    facilities: ["VIP Lounge", "Boarding Face Recognition", "Charging Station", "Minimarket"],
    layout: "Hall kolonial terhubung langsung ke peron utama dan jalur lintas utara.",
    operationalYears: "1912 - Sekarang"
  },
  {
    id: "smt",
    name: "Semarang Tawang Bank Jateng",
    code: "SMT",
    category: "antarkota",
    region: "Daop 4 Semarang",
    city: "Kota Semarang",
    lat: -6.9644,
    lng: 110.4281,
    elevation: 2,
    status: "Aktif",
    type: "Stasiun Besar Cagar Budaya",
    image: "assets/images/stations/smt.jpg",
    review: "Stasiun warisan NIS berkubah megah di kawasan Kota Lama Semarang dengan ciri khas instrumental 'Gambang Semarang'.",
    facilities: ["Polder Kolam Retensi", "Executive Lounge", "Face Recognition", "Integrasi Trans Semarang"],
    layout: "Kanopi baja melengkung bentang lebar menaungi peron jalur 1 sampai 5.",
    operationalYears: "1868 - Sekarang"
  },
  {
    id: "smc",
    name: "Semarang Poncol",
    code: "SMC",
    category: "antarkota",
    region: "Daop 4 Semarang",
    city: "Kota Semarang",
    lat: -6.9728,
    lng: 110.4147,
    elevation: 3,
    status: "Aktif",
    type: "Stasiun Kelas Besar",
    image: "assets/images/stations/smc.jpg",
    review: "Melayani perjalanan KA Jarak Jauh kelas ekonomi, KA aglomerasi (Kaligung, Kedung Sepur), dan rangkaian barang peti kemas.",
    facilities: ["Underpass Penumpang", "Ruang Tunggu Berpendingin", "Loket Pembatalan/Ubah Tiket"],
    layout: "Bangunan memanjang dengan peron beratap dan akses underpass.",
    operationalYears: "1914 - Sekarang"
  },
  {
    id: "pwt",
    name: "Purwokerto",
    code: "PWT",
    category: "antarkota",
    region: "Daop 5 Purwokerto",
    city: "Kabupaten Banyumas",
    lat: -7.4194,
    lng: 109.2217,
    elevation: 75,
    status: "Aktif",
    type: "Stasiun Kelas Besar Tipe A",
    image: "assets/images/stations/pwt.jpg",
    review: "Pusat Daop 5 di kaki Gunung Slamet yang dilengkapi skybridge kaca megah menyeberangi jalur rel aktif menuju peron pulau.",
    facilities: ["Skybridge Penyeberangan", "Lounge Eksklusif", "Sentra Kuliner Mendoan", "Integrasi Teman Bus"],
    layout: "Gedung baru barat terhubung skybridge ke peron jalur 1-6.",
    operationalYears: "1916 - Sekarang"
  },
  {
    id: "yk",
    name: "Yogyakarta (Tugu)",
    code: "YK",
    category: "antarkota",
    region: "Daop 6 Yogyakarta",
    city: "Kota Yogyakarta",
    lat: -7.7892,
    lng: 110.3635,
    elevation: 113,
    status: "Aktif",
    type: "Stasiun Besar Cagar Budaya",
    image: "assets/images/stations/yk.jpg",
    review: "Stasiun ikonik jantung wisata Jogja tepat di ujung Malioboro. Melayani KA Antarkota, KRL Solo-Jogja, dan KA Bandara YIA.",
    facilities: ["Akses Langsung Malioboro", "Peron Khusus KA Bandara YIA", "Gate Face Recognition", "Lounge Anggrek"],
    layout: "Pintu Timur (Malioboro) untuk KA Eksekutif, Pintu Selatan (Pasar Kembang) untuk KRL & Bandara.",
    operationalYears: "1887 - Sekarang"
  },
  {
    id: "slo",
    name: "Solo Balapan",
    code: "SLO",
    category: "antarkota",
    region: "Daop 6 Yogyakarta",
    city: "Kota Surakarta",
    lat: -7.5575,
    lng: 110.8214,
    elevation: 93,
    status: "Aktif",
    type: "Stasiun Besar Terpadu",
    image: "assets/images/stations/slo.jpg",
    review: "Stasiun legendaris Solo yang terhubung jembatan layang pedestrian Skybridge sepanjang 400 meter langsung ke Terminal Bus Tirtonadi.",
    facilities: ["Skybridge ke Terminal Tirtonadi", "Peron KRL Solo-Jogja", "KA Bandara Adi Soemarmo", "Sentra Batik"],
    layout: "Peron selatan untuk KA Antarkota dan KRL, peron utara terhubung depo dan skybridge.",
    operationalYears: "1870 - Sekarang"
  },
  {
    id: "sgu",
    name: "Surabaya Gubeng",
    code: "SGU",
    category: "antarkota",
    region: "Daop 8 Surabaya",
    city: "Kota Surabaya",
    lat: -7.2654,
    lng: 112.7523,
    elevation: 5,
    status: "Aktif",
    type: "Stasiun Terbesar Jatim",
    image: "assets/images/stations/sgu.jpg",
    review: "Stasiun kereta api terbesar di Surabaya dengan dua gedung utama: Gubeng Baru (KA Antarkota) dan Gubeng Lama (KA Lokal & Commuter).",
    facilities: ["Boarding Face Recognition", "Drop Zone Luas", "Lounge Eksekutif", "Koneksi Bus Trans Semanggi"],
    layout: "Gubeng Baru sisi timur dan Gubeng Lama sisi barat terhubung terowongan penyeberangan.",
    operationalYears: "1878 - Sekarang"
  },
  {
    id: "sbi",
    name: "Surabaya Pasarturi",
    code: "SBI",
    category: "antarkota",
    region: "Daop 8 Surabaya",
    city: "Kota Surabaya",
    lat: -7.2479,
    lng: 112.7314,
    elevation: 1,
    status: "Aktif",
    type: "Stasiun Utama Pantura",
    image: "assets/images/stations/sbi.jpg",
    review: "Titik terminus seluruh KA Jarak Jauh jalur utama Pantura utara Jawa (Argo Bromo Anggrek, Sembrani, Jayabaya).",
    facilities: ["Kanopi Peron Baru", "Lounge Luxury", "Mesin Tiket Mandiri", "Akses Angkutan Kota"],
    layout: "Hall concourse modern dengan akses langsung ke seluruh peron pulau.",
    operationalYears: "1900 - Sekarang"
  },

  // ========================== KA LOKAL COMMUTER LINE (KCI) ==========================
  // --- Lokal Bandung Raya & Garut ---
  {
    id: "ccl",
    name: "Cicalengka",
    code: "CCL",
    category: "lokal-kci",
    region: "Lokal Bandung Raya & Garut",
    city: "Kabupaten Bandung",
    lat: -6.9832,
    lng: 107.8383,
    elevation: 689,
    status: "Aktif",
    type: "Terminus Timur CL Bandung Raya",
    image: "assets/images/stations/ccl.jpg",
    review: "Stasiun terminus timur Commuter Line Bandung Raya. Menjadi titik balik armada kereta lokal menuju Kiaracondong dan Padalarang.",
    facilities: ["Peron Tinggi Baru", "Underpass Penyeberangan", "Tap Multi-Trip"],
    layout: "Gedung modern baru dengan 4 jalur peron.",
    operationalYears: "1884 (Modernisasi 2024) - Sekarang"
  },
  {
    id: "cbt",
    name: "Cibatu",
    code: "CB",
    category: "lokal-kci",
    region: "Lokal Bandung Raya & Garut",
    city: "Kabupaten Garut",
    lat: -7.0944,
    lng: 107.9822,
    elevation: 612,
    status: "Aktif",
    type: "Stasiun Percabangan Bersejarah",
    image: "assets/images/stations/cb.jpg",
    review: "Stasiun persimpangan legendaris antara jalur utama selatan dan jalur cabang reaktivasi menuju Garut. Pernah disinggahi komedian dunia Charlie Chaplin pada tahun 1932.",
    facilities: ["Monumen Sejarah SS", "Ruang Tunggu Luas", "Layanan Tiket Lokal"],
    layout: "Emplasemen luas dengan depo lokomotif pembantu pegunungan.",
    operationalYears: "1889 - Sekarang"
  },
  {
    id: "grt",
    name: "Garut",
    code: "GRT",
    category: "lokal-kci",
    region: "Lokal Bandung Raya & Garut",
    city: "Kabupaten Garut",
    lat: -7.2106,
    lng: 107.9069,
    elevation: 717,
    status: "Aktif",
    type: "Stasiun Reaktivasi Terminus",
    image: "assets/images/stations/grt.jpg",
    review: "Stasiun reaktivasi megah di jantung Kota Garut. Melayani KA Commuter Line Garut relasi Purwakarta-Cibatu-Garut serta KA Cikuray menuju Pasar Senen.",
    facilities: ["Gedung Stasiun Megah Bertingkat", "Ruang Laktasi", "Parkir Park & Ride", "Sentra Dodol Garut"],
    layout: "Bangunan modern bergaya kolonial dengan 3 jalur peron tinggi.",
    operationalYears: "1889 (Reaktivasi 2022) - Sekarang"
  },

  // --- Lokal KCI Jawa Timur (Dhoho & Penataran) ---
  {
    id: "kds",
    name: "Kandangan",
    code: "KDA",
    category: "lokal-kci",
    region: "Lokal Jatim Dhoho-Penataran",
    city: "Kota Surabaya",
    lat: -7.2586,
    lng: 112.6711,
    elevation: 2,
    status: "Aktif",
    type: "Percabangan Lokal Surabaya",
    image: "assets/images/stations/kda.jpg",
    review: "Stasiun persimpangan antara jalur barat Surabaya Pasarturi menuju Semarang dan jalur selatan menuju Kertosono/Malang.",
    facilities: ["Tap Gate Tiket", "Ruang Tunggu", "Peron Beratap"],
    layout: "Stasiun segitiga pembalik rel dengan 3 peron.",
    operationalYears: "1900 - Sekarang"
  },
  {
    id: "kts",
    name: "Kertosono",
    code: "KTS",
    category: "lokal-kci",
    region: "Lokal Jatim Dhoho-Penataran",
    city: "Kabupaten Nganjuk",
    lat: -7.5925,
    lng: 112.1006,
    elevation: 43,
    status: "Aktif",
    type: "Hub Percabangan Dhoho",
    image: "assets/images/stations/kts.jpg",
    review: "Stasiun percabangan utama antara jalur Surabaya-Madiun-Solo dan jalur melingkar selatan menuju Kediri-Blitar-Malang (CL Dhoho).",
    facilities: ["Ruang Tunggu Eksekutif", "Underpass Penumpang", "Warung Kuliner Khas Kertosono"],
    layout: "Emplasemen 7 jalur rel aktif.",
    operationalYears: "1881 - Sekarang"
  },
  {
    id: "kd",
    name: "Kediri",
    code: "KD",
    category: "lokal-kci",
    region: "Lokal Jatim Dhoho-Penataran",
    city: "Kota Kediri",
    lat: -7.8183,
    lng: 112.0167,
    elevation: 68,
    status: "Aktif",
    type: "Stasiun Besar Kelas 1",
    image: "assets/images/stations/kd.jpg",
    review: "Stasiun utama di Kota Tahu yang melayani KA Antarkota (Kahuripan, Brantas, Singasari) serta puluhan trip harian Commuter Line Dhoho.",
    facilities: ["Ruang Tunggu Ber-AC", "Face Recognition", "Sentra Tahu Kuning Kediri"],
    layout: "Bangunan kolonial terawat dengan peron pulau kanopi panjang.",
    operationalYears: "1882 - Sekarang"
  },
  {
    id: "bl",
    name: "Blitar",
    code: "BL",
    category: "lokal-kci",
    region: "Lokal Jatim Dhoho-Penataran",
    city: "Kota Blitar",
    lat: -8.1008,
    lng: 112.1644,
    elevation: 167,
    status: "Aktif",
    type: "Stasiun Titik Temu Dhoho-Penataran",
    image: "assets/images/stations/bl.jpg",
    review: "Stasiun di Kota Proklamator Bung Karno. Titik perpindahan nama kereta lingkar Jawa Timur dari Commuter Line Dhoho menjadi Penataran.",
    facilities: ["Patung & Galeri Sejarah Bung Karno", "VIP Lounge", "Underpass"],
    layout: "Emplasemen 6 jalur dengan depo sarana rangkaian.",
    operationalYears: "1884 - Sekarang"
  },
  {
    id: "ml",
    name: "Malang (Kotabaru)",
    code: "ML",
    category: "lokal-kci",
    region: "Lokal Jatim Dhoho-Penataran",
    city: "Kota Malang",
    lat: -7.9775,
    lng: 112.6375,
    elevation: 444,
    status: "Aktif",
    type: "Stasiun Besar Pegunungan",
    image: "assets/images/stations/ml.jpg",
    review: "Stasiun utama di Kota Malang dengan gedung baru bergaya arsitektur Gunung Kawi yang terhubung jembatan layang kaca skybridge melintasi seluruh rel.",
    facilities: ["Gedung Baru Sisi Timur", "Skybridge Kaca", "Lounge Eksekutif", "Integrasi Bus Wisata"],
    layout: "Lantai 2 concourse skybridge, Lantai 1 peron pulau 5 jalur.",
    operationalYears: "1879 (Gedung Timur 2021) - Sekarang"
  },

  // ========================== KA LOKAL DIKELOLA KAI (NON-KRL) ==========================
  {
    id: "bop",
    name: "Bogor Paledang",
    code: "BOP",
    category: "lokal-kai",
    region: "KA Lokal Pangrango & Siliwangi",
    city: "Kota Bogor",
    lat: -6.6006,
    lng: 106.7906,
    elevation: 246,
    status: "Aktif",
    type: "Terminus KA Lokal Pangrango",
    image: "assets/images/stations/bop.jpg",
    review: "Stasiun terminus keberangkatan KA Pangrango (Bogor Paledang-Sukabumi) yang terhubung skybridge pedestrian langsung ke Stasiun KRL Bogor.",
    facilities: ["Skybridge ke Stasiun KRL Bogor", "Loket KA Lokal", "Ruang Boarding Khusus"],
    layout: "Stasiun permukaan dengan 2 jalur aktif.",
    operationalYears: "2013 - Sekarang"
  },
  {
    id: "si",
    name: "Sukabumi",
    code: "SI",
    category: "lokal-kai",
    region: "KA Lokal Pangrango & Siliwangi",
    city: "Kota Sukabumi",
    lat: -6.9286,
    lng: 106.9275,
    elevation: 584,
    status: "Aktif",
    type: "Hub KA Pangrango & KA Siliwangi",
    image: "assets/images/stations/si.jpg",
    review: "Stasiun persimpangan di kaki Gunung Gede-Pangrango. Titik pergantian armada bagi penumpang KA Pangrango (dari Bogor) yang hendak bersambung KA Siliwangi menuju Cianjur dan Cipatat.",
    facilities: ["Peron Transit Khusus", "Ruang Tunggu", "Pusat Informasi KAI 121"],
    layout: "Gedung klasik kolonial SS dengan 5 jalur aktif.",
    operationalYears: "1882 - Sekarang"
  },
  {
    id: "cj",
    name: "Cianjur",
    code: "CJ",
    category: "lokal-kai",
    region: "KA Lokal Pangrango & Siliwangi",
    city: "Kabupaten Cianjur",
    lat: -6.8217,
    lng: 107.1425,
    elevation: 458,
    status: "Aktif",
    type: "Stasiun Reaktivasi KA Siliwangi",
    image: "assets/images/stations/cj.jpg",
    review: "Stasiun cagar budaya di pusat Kota Cianjur peninggalan SS tahun 1883 yang direaktivasi melayani KA Siliwangi menuju Sukabumi dan Cipatat.",
    facilities: ["Bangunan Cagar Budaya Terawat", "Peron Tinggi Ramah Lansia", "Parkir Motor & Mobil"],
    layout: "Emplasemen 3 jalur rel.",
    operationalYears: "1883 (Reaktivasi 2014) - Sekarang"
  },
  {
    id: "cpt",
    name: "Cipatat",
    code: "CPT",
    category: "lokal-kai",
    region: "KA Lokal Pangrango & Siliwangi",
    city: "Kabupaten Bandung Barat",
    lat: -6.8378,
    lng: 107.3828,
    elevation: 387,
    status: "Aktif",
    type: "Terminus Timur KA Siliwangi",
    image: "assets/images/stations/cpt.jpg",
    review: "Stasiun terminus ujung timur KA Siliwangi setelah Terowongan Lampegan (terowongan KA tertua di Jawa Barat peninggalan 1882).",
    facilities: ["Peron Tinggi Baru", "Loket Tiket", "Ruang Tunggu Terbuka"],
    layout: "Emplasemen pegunungan 2 jalur aktif.",
    operationalYears: "1884 (Reaktivasi 2020) - Sekarang"
  },

  // ========================== KRL JABODETABEK & YOGYAKARTA-SOLO ==========================
  {
    id: "mri",
    name: "Manggarai (Sentral)",
    code: "MRI",
    category: "krl-jabodetabek",
    region: "KRL Jabodetabek",
    city: "Jakarta Selatan",
    lat: -6.2099,
    lng: 106.8499,
    elevation: 13,
    status: "Aktif",
    type: "Stasiun Sentral Bertingkat",
    image: "assets/images/stations/mri.jpg",
    review: "Stasiun sentral pertukaran KRL Commuter Line terbesar di Indonesia. Menghubungkan Bogor Line, Cikarang Loop, dan KA Bandara Soekarno-Hatta.",
    facilities: ["Jalur Bertingkat 3 Lantai", "Lift & Eskalator", "Skybridge Transjakarta", "Pos Medis"],
    layout: "Lantai 1 jalur darat Cikarang Loop & Bandara, Lantai 2 concourse, Lantai 3 jalur layang Bogor Line.",
    operationalYears: "1918 (Sentral 2022) - Sekarang"
  },
  {
    id: "boo",
    name: "Bogor (Buitenzorg)",
    code: "BOO",
    category: "krl-jabodetabek",
    region: "KRL Jabodetabek",
    city: "Kota Bogor",
    lat: -6.5956,
    lng: 106.7903,
    elevation: 246,
    status: "Aktif",
    type: "Stasiun Terminus Cagar Budaya",
    image: "assets/images/stations/boo.jpg",
    review: "Terminus ujung lintas Bogor Line peninggalan SS tahun 1881. Memiliki relief prasasti marmer Belanda yang terawat dan terhubung langsung Alun-Alun Kota Bogor.",
    facilities: ["Akses Langsung Alun-Alun Bogor", "Integrasi Biskita Trans Pakuan", "Hall Tap In Luas"],
    layout: "Stasiun peron kantong terminus dengan 8 jalur rel aktif.",
    operationalYears: "1881 - Sekarang"
  },
  {
    id: "bks",
    name: "Bekasi",
    code: "BKS",
    category: "krl-jabodetabek",
    region: "KRL Jabodetabek",
    city: "Kota Bekasi",
    lat: -6.2361,
    lng: 106.9994,
    elevation: 19,
    status: "Aktif",
    type: "Stasiun Besar Antarkota & KRL",
    image: "assets/images/stations/bks.jpg",
    review: "Stasiun modern bertingkat yang melayani ribuan penglaju harian komuter Cikarang Line serta persinggahan KA Jarak Jauh.",
    facilities: ["Gedung Concourse Bertingkat", "Lift & Eskalator", "Underpass", "Sentra Retail"],
    layout: "Lantai 2 concourse tiket dan boarding, Lantai 1 peron 8 jalur rel.",
    operationalYears: "1887 (Modern 2022) - Sekarang"
  },
  {
    id: "thb",
    name: "Tanah Abang",
    code: "THB",
    category: "krl-jabodetabek",
    region: "KRL Jabodetabek",
    city: "Jakarta Pusat",
    lat: -6.1856,
    lng: 106.8111,
    elevation: 9,
    status: "Aktif",
    type: "Hub Transit Rangkasbitung Line",
    image: "assets/images/stations/thb.jpg",
    review: "Stasiun transit utama penglaju dari arah Banten/Serpong menuju pusat grosir Tanah Abang dan kawasan Sudirman.",
    facilities: ["Jembatan Penyeberangan Skybridge", "Sentra UMKM", "Integrasi Transjakarta"],
    layout: "Emplasemen 6 jalur rel terhubung jembatan concourse atas.",
    operationalYears: "1899 - Sekarang"
  },
  {
    id: "lpn",
    name: "Lempuyangan",
    code: "LPN",
    category: "krl-jogja",
    region: "KRL Yogyakarta-Solo",
    city: "Kota Yogyakarta",
    lat: -7.7903,
    lng: 110.3752,
    elevation: 114,
    status: "Aktif",
    type: "Stasiun KA Ekonomi & KRL",
    image: "assets/images/stations/lpn.jpg",
    review: "Stasiun tertua di Jogja peninggalan NIS (1872). Melayani KA Jarak Jauh subsidi ekonomi dan pemberhentian KRL Yogyakarta-Solo.",
    facilities: ["Underpass Penumpang", "Peron KRL Khusus", "Area Kuliner Khas Jogja"],
    layout: "Emplasemen 11 jalur rel dengan gedung cagar budaya.",
    operationalYears: "1872 - Sekarang"
  },
  {
    id: "kt",
    name: "Klaten",
    code: "KT",
    category: "krl-jogja",
    region: "KRL Yogyakarta-Solo",
    city: "Kabupaten Klaten",
    lat: -7.7121,
    lng: 110.6033,
    elevation: 151,
    status: "Aktif",
    type: "Stasiun Besar Antarkota & KRL",
    image: "assets/images/stations/kt.jpg",
    review: "Stasiun utama di Kabupaten Klaten. Melayani seluruh perjalanan KRL Yogya-Solo dan persinggahan KA Jarak Jauh lintas selatan.",
    facilities: ["Underpass Penumpang", "Lounge Eksekutif", "Sentra UMKM Klaten"],
    layout: "Emplasemen 6 jalur dengan kanopi peron memanjang.",
    operationalYears: "1873 - Sekarang"
  },
  {
    id: "pl",
    name: "Palur",
    code: "PL",
    category: "krl-jogja",
    region: "KRL Yogyakarta-Solo",
    city: "Kabupaten Karanganyar",
    lat: -7.5678,
    lng: 110.8758,
    elevation: 93,
    status: "Aktif",
    type: "Terminus Timur KRL",
    image: "assets/images/stations/pl.jpg",
    review: "Stasiun terminus paling timur untuk rute KRL Commuter Line Yogyakarta-Solo. Menjadi simpul penglaju dari Karanganyar dan Sragen.",
    facilities: ["Concourse Penumpang Modern", "Park & Ride Luas", "Gate Tiket Multi-Trip"],
    layout: "Gedung modern bertingkat dengan peron pulau tinggi.",
    operationalYears: "1884 (Terminus KRL 2022) - Sekarang"
  },

  // ========================== KA INTEGRASI BANDARA ==========================
  {
    id: "yia",
    name: "Bandara YIA (Kulon Progo)",
    code: "YIA",
    category: "bandara",
    region: "Daop 6 Yogyakarta",
    city: "Kabupaten Kulon Progo",
    lat: -7.9069,
    lng: 110.0577,
    elevation: 18,
    status: "Aktif",
    type: "Stasiun Integrasi Bandara",
    image: "assets/images/stations/yia.jpg",
    review: "Stasiun terminus modern terintegrasi langsung di dalam Yogyakarta International Airport. Menghubungkan pusat kota Jogja dalam 35-39 menit.",
    facilities: ["Koneksi Langsung Terminal Bandara", "Layar Jadwal Penerbangan", "Baggage Storage"],
    layout: "Concourse ber-AC terhubung skybridge ber-travellator menuju terminal keberangkatan.",
    operationalYears: "2021 - Sekarang"
  },
  {
    id: "knm",
    name: "Bandara Kualanamu (Railink)",
    code: "KNM",
    category: "bandara",
    region: "Divre I Sumatera Utara",
    city: "Kabupaten Deli Serdang",
    lat: 3.6428,
    lng: 98.8789,
    elevation: 8,
    status: "Aktif",
    type: "Stasiun Bandara Terpadu",
    image: "assets/images/stations/knm.jpg",
    review: "Pelopor stasiun bandara rel terpadu di Indonesia. Melayani armada Railink langsung dari Stasiun Kota Medan ke lantai check-in Kualanamu.",
    facilities: ["Check-in City Terminal", "Eskalator Langsung Lantai Bandara", "Lounge Eksklusif"],
    layout: "Terintegrasi penuh di gedung terminal bandara Kualanamu.",
    operationalYears: "2013 - Sekarang"
  },

  // ========================== CAGAR BUDAYA & HERITAGE ==========================
  {
    id: "abr",
    name: "Museum Ambarawa (Willem I)",
    code: "ABR",
    category: "heritage",
    region: "Heritage NIS / SS",
    city: "Kabupaten Semarang",
    lat: -7.2654,
    lng: 110.4042,
    elevation: 474,
    status: "Preservasi / Museum",
    type: "Museum Wisata Uap",
    image: "assets/images/stations/abr.jpg",
    review: "Stasiun militer Willem I yang kini menjadi museum kereta api terkemuka di Asia Tenggara. Mengoperasikan lokomotif uap legendaris di tepi Rawa Pening.",
    facilities: ["Koleksi 21 Lokomotif Uap Kuno", "Layanan KA Wisata", "Depo Restorasi"],
    layout: "Kompleks museum terbuka dengan stasiun berkanopi besi peninggalan 1873.",
    operationalYears: "1873 (Museum 1976) - Sekarang"
  },
  {
    id: "bdn",
    name: "Bedono (Rel Bergerigi)",
    code: "BDN",
    category: "heritage",
    region: "Heritage NIS / SS",
    city: "Kabupaten Semarang",
    lat: -7.3175,
    lng: 110.3475,
    elevation: 711,
    status: "Preservasi / Rel Gigi",
    type: "Stasiun Rel Gigi Khusus",
    image: "assets/images/stations/bdn.jpg",
    review: "Satu dari tiga jalur rel bergigi yang masih aktif di dunia. Menjadi titik akhir pendakian lokomotif uap bergerigi menaiki tanjakan curam 65 permil.",
    facilities: ["Sistem Rel Gigi Riggenbach", "Pengisian Air Ketel Uap", "Spot Panorama Lembah"],
    layout: "Emplasemen perbukitan dengan rel gigi khusus di tengah bantalan.",
    operationalYears: "1905 - Sekarang"
  }
];

/**
 * KOORDINAT JALUR REL POLYLINES (RUTE OPERASIONAL TERPILIH)
 */
const RAILWAY_ROUTES = {
  "whoosh": {
    name: "KCIC Whoosh Cepat",
    color: "#ef4444",
    weight: 5,
    coords: [
      [-6.2444, 106.8833], // Halim
      [-6.3686, 107.2842], // Karawang
      [-6.8427, 107.4975], // Padalarang
      [-6.9664, 107.7126]  // Tegalluar
    ]
  },
  "antarkota-utara": {
    name: "KA Antarkota (Pantura)",
    color: "#3b82f6",
    weight: 4,
    coords: [
      [-6.1767, 106.8306], // Gambir
      [-6.2151, 106.8681], // Jatinegara
      [-6.2361, 106.9994], // Bekasi
      [-6.2553, 107.1444], // Cikarang
      [-6.4050, 107.4520], // Cikampek
      [-6.7061, 108.5557], // Cirebon
      [-6.8686, 109.1394], // Tegal
      [-6.8886, 109.6753], // Pekalongan
      [-6.9644, 110.4281], // Semarang Tawang
      [-7.1517, 111.5897], // Cepu
      [-7.1561, 111.8819], // Bojonegoro
      [-7.1086, 112.4161], // Lamongan
      [-7.2479, 112.7314]  // Surabaya Pasarturi
    ]
  },
  "antarkota-selatan": {
    name: "KA Antarkota (Lintas Selatan)",
    color: "#6366f1",
    weight: 4,
    coords: [
      [-6.1747, 106.8447], // Pasar Senen
      [-6.7061, 108.5557], // Cirebon
      [-7.4194, 109.2217], // Purwokerto
      [-7.6294, 109.2526], // Kroya
      [-7.7183, 109.9075], // Kutoarjo
      [-7.7892, 110.3635], // Yogyakarta
      [-7.5575, 110.8214], // Solo Balapan
      [-7.6186, 111.5247], // Madiun
      [-7.5925, 112.1006], // Kertosono
      [-7.4475, 112.7178], // Sidoarjo
      [-7.2654, 112.7523]  // Surabaya Gubeng
    ]
  },
  "krl-jabodetabek": {
    name: "KRL Commuter Jabodetabek",
    color: "#22d3ee",
    weight: 4,
    coords: [
      [-6.1376, 106.8146], // Jakarta Kota
      [-6.1667, 106.8302], // Juanda
      [-6.1864, 106.8329], // Gondangdia
      [-6.2099, 106.8499], // Manggarai
      [-6.2427, 106.8601], // Cawang
      [-6.2842, 106.8441], // Pasar Minggu
      [-6.3606, 106.8317], // UI
      [-6.3917, 106.8217], // Depok Baru
      [-6.4489, 106.8014], // Citayam
      [-6.4933, 106.7958], // Bojonggede
      [-6.5292, 106.8011], // Cilebut
      [-6.5956, 106.7903]  // Bogor
    ]
  },
  "krl-jogja": {
    name: "KRL Yogyakarta–Solo–Palur",
    color: "#34d399",
    weight: 4,
    coords: [
      [-7.7892, 110.3635], // Yogyakarta
      [-7.7903, 110.3752], // Lempuyangan
      [-7.7844, 110.4357], // Maguwo
      [-7.7562, 110.4939], // Brambanan
      [-7.7323, 110.5373], // Srowot
      [-7.7121, 110.6033], // Klaten
      [-7.6698, 110.6656], // Ceper
      [-7.6322, 110.7061], // Delanggu
      [-7.5936, 110.7494], // Gawok
      [-7.5645, 110.7967], // Purwosari
      [-7.5575, 110.8214], // Solo Balapan
      [-7.5623, 110.8385], // Solo Jebres
      [-7.5678, 110.8758]  // Palur
    ]
  },
  "lokal-bandung": {
    name: "Lokal Bandung Raya & Garut",
    color: "#fbbf24",
    weight: 4,
    coords: [
      [-6.8427, 107.4975], // Padalarang
      [-6.8789, 107.5458], // Cimahi
      [-6.9144, 107.6025], // Bandung
      [-6.9248, 107.6465], // Kiaracondong
      [-6.9832, 107.8383], // Cicalengka
      [-7.0944, 107.9822], // Cibatu
      [-7.2106, 107.9069]  // Garut
    ]
  },
  "lokal-jatim": {
    name: "Lokal Dhoho & Penataran Jatim",
    color: "#facc15",
    weight: 4,
    coords: [
      [-7.2654, 112.7523], // Surabaya Gubeng
      [-7.4475, 112.7178], // Sidoarjo
      [-7.5500, 112.4333], // Mojokerto
      [-7.5925, 112.1006], // Kertosono
      [-7.8183, 112.0167], // Kediri
      [-8.0167, 111.9000], // Tulungagung
      [-8.1008, 112.1644], // Blitar
      [-8.1667, 112.5667], // Wlingi
      [-8.1500, 112.5667], // Kepanjen
      [-7.9775, 112.6375], // Malang
      [-7.7000, 112.7167], // Bangil
      [-7.2654, 112.7523]  // Kembali Surabaya (Looping)
    ]
  },
  "lokal-kai": {
    name: "KA Lokal Pangrango & Siliwangi",
    color: "#c084fc",
    weight: 4,
    coords: [
      [-6.6006, 106.7906], // Bogor Paledang
      [-6.6908, 106.8086], // Maseng
      [-6.7583, 106.8272], // Cicurug
      [-6.9286, 106.9275], // Sukabumi
      [-6.8500, 107.0333], // Gandasoli
      [-6.8217, 107.1425], // Cianjur
      [-6.8378, 107.3828]  // Cipatat
    ]
  }
};
