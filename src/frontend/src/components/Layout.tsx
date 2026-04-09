import { useGameContext } from "@/context/GameContext";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, History, Home, Swords, Trophy } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  backTo?: string;
  title?: string;
}

const navItems = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/game", label: "Main", icon: Swords },
  { to: "/leaderboard", label: "Peringkat", icon: Trophy },
  { to: "/history", label: "Riwayat", icon: History },
];

export function Layout({
  children,
  showBack,
  backTo = "/",
  title,
}: LayoutProps) {
  const { namaPemain, skorGlobal } = useGameContext();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border/60 sticky top-0 z-50 shadow-elevated backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: back or logo */}
          <div className="flex items-center gap-3 min-w-0">
            {showBack ? (
              <Link
                to={backTo}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                data-ocid="nav-back"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="text-sm font-medium hidden sm:inline">
                  Kembali
                </span>
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2.5 group"
                data-ocid="nav-logo"
              >
                <img
                  src="/assets/images/rtik_subang.png"
                  alt="Relawan TIK Kabupaten Subang"
                  className="w-9 h-9 rounded-full object-cover shadow-glow group-hover:scale-105 transition-transform duration-200"
                />
                <div className="hidden sm:block">
                  <div className="text-sm font-bold font-display text-foreground leading-none">
                    LogiTeam
                  </div>
                  <div className="text-xs text-muted-foreground leading-none mt-0.5">
                    Game Logika Interaktif
                  </div>
                </div>
              </Link>
            )}
            {title && (
              <span className="text-base font-semibold text-foreground truncate ml-1 hidden md:block">
                {title}
              </span>
            )}
          </div>

          {/* Center: Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="nav-main"
          >
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                  data-ocid={`nav-item-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Player info */}
          <div className="flex items-center gap-3">
            {namaPemain && (
              <div className="hidden sm:flex items-center gap-2 bg-secondary/60 px-3 py-1.5 rounded-full border border-border/40">
                <div className="w-2 h-2 rounded-full bg-accent pulse-glow" />
                <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
                  {namaPemain}
                </span>
                {skorGlobal > 0 && (
                  <span className="text-xs font-bold text-accent font-mono">
                    {skorGlobal.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-border/40 bg-card/80">
          <div className="flex items-center justify-around px-2 py-1.5">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`nav-mobile-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-card/60 border-t border-border/40 py-4 px-4 mt-auto">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
