import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionHistory } from "@/types/game";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  History,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SAMPLE_HISTORY: SessionHistory[] = [
  {
    id: "h1",
    mode: "tim",
    namaTim: "Tim Garuda Emas",
    skor: 1850,
    puzzleSelesai: 8,
    totalPuzzle: 10,
    tanggal: Date.now() - 1000 * 60 * 60 * 2,
    durasi: 720,
  },
  {
    id: "h2",
    mode: "solo",
    skor: 950,
    puzzleSelesai: 6,
    totalPuzzle: 10,
    tanggal: Date.now() - 1000 * 60 * 60 * 24,
    durasi: 540,
  },
  {
    id: "h3",
    mode: "tim",
    namaTim: "Tim Singa Perkasa",
    skor: 2100,
    puzzleSelesai: 10,
    totalPuzzle: 10,
    tanggal: Date.now() - 1000 * 60 * 60 * 48,
    durasi: 890,
  },
  {
    id: "h4",
    mode: "solo",
    skor: 1450,
    puzzleSelesai: 7,
    totalPuzzle: 10,
    tanggal: Date.now() - 1000 * 60 * 60 * 72,
    durasi: 610,
  },
  {
    id: "h5",
    mode: "tim",
    namaTim: "Tim Merak Indah",
    skor: 600,
    puzzleSelesai: 4,
    totalPuzzle: 10,
    tanggal: Date.now() - 1000 * 60 * 60 * 96,
    durasi: 430,
  },
];

// Per-puzzle mock performance (in real app this would come from the backend)
const PUZZLE_PERFORMANCE: Record<
  string,
  { no: number; benar: boolean; poin: number; waktu: number }[]
> = {
  h1: [
    { no: 1, benar: true, poin: 150, waktu: 45 },
    { no: 2, benar: true, poin: 100, waktu: 30 },
    { no: 3, benar: false, poin: 0, waktu: 120 },
    { no: 4, benar: true, poin: 250, waktu: 60 },
    { no: 5, benar: true, poin: 300, waktu: 55 },
    { no: 6, benar: true, poin: 150, waktu: 40 },
    { no: 7, benar: false, poin: 0, waktu: 120 },
    { no: 8, benar: true, poin: 250, waktu: 70 },
    { no: 9, benar: true, poin: 200, waktu: 50 },
    { no: 10, benar: false, poin: 0, waktu: 110 },
  ],
  h2: [
    { no: 1, benar: true, poin: 150, waktu: 50 },
    { no: 2, benar: false, poin: 0, waktu: 120 },
    { no: 3, benar: true, poin: 200, waktu: 80 },
    { no: 4, benar: true, poin: 250, waktu: 75 },
    { no: 5, benar: false, poin: 0, waktu: 120 },
    { no: 6, benar: true, poin: 150, waktu: 45 },
    { no: 7, benar: false, poin: 0, waktu: 120 },
    { no: 8, benar: false, poin: 0, waktu: 120 },
    { no: 9, benar: true, poin: 200, waktu: 65 },
    { no: 10, benar: false, poin: 0, waktu: 120 },
  ],
};

function formatTanggal(ts: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

function formatDurasi(detik: number): string {
  const m = Math.floor(detik / 60);
  const s = detik % 60;
  return `${m}m ${s}s`;
}

function HistoryCard({ item, index }: { item: SessionHistory; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const akurasi = Math.round((item.puzzleSelesai / item.totalPuzzle) * 100);
  const bintang = akurasi >= 80 ? 3 : akurasi >= 50 ? 2 : 1;
  const perPuzzle = PUZZLE_PERFORMANCE[item.id];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors duration-200"
      data-ocid={`history-card-${item.id}`}
    >
      {/* Card Header — always visible */}
      <button
        type="button"
        className="w-full text-left p-5 space-y-4"
        onClick={() => setExpanded((e) => !e)}
        data-ocid={`history-expand-${item.id}`}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={`text-xs font-bold ${item.mode === "tim" ? "bg-primary/15 text-primary border-primary/30" : "bg-secondary text-muted-foreground"}`}
              >
                {item.mode === "tim" ? "👥 Tim" : "👤 Solo"}
              </Badge>
              {item.namaTim && (
                <span className="text-sm font-semibold text-foreground truncate">
                  {item.namaTim}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3].map((b) => (
                <Star
                  key={b}
                  className={`w-4 h-4 ${b <= bintang ? "text-chart-3 fill-chart-3" : "text-muted"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-accent">
                {item.skor.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">poin</div>
            </div>
            <div className="mt-1 text-muted-foreground">
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/40 rounded-lg p-2.5 text-center">
            <div className="text-sm font-bold text-foreground">
              {item.puzzleSelesai}/{item.totalPuzzle}
            </div>
            <div className="text-xs text-muted-foreground">Puzzle Benar</div>
          </div>
          <div className="bg-secondary/40 rounded-lg p-2.5 text-center">
            <div className="text-sm font-bold text-foreground">{akurasi}%</div>
            <div className="text-xs text-muted-foreground">Akurasi</div>
          </div>
          <div className="bg-secondary/40 rounded-lg p-2.5 text-center">
            <div className="text-sm font-bold text-foreground">
              {formatDurasi(item.durasi)}
            </div>
            <div className="text-xs text-muted-foreground">Durasi</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatTanggal(item.tanggal)}
          <span className="mx-1">·</span>
          <Clock className="w-3.5 h-3.5" />
          {formatDurasi(item.durasi)}
        </div>
      </button>

      {/* Expanded per-puzzle performance */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/40"
          >
            <div className="p-4 bg-secondary/20 space-y-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Performa Per Soal
              </div>
              {perPuzzle ? (
                <div className="grid grid-cols-2 gap-2">
                  {perPuzzle.map((p) => (
                    <div
                      key={p.no}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                        p.benar
                          ? "bg-accent/8 border-accent/20"
                          : "bg-destructive/8 border-destructive/20"
                      }`}
                    >
                      <span className="font-mono font-bold text-xs text-muted-foreground w-4">
                        #{p.no}
                      </span>
                      <span
                        className={`font-bold ${p.benar ? "text-accent" : "text-destructive"}`}
                      >
                        {p.benar ? "✓" : "✗"}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${p.benar ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {p.benar ? `+${p.poin}` : "0 poin"}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {p.waktu}s
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic text-center py-3">
                  Detail per soal tidak tersedia untuk sesi ini.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function HistoryPage() {
  const totalPoin = SAMPLE_HISTORY.reduce((acc, h) => acc + h.skor, 0);
  const rataAkurasi = Math.round(
    SAMPLE_HISTORY.reduce(
      (acc, h) => acc + (h.puzzleSelesai / h.totalPuzzle) * 100,
      0,
    ) / SAMPLE_HISTORY.length,
  );
  const sesiTim = SAMPLE_HISTORY.filter((h) => h.mode === "tim").length;

  return (
    <Layout title="Riwayat Permainan">
      {/* Header */}
      <section className="bg-card border-b border-border/60 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto"
          >
            <History className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black font-display text-foreground"
          >
            Riwayat Permainan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Jejak perjalanan berpikir logismu — klik kartu untuk detail soal
          </motion.p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="bg-background py-6 px-4 border-b border-border/40">
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Sesi",
              nilai: SAMPLE_HISTORY.length.toString(),
              icon: History,
              warna: "text-primary",
            },
            {
              label: "Total Poin",
              nilai: totalPoin.toLocaleString(),
              icon: Trophy,
              warna: "text-accent",
            },
            {
              label: "Rata Akurasi",
              nilai: `${rataAkurasi}%`,
              icon: Target,
              warna: "text-chart-3",
            },
            {
              label: "Sesi Tim",
              nilai: sesiTim.toString(),
              icon: Star,
              warna: "text-primary",
            },
          ].map(({ label, nilai, icon: Icon, warna }) => (
            <div
              key={label}
              className="bg-card rounded-xl p-3 text-center border border-border"
            >
              <Icon className={`w-4 h-4 mx-auto mb-1 ${warna}`} />
              <div className={`text-xl font-black font-mono ${warna}`}>
                {nilai}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* History list */}
      <section className="bg-muted/20 flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Sesi Terakhir
            </h2>
            <span className="text-xs text-muted-foreground">
              {SAMPLE_HISTORY.length} sesi
            </span>
          </div>

          {SAMPLE_HISTORY.length > 0 ? (
            SAMPLE_HISTORY.map((item, i) => (
              <HistoryCard key={item.id} item={item} index={i} />
            ))
          ) : (
            <div
              className="text-center py-16 space-y-4"
              data-ocid="history-empty"
            >
              <div className="text-5xl">📋</div>
              <h3 className="text-xl font-bold text-foreground">
                Belum Ada Riwayat
              </h3>
              <p className="text-muted-foreground text-sm">
                Mainkan tantangan pertamamu untuk mulai mencatat riwayat.
              </p>
              <Link to="/">
                <Button
                  className="btn-primary gap-2"
                  data-ocid="btn-mulai-dari-history"
                >
                  Mulai Bermain
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
