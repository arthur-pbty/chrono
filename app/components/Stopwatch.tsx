"use client";

import React, { useEffect, useCallback } from "react";
import { useStopwatch } from "../hooks/useStopwatch";
import { formatTime, copyToClipboard } from "../lib/utils";

export default function Stopwatch({
  onCopyFeedback,
}: {
  onCopyFeedback: () => void;
}) {
  const { elapsed, isRunning, laps, toggle, reset, lap } = useStopwatch();
  const time = formatTime(elapsed);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          toggle();
          break;
        case "KeyR":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            reset();
          }
          break;
        case "KeyL":
          e.preventDefault();
          lap();
          break;
        case "KeyC":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            copyToClipboard(time.full).then((ok) => {
              if (ok) onCopyFeedback();
            });
          }
          break;
      }
    },
    [toggle, reset, lap, time.full, onCopyFeedback]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const lapDiffs = laps.map((lapTime, i) => {
    const prev = i === 0 ? 0 : laps[i - 1];
    return lapTime - prev;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 animate-fade-in">
      {/* Time display */}
      <div className="relative group">
        <button
          onClick={() =>
            copyToClipboard(time.full).then((ok) => {
              if (ok) onCopyFeedback();
            })
          }
          className="cursor-pointer select-none focus:outline-none"
          title="Copier le temps"
          aria-label="Copier le temps"
        >
          <div className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight tabular-nums transition-all duration-100">
            <span className="text-zinc-500 dark:text-zinc-500">
              {time.hours}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">:</span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {time.minutes}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">:</span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {time.seconds}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">.</span>
            <span className="text-zinc-400 dark:text-zinc-500 text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              {time.milliseconds}
            </span>
          </div>
        </button>
        {/* Copy icon hint */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggle}
          className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 active:scale-95 cursor-pointer ${
            isRunning
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
          }`}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Pause
            </span>
          ) : elapsed > 0 ? (
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Reprendre
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Démarrer
            </span>
          )}
        </button>

        {isRunning && (
          <button
            onClick={lap}
            className="px-5 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 transition-all duration-200 active:scale-95 animate-scale-in cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" x2="4" y1="22" y2="15" />
              </svg>
              Tour
            </span>
          </button>
        )}

        {(elapsed > 0 || laps.length > 0) && (
          <button
            onClick={reset}
            className="px-5 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200 active:scale-95 animate-scale-in cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </span>
          </button>
        )}
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="w-full max-w-lg mt-2 animate-fade-in">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
            Tours ({laps.length})
          </h3>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <th className="py-2.5 px-4 text-left font-medium">#</th>
                  <th className="py-2.5 px-4 text-right font-medium">
                    Temps total
                  </th>
                  <th className="py-2.5 px-4 text-right font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {[...laps]
                  .map((l, i) => ({ lap: l, diff: lapDiffs[i], index: i }))
                  .reverse()
                  .map(({ lap: l, diff, index }) => {
                    const best = Math.min(...lapDiffs);
                    const worst = Math.max(...lapDiffs);
                    const isBest = lapDiffs.length > 1 && diff === best;
                    const isWorst = lapDiffs.length > 1 && diff === worst;

                    return (
                      <tr
                        key={index}
                        className={`border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors ${
                          isBest
                            ? "bg-emerald-500/5"
                            : isWorst
                            ? "bg-red-500/5"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                        }`}
                      >
                        <td className="py-2.5 px-4 font-medium text-zinc-600 dark:text-zinc-300">
                          <span className="flex items-center gap-1.5">
                            {index + 1}
                            {isBest && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                                BEST
                              </span>
                            )}
                            {isWorst && (
                              <span className="text-[10px] bg-red-500/20 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded-full font-semibold">
                                SLOW
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-zinc-800 dark:text-zinc-200">
                          {formatTime(l).full}
                        </td>
                        <td
                          className={`py-2.5 px-4 text-right font-mono ${
                            isBest
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isWorst
                              ? "text-red-500 dark:text-red-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          +{formatTime(diff).full}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-400 dark:text-zinc-600 mt-4">
        <span>
          <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] font-mono">
            Espace
          </kbd>{" "}
          Start/Pause
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] font-mono">
            L
          </kbd>{" "}
          Tour
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] font-mono">
            R
          </kbd>{" "}
          Reset
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] font-mono">
            C
          </kbd>{" "}
          Copier
        </span>
      </div>
    </div>
  );
}
