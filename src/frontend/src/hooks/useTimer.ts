import { useCallback, useEffect, useRef, useState } from "react";

export interface TimerOptions {
  durasi: number; // detik
  onSelesai?: () => void;
  autoStart?: boolean;
}

export function useTimer({
  durasi,
  onSelesai,
  autoStart = false,
}: TimerOptions) {
  const [waktuTersisa, setWaktuTersisa] = useState(durasi);
  const [berjalan, setBerjalan] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSelesaiRef = useRef(onSelesai);
  onSelesaiRef.current = onSelesai;

  const bersihkanInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!berjalan) {
      bersihkanInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setWaktuTersisa((prev) => {
        if (prev <= 1) {
          bersihkanInterval();
          setBerjalan(false);
          onSelesaiRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return bersihkanInterval;
  }, [berjalan, bersihkanInterval]);

  const mulai = useCallback(() => {
    setWaktuTersisa(durasi);
    setBerjalan(true);
  }, [durasi]);

  const jeda = useCallback(() => setBerjalan(false), []);

  const lanjut = useCallback(() => setBerjalan(true), []);

  const reset = useCallback(() => {
    bersihkanInterval();
    setBerjalan(false);
    setWaktuTersisa(durasi);
  }, [durasi, bersihkanInterval]);

  const formatWaktu = useCallback((detik: number): string => {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  const persenTersisa = durasi > 0 ? (waktuTersisa / durasi) * 100 : 0;
  const kritis = waktuTersisa <= 30;
  const daruratWaktu = waktuTersisa <= 10;

  return {
    waktuTersisa,
    berjalan,
    persenTersisa,
    kritis,
    daruratWaktu,
    waktuFormat: formatWaktu(waktuTersisa),
    mulai,
    jeda,
    lanjut,
    reset,
  };
}
