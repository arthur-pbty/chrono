"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "./components/ThemeProvider";
import { toggleFullscreen } from "./lib/utils";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";

type Mode = "stopwatch" | "timer";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [toast, setToast] = useState<string | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load saved mode
  useEffect(() => {
    const saved = localStorage.getItem("chrono-mode") as Mode | null;
    if (saved === "stopwatch" || saved === "timer") {
      setMode(saved);
    }
  }, []);

  // Save mode
  useEffect(() => {
    localStorage.setItem("chrono-mode", mode);
  }, [mode]);

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastExiting(false);
    setToast(msg);
    setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => setToast(null), 200);
    }, 1500);
  }, []);

  const handleCopyFeedback = useCallback(() => {
    showToast("Temps copié !");
  }, [showToast]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-sky-500 to-cyan-400 dark:from-cyan-400 dark:to-sky-500 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 hidden sm:block">
              <span aria-hidden="true">Chrono</span>
              <span className="sr-only">
                Chronomètre en ligne gratuit et minuteur
              </span>
            </h1>
          </div>

          {/* Mode switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 rounded-xl p-0.5">
            <button
              onClick={() => setMode("stopwatch")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === "stopwatch"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="13" r="8" />
                  <path d="M12 9v4l2 2" />
                  <path d="M5 3 2 6" />
                  <path d="m22 6-3-3" />
                  <path d="M6.38 18.7 4 21" />
                  <path d="M17.64 18.67 20 21" />
                </svg>
                <span className="hidden xs:inline">Chrono</span>
              </span>
            </button>
            <button
              onClick={() => setMode("timer")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === "timer"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 22h14" />
                  <path d="M5 2h14" />
                  <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                  <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                </svg>
                <span className="hidden xs:inline">Minuteur</span>
              </span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
              aria-label="Changer de thème"
              title={theme === "dark" ? "Mode clair" : "Mode sombre"}
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer hidden sm:flex"
              aria-label="Plein écran"
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <section
            aria-label={
              mode === "stopwatch"
                ? "Chronomètre en ligne"
                : "Minuteur en ligne"
            }
          >
            <h2 className="sr-only">
              {mode === "stopwatch"
                ? "Chronomètre en ligne gratuit — Précision à la milliseconde"
                : "Minuteur en ligne gratuit — Compte à rebours avec alertes"}
            </h2>
            {mode === "stopwatch" ? (
              <Stopwatch onCopyFeedback={handleCopyFeedback} />
            ) : (
              <Timer onCopyFeedback={handleCopyFeedback} />
            )}
          </section>
        </div>
      </main>

      {/* SEO content — visible et utile, mais discret */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-4">
        <article className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
          <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Chronomètre en ligne gratuit et minuteur professionnel
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
            Bienvenue sur Chrono, votre <strong>chronomètre en ligne gratuit</strong> et{" "}
            <strong>minuteur professionnel</strong>. Mesurez le temps avec une précision à la
            milliseconde, enregistrez vos tours (laps), créez plusieurs minuteurs simultanés et
            profitez d&apos;une interface moderne et rapide. Aucune inscription requise, aucune
            publicité, fonctionne directement dans votre navigateur.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            <div>
              <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 text-sm">
                ⏱️ Chronomètre
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Démarrer, pause et remise à zéro</li>
                <li>Affichage heures, minutes, secondes, millisecondes</li>
                <li>Tours/laps avec historique et meilleur/pire temps</li>
                <li>Raccourcis clavier (Espace, L, R, C)</li>
                <li>Copie du temps en un clic</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 text-sm">
                ⏳ Minuteur
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Réglage heures, minutes, secondes</li>
                <li>Presets rapides (1, 3, 5, 10, 15, 30 min)</li>
                <li>Plusieurs minuteurs simultanés</li>
                <li>Alerte sonore et notification navigateur</li>
                <li>Animation visuelle de progression</li>
              </ul>
            </div>
          </div>

          {/* FAQ SEO */}
          <details className="group text-sm">
            <summary className="font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Questions fréquentes (FAQ)
            </summary>
            <div className="mt-3 space-y-3 text-zinc-500 dark:text-zinc-400">
              <div>
                <h4 className="font-medium text-zinc-600 dark:text-zinc-300">
                  Comment utiliser le chronomètre en ligne ?
                </h4>
                <p>
                  Cliquez sur « Démarrer » ou appuyez sur la barre Espace pour lancer le
                  chronomètre. Utilisez L pour marquer un tour, R pour réinitialiser et C pour
                  copier le temps.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-600 dark:text-zinc-300">
                  Le chronomètre est-il vraiment gratuit ?
                </h4>
                <p>
                  Oui, 100% gratuit, sans publicité et sans inscription. Il fonctionne directement
                  dans votre navigateur web.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-600 dark:text-zinc-300">
                  Puis-je utiliser plusieurs minuteurs en même temps ?
                </h4>
                <p>
                  Oui, vous pouvez créer autant de minuteurs simultanés que vous le souhaitez.
                  Chacun fonctionne de manière indépendante.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-600 dark:text-zinc-300">
                  Le chronomètre fonctionne-t-il en arrière-plan ?
                </h4>
                <p>
                  Oui, le chronomètre et les minuteurs continuent même si vous changez d&apos;onglet.
                  Le temps est sauvegardé automatiquement dans votre navigateur.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-600 dark:text-zinc-300">
                  Le chronomètre fonctionne-t-il sur mobile ?
                </h4>
                <p>
                  Oui, l&apos;interface est entièrement responsive et optimisée pour smartphones et
                  tablettes. Vous pouvez aussi l&apos;installer comme application (PWA).
                </p>
              </div>
            </div>
          </details>
        </article>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900">
        <p>Chronomètre en ligne gratuit — rapide, précis, sans pub</p>
        <nav className="mt-1 flex justify-center gap-3" aria-label="Liens utiles">
          <span>Chronomètre</span>
          <span aria-hidden="true">·</span>
          <span>Minuteur</span>
          <span aria-hidden="true">·</span>
          <span>Compte à rebours</span>
        </nav>
      </footer>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium shadow-lg ${
            toastExiting ? "toast-exit" : "toast-enter"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {toast}
          </span>
        </div>
      )}
    </div>
  );
}
