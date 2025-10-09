import { useRef, useEffect, useState, useCallback } from 'react';
import { Ship } from './components/Ship.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CROSSHAIR_SIZE, INITIAL_LIVES, WORLD_WIDTH, WORLD_HEIGHT, PLAYFIELD_FRAME_BORDER_OFFSET, SURVIVAL_TUNING_DEFAULTS } from './utils/constants.js';
import { LevelUpEffect } from './effects/LevelUpEffect.js';
import { StageClearEffect } from './effects/StageClearEffect.js';
import { HyperSpaceJumpEffect } from './effects/HyperSpaceJumpEffect.js';
import { DeathExplosion } from './effects/DeathExplosion.js';
import { Camera } from './utils/camera.js';
import { useGameWorld } from './hooks/useGameWorld.js';
import { useGameSession } from './hooks/useGameSession.js';
import { useGameControls } from './hooks/useGameControls.js';
import { useGameLogic } from './hooks/useGameLogic.js';
import { useResponsiveLayout } from './hooks/useResponsiveLayout.js';
import { useGameLoop } from './hooks/useGameLoop.js';
import { useGameTimer } from './hooks/useGameTimer.js';
import { renderScene } from './render/gameRenderer.js';
import { formatCountdown } from './utils/time.js';
import GameHud from './components/ui/GameHud.jsx';
import GameOverlayLayer from './components/ui/GameOverlayLayer.jsx';
import TestConsole from './components/ui/TestConsole.jsx';
import SurvivalTuningOverlay from './components/ui/SurvivalTuningOverlay.jsx';
import DebugStatsDisplay from './components/ui/DebugStatsDisplay.jsx';
import { useTestConsole } from './hooks/useTestConsole.js';
import { useHyperCountdownDisplay } from './hooks/useHyperCountdownDisplay.js';
import './App.css';
import './styles/theme.css';
import './styles/ui.css';

function App() {
  const canvasRef = useRef(null);
  const playAreaRef = useRef(null);
  const canvasWidthRef = useRef(CANVAS_WIDTH);
  const canvasHeightRef = useRef(CANVAS_HEIGHT);
  const minimapCanvasRef = useRef(null);
  const shipRef = useRef(new Ship(WORLD_WIDTH / 2, WORLD_HEIGHT / 2));
  const cameraRef = useRef(new Camera());
  const bulletsRef = useRef([]);
  const keysRef = useRef({});
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const mouseScreenRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const isMouseDownRef = useRef(false);
  const isPausedRef = useRef(false);
  const testingModeRef = useRef(false);
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);
  const livesRef = useRef(INITIAL_LIVES);
  const lastShotTimeRef = useRef(0);
  const levelUpEffectRef = useRef(new LevelUpEffect());
  const stageClearEffectRef = useRef(new StageClearEffect());
  const hyperSpaceJumpEffectRef = useRef(new HyperSpaceJumpEffect());
  const deathExplosionRef = useRef(new DeathExplosion());
  const portalRef = useRef(null);
  const modeRef = useRef(null);
  const survivalStateRef = useRef({ lastSpawnMs: 0, speedMultiplier: 1, spawnIntervalMs: SURVIVAL_TUNING_DEFAULTS.spawnIntervalMs });
  const survivalTuningRef = useRef({ ...SURVIVAL_TUNING_DEFAULTS });
  const [survivalTuning, setSurvivalTuning] = useState(() => ({ ...SURVIVAL_TUNING_DEFAULTS }));
  const [survivalOverlayVisible, setSurvivalOverlayVisible] = useState(false);
  const [testConsoleTab, setTestConsoleTab] = useState('effects');
  const warmupRef = useRef({ active: false, endTime: 0 });
  const applySurvivalTuning = useCallback((update) => {
    setSurvivalTuning((prev) => {
      const next = typeof update === 'function' ? update({ ...prev }) : { ...prev, ...update };
      survivalTuningRef.current = next;
      if (survivalStateRef.current) {
        if (typeof next.spawnIntervalMs === 'number' && !Number.isNaN(next.spawnIntervalMs)) {
          survivalStateRef.current.spawnIntervalMs = next.spawnIntervalMs;
          const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
          survivalStateRef.current.lastSpawnMs = now;
        }
      }
      return next;
    });
  }, []);
  const [uiState, setUiState] = useState({
    currency: 0,
    lives: INITIAL_LIVES,
    xp: 0,
    level: 1,
    gameOver: false,
    gameStarted: false,
    isPaused: false,
    testingMode: false,
    mode: null,
    hyperCountdownMs: 0,
    round: 1,
    survivalHold: false,
  });
  const [bulletCount, setBulletCount] = useState(0);
  const [lastRun, setLastRun] = useState({ level: 1, wave: 1, time: '00:00:00', currency: 0 });
  const prevGameOverRef = useRef(false);
  const {
    initializeAsteroids,
    generateStarfield,
    currencyRef,
    xpRef,
    levelRef,
    stageRef,
    baseAsteroidCountRef,
    clearPickups,
    clearAsteroids,
    clearHyperCountdown,
    startNewStage,
    xpNeededForNextLevel,
    asteroidCountsRef,
    hyperCountdownRef,
    asteroidsRef,
    pickupsRef,
    starsRef,
    spawnPickups,
    updatePickups,
    updateAsteroidCounts,
    triggerLevelUp,
  } = useGameWorld({ shipRef, bulletsRef, setBulletCount, levelUpEffectRef, stageClearEffectRef, hyperSpaceJumpEffectRef, modeRef, setUiState });
  const { start, pause, reset, formattedTime, elapsedMs } = useGameTimer();

  const session = useGameSession({
    setUiState,
    shipRef,
    isPausedRef,
    bulletsRef,
    setBulletCount,
    canvasRef,
    cameraRef,
    mouseScreenRef,
    mousePositionRef,
    gameStartedRef,
    gameOverRef,
    currencyRef,
    livesRef,
    lastShotTimeRef,
    xpRef,
    levelRef,
    stageRef,
    baseAsteroidCountRef,
    initializeAsteroids,
    generateStarfield,
    clearPickups,
    clearAsteroids,
    clearHyperCountdown,
    modeRef,
    survivalStateRef,
    setLastRun,
    formattedTime,
    portalRef,
    survivalTuningRef,
    warmupRef,
  });

  const {
    statOptions,
    statSelections,
    toggleStat: handleToggleDebugStat,
    effectActions,
    frameRate: debugFrameRate,
    onFrame: handleFrameSample,
    survivalControls,
  } = useTestConsole({
    shipRef,
    deathExplosionRef,
    hyperSpaceJumpEffectRef,
    stageClearEffectRef,
    triggerLevelUp,
    levelRef,
    stageRef,
    baseAsteroidCountRef,
    starsRef,
    startNewStage,
    survivalTuning,
    setSurvivalTuning: applySurvivalTuning,
    survivalOverlayVisible,
    setSurvivalOverlayVisible,
    survivalStateRef,
    restartGame: session.startGame,
  });

  useEffect(() => {
    if (!uiState.testingMode) {
      setTestConsoleTab('effects');
    }
  }, [uiState.testingMode]);

  const handleSelectConsoleTab = useCallback((tab) => {
    if ((tab === 'survival' || tab === 'telemetry') && !survivalControls) {
      return;
    }
    setTestConsoleTab(tab);
  }, [survivalControls]);

  const hasActiveDebugStats = Object.values(statSelections).some(Boolean);

  useGameControls({
    canvasRef,
    keysRef,
    mousePositionRef,
    mouseScreenRef,
    isMouseDownRef,
    isPausedRef,
    testingModeRef,
    shootBullet: session.shootBullet,
    hyperSpaceJumpEffectRef,
    deathExplosionRef,
    startGame: session.startGame,
    setUiState,
    cameraRef,
    gameStartedRef,
    gameOverRef,
    testingEffectActions: effectActions,
  });

  const { update } = useGameLogic({
    gameOverRef,
    gameStartedRef,
    isPausedRef,
    cameraRef,
    canvasWidthRef,
    canvasHeightRef,
    keysRef,
    shipRef,
    mouseScreenRef,
    mousePositionRef,
    asteroidsRef,
    bulletsRef,
    setBulletCount,
    isMouseDownRef,
    lastShotTimeRef,
    livesRef,
    spawnPickups,
    updatePickups,
    levelUpEffectRef,
    stageClearEffectRef,
    hyperSpaceJumpEffectRef,
    deathExplosionRef,
    starsRef,
    updateAsteroidCounts,
    modeRef,
    survivalStateRef,
    survivalTuningRef,
    survivalElapsedMs: elapsedMs,
    portalRef,
    setUiState,
    warmupRef,
  });

  const { metaLayout } = useResponsiveLayout({ canvasRef, playAreaRef, canvasWidthRef, canvasHeightRef });

  useEffect(() => {
    initializeAsteroids();
    generateStarfield();
  }, [initializeAsteroids, generateStarfield]);

  useEffect(() => {
    modeRef.current = uiState.mode;
  }, [uiState.mode]);

  useEffect(() => {
    const active =
      uiState.mode === 'survival' &&
      uiState.gameStarted &&
      !uiState.isPaused &&
      !uiState.gameOver &&
      !uiState.survivalHold;
    active ? start() : pause();
  }, [uiState.mode, uiState.gameStarted, uiState.isPaused, uiState.gameOver, uiState.survivalHold, start, pause]);

  useEffect(() => {
    if (!uiState.gameStarted || uiState.mode !== 'survival') reset();
  }, [uiState.gameStarted, uiState.mode, reset]);
  const render = useCallback(() => {
    renderScene({
      canvasRef,
      canvasWidthRef,
      canvasHeightRef,
      minimapCanvasRef,
      cameraRef,
      starsRef,
      shipRef,
      asteroidsRef,
      pickupsRef,
      bulletsRef,
      mousePositionRef,
      gameStartedRef,
      levelUpEffectRef,
      stageClearEffectRef,
      hyperSpaceJumpEffectRef,
      deathExplosionRef,
      portalRef,
      CROSSHAIR_SIZE,
    });
  }, [
    canvasRef,
    canvasWidthRef,
    canvasHeightRef,
    minimapCanvasRef,
    cameraRef,
    starsRef,
    shipRef,
    asteroidsRef,
    pickupsRef,
    bulletsRef,
    mousePositionRef,
    gameStartedRef,
    levelUpEffectRef,
    stageClearEffectRef,
    hyperSpaceJumpEffectRef,
    deathExplosionRef,
  ]);
  useGameLoop({
    update,
    render,
    setUiState,
    currencyRef,
    livesRef,
    gameOverRef,
    xpRef,
    levelRef,
    hyperCountdownRef,
    onFrame: handleFrameSample,
  });

  useEffect(() => {
    if (!prevGameOverRef.current && uiState.gameOver) {
      const wave = uiState.mode === 'waves' ? stageRef.current : 1;
      setLastRun({
        level: uiState.level,
        wave,
        time: formattedTime,
        currency: uiState.currency,
      });
    }
    prevGameOverRef.current = uiState.gameOver;
  }, [uiState.gameOver, uiState.mode, uiState.level, uiState.currency, formattedTime, stageRef, setLastRun]);

  const debugStatsVisible = uiState.testingMode || hasActiveDebugStats;

  const { countdownActive, countdownColor, outerSpaceStyle } = useHyperCountdownDisplay({
    mode: uiState.mode,
    hyperCountdownMs: uiState.hyperCountdownMs,
  });
  const xpNeededForCurrentLevel = xpNeededForNextLevel(uiState.level);

  return (
    <div className="outerSpace" style={outerSpaceStyle}>
      <div
        ref={playAreaRef}
        className="playfieldFrame"
        style={{
          width: canvasWidthRef.current + PLAYFIELD_FRAME_BORDER_OFFSET,
          height: canvasHeightRef.current + PLAYFIELD_FRAME_BORDER_OFFSET,
          left: `${metaLayout.playX}px`,
          top: `${metaLayout.playY}px`,
          position: 'absolute'
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidthRef.current}
          height={canvasHeightRef.current}
          className="game-canvas"
          role="img"
          aria-label="Asteroids play area"
        />
      </div>

      <GameHud
        xp={uiState.xp}
        xpMax={xpNeededForCurrentLevel}
        level={uiState.level}
        lives={uiState.lives}
        wave={uiState.mode === 'waves' ? stageRef.current : 1}
        time={formattedTime}
        currency={uiState.currency}
        minimapRef={minimapCanvasRef}
        mode={uiState.mode}
        round={uiState.round}
      />

      {countdownActive && (
        <div className="hyperCountdownBanner" style={{ color: countdownColor }}>
          <span className="label">Hyper jump in</span>
          <span className="timer mono">{formatCountdown(uiState.hyperCountdownMs)}</span>
        </div>
      )}

      <GameOverlayLayer
        uiState={uiState}
        session={session}
        asteroidCounts={asteroidCountsRef.current}
        lastRun={lastRun}
      />

      <TestConsole
        open={uiState.testingMode}
        effectActions={effectActions}
        statOptions={statOptions}
        statSelections={statSelections}
        onToggleStat={handleToggleDebugStat}
        survivalControls={survivalControls}
        activeTab={testConsoleTab}
        onSelectTab={handleSelectConsoleTab}
      />

      <DebugStatsDisplay
        visible={debugStatsVisible}
        selections={statSelections}
        frameRate={debugFrameRate}
        asteroidCounts={asteroidCountsRef.current}
        uiState={uiState}
        bulletCount={bulletCount}
        xpRequired={xpNeededForCurrentLevel}
        stageNumber={stageRef.current}
      />

      <SurvivalTuningOverlay
        visible={survivalOverlayVisible}
        tuning={survivalTuning}
        survivalState={survivalStateRef.current}
        elapsedMs={elapsedMs}
      />


      <div data-testid="bullet-count" style={{ display: 'none' }}>{bulletCount}</div>
    </div>
  );
}

export default App;
