import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useActor } from "@/lib/actor";
import {
  type CityQuestionLocal,
  useCityQuestions,
  useInvalidateLeaderboard,
} from "@/lib/actor";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Home,
  MapPin,
  RotateCcw,
  Star,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ---- Timer Ring ----
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

// ---- Landmark Card ----
const CITY_GRADIENTS: Record<string, string> = {
  Jakarta: "from-primary/25 to-primary/10",
  Surabaya: "from-destructive/20 to-destructive/8",
  Bandung: "from-chart-2/25 to-chart-2/10",
  Yogyakarta: "from-chart-3/25 to-chart-3/8",
  Medan: "from-accent/25 to-accent/10",
  Bali: "from-chart-1/25 to-chart-1/8",
  Makassar: "from-chart-5/25 to-chart-5/8",
  Semarang: "from-primary/20 to-accent/10",
  Palembang: "from-chart-3/20 to-primary/8",
  Malang: "from-accent/20 to-chart-2/8",
};

function LandmarkCard({
  label,
  teks,
  namaKota,
  index,
}: {
  label: string;
  teks: string;
  namaKota: string;
  index: number;
}) {
  const gradient = CITY_GRADIENTS[namaKota] ?? "from-muted/40 to-muted/10";
  const lines = teks.split("\n");
  const emoji = lines[0] ?? "";
  const desc = lines.slice(1).join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex-1 bg-gradient-to-br ${gradient} border border-border/60 rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-elevated`}
    >
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Petunjuk {index + 1}
      </span>
      <div className="text-6xl leading-none select-none">{emoji.trim()}</div>
      {desc && (
        <div className="space-y-0.5">
          {desc.split("\n").map((line) => (
            <p
              key={line}
              className={
                desc.split("\n").indexOf(line) === 0
                  ? "text-sm font-bold text-foreground"
                  : "text-xs text-muted-foreground"
              }
            >
              {line}
            </p>
          ))}
        </div>
      )}
      <span className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-mono">
        {label}
      </span>
    </motion.div>
  );
}

// ---- Score Popup ----
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
        +{poin} poin! 🗺️
      </div>
    </motion.div>
  );
}

// ---- Summary Modal ----
function RingkasanModal({
  skor,
  total,
  benar,
  waktuMulai,
  onUlang,
  onMenu,
  onLeaderboard,
}: {
  skor: number;
  total: number;
  benar: number;
  waktuMulai: number;
  onUlang: () => void;
  onMenu: () => void;
  onLeaderboard: () => void;
}) {
  const akurasi = total > 0 ? Math.round((benar / total) * 100) : 0;
  const durasi = Math.round((Date.now() - waktuMulai) / 1000);
  const bintang = akurasi >= 80 ? 3 : akurasi >= 50 ? 2 : 1;
  const formatDurasi = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-elevated text-center space-y-6"
      >
        <div className="text-6xl pop-in">
          {akurasi >= 80 ? "🗺️" : akurasi >= 60 ? "🏙️" : "🧭"}
        </div>
        <div>
          <h2 className="text-3xl font-black font-display text-foreground">
            {akurasi >= 80
              ? "Penjelajah Handal!"
              : akurasi >= 60
                ? "Kerja Bagus!"
                : "Terus Berlatih!"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tebak Kota selesai — {benar}/{total} kota berhasil ditebak. Skormu
            sudah dicatat!
          </p>
        </div>

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

        <div className="bg-secondary/40 rounded-xl p-5 space-y-3">
          {[
            {
              label: "Total Skor",
              nilai: skor.toLocaleString(),
              warna: "text-accent text-2xl font-black font-mono",
            },
            {
              label: "Kota Benar",
              nilai: `${benar} / ${total}`,
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
            data-ocid="btn-ke-menu-kota"
          >
            <Home className="w-4 h-4" />
            Menu
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={onUlang}
            data-ocid="btn-mainkan-lagi-kota"
          >
            <RotateCcw className="w-4 h-4" />
            Mainkan Lagi
          </Button>
          <Button
            className="flex-1 btn-primary gap-2"
            onClick={onLeaderboard}
            data-ocid="btn-peringkat-kota"
          >
            <Trophy className="w-4 h-4" />
            Peringkat
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Scoring helper ----
function hitungPoin(
  poinDasar: number,
  batasWaktu: number,
  sisaWaktu: number,
): number {
  const bonus = sisaWaktu >= batasWaktu / 2 ? Math.round(poinDasar * 0.5) : 0;
  return poinDasar + bonus;
}

// ---- Main TebakKotaPage ----
export function TebakKotaPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/tebak-kota" });
  const { data: questions, isLoading } = useCityQuestions();
  const { daftarkanKeLeaderboard } = useGameContext();
  const { actor } = useActor();
  const invalidateLeaderboard = useInvalidateLeaderboard();

  const [soalIndex, setSoalIndex] = useState(0);
  const [skorTotal, setSkorTotal] = useState(0);
  const [benar, setBenar] = useState(0);
  const [jawaban, setJawaban] = useState<string | null>(null);
  const [sudahDijawab, setSudahDijawab] = useState(false);
  const [waktuTersisa, setWaktuTersisa] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPoin, setPopupPoin] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [shakeSalah, setShakeSalah] = useState(false);
  const [backendSessionId, setBackendSessionId] = useState<bigint | null>(null);
  const [terdaftar, setTerdaftar] = useState(false);
  const waktuMulaiRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waktuRef = useRef(30);

  const currentQ: CityQuestionLocal | undefined = questions?.[soalIndex];

  const searchParams = search as Record<string, string>;
  const modeLabel =
    searchParams.mode === "tim"
      ? `Tim: ${searchParams.namaTim ?? "Tim Saya"}`
      : "Mode Solo";
  const isTimMode = searchParams.mode === "tim";
  const namaTim = isTimMode ? (searchParams.namaTim ?? undefined) : undefined;

  // Create backend session on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on mount
  useEffect(() => {
    if (!actor) return;
    const createSession = async () => {
      try {
        if (isTimMode) {
          // If joining from code, the sessionId may already be in search params
          const existingId = searchParams.sessionId
            ? BigInt(searchParams.sessionId)
            : null;
          if (existingId) {
            setBackendSessionId(existingId);
          } else {
            const [sid] = await actor.buatSesiTim();
            setBackendSessionId(sid);
          }
        } else {
          const sid = await actor.buatSesiSolo();
          setBackendSessionId(sid);
        }
      } catch {
        // Ignore — session is best-effort
      }
    };
    createSession();
  }, [actor]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (durasi: number) => {
      stopTimer();
      waktuRef.current = durasi;
      setWaktuTersisa(durasi);
      intervalRef.current = setInterval(() => {
        waktuRef.current -= 1;
        setWaktuTersisa(waktuRef.current);
        if (waktuRef.current <= 0) {
          stopTimer();
          setSudahDijawab(true);
        }
      }, 1000);
    },
    [stopTimer],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: soalIndex triggers timer reset
  useEffect(() => {
    if (!questions || selesai) return;
    const q = questions[soalIndex];
    if (!q) return;
    setJawaban(null);
    setSudahDijawab(false);
    startTimer(q.batasWaktu);
    return () => stopTimer();
  }, [soalIndex, questions, selesai]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Register on leaderboard when game ends
  useEffect(() => {
    if (selesai && !terdaftar) {
      setTerdaftar(true);
      if (backendSessionId) {
        daftarkanKeLeaderboard(backendSessionId, namaTim).then(() => {
          invalidateLeaderboard();
        });
      } else if (actor) {
        // No backend session — create a solo session now just to register
        actor
          .buatSesiSolo()
          .then((sid) => daftarkanKeLeaderboard(sid, namaTim))
          .then(() => invalidateLeaderboard())
          .catch(() => {
            /* ignore */
          });
      }
    }
  }, [
    selesai,
    terdaftar,
    backendSessionId,
    namaTim,
    daftarkanKeLeaderboard,
    invalidateLeaderboard,
    actor,
  ]);

  const handlePilih = (kota: string) => {
    if (sudahDijawab || !currentQ) return;
    setJawaban(kota);
  };

  const handleSubmit = () => {
    if (!jawaban || sudahDijawab || !currentQ) return;
    stopTimer();
    setSudahDijawab(true);

    const isBenar = jawaban === currentQ.namaKota;
    if (isBenar) {
      const poin = hitungPoin(
        currentQ.poinDasar,
        currentQ.batasWaktu,
        waktuRef.current,
      );
      setSkorTotal((s) => s + poin);
      setBenar((b) => b + 1);
      setPopupPoin(poin);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } else {
      setShakeSalah(true);
      setTimeout(() => setShakeSalah(false), 600);
    }
  };

  const handleLanjut = () => {
    if (!questions) return;
    if (soalIndex + 1 >= questions.length) {
      setSelesai(true);
    } else {
      setSoalIndex((i) => i + 1);
    }
  };

  const handleUlang = () => {
    setSoalIndex(0);
    setSkorTotal(0);
    setBenar(0);
    setJawaban(null);
    setSudahDijawab(false);
    setSelesai(false);
    setTerdaftar(false);
    setBackendSessionId(null);
    waktuMulaiRef.current = Date.now();
    // Re-create backend session
    if (actor) {
      (isTimMode
        ? actor.buatSesiTim().then(([sid]) => sid)
        : actor.buatSesiSolo()
      )
        .then((sid) => setBackendSessionId(sid))
        .catch(() => {
          /* ignore */
        });
    }
  };

  const persen = currentQ ? (waktuTersisa / currentQ.batasWaktu) * 100 : 100;
  const kritis = waktuTersisa <= (currentQ?.batasWaktu ?? 30) * 0.4;
  const darurat = waktuTersisa <= (currentQ?.batasWaktu ?? 30) * 0.2;

  if (isLoading || !questions) {
    return (
      <Layout showBack backTo="/" title="Tebak Kota">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground">Menyiapkan soal kota...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBack backTo="/" title="Tebak Kota 🗺️">
      <AnimatePresence>
        {showPopup && <ScorePopup poin={popupPoin} />}
      </AnimatePresence>

      {selesai && (
        <RingkasanModal
          skor={skorTotal}
          total={questions.length}
          benar={benar}
          waktuMulai={waktuMulaiRef.current}
          onUlang={handleUlang}
          onMenu={() => navigate({ to: "/" })}
          onLeaderboard={() => navigate({ to: "/leaderboard" })}
        />
      )}

      <div className="flex-1 flex flex-col">
        {/* HUD */}
        <div className="bg-card/95 border-b border-border/60 sticky top-0 z-30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
            <TimerRing
              persen={persen}
              waktuTersisa={waktuTersisa}
              kritis={kritis}
              darurat={darurat}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  Soal {soalIndex + 1} / {questions.length}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/15 text-primary">
                  {modeLabel}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${(soalIndex / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right flex-shrink-0" data-ocid="hud-skor-kota">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                SKOR
              </div>
              <div className="text-2xl font-black font-mono text-accent">
                {skorTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Instruction */}
          <motion.div
            key={soalIndex}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">
                Tebak kota berdasarkan dua landmark berikut!
              </span>
            </div>
          </motion.div>

          {/* Landmark Cards */}
          <AnimatePresence mode="wait">
            {currentQ && (
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -40 }}
                className="flex gap-4"
              >
                <LandmarkCard
                  label="Gambar 1"
                  teks={currentQ.gambar1}
                  namaKota={currentQ.namaKota}
                  index={0}
                />
                <LandmarkCard
                  label="Gambar 2"
                  teks={currentQ.gambar2}
                  namaKota={currentQ.namaKota}
                  index={1}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* City Choice Buttons */}
          {currentQ && (
            <motion.div
              className={`grid grid-cols-2 gap-3 ${shakeSalah ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
              style={
                shakeSalah ? { animation: "shake 0.5s ease-in-out" } : undefined
              }
            >
              {currentQ.pilihan.map((kota, i) => {
                const isBenar = kota === currentQ.namaKota;
                const isDipilih = jawaban === kota;
                let variantClass =
                  "border-border bg-secondary/30 text-foreground hover:border-primary/50 hover:bg-primary/5";
                if (sudahDijawab) {
                  if (isBenar)
                    variantClass = "border-accent bg-accent/15 text-accent";
                  else if (isDipilih && !isBenar)
                    variantClass =
                      "border-destructive bg-destructive/15 text-destructive-foreground";
                  else
                    variantClass =
                      "border-border/40 bg-secondary/10 text-muted-foreground";
                } else if (isDipilih) {
                  variantClass = "border-primary bg-primary/15 text-primary";
                }

                return (
                  <motion.button
                    key={kota}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handlePilih(kota)}
                    disabled={sudahDijawab}
                    className={`flex items-center justify-between gap-2 px-4 py-4 rounded-xl border-2 text-left font-semibold transition-all duration-200 ${variantClass}`}
                    data-ocid={`btn-kota-${kota.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <span className="flex-1 text-sm">{kota}</span>
                    {sudahDijawab && isBenar && (
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    )}
                    {sudahDijawab && isDipilih && !isBenar && (
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Explanation */}
          <AnimatePresence>
            {sudahDijawab && currentQ && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl p-4 border text-sm leading-relaxed ${
                  jawaban === currentQ.namaKota
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
                }`}
              >
                <strong>
                  {jawaban === currentQ.namaKota ? "✅ " : "❌ "}
                  Jawaban Benar: {currentQ.namaKota}
                </strong>
                {" — "}
                {currentQ.penjelasan}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div data-ocid="game-action-area-kota">
            {!sudahDijawab ? (
              <Button
                className="w-full btn-primary text-base py-6 font-bold tracking-wide"
                onClick={handleSubmit}
                disabled={!jawaban}
                data-ocid="btn-kumpulkan-kota"
              >
                KUMPULKAN JAWABAN
              </Button>
            ) : (
              <Button
                className="w-full gap-2 bg-accent/80 hover:bg-accent text-accent-foreground text-base py-6 font-bold"
                onClick={handleLanjut}
                data-ocid="btn-lanjut-kota"
              >
                {soalIndex + 1 >= (questions?.length ?? 10)
                  ? "Lihat Hasil"
                  : "Soal Berikutnya"}
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </Layout>
  );
}
