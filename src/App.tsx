import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { CommandPalette } from "./components/CommandPalette";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Lazy load pages for better performance
const Create = lazy(() => import("./pages/Create"));
const Strategy = lazy(() => import("./pages/Strategy"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const Hub = lazy(() => import("./pages/Hub"));
const Playbooks = lazy(() => import("./pages/Playbooks"));
const Research = lazy(() => import("./pages/Research"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  useKeyboardShortcuts();

  return (
    <>
      <Toaster />
      <Sonner />
      <CommandPalette />
      <Routes>
        <Route path="/" element={<Navigate to="/create" replace />} />
        <Route
          path="/create"
          element={
            <AppShell>
              <Suspense fallback={<LoadingScreen />}>
                <Create />
              </Suspense>
            </AppShell>
          }
        />
        <Route
          path="/strategy"
          element={
            <AppShell>
              <Suspense fallback={<LoadingScreen />}>
                <Strategy />
              </Suspense>
            </AppShell>
          }
        />
        <Route
          path="/intelligence"
          element={
            <AppShell>
              <Suspense fallback={<LoadingScreen />}>
                <Intelligence />
              </Suspense>
            </AppShell>
          }
        />
        <Route
          path="/hub"
          element={
            <AppShell>
              <Suspense fallback={<LoadingScreen />}>
                <Hub />
              </Suspense>
            </AppShell>
          }
        />
        <Route
          path="/playbooks"
          element={
            <AppShell>
              <Suspense fallback={<LoadingScreen />}>
                <Playbooks />
              </Suspense>
            </AppShell>
          }
        />
        <Route
          path="/research"
          element={
            <AppShell>
              <Suspense fallback={<LoadingScreen />}>
                <Research />
              </Suspense>
            </AppShell>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
