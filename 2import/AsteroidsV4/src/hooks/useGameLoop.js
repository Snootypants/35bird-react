import { useEffect, useRef } from 'react';

export function useGameLoop({
  update,
  render,
  setUiState,
  currencyRef,
  livesRef,
  gameOverRef,
  xpRef,
  levelRef,
  hyperCountdownRef,
  onFrame,
}) {
  const requestRef = useRef();
  const lastTimestampRef = useRef(null);
  const uiSnapshotRef = useRef(null);

  useEffect(() => {
    const loop = (timestamp) => {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      update();
      render();

      const nextSnapshot = {
        currency: currencyRef.current,
        lives: livesRef.current,
        gameOver: gameOverRef.current,
        xp: xpRef.current,
        level: levelRef.current,
        hyperCountdownMs: hyperCountdownRef?.current ?? 0,
      };

      const prevSnapshot = uiSnapshotRef.current;
      const didChange =
        !prevSnapshot ||
        prevSnapshot.currency !== nextSnapshot.currency ||
        prevSnapshot.lives !== nextSnapshot.lives ||
        prevSnapshot.gameOver !== nextSnapshot.gameOver ||
        prevSnapshot.xp !== nextSnapshot.xp ||
        prevSnapshot.level !== nextSnapshot.level ||
        prevSnapshot.hyperCountdownMs !== nextSnapshot.hyperCountdownMs;

      if (didChange) {
        uiSnapshotRef.current = nextSnapshot;
        setUiState((prev) => ({
          ...prev,
          ...nextSnapshot,
        }));
      }

      if (typeof onFrame === 'function') {
        onFrame(delta);
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      lastTimestampRef.current = null;
      uiSnapshotRef.current = null;
    };
  }, [update, render, setUiState, currencyRef, livesRef, gameOverRef, xpRef, levelRef, hyperCountdownRef, onFrame]);
}
