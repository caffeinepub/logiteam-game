import { useActor } from "@/lib/actor";
import type { GameContextValue, SessionState } from "@/types/game";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [namaPemain, setNamaPemain] = useState<string>(() => {
    return localStorage.getItem("blc_nama_pemain") ?? "";
  });
  const [sesiAktif, setSesiAktifState] = useState<SessionState | null>(null);
  const [skorGlobal, setSkorGlobal] = useState<number>(0);

  const { actor } = useActor();

  const setNamaPemainPersisted = (nama: string) => {
    localStorage.setItem("blc_nama_pemain", nama);
    setNamaPemain(nama);
  };

  const setSesiAktif = (sesi: SessionState | null) => {
    setSesiAktifState(sesi);
  };

  /**
   * Daftarkan pemain ke leaderboard backend setelah sesi selesai.
   * namaTim bersifat opsional — untuk mode tim, teruskan nama tim.
   */
  const daftarkanKeLeaderboard = useCallback(
    async (sessionId: bigint, namaTim?: string): Promise<void> => {
      if (!actor) return;
      const nama = namaPemain.trim() || "Pemain";
      // Backend now supports namaTim as a separate optional parameter
      try {
        await actor.daftarkanNama(nama, sessionId, namaTim ?? null);
      } catch {
        // Silently ignore — leaderboard registration is best-effort
      }
    },
    [actor, namaPemain],
  );

  return (
    <GameContext.Provider
      value={{
        namaPemain,
        setNamaPemain: setNamaPemainPersisted,
        sesiAktif,
        setSesiAktif,
        skorGlobal,
        setSkorGlobal,
        daftarkanKeLeaderboard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}
