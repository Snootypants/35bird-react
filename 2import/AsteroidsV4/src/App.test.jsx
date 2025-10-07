import { render, fireEvent, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';
import { BULLET_FIRE_RATE, MAX_BULLETS } from './utils/constants.js';

describe('bullet firing limits', () => {
  it('caps bullets at MAX_BULLETS when holding fire', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    render(<App />);

    // Click the StartScreen "Waves" button to start
    const wavesButton = screen.getByRole('button', { name: /^waves/i });
    fireEvent.click(wavesButton);

    // Hold Space to fire
    fireEvent.keyDown(window, { code: 'Space' });

    for (let i = 0; i < MAX_BULLETS + 2; i++) {
      act(() => {
        vi.advanceTimersByTime(BULLET_FIRE_RATE);
      });
    }

    const count = Number(screen.getByTestId('bullet-count').textContent);
    expect(count).toBeLessThanOrEqual(MAX_BULLETS);

    fireEvent.keyUp(window, { code: 'Space' });
    vi.useRealTimers();
  });

  it('allows default Tab navigation', () => {
    render(<App />);

    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      bubbles: true,
      cancelable: true,
    });

    window.dispatchEvent(tabEvent);

    expect(tabEvent.defaultPrevented).toBe(false);
  });

  it('prevents default for Shift+Tab when toggling the test console', () => {
    render(<App />);

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });

    window.dispatchEvent(shiftTabEvent);

    expect(shiftTabEvent.defaultPrevented).toBe(true);
  });

  it('keeps telemetry overlays visible when the console is hidden', () => {
    render(<App />);

    const dispatchShiftTab = () => {
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Tab',
          code: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }));
      });
    };

    const openTelemetryPanel = () => {
      fireEvent.click(screen.getByRole('button', { name: 'Survival Tuning' }));
      const telemetryTabs = screen.getAllByRole('button', { name: 'Telemetry' });
      fireEvent.click(telemetryTabs[telemetryTabs.length - 1]);
    };

    // Open console and enable FPS telemetry
    dispatchShiftTab();
    openTelemetryPanel();
    const enableFpsCheckbox = screen.getByLabelText('FPS');
    fireEvent.click(enableFpsCheckbox);

    // Hide console – debug stats should remain
    dispatchShiftTab();
    expect(screen.getByTestId('debug-stats')).toBeTruthy();

    // Re-open console, deselect telemetry, and hide again
    dispatchShiftTab();
    openTelemetryPanel();
    fireEvent.click(screen.getByLabelText('FPS'));
    fireEvent.click(screen.getByRole('button', { name: 'Back to Survival' }));
    dispatchShiftTab();

    expect(screen.queryByTestId('debug-stats')).toBeNull();
  });
});
