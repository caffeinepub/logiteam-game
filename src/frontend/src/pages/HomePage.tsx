import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/context/GameContext";
import { useNavigate } from "@tanstack/react-router";
import {
  Book,
  Brain,
  ChevronRight,
  Copy,
  History,
  LogIn,
  MapPin,
  Plus,
  Swords,
  Target,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CARA_BERMAIN = [
  {
    no: 1,
    judul: "Masukkan Nama",
    deskripsi: "Ketik nama kamu atau nama ketua tim sebelum mulai bermain.",
  },
  {
    no: 2,
    judul: "Pilih Mode",
    deskripsi:
      "Solo untuk bermain sendiri. Tim untuk berdiskusi dan menjawab bersama.",
  },
  {
    no: 3,
    judul: "Jawab Puzzle",
    deskripsi:
      "Setiap puzzle punya 4 pilihan jawaban. Pilih satu dan kumpulkan sebelum waktu habis.",
  },
  {
    no: 4,
    judul: "Raih Skor Tertinggi",
    deskripsi:
      "Jawaban benar dan cepat memberi poin lebih besar. Bersaing di leaderboard!",
  },
];

const FITUR = [
  {
    icon: Brain,
    judul: "Teka-Teki Logika",
    deskripsi:
      "10 puzzle deduksi, silogisme & analisis keputusan yang menantang",
    warna: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: MapPin,
    judul: "Tebak Kota",
    deskripsi: "Cocokkan dua gambar/klue dan tebak nama kota dari 10 soal seru",
    warna: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    icon: Target,
    judul: "Skor & Peringkat",
    deskripsi: "Bersaing di papan peringkat LogiTeam dan pantau perkembanganmu",
    warna: "text-chart-3",
    bg: "bg-chart-3/10 border-chart-3/20",
  },
];

function generateKodeTim(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function HomePage() {
  const navigate = useNavigate();
  const { namaPemain, setNamaPemain } = useGameContext();
  const [inputNama, setInputNama] = useState(namaPemain);
  const [jenisGame, setJenisGame] = useState<"logika" | "tebak-kota">("logika");
  const [mode, setMode] = useState<"solo" | "tim" | null>(null);
  const [timSubMode, setTimSubMode] = useState<"buat" | "gabung" | null>(null);
  const [namaTim, setNamaTim] = useState("");
  const [kodeTim, setKodeTim] = useState("");
  const [kodeBuat] = useState(() => generateKodeTim());

  const isTimReady =
    mode !== "tim" ||
    (timSubMode === "buat" && namaTim.trim()) ||
    (timSubMode === "gabung" && kodeTim.trim().length === 6);

  const bisaMulai = inputNama.trim() && mode && isTimReady;

  const handleMulai = useCallback(() => {
    const nama = inputNama.trim();
    if (!nama || !mode) return;
    setNamaPemain(nama);
    const nt =
      mode === "tim"
        ? timSubMode === "buat"
          ? namaTim.trim() || `Tim ${kodeBuat}`
          : `Tim ${kodeTim.toUpperCase()}`
        : "";
    const tujuan = jenisGame === "tebak-kota" ? "/tebak-kota" : "/game";
    navigate({
      to: tujuan,
      search: {
        mode,
        namaTim: nt || undefined,
      },
    });
  }, [
    inputNama,
    mode,
    jenisGame,
    timSubMode,
    namaTim,
    kodeTim,
    kodeBuat,
    setNamaPemain,
    navigate,
  ]);

  const handleCopyKode = () => {
    navigator.clipboard.writeText(kodeBuat);
    toast.success("Kode tim disalin!");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0d0a2e 0%, #0f1c4a 30%, #130828 60%, #0a0a28 100%)",
        }}
      >
        {/* Layered radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(99,102,241,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(34,211,238,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Decorative accent glow top-right */}
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-success text-sm px-4 py-1.5 font-bold tracking-wide">
              🧠 Game Logika &amp; Tebak Kota
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-black font-display text-foreground leading-none tracking-tight">
              LogiTeam
              <br />
              <span className="text-primary">Game</span>{" "}
              <span className="text-accent">Kerjasama</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Uji kemampuan berpikir logis dan kekompakan timmu! Selesaikan
              puzzle logika dan tebak kota bersama timmu untuk meraih skor
              tertinggi.
            </p>
          </motion.div>

          {/* Setup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-md bg-card/90 border border-border rounded-2xl p-6 shadow-elevated backdrop-blur-sm space-y-5"
          >
            {/* Pilih Jenis Game */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Pilih Jenis Permainan
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      id: "logika",
                      emoji: "🧠",
                      judul: "Permainan Logika",
                      sub: "Soal pilihan ganda logika & kerjasama tim",
                      borderActive: "border-primary bg-primary/10 text-primary",
                      borderInactive:
                        "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    },
                    {
                      id: "tebak-kota",
                      emoji: "🏙️",
                      judul: "Tebak Kota",
                      sub: "Cocokkan dua gambar dan tebak nama kota",
                      borderActive: "border-accent bg-accent/10 text-accent",
                      borderInactive:
                        "border-border bg-secondary/30 text-muted-foreground hover:border-accent/40 hover:text-foreground",
                    },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setJenisGame(g.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      jenisGame === g.id ? g.borderActive : g.borderInactive
                    }`}
                    data-ocid={`btn-jenis-${g.id}`}
                  >
                    <span className="text-2xl leading-none">{g.emoji}</span>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {g.judul}
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5 leading-snug">
                        {g.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                htmlFor="nama-input"
              >
                <User className="w-3.5 h-3.5 text-primary" />
                Nama Pemain / Ketua Tim
              </label>
              <Input
                id="nama-input"
                placeholder="Masukkan namamu..."
                value={inputNama}
                onChange={(e) => setInputNama(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && bisaMulai && handleMulai()
                }
                className="bg-secondary/50 border-border focus:border-primary"
                data-ocid="input-nama-pemain"
              />
            </div>

            {/* Mode selection */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Pilih Mode Bermain
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["solo", "tim"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setTimSubMode(null);
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      mode === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                    data-ocid={`btn-mode-${m}`}
                  >
                    {m === "solo" ? (
                      <User className="w-6 h-6" />
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                    <div>
                      <div className="text-sm font-bold">
                        {m === "solo" ? "Solo" : "Tim"}
                      </div>
                      <div className="text-xs opacity-70">
                        {m === "solo" ? "Bermain sendiri" : "Bersama tim"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tim sub-mode */}
            {mode === "tim" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <p className="text-sm font-semibold text-foreground">
                  Opsi Tim
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimSubMode("buat")}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      timSubMode === "buat"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-accent/40"
                    }`}
                    data-ocid="btn-buat-tim"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Tim Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimSubMode("gabung")}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      timSubMode === "gabung"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                    }`}
                    data-ocid="btn-gabung-tim"
                  >
                    <LogIn className="w-4 h-4" />
                    Gabung Tim
                  </button>
                </div>

                {timSubMode === "buat" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="space-y-1.5">
                      <label
                        className="text-xs font-semibold text-muted-foreground"
                        htmlFor="nama-tim"
                      >
                        Nama Tim
                      </label>
                      <Input
                        id="nama-tim"
                        placeholder="Contoh: Tim Garuda Emas"
                        value={namaTim}
                        onChange={(e) => setNamaTim(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-accent"
                        data-ocid="input-nama-tim"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-secondary/40 rounded-xl px-4 py-3 border border-accent/20">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Kode Tim (bagikan ke anggota)
                        </div>
                        <div className="text-lg font-black font-mono text-accent tracking-widest">
                          {kodeBuat}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyKode}
                        className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-200"
                        aria-label="Salin kode tim"
                        data-ocid="btn-salin-kode"
                      >
                        <Copy className="w-4 h-4 text-accent" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {timSubMode === "gabung" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label
                      className="text-xs font-semibold text-muted-foreground"
                      htmlFor="kode-tim"
                    >
                      Kode Tim (6 karakter)
                    </label>
                    <Input
                      id="kode-tim"
                      placeholder="Contoh: A3X9KZ"
                      value={kodeTim}
                      onChange={(e) =>
                        setKodeTim(e.target.value.toUpperCase().slice(0, 6))
                      }
                      className="bg-secondary/50 border-border focus:border-primary font-mono tracking-widest uppercase text-center text-lg"
                      maxLength={6}
                      data-ocid="input-kode-tim"
                    />
                    {kodeTim.length > 0 && kodeTim.length < 6 && (
                      <p className="text-xs text-chart-3">
                        Kode harus 6 karakter
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Start Button */}
            <Button
              className="w-full btn-primary justify-center gap-2 text-base h-12 font-bold"
              onClick={handleMulai}
              disabled={!bisaMulai}
              data-ocid="btn-mulai-game"
            >
              {jenisGame === "tebak-kota" ? (
                <MapPin className="w-4 h-4" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {jenisGame === "tebak-kota"
                ? "Mulai Tebak Kota!"
                : "Mulai Tantangan!"}
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Secondary actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                onClick={() => navigate({ to: "/leaderboard" })}
                data-ocid="btn-home-leaderboard"
              >
                <Trophy className="w-3.5 h-3.5" />
                Peringkat
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                onClick={() => navigate({ to: "/history" })}
                data-ocid="btn-home-riwayat"
              >
                <History className="w-3.5 h-3.5" />
                Riwayat
              </Button>

              {/* Cara Bermain Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                    data-ocid="btn-cara-bermain"
                  >
                    <Book className="w-3.5 h-3.5" />
                    Cara Main
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl flex items-center gap-2">
                      <Swords className="w-5 h-5 text-primary" />
                      Cara Bermain LogiTeam
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    {CARA_BERMAIN.map((step) => (
                      <div key={step.no} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-black font-mono text-primary flex-shrink-0">
                          {step.no}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">
                            {step.judul}
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                            {step.deskripsi}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-xs text-accent leading-relaxed">
                      💡 <strong>Tips:</strong> Pada mode Tim, diskusikan
                      jawabannya dulu sebelum mengumpulkan! Kerjasama adalah
                      kunci kemenangan.
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold font-display text-foreground">
              Fitur Permainan
            </h2>
            <p className="text-muted-foreground mt-2">
              Dirancang untuk melatih kekompakan dan ketajaman berpikir tim
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {FITUR.map(({ icon: Icon, judul, deskripsi, warna, bg }, i) => (
              <motion.div
                key={judul}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-2xl border ${bg} space-y-3`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}
                >
                  <Icon className={`w-5 h-5 ${warna}`} />
                </div>
                <h3 className="font-bold text-foreground">{judul}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {deskripsi}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-background py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {[
              { nilai: "10+10", label: "Total Soal", warna: "text-primary" },
              { nilai: "2", label: "Jenis Permainan", warna: "text-accent" },
              { nilai: "#1", label: "Siap Bersaing", warna: "text-chart-3" },
            ].map(({ nilai, label, warna }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-4 bg-card rounded-xl border border-border/60"
              >
                <div className={`text-3xl font-black font-mono ${warna}`}>
                  {nilai}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 border-t border-border/40 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Trophy className="w-10 h-10 text-chart-3 mx-auto" />
          <h2 className="text-2xl font-bold font-display text-foreground">
            Siap Menjadi Tim Terbaik?
          </h2>
          <p className="text-muted-foreground">
            Lihat siapa yang menduduki puncak papan peringkat LogiTeam.
          </p>
          <Button
            variant="outline"
            className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => navigate({ to: "/leaderboard" })}
            data-ocid="btn-lihat-leaderboard"
          >
            <Trophy className="w-4 h-4" />
            Lihat Leaderboard
          </Button>
        </div>
      </section>
    </Layout>
  );
}
