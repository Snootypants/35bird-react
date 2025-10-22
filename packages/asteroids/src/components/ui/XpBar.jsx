import React from 'react';

export default function XpBar({ xp, xpMax }) {
  const current = Number.isFinite(xp) ? xp : Number(xp ?? 0) || 0;
  const target = Number.isFinite(xpMax) && xpMax > 0 ? xpMax : 0;
  const progress = target > 0 ? Math.max(0, Math.min(1, current / target)) : 0;

  const displayedCurrent = Math.max(0, Math.round(current));
  const displayedTarget = target > 0 ? Math.round(target) : '—';

  return (
    <div className="xpBar">
      <div
        className="xpFill"
        style={{ '--xp-progress': `${progress}` }}
        data-progress={progress.toFixed(3)}
      />
      <div className="xpText">{`${displayedCurrent} / ${displayedTarget} XP`}</div>
    </div>
  );
}
