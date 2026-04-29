import type { ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout.js";
import { useAuthStore } from "../features/auth/auth.store.js";
import { GamePage } from "../pages/GamePage.js";
import { HomePage } from "../pages/HomePage.js";
import { LeaderboardPage } from "../pages/LeaderboardPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/game",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <GamePage />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LeaderboardPage />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);
