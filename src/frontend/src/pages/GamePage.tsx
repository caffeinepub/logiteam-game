import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useGameSession } from "@/hooks/useGameSession";
import { useTimer } from "@/hooks/useTimer";
import { type PuzzleLocal, usePuzzles } from "@/lib/actor";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Home,
  RotateCcw,
  Star,
  Timer,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const WAKTU_PER_PUZZLE = 120;

// --- Timer Ring ---
function TimerRing({
  persen,
  waktuTersisa,
  kritis,
  darurat,
}: {
  persen: number;
  waktuTersisa: number;
  kritis: boolean;
  darurat: boolean;
}) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (persen / 100) * circumference;

  const ringColor = darurat
    ? "stroke-destructive"
    : kritis
      ? "stroke-chart-3"
      : "stroke-accent";

  const textColor = darurat
    ? "text-destructive"
    : kritis
      ? "text-chart-3"
      : "text-foreground";

  return (
    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
      <svg className="absolute w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <title>Timer</title>
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-secondary"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`${ringColor} transition-all duration-1000`}
        />
      </svg>
      <div
        className={`font-mono font-black text-sm ${textColor} ${darurat ? "pulse-glow" : ""}`}
      >
        {String(Math.floor(waktuTersisa / 60)).padStart(2, "0")}:
        {String(waktuTersisa % 60).padStart(2, "0")}
      </div>
    </div>
  );
}

// --- Score Popup ---
function ScorePopup({ poin }: { poin: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: -40, scale: 1 }}
      exit={{ opacity: 0, y: -70, scale: 0.6 }}
      transition={{ duration: 0.6 }}
      className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-accent text-accent-foreground font-black text-2xl px-6 py-3 rounded-2xl shadow-elevated pop-in">
        +{poin} poin! ✨
      </div>
    </motion.div>
  );
}

// --- Puzzle Card ---
function PuzzleCard({
  puzzle,
  jawabanDipilih,
  onPilih,
  sudahDijawab,
  jawabanBenar,
}: {
  puzzle: PuzzleLocal;
  jawabanDipilih: string | undefined;
  onPilih: (k: string) => void;
  sudahDijawab: boolean;
  jawabanBenar?: string;
}) {
  const diffColors: Record<string, string> = {
    mudah: "text-accent bg-accent/10 border-accent/20",
    sedang: "text-chart-3 bg-chart-3/10 border-chart-3/20",
    sulit: "text-destructive bg-destructive/10 border-destructive/20",
  };

  return (
    <motion.div
      key={puzzle.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-card border border-accent/30 rounded-2xl p-6 space-y-5 shadow-elevated"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="badge-success text-xs">{puzzle.kategori}</span>
        <span
          className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full border capitalize ${diffColors[puzzle.kesulitan] ?? ""}`}
        >
          {puzzle.kesulitan}
        </span>
        <span className="text-xs text-muted-foreground ml-auto font-mono font-bold">
          +{puzzle.poin} poin
        </span>
      </div>

      {puzzle.konteks && (
        <p className="text-sm text-muted-foreground italic leading-relaxed border-l-2 border-primary/40 pl-3 bg-primary/5 rounded-r-lg py-2 pr-2">
          {puzzle.konteks}
        </p>
      )}

      <p className="text-lg font-semibold text-foreground leading-snug">
        {puzzle.pertanyaan}
      </p>

      <div className="space-y-3">
        {puzzle.opsi.map(({ kode, teks }) => {
          type AnswerVariant = "default" | "benar" | "salah" | "normal";
          let variant: AnswerVariant = "normal";
          if (sudahDijawab) {
            if (kode === jawabanBenar) variant = "benar";
            else if (kode === jawabanDipilih && kode !== jawabanBenar)
              variant = "salah";
          } else if (jawabanDipilih === kode) {
            variant = "default";
          }

          return (
            <button
              key={kode}
              type="button"
              onClick={() => !sudahDijawab && onPilih(kode)}
              disabled={sudahDijawab}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                variant === "benar"
                  ? "border-accent bg-accent/15 text-accent"
                  : variant === "salah"
                    ? "border-destructive bg-destructive/15 text-destructive-foreground"
                    : variant === "default"
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary/30 text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
              data-ocid={`btn-jawaban-${kode}`}
            >
              <span className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center text-sm font-bold font-mono flex-shrink-0">
                {kode}
              </span>
              <span className="text-sm leading-snug flex-1">{teks}</span>
              {sudahDijawab && kode === jawabanBenar && (
                <CheckCircle className="w-5 h-5 ml-auto text-accent flex-shrink-0" />
              )}
              {sudahDijawab &&
                kode === jawabanDipilih &&
                kode !== jawabanBenar && (
                  <XCircle className="w-5 h-5 ml-auto text-destructive flex-shrink-0" />
                )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// --- Session Summary ---
function RingkasanSesi({
  skor,
  total,
  puzzleBenar,
  waktuMulai,
  onUlang,
  onMenu,
  onLeaderboard,
}: {
  skor: number;
  total: number;
  puzzleBenar: number;
  waktuMulai: number;
  onUlang: () => void;
  onMenu: () => void;
  onLeaderboard: () => void;
}) {
  const akurasi = total > 0 ? Math.round((puzzleBenar / total) * 100) : 0;
  const durasi = Math.round((Date.now() - waktuMulai) / 1000);
  const bintang = akurasi >= 80 ? 3 : akurasi >= 50 ? 2 : 1;

  const formatDurasi = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-elevated text-center space-y-6">
        <div className="text-6xl pop-in">
          {akurasi >= 80 ? "🏆" : akurasi >= 60 ? "🎯" : "💪"}
        </div>
        <div>
          <h2 className="text-3xl font-black font-display text-foreground">
            {akurasi >= 80
              ? "Luar Biasa!"
              : akurasi >= 60
                ? "Kerja Bagus!"
                : "Terus Berlatih!"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Sesi permainan selesai
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((b) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: b * 0.15 }}
            >
              <Star
                className={`w-10 h-10 ${b <= bintang ? "text-chart-3 fill-chart-3" : "text-muted"}`}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-secondary/40 rounded-xl p-5 space-y-3">
          {[
            {
              label: "Total Skor",
              nilai: skor.toLocaleString(),
              warna: "text-accent text-2xl font-black font-mono",
            },
            {
              label: "Jawaban Benar",
              nilai: `${puzzleBenar} / ${total}`,
              warna: "font-bold text-foreground",
            },
            {
              label: "Akurasi",
              nilai: `${akurasi}%`,
              warna: "font-bold text-foreground",
            },
            {
              label: "Waktu",
              nilai: formatDurasi(durasi),
              warna: "font-bold text-foreground",
            },
          ].map(({ label, nilai, warna }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">{label}</span>
              <span className={warna}>{nilai}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={onMenu}
            data-ocid="btn-ke-menu"
          >
            <Home className="w-4 h-4" />
            Menu
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={onUlang}
            data-ocid="btn-ulangi"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi
          </Button>
          <Button
            className="flex-1 btn-primary gap-2"
            onClick={onLeaderboard}
            data-ocid="btn-ke-leaderboard"
          >
            <Trophy className="w-4 h-4" />
            Peringkat
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main GamePage ---
export function GamePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/game" });
  const { data: puzzles, isLoading } = usePuzzles();
  const {
    sesiAktif,
    mulaiSesiSolo,
    mulaiSesiTim,
    pilihJawaban,
    submitJawaban,
    akhiriSesi,
  } = useGameSession();
  const { setSkorGlobal } = useGameContext();

  const [sudahDijawab, setSudahDijawab] = useState(false);
  const [hasilTerakhir, setHasilTerakhir] = useState<{
    benar: boolean;
    penjelasan: string;
    poin: number;
  } | null>(null);
  const [puzzleBenar, setPuzzleBenar] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [popupPoin, setPopupPoin] = useState(0);
  const waktuMulaiRef = useRef<number>(Date.now());

  const handleWaktuHabis = useCallback(() => {
    if (sudahDijawab || !sesiAktif?.puzzleAktif) return;
    toast.error("⏰ Waktu habis! Lanjut ke soal berikutnya.", {
      duration: 3000,
    });
    setSudahDijawab(true);
    setHasilTerakhir(null);
    setTimeout(() => {
      if (puzzles) {
        submitJawaban(puzzles as unknown as import("@/types/game").Puzzle[]);
        setSudahDijawab(false);
        setHasilTerakhir(null);
      }
    }, 1800);
  }, [sudahDijawab, sesiAktif, puzzles, submitJawaban]);

  const timer = useTimer({
    durasi: WAKTU_PER_PUZZLE,
    onSelesai: handleWaktuHabis,
    autoStart: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once when puzzles are loaded
  useEffect(() => {
    if (!puzzles || sesiAktif) return;
    waktuMulaiRef.current = Date.now();
    const mode =
      (search as Record<string, string>).mode === "tim" ? "tim" : "solo";
    const namaTim = (search as Record<string, string>).namaTim || "Tim Saya";
    if (mode === "tim") {
      mulaiSesiTim(
        namaTim,
        [namaTim, "Anggota 2", "Anggota 3", "Anggota 4"],
        puzzles as unknown as import("@/types/game").Puzzle[],
      );
    } else {
      mulaiSesiSolo(puzzles as unknown as import("@/types/game").Puzzle[]);
    }
    timer.mulai();
  }, [puzzles]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: timer functions are stable refs
  useEffect(() => {
    if (sesiAktif?.puzzleIndex !== undefined && sesiAktif.status === "aktif") {
      timer.reset();
      setTimeout(() => timer.mulai(), 100);
    }
  }, [sesiAktif?.puzzleIndex]);

  useEffect(() => {
    if (sesiAktif) setSkorGlobal(sesiAktif.skorTotal);
  }, [sesiAktif, setSkorGlobal]);

  const handlePilih = (kode: string) => {
    if (sudahDijawab) return;
    pilihJawaban(kode);
  };

  const handleSubmit = () => {
    if (!sesiAktif?.jawabanDipilih || !puzzles || sudahDijawab) return;
    const hasil = submitJawaban(
      puzzles as unknown as import("@/types/game").Puzzle[],
    );
    if (!hasil) return;
    timer.jeda();
    setSudahDijawab(true);
    setHasilTerakhir({
      benar: hasil.benar,
      penjelasan: hasil.penjelasan,
      poin: hasil.poinDiperoleh,
    });
    if (hasil.benar) {
      setPuzzleBenar((p) => p + 1);
      setPopupPoin(hasil.poinDiperoleh);
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 2000);
    } else {
      toast.error(`❌ Salah. Jawaban benar: ${hasil.jawabanBenar}`, {
        duration: 3000,
      });
    }
  };

  const handleLanjut = () => {
    setSudahDijawab(false);
    setHasilTerakhir(null);
  };

  const handleUlang = () => {
    akhiriSesi();
    setSudahDijawab(false);
    setHasilTerakhir(null);
    setPuzzleBenar(0);
    waktuMulaiRef.current = Date.now();
    if (puzzles) {
      const mode =
        (search as Record<string, string>).mode === "tim" ? "tim" : "solo";
      const namaTim = (search as Record<string, string>).namaTim || "Tim Saya";
      if (mode === "tim") {
        mulaiSesiTim(
          namaTim,
          [namaTim, "Anggota 2", "Anggota 3", "Anggota 4"],
          puzzles as unknown as import("@/types/game").Puzzle[],
        );
      } else {
        mulaiSesiSolo(puzzles as unknown as import("@/types/game").Puzzle[]);
      }
      timer.mulai();
    }
  };

  if (isLoading || !puzzles) {
    return (
      <Layout showBack backTo="/" title="Memuat Game...">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground">Menyiapkan puzzle logika...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (sesiAktif?.status === "selesai") {
    return (
      <Layout showBack backTo="/" title="Hasil Akhir">
        <RingkasanSesi
          skor={sesiAktif.skorTotal}
          total={sesiAktif.totalPuzzle}
          puzzleBenar={puzzleBenar}
          waktuMulai={waktuMulaiRef.current}
          onUlang={handleUlang}
          onMenu={() => {
            akhiriSesi();
            navigate({ to: "/" });
          }}
          onLeaderboard={() => navigate({ to: "/leaderboard" })}
        />
      </Layout>
    );
  }

  const currentPuzzle = puzzles[sesiAktif?.puzzleIndex ?? 0] as PuzzleLocal;
  const modeLabel =
    sesiAktif?.mode === "tim" ? `Tim: ${sesiAktif.namaTim ?? ""}` : "Mode Solo";
  const isTimMode = sesiAktif?.mode === "tim";

  return (
    <Layout showBack backTo="/" title="Teka-Teki Logika">
      <AnimatePresence>
        {showScorePopup && <ScorePopup poin={popupPoin} />}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        {/* HUD Bar */}
        <div className="bg-card/95 border-b border-border/60 sticky top-0 z-30 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Timer Ring */}
            <TimerRing
              persen={timer.persenTersisa}
              waktuTersisa={timer.waktuTersisa}
              kritis={timer.kritis}
              darurat={timer.daruratWaktu}
            />

            {/* Center info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  Soal {(sesiAktif?.puzzleIndex ?? 0) + 1} /{" "}
                  {sesiAktif?.totalPuzzle ?? 10}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isTimMode ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}
                >
                  {modeLabel}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{
                    width: `${((sesiAktif?.puzzleIndex ?? 0) / (sesiAktif?.totalPuzzle ?? 10)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Score */}
            <div className="text-right flex-shrink-0" data-ocid="hud-skor">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                SKOR
              </div>
              <div className="text-2xl font-black font-mono text-accent">
                {(sesiAktif?.skorTotal ?? 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 grid lg:grid-cols-[1fr_260px] gap-6">
          {/* Puzzle + Answers */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {currentPuzzle && (
                <PuzzleCard
                  key={currentPuzzle.id}
                  puzzle={currentPuzzle}
                  jawabanDipilih={sesiAktif?.jawabanDipilih}
                  onPilih={handlePilih}
                  sudahDijawab={sudahDijawab}
                  jawabanBenar={
                    sudahDijawab ? currentPuzzle.jawaban : undefined
                  }
                />
              )}
            </AnimatePresence>

            {/* Explanation */}
            <AnimatePresence>
              {sudahDijawab && hasilTerakhir && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl p-4 border text-sm leading-relaxed ${
                    hasilTerakhir.benar
                      ? "bg-accent/10 border-accent/30 text-accent"
                      : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
                  }`}
                >
                  <strong>
                    {hasilTerakhir.benar ? "✅ Penjelasan:" : "❌ Penjelasan:"}
                  </strong>{" "}
                  {hasilTerakhir.penjelasan}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Button */}
            <div className="flex gap-3" data-ocid="game-action-area">
              {!sudahDijawab ? (
                <Button
                  className="flex-1 btn-primary text-base py-6 font-bold tracking-wide"
                  onClick={handleSubmit}
                  disabled={!sesiAktif?.jawabanDipilih}
                  data-ocid="btn-kumpulkan-jawaban"
                >
                  KUMPULKAN JAWABAN
                </Button>
              ) : (
                <Button
                  className="flex-1 gap-2 bg-accent/80 hover:bg-accent text-accent-foreground text-base py-6 font-bold"
                  onClick={handleLanjut}
                  data-ocid="btn-lanjut"
                >
                  Puzzle Berikutnya
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Team Members */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {isTimMode ? "Anggota Tim" : "Pemain"}
                </span>
              </div>
              {sesiAktif?.pemain.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5"
                  data-ocid={`anggota-${p.id}`}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground flex-shrink-0">
                    {p.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                      {p.nama}
                      {p.peran === "ketua" && (
                        <span className="text-xs text-chart-3 font-bold">
                          ★
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {p.peran}
                    </div>
                  </div>
                  {/* Status dot / submitted check */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      sudahDijawab
                        ? "bg-accent"
                        : p.status === "online"
                          ? "bg-accent pulse-glow"
                          : "bg-chart-3"
                    }`}
                  />
                  {sudahDijawab && (
                    <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Puzzle Benar</span>
                <span className="font-bold text-accent">{puzzleBenar}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Poin puzzle ini</span>
                <span className="font-bold text-chart-3">
                  {currentPuzzle?.poin ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kesulitan</span>
                <span className="font-bold capitalize text-foreground">
                  {currentPuzzle?.kesulitan}
                </span>
              </div>
              <div className="pt-1 border-t border-border/40">
                <div className="text-xs text-muted-foreground mb-1.5">
                  Tingkat kesulitan
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        currentPuzzle?.kesulitan === "sulit" && i <= 5
                          ? "text-chart-3 fill-chart-3"
                          : currentPuzzle?.kesulitan === "sedang" && i <= 3
                            ? "text-chart-3 fill-chart-3"
                            : i <= 1
                              ? "text-chart-3 fill-chart-3"
                              : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
