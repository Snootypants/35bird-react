import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

const scheduleFrame = typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
  ? window.requestAnimationFrame.bind(window)
  : (callback) => setTimeout(() => callback(getNow()), 1000 / 60);

const cancelFrame = typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function'
  ? window.cancelAnimationFrame.bind(window)
  : (id) => clearTimeout(id);

export function useGameTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const runningRef = useRef(false);
  const startTsRef = useRef(getNow());
  const rafRef = useRef(0);

  const tick = useCallback((now) => {
    if (!runningRef.current) return;
    setElapsedMs(now - startTsRef.current);
    rafRef.current = scheduleFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    const now = getNow();
    startTsRef.current = now - elapsedMs;
    rafRef.current = scheduleFrame(tick);
  }, [elapsedMs, tick]);

  const pause = useCallback(() => {
    if (!runningRef.current) return;
    runningRef.current = false;
    if (rafRef.current) cancelFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelFrame(rafRef.current);
    rafRef.current = 0;
    setElapsedMs(0);
    startTsRef.current = getNow();
  }, []);

  const formattedTime = useMemo(() => {
    const total = Math.floor(elapsedMs / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [elapsedMs]);

  useEffect(() => () => { if (rafRef.current) cancelFrame(rafRef.current); }, []);

  return { elapsedMs, formattedTime, start, pause, reset };
}
