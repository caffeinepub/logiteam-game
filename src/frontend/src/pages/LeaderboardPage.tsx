import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameContext } from "@/context/GameContext";
import { type LeaderboardEntryLocal, useLeaderboard } from "@/lib/actor";
import { useNavigate } from "@tanstack/react-router";
import { Medal, RefreshCw, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-chart-3/20 border border-chart-3/50 flex-shrink-0">
        <Medal className="w-5 h-5 text-chart-3" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/60 border border-muted-foreground/30 flex-shrink-0">
        <Medal className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/30 flex-shrink-0">
        <Medal className="w-5 h-5 text-accent" />
      </div>
    );
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/40 border border-border flex-shrink-0">
      <span className="text-sm font-bold text-muted-foreground font-mono">
        #{rank}
      </span>
    </div>
  );
}

function PodiumCard({
  entry,
  index,
  isCurrentPlayer,
}: {
  entry: LeaderboardEntryLocal;
  index: number;
  isCurrentPlayer: boolean;
}) {
  const rankStyle: Record<number, string> = {
    1: "border-chart-3/50 bg-chart-3/5 shadow-[0_0_20px_rgba(168,130,50,0.15)]",
    2: "border-muted-foreground/30 bg-secondary/20",
    3: "border-accent/30 bg-accent/5",
  };
  const baseStyle = rankStyle[entry.peringkat] ?? "border-border bg-card";
  const highlightStyle = isCurrentPlayer
    ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`flex items-center gap-4 p-4 rounded-xl border ${baseStyle} ${highlightStyle} transition-all duration-200 hover:scale-[1.015]`}
      data-ocid={`leaderboard-row-${entry.peringkat}`}
    >
      <RankBadge rank={entry.peringkat} />

      {/* Emoji mascot */}
      <span className="text-2xl flex-shrink-0">{entry.emot}</span>

      {/* Player / team info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold text-foreground truncate">
            {entry.namaPemain || entry.namaTampil}
          </span>
          {isCurrentPlayer && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold flex-shrink-0">
              Kamu
            </span>
          )}
        </div>
        {entry.namaTim && (
          <div className="text-xs text-accent font-semibold mt-0.5 truncate">
            🏆 {entry.namaTim}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-0.5">
          {entry.puzzleSelesai} permainan selesai
        </div>
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <div
          className={`text-xl font-black font-mono ${entry.peringkat === 1 ? "text-chart-3" : entry.peringkat <= 3 ? "text-accent" : "text-foreground"}`}
        >
          {entry.skor.toLocaleString()}
        </div>
        <div className="flex items-center justify-end gap-0.5 mt-0.5">
          {Array.from({
            length: Math.min(3, Math.ceil(entry.puzzleSelesai / 3) || 1),
          }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative stars
            <Star key={i} className="w-2.5 h-2.5 fill-chart-3 text-chart-3" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function LeaderboardPage() {
  const { data: entries, isLoading, refetch, isFetching } = useLeaderboard();
  const { namaPemain } = useGameContext();
  const navigate = useNavigate();

  return (
    <Layout title="Papan Peringkat">
      {/* Hero */}
      <section className="bg-card border-b border-border/60 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-chart-3/20 border border-chart-3/40 flex items-center justify-center mx-auto"
          >
            <Trophy className="w-8 h-8 text-chart-3" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black font-display text-foreground"
          >
            Papan Peringkat
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Pemain terbaik LogiTeam — siapa yang akan merajai puncak?
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3 pt-2"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/60 text-muted-foreground hover:text-foreground"
              onClick={() => refetch()}
              disabled={isFetching}
              data-ocid="btn-refresh-leaderboard"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Memperbarui..." : "Perbarui"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/60 text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: "/" })}
              data-ocid="btn-back-to-menu"
            >
              ← Kembali ke Menu
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Top 3 Trophy display */}
      {!isLoading && entries && entries.length >= 3 && (
        <section className="bg-background py-8 px-4 border-b border-border/40">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3 items-end">
              {/* 2nd place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-2 pt-4"
              >
                <div className="text-3xl">{entries[1].emot}</div>
                <div className="text-lg font-black font-mono text-muted-foreground">
                  #2
                </div>
                <div className="bg-muted/60 rounded-t-xl px-2 py-4 border border-muted-foreground/20">
                  <div className="text-sm font-bold text-foreground truncate">
                    {entries[1].namaPemain || entries[1].namaTampil}
                  </div>
                  {entries[1].namaTim && (
                    <div className="text-xs text-accent font-semibold truncate">
                      🏆 {entries[1].namaTim}
                    </div>
                  )}
                  <div className="text-lg font-black font-mono text-foreground">
                    {entries[1].skor.toLocaleString()}
                  </div>
                </div>
              </motion.div>
              {/* 1st place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-2"
              >
                <div className="text-4xl">{entries[0].emot}</div>
                <div className="text-2xl font-black font-mono text-chart-3">
                  #1
                </div>
                <div className="bg-chart-3/15 rounded-t-xl px-2 py-5 border border-chart-3/40">
                  <div className="text-sm font-bold text-foreground truncate">
                    {entries[0].namaPemain || entries[0].namaTampil}
                  </div>
                  {entries[0].namaTim && (
                    <div className="text-xs text-accent font-semibold truncate">
                      🏆 {entries[0].namaTim}
                    </div>
                  )}
                  <div className="text-xl font-black font-mono text-chart-3">
                    {entries[0].skor.toLocaleString()}
                  </div>
                </div>
              </motion.div>
              {/* 3rd place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-2 pt-6"
              >
                <div className="text-3xl">{entries[2].emot}</div>
                <div className="text-lg font-black font-mono text-accent">
                  #3
                </div>
                <div className="bg-accent/10 rounded-t-xl px-2 py-3 border border-accent/20">
                  <div className="text-sm font-bold text-foreground truncate">
                    {entries[2].namaPemain || entries[2].namaTampil}
                  </div>
                  {entries[2].namaTim && (
                    <div className="text-xs text-accent font-semibold truncate">
                      🏆 {entries[2].namaTim}
                    </div>
                  )}
                  <div className="text-lg font-black font-mono text-accent">
                    {entries[2].skor.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Leaderboard list */}
      <section className="bg-background flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Semua Peringkat
            </h2>
            <span className="text-xs text-muted-foreground">
              {entries?.length ?? 0} pemain terdaftar
            </span>
          </div>

          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            : (entries ?? []).map((entry, i) => (
                <PodiumCard
                  key={`${entry.peringkat}-${entry.namaTampil}`}
                  entry={entry}
                  index={i}
                  isCurrentPlayer={
                    !!namaPemain &&
                    entry.namaTampil
                      .toLowerCase()
                      .includes(namaPemain.toLowerCase())
                  }
                />
              ))}

          {!isLoading && (!entries || entries.length === 0) && (
            <div
              className="text-center py-16 space-y-4"
              data-ocid="leaderboard-empty"
            >
              <div className="text-5xl">🏅</div>
              <h3 className="text-xl font-bold text-foreground">
                Belum Ada Data
              </h3>
              <p className="text-muted-foreground text-sm">
                Jadilah yang pertama memasuki leaderboard!
              </p>
              <Button
                className="btn-primary gap-2"
                onClick={() => navigate({ to: "/" })}
                data-ocid="btn-mulai-dari-leaderboard"
              >
                Mulai Bermain
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Info section */}
      <section className="bg-muted/30 border-t border-border/40 py-8 px-4">
        <div className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-4 text-center">
          {[
            {
              label: "Pemain Terdaftar",
              nilai: entries?.length.toString() ?? "0",
              warna: "text-primary",
            },
            {
              label: "Skor Tertinggi",
              nilai: entries?.[0]?.skor.toLocaleString() ?? "0",
              warna: "text-chart-3",
            },
            {
              label: "Permainan Selesai",
              nilai: entries?.[0]?.puzzleSelesai.toString() ?? "0",
              warna: "text-accent",
            },
          ].map(({ label, nilai, warna }) => (
            <div
              key={label}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className={`text-2xl font-black font-mono ${warna}`}>
                {nilai}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
