"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { playAlarm, sendNotification, requestNotificationPermission } from "../lib/utils";

const STORAGE_KEY = "chrono-timers";

export interface TimerItem {
  id: string;
  label: string;
  duration: number;
  remaining: number;
  isRunning: boolean;
  endTime: number;
  finished: boolean;
}

interface SavedTimers {
  timers: TimerItem[];
  savedAt: number;
}

export function useTimers() {
  const [timers, setTimers] = useState<TimerItem[]>([]);
  const rafRef = useRef(0);
  const notifiedRef = useRef(new Set<string>());
  const timersRef = useRef<TimerItem[]>([]);
  const initializedRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    timersRef.current = timers;
  }, [timers]);

  const saveTimers = useCallback((t: TimerItem[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timers: t, savedAt: Date.now() } satisfies SavedTimers)
      );
    } catch {
      // Storage unavailable
    }
  }, []);

  // Animation loop
  const tick = useCallback(() => {
    const now = Date.now();
    setTimers((prev) => {
      let changed = false;
      const updated = prev.map((t) => {
        if (!t.isRunning || t.finished) return t;
        const remaining = t.endTime - now;
        if (remaining <= 0) {
          changed = true;
          return { ...t, remaining: 0, isRunning: false, finished: true };
        }
        changed = true;
        return { ...t, remaining };
      });
      return changed ? updated : prev;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Detect finished timers - trigger alarm and notification
  useEffect(() => {
    timers.forEach((t) => {
      if (t.finished && !notifiedRef.current.has(t.id)) {
        notifiedRef.current.add(t.id);
        playAlarm();
        sendNotification(t.label || "Minuteur");
      }
    });
  }, [timers]);

  // Start/stop animation loop
  useEffect(() => {
    const hasRunning = timers.some((t) => t.isRunning && !t.finished);
    if (hasRunning) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [timers.some((t) => t.isRunning), tick]); // eslint-disable-line react-hooks/exhaustive-deps

  // Background tab handling
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        const hasRunning = timersRef.current.some(
          (t) => t.isRunning && !t.finished
        );
        if (hasRunning) {
          // Force update
          const now = Date.now();
          setTimers((prev) =>
            prev.map((t) => {
              if (!t.isRunning || t.finished) return t;
              const remaining = t.endTime - now;
              if (remaining <= 0) {
                return { ...t, remaining: 0, isRunning: false, finished: true };
              }
              return { ...t, remaining };
            })
          );
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  // Load from localStorage
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    requestNotificationPermission();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: SavedTimers = JSON.parse(raw);
      const elapsed = Date.now() - (saved.savedAt || Date.now());

      const restored = saved.timers.map((t) => {
        if (t.isRunning && !t.finished) {
          const newRemaining = t.remaining - elapsed;
          if (newRemaining <= 0) {
            return { ...t, remaining: 0, isRunning: false, finished: true };
          }
          return {
            ...t,
            remaining: newRemaining,
            endTime: Date.now() + newRemaining,
          };
        }
        return t;
      });

      setTimers(restored);
    } catch {
      // Parse error
    }
  }, []);

  // Periodic save
  useEffect(() => {
    const interval = setInterval(() => {
      saveTimers(timersRef.current);
    }, 2000);
    return () => clearInterval(interval);
  }, [saveTimers]);

  const addTimer = useCallback(
    (duration: number, label: string = "") => {
      const timer: TimerItem = {
        id: crypto.randomUUID(),
        label,
        duration,
        remaining: duration,
        isRunning: false,
        endTime: 0,
        finished: false,
      };
      setTimers((prev) => {
        const next = [...prev, timer];
        saveTimers(next);
        return next;
      });
      return timer.id;
    },
    [saveTimers]
  );

  const startTimer = useCallback(
    (id: string) => {
      setTimers((prev) => {
        const next = prev.map((t) => {
          if (t.id !== id || t.finished) return t;
          return {
            ...t,
            isRunning: true,
            endTime: Date.now() + t.remaining,
          };
        });
        saveTimers(next);
        return next;
      });
    },
    [saveTimers]
  );

  const pauseTimer = useCallback(
    (id: string) => {
      setTimers((prev) => {
        const next = prev.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            isRunning: false,
            remaining: Math.max(0, t.endTime - Date.now()),
          };
        });
        saveTimers(next);
        return next;
      });
    },
    [saveTimers]
  );

  const resetTimer = useCallback(
    (id: string) => {
      notifiedRef.current.delete(id);
      setTimers((prev) => {
        const next = prev.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            remaining: t.duration,
            isRunning: false,
            endTime: 0,
            finished: false,
          };
        });
        saveTimers(next);
        return next;
      });
    },
    [saveTimers]
  );

  const deleteTimer = useCallback(
    (id: string) => {
      notifiedRef.current.delete(id);
      setTimers((prev) => {
        const next = prev.filter((t) => t.id !== id);
        saveTimers(next);
        return next;
      });
    },
    [saveTimers]
  );

  const toggleTimer = useCallback(
    (id: string) => {
      const timer = timersRef.current.find((t) => t.id === id);
      if (!timer || timer.finished) return;
      if (timer.isRunning) {
        pauseTimer(id);
      } else {
        startTimer(id);
      }
    },
    [startTimer, pauseTimer]
  );

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return {
    timers,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    deleteTimer,
    toggleTimer,
  };
}
