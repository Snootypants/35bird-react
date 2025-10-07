import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useGameLoop } from './useGameLoop.js';

function TestHarness({ setUiState }) {
  const currencyRef = useRef(0);
  const livesRef = useRef(3);
  const gameOverRef = useRef(false);
  const xpRef = useRef(0);
  const levelRef = useRef(1);
  const hyperCountdownRef = useRef(0);

  useGameLoop({
    update: () => {},
    render: () => {},
    setUiState,
    currencyRef,
    livesRef,
    gameOverRef,
    xpRef,
    levelRef,
    hyperCountdownRef,
    onFrame: undefined,
  });

  return null;
}

describe('useGameLoop', () => {
  const originalRaf = globalThis.requestAnimationFrame;
  const originalCancel = globalThis.cancelAnimationFrame;

  afterEach(() => {
    vi.unstubAllGlobals();
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancel;
  });

  it('skips state updates when the snapshot does not change', () => {
    const callbacks = [];
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      callbacks.push(cb);
      return callbacks.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const setUiState = vi.fn((updater) => {
      if (typeof updater === 'function') {
        updater({
          currency: 0,
          lives: 3,
          gameOver: false,
          xp: 0,
          level: 1,
          hyperCountdownMs: 0,
        });
      }
    });

    const { unmount } = render(<TestHarness setUiState={setUiState} />);

    expect(callbacks.length).toBeGreaterThan(0);

    // First frame should publish state
    const first = callbacks.shift();
    first(0);
    expect(setUiState).toHaveBeenCalledTimes(1);

    // Second frame uses identical refs, so no additional state writes
    const second = callbacks.shift();
    second(16);
    expect(setUiState).toHaveBeenCalledTimes(1);

    unmount();
  });
});
