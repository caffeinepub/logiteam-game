import type { GameContextValue, SessionState } from "@/types/game";
import { type ReactNode, createContext, useContext, useState } from "react";

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [namaPemain, setNamaPemain] = useState<string>(() => {
    return localStorage.getItem("blc_nama_pemain") ?? "";
  });
  const [sesiAktif, setSesiAktifState] = useState<SessionState | null>(null);
  const [skorGlobal, setSkorGlobal] = useState<number>(0);

  const setNamaPemainPersisted = (nama: string) => {
    localStorage.setItem("blc_nama_pemain", nama);
    setNamaPemain(nama);
  };

  const setSesiAktif = (sesi: SessionState | null) => {
    setSesiAktifState(sesi);
  };

  return (
    <GameContext.Provider
      value={{
        namaPemain,
        setNamaPemain: setNamaPemainPersisted,
        sesiAktif,
        setSesiAktif,
        skorGlobal,
        setSkorGlobal,
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
