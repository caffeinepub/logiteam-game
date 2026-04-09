import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { GameProvider } from "@/context/GameContext";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { GamePage } from "@/pages/GamePage";
import { HistoryPage } from "@/pages/HistoryPage";
// Lazy pages — inline for foundation
import { HomePage } from "@/pages/HomePage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { TebakKotaPage } from "@/pages/TebakKotaPage";

const rootRoute = createRootRoute({
  component: () => (
    <GameProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </GameProvider>
  ),
  notFoundComponent: () => (
    <GameProvider>
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20">
          <div className="text-6xl">🧩</div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground">
            Halaman yang kamu cari tidak ada.
          </p>
          <Link to="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </Layout>
    </GameProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: GamePage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const tebakKotaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tebak-kota",
  component: TebakKotaPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  gameRoute,
  leaderboardRoute,
  historyRoute,
  tebakKotaRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
