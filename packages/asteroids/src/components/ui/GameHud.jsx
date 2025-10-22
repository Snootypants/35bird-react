import React from 'react';
import XpBar from './XpBar.jsx';

export default function GameHud({ xp, xpMax, level, lives, wave, time, currency, minimapRef, mode, round = 1 }) {
  const showWave = mode === 'waves';
  const showTime = mode === 'survival';
  const roundLabel = `Round ${round}`;

  return (
    <div className="hudRoot">
      <XpBar xp={xp} xpMax={xpMax} />

      <div className="hudPanels">
        <div className="hudPanel">
          <div className="hudColumn">
            <div className="hudLabel">Level</div>
            <div className="hudValue">{level}</div>
          </div>
          <div className="hudColumn">
            <div className="hudLabel">Lives</div>
            <div className="hudValue">{lives}</div>
          </div>
          <div className="hudColumn">
            <div className="hudLabel">Currency</div>
            <div className="hudValue">{currency}</div>
          </div>
        </div>

        <div className="hudPanel hudMinimap">
          <canvas ref={minimapRef} width={140} height={80} />
        </div>

        <div className="hudPanel">
          {showWave && (
            <div className="hudColumn">
              <div className="hudLabel">Wave</div>
              <div className="hudValue">{wave}</div>
            </div>
          )}
          {showTime && (
            <div className="hudColumn">
              <div className="hudLabel">{roundLabel}</div>
              <div className="hudValue mono">{time}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
