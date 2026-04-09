import { useGameContext } from "@/context/GameContext";
import type { AnggotaTim, GameMode, Puzzle, SessionState } from "@/types/game";
import { useCallback, useState } from "react";

function buatAnggota(nama: string, peran: "ketua" | "anggota"): AnggotaTim {
  return {
    id: crypto.randomUUID(),
    nama,
    peran,
    status: "online",
    skorKontribusi: 0,
  };
}

export function useGameSession() {
  const { sesiAktif, setSesiAktif, namaPemain } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mulaiSesiSolo = useCallback(
    (puzzles: Puzzle[]) => {
      const sesi: SessionState = {
        id: crypto.randomUUID(),
        mode: "solo" as GameMode,
        pemain: [buatAnggota(namaPemain || "Pemain", "ketua")],
        skorTotal: 0,
        puzzleAktif: puzzles[0],
        puzzleIndex: 0,
        totalPuzzle: puzzles.length,
        status: "aktif",
        waktuMulai: Date.now(),
      };
      setSesiAktif(sesi);
      return sesi;
    },
    [namaPemain, setSesiAktif],
  );

  const mulaiSesiTim = useCallback(
    (namaTim: string, anggota: string[], puzzles: Puzzle[]) => {
      const pemain: AnggotaTim[] = anggota.map((n, i) =>
        buatAnggota(n, i === 0 ? "ketua" : "anggota"),
      );
      const sesi: SessionState = {
        id: crypto.randomUUID(),
        mode: "tim" as GameMode,
        namaTim,
        pemain,
        skorTotal: 0,
        puzzleAktif: puzzles[0],
        puzzleIndex: 0,
        totalPuzzle: puzzles.length,
        status: "aktif",
        waktuMulai: Date.now(),
      };
      setSesiAktif(sesi);
      return sesi;
    },
    [setSesiAktif],
  );

  const pilihJawaban = useCallback(
    (jawaban: string) => {
      if (!sesiAktif) return;
      setSesiAktif({ ...sesiAktif, jawabanDipilih: jawaban });
    },
    [sesiAktif, setSesiAktif],
  );

  const submitJawaban = useCallback(
    (puzzles: Puzzle[]) => {
      if (!sesiAktif?.jawabanDipilih || !sesiAktif.puzzleAktif) return null;

      const puzzle = sesiAktif.puzzleAktif;
      const benar = sesiAktif.jawabanDipilih === puzzle.jawaban;
      const poinDiperoleh = benar ? puzzle.poin : 0;
      const nextIndex = sesiAktif.puzzleIndex + 1;
      const selesai = nextIndex >= sesiAktif.totalPuzzle;

      setSesiAktif({
        ...sesiAktif,
        skorTotal: sesiAktif.skorTotal + poinDiperoleh,
        puzzleIndex: nextIndex,
        puzzleAktif: selesai ? undefined : puzzles[nextIndex],
        jawabanDipilih: undefined,
        status: selesai ? "selesai" : "aktif",
      });

      return {
        benar,
        poinDiperoleh,
        penjelasan: puzzle.penjelasan,
        jawabanBenar: puzzle.jawaban,
      };
    },
    [sesiAktif, setSesiAktif],
  );

  const akhiriSesi = useCallback(() => {
    setSesiAktif(null);
  }, [setSesiAktif]);

  return {
    sesiAktif,
    loading,
    error,
    setError,
    setLoading,
    mulaiSesiSolo,
    mulaiSesiTim,
    pilihJawaban,
    submitJawaban,
    akhiriSesi,
  };
}
