import type { backendInterface } from "../backend";
import { Difficulty, ModeSesi, StatusSesi } from "../backend";

export const mockBackend: backendInterface = {
  bergabungSesiTim: async (_kode) => BigInt(1),
  buatSesiSolo: async () => BigInt(1),
  buatSesiTim: async () => [BigInt(1), "TEAM-ABC"] as [bigint, string],
  daftarkanNama: async (_nama, _sessionId, _namaTim) => undefined,
  setNamaTim: async (_sessionId, _namaTim) => true,
  getLeaderboard: async () => [
    {
      namaPemain: "Budi Santoso",
      userId: { _isPrincipal: true, toText: () => "abc-1" } as any,
      totalPoin: BigInt(2500),
      jumlahPermainan: BigInt(12),
    },
    {
      namaPemain: "Siti Rahayu",
      userId: { _isPrincipal: true, toText: () => "abc-2" } as any,
      totalPoin: BigInt(2100),
      jumlahPermainan: BigInt(10),
    },
    {
      namaPemain: "Ahmad Fauzi",
      userId: { _isPrincipal: true, toText: () => "abc-3" } as any,
      totalPoin: BigInt(1800),
      jumlahPermainan: BigInt(9),
    },
    {
      namaPemain: "Dewi Lestari",
      userId: { _isPrincipal: true, toText: () => "abc-4" } as any,
      totalPoin: BigInt(1500),
      jumlahPermainan: BigInt(7),
    },
    {
      namaPemain: "Rizky Pratama",
      userId: { _isPrincipal: true, toText: () => "abc-5" } as any,
      totalPoin: BigInt(1200),
      jumlahPermainan: BigInt(6),
    },
  ],
  getPoinKumulatif: async () => BigInt(2500),
  getPoinSesi: async (_sessionId) => BigInt(350),
  getPuzzle: async (_id) => ({
    id: BigInt(1),
    pertanyaan:
      "Tim Anda memiliki 4 anggota. Setiap anggota harus menyeberangi jembatan dalam waktu yang berbeda: 1, 2, 5, dan 10 menit. Jembatan hanya bisa dilalui 2 orang sekaligus dan membutuhkan senter. Berapa waktu minimum semua anggota bisa menyeberang?",
    jawabanBenar: BigInt(1),
    poinDasar: BigInt(100),
    batasWaktu: BigInt(60),
    pilihan: ["17 menit", "19 menit", "21 menit", "23 menit"],
    kesulitan: Difficulty.sedang,
    penjelasan:
      "Strategi optimal: 1+2 menyeberang (2 menit), 1 kembali (1 menit), 5+10 menyeberang (10 menit), 2 kembali (2 menit), 1+2 menyeberang (2 menit). Total: 17 menit.",
  }),
  getRiwayatSesi: async () => [
    {
      akurasi: BigInt(85),
      tanggal: BigInt(Date.now() * 1_000_000 - 86400000000000),
      mode: "solo",
      poin: BigInt(450),
      sessionId: BigInt(1),
    },
    {
      akurasi: BigInt(70),
      tanggal: BigInt(Date.now() * 1_000_000 - 172800000000000),
      mode: "tim",
      poin: BigInt(380),
      sessionId: BigInt(2),
    },
  ],
  getSesi: async (_sessionId) => ({
    id: BigInt(1),
    status: StatusSesi.aktif,
    kodeJoin: "TEAM-ABC",
    mode: ModeSesi.solo,
    anggota: [],
    totalPoin: BigInt(350),
    waktuMulai: BigInt(Date.now() * 1_000_000),
    puzzles: [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)],
    indeksPuzzleAktif: BigInt(0),
    jawabanPuzzles: [],
  }),
  puzzleByKesulitan: async (_kesulitan) => [],
  semuaPuzzle: async () => [
    {
      id: BigInt(1),
      pertanyaan:
        "Tim Anda memiliki 4 anggota. Setiap anggota harus menyeberangi jembatan dalam waktu yang berbeda: 1, 2, 5, dan 10 menit. Jembatan hanya bisa dilalui 2 orang sekaligus dan membutuhkan senter. Berapa waktu minimum semua anggota bisa menyeberang?",
      jawabanBenar: BigInt(0),
      poinDasar: BigInt(100),
      batasWaktu: BigInt(60),
      pilihan: ["17 menit", "19 menit", "21 menit", "23 menit"],
      kesulitan: Difficulty.sedang,
      penjelasan:
        "Strategi optimal: 1+2 menyeberang (2 menit), 1 kembali (1 menit), 5+10 menyeberang (10 menit), 2 kembali (2 menit), 1+2 menyeberang (2 menit). Total: 17 menit.",
    },
  ],
  submitJawaban: async (_sessionId, _puzzleId, _pilihanJawaban) => ({
    poinTim: BigInt(100),
    poinDiperoleh: BigInt(80),
    semuaSudahJawab: true,
    benar: true,
    penjelasan:
      "Strategi optimal: 1+2 menyeberang (2 menit), 1 kembali (1 menit), 5+10 menyeberang (10 menit), 2 kembali (2 menit), 1+2 menyeberang (2 menit). Total: 17 menit.",
  }),
  getCityQuestion: async (_id) => null,
  semuaCityQuestions: async () => [],
};
