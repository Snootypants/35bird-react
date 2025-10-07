import { useMemo } from 'react';

function formatDuration(ms = 0) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '0:00';
  }
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(decimals);
}

function SurvivalTuningOverlay({ visible, tuning, survivalState, elapsedMs }) {
  const snapshot = useMemo(() => {
    if (!tuning) {
      return null;
    }
    const state = survivalState ?? {};
    const spawnIntervalMs = state.spawnIntervalMs ?? tuning.spawnIntervalMs;
    return {
      spawnIntervalMs,
      elapsedMs: elapsedMs ?? state.elapsedThisRound ?? 0,
      currentMultiplier: state.speedMultiplier ?? 1,
      spawnCount: state.spawnCount ?? 0,
      rampDurationMs: tuning.rampDurationMs,
      baseTau: tuning.baseTau,
      stretch: tuning.stretch,
      maxMultiplier: tuning.maxMultiplier,
    };
  }, [elapsedMs, survivalState, tuning]);

  if (!visible || !snapshot) {
    return null;
  }

  return (
    <aside className="survivalTuningOverlay" aria-live="polite">
      <header>
        <h3>Survival Speed</h3>
      </header>
      <div className="survivalTuningOverlay__grid">
        <span>Spawn interval</span>
        <span>{snapshot.spawnIntervalMs} ms</span>
        <span>Ramp duration</span>
        <span>{formatDuration(snapshot.rampDurationMs)}</span>
        <span>Base tau</span>
        <span>{formatNumber(snapshot.baseTau, 2)}</span>
        <span>Stretch</span>
        <span>{formatNumber(snapshot.stretch, 2)}</span>
        <span>Max multiplier</span>
        <span>{formatNumber(snapshot.maxMultiplier, 2)}×</span>
        <span>Current multiplier</span>
        <span>{formatNumber(snapshot.currentMultiplier, 2)}×</span>
        <span>Spawn count</span>
        <span>{snapshot.spawnCount}</span>
        <span>Elapsed</span>
        <span>{formatDuration(snapshot.elapsedMs)}</span>
      </div>
    </aside>
  );
}

export default SurvivalTuningOverlay;
