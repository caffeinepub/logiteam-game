export type GameMode = "solo" | "tim";

export type Kesulitan = "mudah" | "sedang" | "sulit";

export type StatusSesi = "menunggu" | "aktif" | "selesai";

export interface Puzzle {
  id: string;
  pertanyaan: string;
  opsi: string[];
  jawaban: string;
  penjelasan: string;
  poin: number;
  kesulitan: Kesulitan;
  kategori: string;
}

export interface AnggotaTim {
  id: string;
  nama: string;
  peran: "ketua" | "anggota";
  status: "online" | "idle" | "offline";
  skorKontribusi: number;
}

export interface SessionState {
  id: string;
  mode: GameMode;
  namaTim?: string;
  pemain: AnggotaTim[];
  skorTotal: number;
  puzzleAktif?: Puzzle;
  puzzleIndex: number;
  totalPuzzle: number;
  status: StatusSesi;
  jawabanDipilih?: string;
  waktuMulai: number;
}

export interface LeaderboardEntry {
  peringkat: number;
  namaTim: string;
  skor: number;
  emot: string;
  puzzleSelesai: number;
  waktu?: number;
}

export interface SessionHistory {
  id: string;
  mode: GameMode;
  namaTim?: string;
  skor: number;
  puzzleSelesai: number;
  totalPuzzle: number;
  tanggal: number;
  durasi: number;
}

export interface GameContextValue {
  namaPemain: string;
  setNamaPemain: (nama: string) => void;
  sesiAktif: SessionState | null;
  setSesiAktif: (sesi: SessionState | null) => void;
  skorGlobal: number;
  setSkorGlobal: (skor: number) => void;
}

export interface HasilJawaban {
  benar: boolean;
  poinDiperoleh: number;
  penjelasan: string;
  jawabanBenar: string;
}

export interface CityQuestion {
  id: string;
  gambar1: string;
  gambar2: string;
  namaKota: string;
  pilihan: string[];
  poinDasar: number;
  batasWaktu: number;
  penjelasan: string;
}
