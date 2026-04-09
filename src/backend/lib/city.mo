import Types "../types/city";
import List "mo:core/List";

module {
  /// Seed 10 city-guessing questions for major Indonesian cities.
  /// gambar1 and gambar2 are descriptive text/emoji that the frontend renders as illustrated cards.
  public func seedCityQuestions(store : List.List<Types.CityQuestion>) {
    let data : [Types.CityQuestion] = [
      {
        id = 1;
        gambar1 = "🗼 Monumen Nasional (Monas) — obelisk setinggi 132 meter berlapis emas di jantung kota, simbol kemerdekaan Indonesia";
        gambar2 = "🔵 Bundaran Hotel Indonesia — air mancur megah di persimpangan pusat kota dengan patung Selamat Datang";
        namaKota = "Jakarta";
        pilihan = ["Jakarta", "Surabaya", "Bandung", "Semarang"];
        poinDasar = 100;
        batasWaktu = 30;
        penjelasan = "Jakarta adalah ibu kota Indonesia. Monas (Monumen Nasional) dibangun pada tahun 1961 dan menjadi ikon kebanggaan bangsa, sementara Bundaran HI menjadi titik kumpul perayaan penting.";
      },
      {
        id = 2;
        gambar1 = "🌉 Jembatan Suramadu — jembatan terpanjang di Indonesia (5.438 m) yang menghubungkan Jawa dan Madura melintasi Selat Madura";
        gambar2 = "⚔️ Tugu Pahlawan — monumen setinggi 41,15 meter berbentuk paku terbalik untuk mengenang pertempuran 10 November 1945";
        namaKota = "Surabaya";
        pilihan = ["Surabaya", "Malang", "Jakarta", "Makassar"];
        poinDasar = 100;
        batasWaktu = 30;
        penjelasan = "Surabaya, Kota Pahlawan, adalah kota terbesar kedua di Indonesia. Jembatan Suramadu diresmikan tahun 2009, sedangkan Tugu Pahlawan menandai lokasi pertempuran heroik melawan penjajah.";
      },
      {
        id = 3;
        gambar1 = "🏛️ Gedung Sate — bangunan kolonial Belanda bergaya neo-Renaisans dengan ornamen tusuk sate di puncak menara, kini kantor Gubernur Jawa Barat";
        gambar2 = "🎡 Trans Studio Bandung — taman hiburan indoor terbesar di Indonesia dengan wahana seru di dalam gedung raksasa";
        namaKota = "Bandung";
        pilihan = ["Bandung", "Yogyakarta", "Jakarta", "Bali"];
        poinDasar = 100;
        batasWaktu = 30;
        penjelasan = "Bandung, Kota Kembang, dikenal dengan iklimnya yang sejuk dan budayanya yang kaya. Gedung Sate dibangun pada 1920 dan mendapat namanya karena ornamen khas di atapnya yang menyerupai tusuk sate.";
      },
      {
        id = 4;
        gambar1 = "🛕 Candi Borobudur — candi Buddha terbesar di dunia berusia 1.200 tahun dengan 2.672 relief dan 504 arca Buddha di sembilan tingkat teras";
        gambar2 = "👑 Kraton Yogyakarta — istana megah Kesultanan Ngayogyakarta Hadiningrat yang masih aktif sebagai pusat budaya dan pemerintahan kerajaan";
        namaKota = "Yogyakarta";
        pilihan = ["Yogyakarta", "Solo", "Magelang", "Bandung"];
        poinDasar = 150;
        batasWaktu = 35;
        penjelasan = "Yogyakarta adalah pusat seni dan budaya Jawa. Borobudur, warisan UNESCO, dibangun abad ke-9 oleh Dinasti Syailendra. Kraton Yogyakarta masih dihuni oleh Sultan dan keluarganya hingga kini.";
      },
      {
        id = 5;
        gambar1 = "🕌 Masjid Raya Al-Mashun Medan — masjid berarsitektur campuran Melayu, Arab, India, dan Eropa yang dibangun Sultan Deli pada 1906";
        gambar2 = "🏰 Istana Maimun — istana Sultan Deli bergaya Melayu-Islam berwarna kuning cerah dengan 30 ruangan megah dibangun tahun 1888";
        namaKota = "Medan";
        pilihan = ["Medan", "Palembang", "Pekanbaru", "Padang"];
        poinDasar = 150;
        batasWaktu = 35;
        penjelasan = "Medan adalah kota terbesar di Sumatera dan ketiga terbesar di Indonesia. Istana Maimun dan Masjid Raya Al-Mashun merupakan peninggalan Kesultanan Deli yang kini menjadi ikon wisata bersejarah.";
      },
      {
        id = 6;
        gambar1 = "🌊 Pura Tanah Lot — pura Hindu di atas batu karang di tengah laut yang hanya dapat dicapai saat air surut, tersapu ombak Samudra Hindia";
        gambar2 = "🦅 Pura Uluwatu — pura sakral di tepi tebing setinggi 70 meter menghadap Samudra Hindia di ujung selatan Semenanjung Bukit, Bali";
        namaKota = "Bali";
        pilihan = ["Bali", "Lombok", "Yogyakarta", "Manado"];
        poinDasar = 100;
        batasWaktu = 30;
        penjelasan = "Bali, Pulau Dewata, terkenal dengan budaya Hindu yang kaya dan keindahan alamnya. Pura Tanah Lot dan Pura Uluwatu adalah dua dari enam pura laut suci (sad kahyangan jagat) di Bali.";
      },
      {
        id = 7;
        gambar1 = "🏯 Benteng Rotterdam — benteng peninggalan VOC Belanda berbentuk penyu berlapis yang dibangun pada 1545 di tepi pantai Makassar";
        gambar2 = "🌅 Pantai Losari — promenade ikonik Kota Makassar di tepi Selat Makassar, tempat menikmati matahari terbenam dan pisang epe";
        namaKota = "Makassar";
        pilihan = ["Makassar", "Manado", "Ambon", "Kupang"];
        poinDasar = 150;
        batasWaktu = 35;
        penjelasan = "Makassar (Ujung Pandang) adalah gerbang utama Indonesia bagian timur. Benteng Rotterdam yang dinamai dari kota kelahiran Gubernur Jenderal VOC menjadi museum sejarah yang kaya koleksi.";
      },
      {
        id = 8;
        gambar1 = "👻 Lawang Sewu — gedung bersejarah era kolonial Belanda berarti 'Seribu Pintu', dibangun 1904 sebagai kantor kereta api Hindia Belanda";
        gambar2 = "🏘️ Kota Lama Semarang — kawasan bersejarah bergaya Eropa abad ke-17 yang dijuluki 'Little Netherland' dengan puluhan gedung tua yang terawat";
        namaKota = "Semarang";
        pilihan = ["Semarang", "Solo", "Yogyakarta", "Kudus"];
        poinDasar = 150;
        batasWaktu = 35;
        penjelasan = "Semarang, ibu kota Jawa Tengah, menyimpan banyak peninggalan sejarah kolonial. Lawang Sewu sempat menjadi penjara pada masa pendudukan Jepang dan kini menjadi destinasi wisata sejarah.";
      },
      {
        id = 9;
        gambar1 = "🌉 Jembatan Ampera — jembatan merah ikonik di atas Sungai Musi, simbol Kota Palembang, dibangun tahun 1962 dengan panjang 1.177 meter";
        gambar2 = "🏰 Benteng Kuto Besak — benteng pertahanan Kesultanan Palembang dibangun pada 1780 di tepi Sungai Musi sebagai pusat kekuasaan kerajaan";
        namaKota = "Palembang";
        pilihan = ["Palembang", "Jambi", "Bengkulu", "Lampung"];
        poinDasar = 150;
        batasWaktu = 35;
        penjelasan = "Palembang adalah kota tertua di Indonesia yang telah berusia lebih dari 1.300 tahun. Sungai Musi membelah kota dan menjadi urat nadi kehidupan sejak era Kerajaan Sriwijaya.";
      },
      {
        id = 10;
        gambar1 = "🌳 Alun-alun Kota Malang — ruang publik hijau di jantung kota berusia 200 tahun dikelilingi pohon beringin tua dan bangunan bersejarah";
        gambar2 = "🛍️ Kayutangan Heritage — kawasan pedestrian bersejarah dengan deretan bangunan kolonial Belanda yang telah direvitalisasi menjadi pusat kuliner dan seni";
        namaKota = "Malang";
        pilihan = ["Malang", "Surabaya", "Batu", "Blitar"];
        poinDasar = 100;
        batasWaktu = 30;
        penjelasan = "Malang, Kota Apel, dikenal dengan udaranya yang sejuk dan kekayaan sejarahnya. Kayutangan adalah jantung kota bersejarah yang kini bangkit kembali sebagai destinasi wisata urban yang trendi.";
      },
    ];
    for (q in data.vals()) {
      store.add(q);
    };
  };

  /// Retrieve a single city question by ID.
  public func getCityQuestion(store : List.List<Types.CityQuestion>, id : Nat) : ?Types.CityQuestion {
    store.find(func(q) { q.id == id });
  };

  /// Return all city questions as an immutable array.
  public func getAllCityQuestions(store : List.List<Types.CityQuestion>) : [Types.CityQuestion] {
    store.toArray();
  };
};
