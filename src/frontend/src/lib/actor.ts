import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

// Re-export useActor for convenience
export { useActor };

// Local puzzle data since backend interface is not yet populated
export interface PuzzleLocal {
  id: string;
  pertanyaan: string;
  konteks?: string;
  opsi: { kode: string; teks: string }[];
  jawaban: string;
  penjelasan: string;
  poin: number;
  kesulitan: "mudah" | "sedang" | "sulit";
  kategori: string;
}

export const PUZZLES_LOCAL: PuzzleLocal[] = [
  {
    id: "p1",
    pertanyaan:
      "Siapakah yang paling mungkin berbohong berdasarkan pernyataan berikut?",
    konteks:
      "Andi, Budi, dan Candra tersangka pelanggaran SOP. Hanya satu yang berbohong.",
    opsi: [
      { kode: "A", teks: "Andi" },
      { kode: "B", teks: "Budi" },
      { kode: "C", teks: "Candra" },
    ],
    jawaban: "A",
    penjelasan:
      'Jika Andi jujur, Budi berbohong dan Candra jujur. Tapi Budi mengatakan "Candra berbohong" — kontradiksi. Maka Andi-lah yang berbohong.',
    poin: 150,
    kesulitan: "sedang",
    kategori: "Logika Deduksi",
  },
  {
    id: "p2",
    pertanyaan:
      "Tim terdiri dari 5 orang. Setiap anggota harus berjabat tangan dengan semua anggota lainnya tepat sekali. Berapa total jabat tangan?",
    opsi: [
      { kode: "A", teks: "10" },
      { kode: "B", teks: "20" },
      { kode: "C", teks: "25" },
    ],
    jawaban: "A",
    penjelasan: "Rumus kombinasi C(5,2) = 5×4/2 = 10 jabat tangan.",
    poin: 100,
    kesulitan: "mudah",
    kategori: "Matematika Logika",
  },
  {
    id: "p3",
    pertanyaan:
      "Dalam rapat tim, setiap keputusan butuh persetujuan mayoritas. Ada 7 anggota. Jika 3 setuju dan 2 abstain, apakah keputusan disahkan?",
    opsi: [
      { kode: "A", teks: "Ya, karena 3 dari 5 suara aktif mendukung" },
      {
        kode: "B",
        teks: "Tidak, karena 3 dari 7 total anggota belum mayoritas",
      },
      { kode: "C", teks: "Ya, karena abstain dihitung sebagai setuju" },
    ],
    jawaban: "B",
    penjelasan:
      "Mayoritas dari 7 anggota = minimal 4. Dengan 3 setuju, keputusan belum mencapai mayoritas mutlak.",
    poin: 200,
    kesulitan: "sedang",
    kategori: "Pengambilan Keputusan",
  },
  {
    id: "p4",
    pertanyaan:
      "4 staf harus menyelesaikan 4 tugas berbeda. Ani hanya bisa tugas 1 atau 3. Budi hanya bisa tugas 2. Candra bisa semua kecuali 1. Deni ambil tugas 4. Siapa ambil tugas 1?",
    opsi: [
      { kode: "A", teks: "Ani" },
      { kode: "B", teks: "Candra" },
      { kode: "C", teks: "Tidak mungkin ditentukan" },
    ],
    jawaban: "A",
    penjelasan:
      "Deni=4, Budi=2, Candra tidak bisa 1 → Candra=3. Maka Ani harus ambil tugas 1.",
    poin: 250,
    kesulitan: "sulit",
    kategori: "Penugasan Optimal",
  },
  {
    id: "p5",
    pertanyaan:
      "Proyek A membutuhkan 3 hari, B 5 hari, C 2 hari. A harus selesai sebelum C. B bisa paralel dengan A dan C. Berapa hari minimum semua proyek selesai?",
    opsi: [
      { kode: "A", teks: "5 hari" },
      { kode: "B", teks: "7 hari" },
      { kode: "C", teks: "10 hari" },
    ],
    jawaban: "A",
    penjelasan:
      "A(3 hari) → C(2 hari) = 5 hari jalur kritis. B berjalan paralel selesai hari ke-5. Minimum = 5 hari.",
    poin: 300,
    kesulitan: "sulit",
    kategori: "Manajemen Proyek",
  },
  {
    id: "p6",
    pertanyaan:
      "Seorang kepala tim selalu memuji anggota yang bekerja keras. Dewi dipuji kepala tim. Apa kesimpulan yang PASTI benar?",
    opsi: [
      { kode: "A", teks: "Dewi bekerja keras" },
      { kode: "B", teks: "Dewi mungkin bekerja keras" },
      { kode: "C", teks: "Dewi adalah favorit kepala tim" },
    ],
    jawaban: "A",
    penjelasan:
      'Premis: "Selalu memuji yang bekerja keras." Dewi dipuji → Dewi pasti bekerja keras. Ini silogisme valid.',
    poin: 150,
    kesulitan: "mudah",
    kategori: "Silogisme",
  },
  {
    id: "p7",
    pertanyaan:
      "Dalam distribusi tugas, prinsip keadilan mensyaratkan beban kerja proporsional. Tim 4 orang selesaikan 120 unit kerja dalam 8 jam. Jika 1 orang absen, berapa jam yang dibutuhkan tim tersisa untuk beban sama?",
    opsi: [
      { kode: "A", teks: "10 jam" },
      { kode: "B", teks: "10.67 jam" },
      { kode: "C", teks: "12 jam" },
    ],
    jawaban: "B",
    penjelasan:
      "Kapasitas 4 orang = 15 unit/jam. Dengan 3 orang = 11.25 unit/jam. 120/11.25 ≈ 10.67 jam.",
    poin: 200,
    kesulitan: "sedang",
    kategori: "Perhitungan Efisiensi",
  },
  {
    id: "p8",
    pertanyaan:
      "5 tim berlomba. Tim Merah lebih cepat dari Tim Biru. Tim Hijau lebih lambat dari Tim Kuning. Tim Kuning lebih cepat dari Tim Merah. Tim Putih paling lambat. Urutan pertama hingga terakhir?",
    opsi: [
      { kode: "A", teks: "Kuning, Merah, Biru, Hijau, Putih" },
      { kode: "B", teks: "Hijau, Kuning, Merah, Biru, Putih" },
      { kode: "C", teks: "Kuning, Merah, Hijau, Biru, Putih" },
    ],
    jawaban: "A",
    penjelasan:
      "Kuning > Merah > Biru; Kuning > Hijau; Putih terakhir. Urutan: Kuning → Merah → Biru → Hijau → Putih.",
    poin: 250,
    kesulitan: "sedang",
    kategori: "Urutan Logika",
  },
  {
    id: "p9",
    pertanyaan:
      "Setiap pemimpin yang efektif mendengarkan timnya. Pak Hendra tidak pernah mengabaikan masukan tim. Apakah Pak Hendra pemimpin efektif?",
    opsi: [
      { kode: "A", teks: "Ya, karena ia mendengarkan timnya" },
      {
        kode: "B",
        teks: "Belum tentu — mendengarkan bukan satu-satunya syarat",
      },
      {
        kode: "C",
        teks: "Tidak, karena tidak semua yang mendengarkan itu efektif",
      },
    ],
    jawaban: "B",
    penjelasan:
      'Premis hanya menyatakan syarat perlu: "pemimpin efektif SELALU mendengarkan." Mendengarkan belum tentu cukup untuk efektif.',
    poin: 200,
    kesulitan: "sedang",
    kategori: "Penalaran Kondisional",
  },
  {
    id: "p10",
    pertanyaan:
      "Tim memiliki anggaran Rp 100 juta. Proyek X butuh Rp 60 juta, Y butuh Rp 45 juta, Z butuh Rp 30 juta. Semua harus selesai. Mana kombinasi yang TIDAK mungkin dalam 1 anggaran?",
    opsi: [
      { kode: "A", teks: "X + Z = Rp 90 juta" },
      { kode: "B", teks: "X + Y = Rp 105 juta" },
      { kode: "C", teks: "Y + Z = Rp 75 juta" },
    ],
    jawaban: "B",
    penjelasan:
      "X + Y = Rp 105 juta melebihi anggaran Rp 100 juta. Kombinasi ini tidak mungkin dijalankan bersamaan.",
    poin: 150,
    kesulitan: "mudah",
    kategori: "Analisis Anggaran",
  },
];

export function usePuzzles() {
  return useQuery({
    queryKey: ["puzzles"],
    queryFn: async (): Promise<PuzzleLocal[]> => {
      // Backend not yet populated — use local data
      return PUZZLES_LOCAL;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export interface LeaderboardEntryLocal {
  peringkat: number;
  namaTim: string;
  skor: number;
  emot: string;
  puzzleSelesai: number;
}

export interface CityQuestionLocal {
  id: string;
  gambar1: string;
  gambar2: string;
  namaKota: string;
  pilihan: string[];
  poinDasar: number;
  batasWaktu: number;
  penjelasan: string;
}

export const CITY_QUESTIONS_LOCAL: CityQuestionLocal[] = [
  {
    id: "kota1",
    gambar1:
      "🏛️ Monumen Nasional\nTugu emas setinggi 132m\nSimbol kemerdekaan RI",
    gambar2:
      "🔄 Bundaran Hotel Indonesia\nFontain ikonik di jantung kota\nKawasan bisnis terpusat",
    namaKota: "Jakarta",
    pilihan: ["Jakarta", "Surabaya", "Bandung", "Semarang"],
    poinDasar: 100,
    batasWaktu: 30,
    penjelasan:
      "Monas dan Bundaran HI adalah landmark paling ikonik di Jakarta, ibu kota Indonesia.",
  },
  {
    id: "kota2",
    gambar1:
      "🦈 Monumen Hiu & Buaya\nPatung raksasa simbol keberanian\nKota Pahlawan",
    gambar2:
      "⛪ Gereja Kelahiran Yesus\nArsitektur kolonial Belanda\nJalan Kembang Jepun",
    namaKota: "Surabaya",
    pilihan: ["Surabaya", "Malang", "Sidoarjo", "Gresik"],
    poinDasar: 120,
    batasWaktu: 30,
    penjelasan:
      "Monumen Suro dan Boyo (Hiu & Buaya) adalah simbol Kota Surabaya yang terkenal sebagai Kota Pahlawan.",
  },
  {
    id: "kota3",
    gambar1:
      "🌸 Gedung Sate\nAtap berbentuk sate tusuk\nKantor Gubernur Jawa Barat",
    gambar2:
      "🌊 Curug Dago\nAir terjun di kawasan Dago\nSejuk di ketinggian 768 mdpl",
    namaKota: "Bandung",
    pilihan: ["Bandung", "Cirebon", "Bekasi", "Bogor"],
    poinDasar: 110,
    batasWaktu: 30,
    penjelasan:
      "Gedung Sate dengan ornamen tusuk sate di atapnya adalah ikon Kota Bandung, Paris van Java.",
  },
  {
    id: "kota4",
    gambar1:
      "🏯 Keraton Ngayogyakarta\nIstana Sultan sejak 1755\nPusat budaya Jawa",
    gambar2:
      "🌋 Gunung Merapi\nVolkan aktif paling berbahaya\nPenjaga kota dari utara",
    namaKota: "Yogyakarta",
    pilihan: ["Yogyakarta", "Solo", "Magelang", "Klaten"],
    poinDasar: 130,
    batasWaktu: 30,
    penjelasan:
      "Keraton Ngayogyakarta dan pemandangan Gunung Merapi adalah ciri khas Kota Yogyakarta, kota budaya Indonesia.",
  },
  {
    id: "kota5",
    gambar1:
      "🕌 Masjid Raya Al Mashun\nArsitektur Melayu-Mughal-Spanyol\nDibangun 1906 oleh Sultan Deli",
    gambar2:
      "🌴 Istana Maimun\nIstana Kerajaan Deli 1888\nBerarsitektur Melayu-Italia",
    namaKota: "Medan",
    pilihan: ["Medan", "Pekanbaru", "Palembang", "Padang"],
    poinDasar: 140,
    batasWaktu: 30,
    penjelasan:
      "Masjid Raya Al Mashun dan Istana Maimun adalah peninggalan Kesultanan Deli di Kota Medan.",
  },
  {
    id: "kota6",
    gambar1:
      "🌺 Pura Tanah Lot\nKuil Hindu di atas batu karang\nDi tepi Samudra Hindia",
    gambar2:
      "🌾 Sawah Tegalalang\nTerasering berundak-undak\nSistem irigasi Subak UNESCO",
    namaKota: "Bali",
    pilihan: ["Bali", "Lombok", "Flores", "Kupang"],
    poinDasar: 100,
    batasWaktu: 30,
    penjelasan:
      "Pura Tanah Lot dan sawah Tegalalang di Ubud adalah ikon Pulau Bali yang terkenal di dunia.",
  },
  {
    id: "kota7",
    gambar1:
      "🦅 Fort Rotterdam\nBenteng Belanda abad ke-17\nWarisan kolonial di pesisir",
    gambar2:
      "🌊 Pantai Losari\nBeranda Kota Makassar\nSunset terindah di timur",
    namaKota: "Makassar",
    pilihan: ["Makassar", "Manado", "Kendari", "Palu"],
    poinDasar: 150,
    batasWaktu: 30,
    penjelasan:
      "Fort Rotterdam dan Pantai Losari adalah landmark khas Kota Makassar, pintu gerbang Indonesia Timur.",
  },
  {
    id: "kota8",
    gambar1:
      "🕍 Lawang Sewu\nGedung seribu pintu 1904\nArsitektur Neo-Renaissance",
    gambar2:
      "⛩️ Sam Poo Kong\nKlenteng Cheng Ho tertua\nPerpaduan budaya Tionghoa-Jawa",
    namaKota: "Semarang",
    pilihan: ["Semarang", "Solo", "Purwokerto", "Tegal"],
    poinDasar: 140,
    batasWaktu: 30,
    penjelasan:
      "Lawang Sewu dan Klenteng Sam Poo Kong adalah ikon kota Semarang dengan kekayaan sejarah kolonial.",
  },
  {
    id: "kota9",
    gambar1:
      "🌉 Jembatan Ampera\nJembatan kebanggaan 1965\nMembelah Sungai Musi",
    gambar2:
      "🛶 Sungai Musi\nSungai terpanjang di Sumatera\nPusat aktivitas warga",
    namaKota: "Palembang",
    pilihan: ["Palembang", "Jambi", "Bengkulu", "Lampung"],
    poinDasar: 150,
    batasWaktu: 30,
    penjelasan:
      "Jembatan Ampera yang membentang di Sungai Musi adalah simbol utama Kota Palembang.",
  },
  {
    id: "kota10",
    gambar1: "🏔️ Gunung Bromo\nKawah berapi aktif\nPemandangan matahari terbit",
    gambar2:
      "🌸 Alun-Alun Batu\nKota wisata berhawa sejuk\nDikelilingi pegunungan",
    namaKota: "Malang",
    pilihan: ["Malang", "Surabaya", "Blitar", "Probolinggo"],
    poinDasar: 130,
    batasWaktu: 30,
    penjelasan:
      "Kawasan Malang dikenal sebagai kota pelajar yang sejuk, dekat dengan keajaiban Gunung Bromo.",
  },
];

export function useCityQuestions() {
  return useQuery({
    queryKey: ["cityQuestions"],
    queryFn: async (): Promise<CityQuestionLocal[]> => {
      return CITY_QUESTIONS_LOCAL;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<LeaderboardEntryLocal[]> => {
      return [
        {
          peringkat: 1,
          namaTim: "Tim Elang Biru",
          skor: 2450,
          emot: "🦅",
          puzzleSelesai: 10,
        },
        {
          peringkat: 2,
          namaTim: "Tim Garuda Emas",
          skor: 2200,
          emot: "🦅",
          puzzleSelesai: 10,
        },
        {
          peringkat: 3,
          namaTim: "Tim Beruang Madu",
          skor: 1950,
          emot: "🐻",
          puzzleSelesai: 9,
        },
        {
          peringkat: 4,
          namaTim: "Tim Singa Perkasa",
          skor: 1800,
          emot: "🦁",
          puzzleSelesai: 9,
        },
        {
          peringkat: 5,
          namaTim: "Tim Merak Indah",
          skor: 1550,
          emot: "🦚",
          puzzleSelesai: 8,
        },
      ];
    },
    staleTime: 1000 * 60 * 2,
  });
}
