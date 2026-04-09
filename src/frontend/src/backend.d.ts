import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface JawabanPuzzle {
    sudahDievaluasi: boolean;
    poinTim: bigint;
    puzzleId: PuzzleId;
    waktuMulai: Timestamp;
    jawabanAnggota: Array<JawabanAnggota>;
}
export type Timestamp = bigint;
export interface EntriLeaderboard {
    namaPemain: string;
    userId: UserId;
    totalPoin: bigint;
    namaTim?: string;
    jumlahPermainan: bigint;
}
export type SessionId = bigint;
export type PuzzleId = bigint;
export interface HasilJawaban {
    poinTim?: bigint;
    poinDiperoleh: bigint;
    semuaSudahJawab: boolean;
    benar: boolean;
    penjelasan: string;
}
export type UserId = Principal;
export interface JawabanAnggota {
    userId: UserId;
    poinDiperoleh: bigint;
    pilihanJawaban: bigint;
    waktuSubmit: Timestamp;
    benar: boolean;
}
export type TeamCode = string;
export interface Puzzle {
    id: PuzzleId;
    pertanyaan: string;
    jawabanBenar: bigint;
    poinDasar: bigint;
    batasWaktu: bigint;
    pilihan: Array<string>;
    kesulitan: Difficulty;
    penjelasan: string;
}
export interface CityQuestion {
    id: bigint;
    gambar1: string;
    gambar2: string;
    poinDasar: bigint;
    batasWaktu: bigint;
    pilihan: Array<string>;
    namaKota: string;
    penjelasan: string;
}
export interface Sesi {
    id: SessionId;
    status: StatusSesi;
    kodeJoin?: string;
    mode: ModeSesi;
    anggota: Array<UserId>;
    totalPoin: bigint;
    waktuMulai: Timestamp;
    puzzles: Array<PuzzleId>;
    indeksPuzzleAktif: bigint;
    namaTim?: string;
    waktuSelesai?: Timestamp;
    jawabanPuzzles: Array<JawabanPuzzle>;
}
export interface RiwayatSesi {
    akurasi: bigint;
    tanggal: Timestamp;
    mode: string;
    poin: bigint;
    sessionId: SessionId;
}
export enum Difficulty {
    mudah = "mudah",
    sedang = "sedang",
    sulit = "sulit"
}
export enum ModeSesi {
    tim = "tim",
    solo = "solo"
}
export enum StatusSesi {
    aktif = "aktif",
    selesai = "selesai"
}
export interface backendInterface {
    bergabungSesiTim(kode: TeamCode): Promise<SessionId | null>;
    buatSesiSolo(): Promise<SessionId>;
    buatSesiTim(): Promise<[SessionId, TeamCode]>;
    daftarkanNama(namaPemain: string, sessionId: SessionId, namaTim: string | null): Promise<void>;
    getCityQuestion(id: bigint): Promise<CityQuestion | null>;
    getLeaderboard(): Promise<Array<EntriLeaderboard>>;
    getPoinKumulatif(): Promise<bigint>;
    getPoinSesi(sessionId: SessionId): Promise<bigint>;
    getPuzzle(id: PuzzleId): Promise<Puzzle | null>;
    getRiwayatSesi(): Promise<Array<RiwayatSesi>>;
    getSesi(sessionId: SessionId): Promise<Sesi | null>;
    puzzleByKesulitan(kesulitan: Difficulty): Promise<Array<Puzzle>>;
    semuaCityQuestions(): Promise<Array<CityQuestion>>;
    semuaPuzzle(): Promise<Array<Puzzle>>;
    setNamaTim(sessionId: SessionId, namaTim: string): Promise<boolean>;
    submitJawaban(sessionId: SessionId, puzzleId: PuzzleId, pilihanJawaban: bigint): Promise<HasilJawaban>;
}
