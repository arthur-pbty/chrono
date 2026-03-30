"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const STORAGE_KEY = "chrono-stopwatch";

interface SavedState {
  elapsed: number;
  isRunning: boolean;
  laps: number[];
  savedAt: number;
}

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const originRef = useRef(0);
  const rafRef = useRef(0);
  const isRunningRef = useRef(false);
  const lapsRef = useRef<number[]>([]);
  const initializedRef = useRef(false);

  const saveNow = useCallback(
    (e: number, running: boolean, l: number[]) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            elapsed: e,
            isRunning: running,
            laps: l,
            savedAt: Date.now(),
          } satisfies SavedState)
        );
      } catch {
        // Storage not available
      }
    },
    []
  );

  const tick = useCallback(() => {
    if (!isRunningRef.current) return;
    setElapsed(Date.now() - originRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: SavedState = JSON.parse(raw);

      let restoredElapsed = saved.elapsed || 0;
      if (saved.isRunning && saved.savedAt) {
        restoredElapsed += Date.now() - saved.savedAt;
      }

      setElapsed(restoredElapsed);
      setLaps(saved.laps || []);
      lapsRef.current = saved.laps || [];

      if (saved.isRunning) {
        originRef.current = Date.now() - restoredElapsed;
        isRunningRef.current = true;
        setIsRunning(true);
        rafRef.current = requestAnimationFrame(tick);
      }
    } catch {
      // Parse error
    }
  }, [tick]);

  // Background tab handling
  useEffect(() => {
    const handleVisibility = () => {
      if (!isRunningRef.current) return;
      if (!document.hidden) {
        setElapsed(Date.now() - originRef.current);
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  // Periodic save when running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      saveNow(Date.now() - originRef.current, true, lapsRef.current);
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, saveNow]);

  const start = useCallback(() => {
    const currentElapsed =
      isRunningRef.current ? Date.now() - originRef.current : elapsed;
    originRef.current = Date.now() - currentElapsed;
    isRunningRef.current = true;
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
    saveNow(currentElapsed, true, lapsRef.current);
  }, [elapsed, tick, saveNow]);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    const currentElapsed = Date.now() - originRef.current;
    setElapsed(currentElapsed);
    saveNow(currentElapsed, false, lapsRef.current);
  }, [saveNow]);

  const reset = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    setElapsed(0);
    setLaps([]);
    lapsRef.current = [];
    originRef.current = 0;
    saveNow(0, false, []);
  }, [saveNow]);

  const lap = useCallback(() => {
    if (!isRunningRef.current) return;
    const currentElapsed = Date.now() - originRef.current;
    const newLaps = [...lapsRef.current, currentElapsed];
    lapsRef.current = newLaps;
    setLaps(newLaps);
    saveNow(currentElapsed, true, newLaps);
  }, [saveNow]);

  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      pause();
    } else {
      start();
    }
  }, [start, pause]);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { elapsed, isRunning, laps, start, pause, reset, lap, toggle };
}
