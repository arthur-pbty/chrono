"use client";

import React, { useState, useCallback } from "react";
import { useTimers, TimerItem } from "../hooks/useTimers";
import { formatTime, copyToClipboard } from "../lib/utils";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "30 min", seconds: 1800 },
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularProgress({
  progress,
  finished,
}: {
  progress: number;
  finished: boolean;
}) {
  const offset = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Track */}
      <circle
        cx="60"
        cy="60"
        r={RADIUS}
        fill="none"
        strokeWidth="5"
        className="stroke-zinc-200 dark:stroke-zinc-800"
      />
      {/* Progress */}
      <circle
        cx="60"
        cy="60"
        r={RADIUS}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        className={`transition-[stroke-dashoffset] duration-100 ${
          finished
            ? "stroke-red-500 dark:stroke-red-400"
            : progress > 0.25
            ? "stroke-sky-500 dark:stroke-cyan-400"
            : progress > 0.1
            ? "stroke-amber-500 dark:stroke-amber-400"
            : "stroke-red-500 dark:stroke-red-400"
        }`}
      />
      {/* Glow when close to finish */}
      {progress <= 0.1 && progress > 0 && (
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="stroke-red-500/20 dark:stroke-red-400/20 animate-pulse-ring"
        />
      )}
    </svg>
  );
}

function TimerCard({
  timer,
  onToggle,
  onReset,
  onDelete,
  onCopyFeedback,
}: {
  timer: TimerItem;
  onToggle: () => void;
  onReset: () => void;
  onDelete: () => void;
  onCopyFeedback: () => void;
}) {
  const time = formatTime(timer.remaining);
  const progress = timer.duration > 0 ? timer.remaining / timer.duration : 0;

  return (
    <div
      className={`relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 animate-scale-in ${
        timer.finished
          ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/5 shadow-lg shadow-red-500/10"
          : "border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700"
      } backdrop-blur-sm`}
    >
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        aria-label="Supprimer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="flex items-center gap-4 sm:gap-5">
        {/* Circular progress */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 relative">
          <CircularProgress progress={progress} finished={timer.finished} />
          {/* Percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-xs sm:text-sm font-semibold ${
                timer.finished
                  ? "text-red-500 dark:text-red-400"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {timer.finished ? "Fini !" : `${Math.round(progress * 100)}%`}
            </span>
          </div>
        </div>

        {/* Time + controls */}
        <div className="flex-1 min-w-0">
          {timer.label && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 truncate">
              {timer.label}
            </p>
          )}
          <button
            onClick={() =>
              copyToClipboard(time.full).then((ok) => {
                if (ok) onCopyFeedback();
              })
            }
            className="cursor-pointer"
            title="Copier le temps"
          >
            <p
              className={`font-mono text-2xl sm:text-3xl font-bold tabular-nums ${
                timer.finished
                  ? "text-red-500 dark:text-red-400 animate-pulse"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {time.hours !== "00" && (
                <>
                  {time.hours}
                  <span className="text-zinc-400 dark:text-zinc-600">:</span>
                </>
              )}
              {time.minutes}
              <span className="text-zinc-400 dark:text-zinc-600">:</span>
              {time.seconds}
            </p>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-2.5">
            {!timer.finished && (
              <button
                onClick={onToggle}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  timer.isRunning
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                }`}
              >
                {timer.isRunning ? "⏸ Pause" : "▶ Start"}
              </button>
            )}
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl text-sm font-semibold bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300/60 dark:hover:bg-zinc-700/60 border border-zinc-300/50 dark:border-zinc-700/50 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              ↻ Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Timer({
  onCopyFeedback,
}: {
  onCopyFeedback: () => void;
}) {
  const {
    timers,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    deleteTimer,
    toggleTimer,
  } = useTimers();

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [label, setLabel] = useState("");

  const handleAdd = useCallback(() => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalMs <= 0) return;
    const id = addTimer(totalMs, label || `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds > 0 ? seconds + "s" : ""}`.trim());
    startTimer(id);
    setLabel("");
  }, [hours, minutes, seconds, label, addTimer, startTimer]);

  const handlePreset = useCallback(
    (totalSeconds: number) => {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setHours(h);
      setMinutes(m);
      setSeconds(s);

      const id = addTimer(totalSeconds * 1000, `${m > 0 ? m + " min" : ""}${s > 0 ? " " + s + "s" : ""}`);
      startTimer(id);
    },
    [addTimer, startTimer]
  );

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 animate-fade-in w-full max-w-xl mx-auto">
      {/* Timer creation */}
      <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-5 sm:p-6">
        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {PRESETS.map((p) => (
            <button
              key={p.seconds}
              onClick={() => handlePreset(p.seconds)}
              className="px-3.5 py-1.5 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-sky-500/15 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-500/30 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Time input */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4">
          <TimeInput
            value={hours}
            onChange={setHours}
            max={99}
            label="Heures"
          />
          <span className="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-600 mt-5">
            :
          </span>
          <TimeInput
            value={minutes}
            onChange={setMinutes}
            max={59}
            label="Minutes"
          />
          <span className="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-600 mt-5">
            :
          </span>
          <TimeInput
            value={seconds}
            onChange={setSeconds}
            max={59}
            label="Secondes"
          />
        </div>

        {/* Label input */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nom du minuteur (optionnel)"
            className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={hours === 0 && minutes === 0 && seconds === 0}
          className="w-full py-3 rounded-2xl font-semibold text-base bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ajouter un minuteur
          </span>
        </button>
      </div>

      {/* Active timers */}
      {timers.length > 0 && (
        <div className="w-full space-y-3">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Minuteurs actifs ({timers.length})
          </h3>
          {timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onToggle={() => toggleTimer(timer.id)}
              onReset={() => resetTimer(timer.id)}
              onDelete={() => deleteTimer(timer.id)}
              onCopyFeedback={onCopyFeedback}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {timers.length === 0 && (
        <div className="text-center py-8 text-zinc-400 dark:text-zinc-600">
          <svg
            className="mx-auto mb-3 opacity-40"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-sm">
            Sélectionnez un preset ou réglez un temps personnalisé
          </p>
        </div>
      )}
    </div>
  );
}

function TimeInput({
  value,
  onChange,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
  label: string;
}) {
  const increment = () => onChange(Math.min(max, value + 1));
  const decrement = () => onChange(Math.max(0, value - 1));

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={increment}
        className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        aria-label={`Augmenter ${label}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || 0;
          onChange(Math.max(0, Math.min(max, v)));
        }}
        className="w-16 sm:w-20 text-center text-3xl sm:text-4xl font-mono font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all"
        min={0}
        max={max}
      />
      <button
        onClick={decrement}
        className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        aria-label={`Diminuer ${label}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  );
}
