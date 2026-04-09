import { useGameContext } from "@/context/GameContext";
import { useActor } from "@/lib/actor";
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
  const { actor } = useActor();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Create solo session — tries backend first, falls back to local UUID */
  const mulaiSesiSolo = useCallback(
    async (puzzles: Puzzle[]): Promise<SessionState> => {
      let backendSessionId: bigint | undefined;
      try {
        if (actor) {
          backendSessionId = await actor.buatSesiSolo();
        }
      } catch {
        // fallback — continue without backend session
      }

      const sesi: SessionState = {
        id: backendSessionId?.toString() ?? crypto.randomUUID(),
        backendSessionId,
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
    [namaPemain, setSesiAktif, actor],
  );

  /**
   * Create team session.
   * Calls buatSesiTim() to get real SessionId + TeamCode from backend,
   * or falls back to local data if backend is unavailable.
   */
  const mulaiSesiTim = useCallback(
    async (
      namaTim: string,
      anggota: string[],
      puzzles: Puzzle[],
    ): Promise<SessionState> => {
      let backendSessionId: bigint | undefined;
      let teamCode: string | undefined;

      try {
        if (actor) {
          const [sid, code] = await actor.buatSesiTim();
          backendSessionId = sid;
          teamCode = code;
        }
      } catch {
        // fallback — continue without backend session
      }

      const pemain: AnggotaTim[] = anggota.map((n, i) =>
        buatAnggota(n, i === 0 ? "ketua" : "anggota"),
      );
      const sesi: SessionState = {
        id: backendSessionId?.toString() ?? crypto.randomUUID(),
        backendSessionId,
        teamCode,
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
    [setSesiAktif, actor],
  );

  /**
   * Join an existing team session by code.
   * Returns the backend SessionId if successful.
   */
  const gabungSesiTim = useCallback(
    async (kode: string): Promise<bigint | null> => {
      if (!actor) return null;
      try {
        const sessionId = await actor.bergabungSesiTim(kode);
        return sessionId;
      } catch {
        return null;
      }
    },
    [actor],
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

      // Best-effort: submit to backend (fire-and-forget)
      if (actor && sesiAktif.backendSessionId) {
        const puzzleIdNum = BigInt(sesiAktif.puzzleIndex);
        const answerIndex = BigInt(
          ["A", "B", "C", "D"].indexOf(sesiAktif.jawabanDipilih),
        );
        if (answerIndex >= 0n) {
          actor
            .submitJawaban(sesiAktif.backendSessionId, puzzleIdNum, answerIndex)
            .catch(() => {
              /* ignore */
            });
        }
      }

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
    [sesiAktif, setSesiAktif, actor],
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
    gabungSesiTim,
    pilihJawaban,
    submitJawaban,
    akhiriSesi,
  };
}
