import React, { useCallback, useEffect, useRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGameSession } from './useGameSession.js';
import { SURVIVAL_TUNING_DEFAULTS, SURVIVAL_LIVES } from '../utils/constants.js';

describe('useGameSession', () => {
  const noop = () => {};

  function Harness({ onReady }) {
    const stateRef = useRef({ isPaused: true });
    const isPausedRef = useRef(true);
    const sharedRef = useRef(null);
    const gameStartedRef = useRef(false);
    const gameOverRef = useRef(false);
    const livesRef = useRef(3);
    const currencyRef = useRef(0);
    const xpRef = useRef(0);
    const levelRef = useRef(1);
    const stageRef = useRef(1);
    const baseAsteroidCountRef = useRef(0);
    const modeRef = useRef(null);
    const survivalStateRef = useRef({});
    const survivalTuningRef = useRef({ ...SURVIVAL_TUNING_DEFAULTS });
    const portalRef = useRef(null);
    const cameraRef = useRef({
      x: 0,
      y: 0,
      zoom: 1,
      targetZoom: 1,
      screenToWorld: () => ({ x: 0, y: 0 }),
    });

    const setUiState = useCallback((updater) => {
      stateRef.current = typeof updater === 'function'
        ? updater(stateRef.current)
        : updater;
    }, []);

    const session = useGameSession({
      setUiState,
      shipRef: sharedRef,
      isPausedRef,
      bulletsRef: useRef([]),
      setBulletCount: noop,
      canvasRef: { current: null },
      cameraRef,
      mouseScreenRef: useRef({ x: 0, y: 0 }),
      mousePositionRef: useRef({ x: 0, y: 0 }),
      gameStartedRef,
      gameOverRef,
      currencyRef,
      livesRef,
      lastShotTimeRef: useRef(0),
      xpRef,
      levelRef,
      stageRef,
      baseAsteroidCountRef,
      initializeAsteroids: noop,
      generateStarfield: noop,
      clearPickups: noop,
      clearHyperCountdown: noop,
      modeRef,
      survivalStateRef,
      setLastRun: noop,
      formattedTime: '00:00:00',
      portalRef,
      survivalTuningRef,
    });

    useEffect(() => {
      onReady({
        handleResume: session.handleResume,
        isPausedRef,
        getState: () => stateRef.current,
        livesRef,
        startSurvival: () => session.handleSelectMode('survival'),
        modeRef,
      });
    }, [onReady, session.handleResume, session.handleSelectMode, isPausedRef, livesRef, modeRef]);

    return null;
  }

  it('clears the paused ref when resuming the game', () => {
    let api;
    const handleReady = (value) => { api = value; };
    render(<Harness onReady={handleReady} />);

    expect(api).toBeDefined();
    expect(api.isPausedRef.current).toBe(true);
    expect(api.getState().isPaused).toBe(true);

    api.handleResume();

    expect(api.isPausedRef.current).toBe(false);
    expect(api.getState().isPaused).toBe(false);
  });

  it('starts survival with a single life', () => {
    let api;
    const handleReady = (value) => { api = value; };
    render(<Harness onReady={handleReady} />);

    expect(api.livesRef.current).toBe(3);
    expect(api.modeRef.current).toBe(null);

    api.startSurvival();

    expect(api.modeRef.current).toBe('survival');
    expect(api.livesRef.current).toBe(SURVIVAL_LIVES);
    expect(api.getState().lives).toBe(SURVIVAL_LIVES);
  });
});
