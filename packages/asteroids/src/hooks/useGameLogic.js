import { useCallback, useRef } from 'react';
import { Bullet } from '../components/Bullet.js';
import { Asteroid } from '../components/Asteroid.js';
import { Portal } from '../components/Portal.js';
import { checkCollision, wrapPosition } from '../utils/collision.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, BULLET_FIRE_RATE, MAX_BULLETS,
         SHIP_DECELERATION, SHIP_FRICTION,
         WORLD_WIDTH, WORLD_HEIGHT, DEATH_PAUSE_MS,
         ASTEROID_SPEED, ASTEROID_SIZE_LARGE,
         SURVIVAL_SPEED_MAX_MULTIPLIER, SURVIVAL_SPEED_CURVE_BASE_TAU,
         SURVIVAL_SPEED_CURVE_STRETCH, SURVIVAL_SPEED_RAMP_DURATION_MS,
         SURVIVAL_PORTAL_OPEN_MS, SURVIVAL_PORTAL_INNER_MARGIN_RATIO,
         SURVIVAL_TUNING_DEFAULTS } from '../utils/constants.js';

export function useGameLogic({
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
  portalRef,
  survivalElapsedMs = 0,
  setUiState,
  warmupRef,
}, options = {}) {
  const { onLifeLost } = options;
  const deathPauseUntilRef = useRef(0);

  const computeSurvivalMultiplier = (spawnCount = 0, elapsedMs = 0, intervalMs = 2000) => {
    const tuning = survivalTuningRef?.current ?? SURVIVAL_TUNING_DEFAULTS;
    const baseTau = tuning.baseTau ?? SURVIVAL_SPEED_CURVE_BASE_TAU;
    const stretch = tuning.stretch ?? SURVIVAL_SPEED_CURVE_STRETCH;
    const stretchTau = baseTau * Math.max(stretch, Number.EPSILON);
    const rampDurationMs = tuning.rampDurationMs ?? SURVIVAL_SPEED_RAMP_DURATION_MS;
    const rampSpawnCap = Math.max(1, Math.floor(rampDurationMs / intervalMs));
    const maxMultiplier = Math.max(1, tuning.maxMultiplier ?? SURVIVAL_SPEED_MAX_MULTIPLIER);
    const clampedSpawns = Math.min(Math.max(spawnCount, 0), rampSpawnCap);
    const progress = 1 - Math.exp(-clampedSpawns / stretchTau);
    if (elapsedMs >= rampDurationMs) {
      return maxMultiplier;
    } else if (portalRef?.current) {
      portalRef.current = null;
    }
    return 1 + (maxMultiplier - 1) * progress;
  };

  const spawnSurvivalAsteroid = useCallback((speedMultiplier = 1) => {
    const margin = 200;
    const edge = Math.floor(Math.random() * 4);
    let x;
    let y;
    switch (edge) {
      case 0:
        x = Math.random() * WORLD_WIDTH;
        y = -margin;
        break;
      case 1:
        x = Math.random() * WORLD_WIDTH;
        y = WORLD_HEIGHT + margin;
        break;
      case 2:
        x = -margin;
        y = Math.random() * WORLD_HEIGHT;
        break;
      default:
        x = WORLD_WIDTH + margin;
        y = Math.random() * WORLD_HEIGHT;
        break;
    }

    const asteroid = new Asteroid(x, y, ASTEROID_SIZE_LARGE);
    const target = shipRef.current ? { x: shipRef.current.x, y: shipRef.current.y } : { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 };
    const dx = target.x - x;
    const dy = target.y - y;
    const distance = Math.hypot(dx, dy) || 1;
    const speed = ASTEROID_SPEED * speedMultiplier;
    asteroid.vx = (dx / distance) * speed;
    asteroid.vy = (dy / distance) * speed;
    asteroidsRef.current.push(asteroid);
    updateAsteroidCounts();
  }, [asteroidsRef, shipRef, updateAsteroidCounts]);

  const update = useCallback(() => {
    // Allow death explosion to continue updating even during game over
    if (gameOverRef.current) {
      deathExplosionRef.current.update();
      return;
    }
    if (!gameStartedRef.current || isPausedRef.current) return;

    // Capture time once per tick
    const nowMs = performance.now();
    let survivalState = null;
    const warmupState = warmupRef?.current;
    let warmupActive = false;
    if (warmupState?.active && shipRef.current) {
      if (nowMs >= warmupState.endTime) {
        warmupRef.current = { active: false, endTime: 0 };
        if (typeof shipRef.current.clearWarmup === 'function') {
          shipRef.current.clearWarmup();
        }
      } else {
        warmupActive = true;
      }
    }

    // During death pause, only update death explosion effect
    if (nowMs < deathPauseUntilRef.current) {
      // Keep updating death explosion during pause
      deathExplosionRef.current.update();
      return; // skip physics, input, and collisions this tick
    }

    if (modeRef?.current === 'survival') {
      const state = survivalStateRef.current ?? {};
      survivalState = state;
      const interval = state.spawnIntervalMs ?? 2000;

      if (state.round == null) {
        state.round = 1;
      }

      if (state.roundStartElapsedMs == null) {
        state.roundStartElapsedMs = survivalElapsedMs ?? 0;
      }

      if (!state.lastSpawnMs) {
        state.lastSpawnMs = nowMs;
      }

      if (state.spawnCount == null) {
        state.spawnCount = 0;
      }

      const elapsedThisRound = Math.max(0, (survivalElapsedMs ?? 0) - (state.roundStartElapsedMs ?? 0));
      state.elapsedThisRound = elapsedThisRound;
      if (warmupActive) {
        state.roundStartElapsedMs = survivalElapsedMs ?? 0;
        state.elapsedThisRound = 0;
      }

      if (!state.portalActive && !state.portalTriggered && !state.waitingForRoundStart && elapsedThisRound >= SURVIVAL_PORTAL_OPEN_MS) {
        const marginX = WORLD_WIDTH * SURVIVAL_PORTAL_INNER_MARGIN_RATIO;
        const marginY = WORLD_HEIGHT * SURVIVAL_PORTAL_INNER_MARGIN_RATIO;
        const spanX = Math.max(WORLD_WIDTH - marginX * 2, WORLD_WIDTH * 0.1);
        const spanY = Math.max(WORLD_HEIGHT - marginY * 2, WORLD_HEIGHT * 0.1);
        const portalX = marginX + Math.random() * spanX;
        const portalY = marginY + Math.random() * spanY;
        portalRef.current = new Portal(portalX, portalY);
        state.portalActive = true;
        state.portalTriggered = false;
        state.portalOpenedElapsedMs = survivalElapsedMs ?? 0;
        state.portalSequenceStarted = false;
      }

      if (!warmupActive && !state.waitingForRoundStart && nowMs - state.lastSpawnMs >= interval) {
        state.lastSpawnMs = nowMs;
        state.spawnCount += 1;
        const multiplier = computeSurvivalMultiplier(state.spawnCount, elapsedThisRound, interval);
        spawnSurvivalAsteroid(multiplier);
        state.speedMultiplier = multiplier;
      } else {
        state.speedMultiplier = computeSurvivalMultiplier(state.spawnCount, elapsedThisRound, interval);
      }

      survivalStateRef.current = state;
    }

    // Update camera zoom
    const camera = cameraRef.current;
    camera.updateZoom();

    // Update ship - aims at crosshair, moves with W/S
    const keys = keysRef.current;
    const ship = shipRef.current;

    // Reproject last known screen mouse into world space even if mouse is idle.
    // This prevents the crosshair from becoming stale when the camera moves.
    const canvasWidth = canvasWidthRef.current || CANVAS_WIDTH;
    const canvasHeight = canvasHeightRef.current || CANVAS_HEIGHT;
    const reproj = camera.screenToWorld(
      mouseScreenRef.current.x,
      mouseScreenRef.current.y,
      canvasWidth,
      canvasHeight
    );
    mousePositionRef.current.x = reproj.x;
    mousePositionRef.current.y = reproj.y;
    const mousePos = mousePositionRef.current;

    // Calculate angle to mouse crosshair (unless hyperspace jump is active)
    if (!warmupActive && (!hyperSpaceJumpEffectRef.current.active || hyperSpaceJumpEffectRef.current.phase === 'waiting')) {
      const dx = mousePos.x - ship.x;
      const dy = mousePos.y - ship.y;
      ship.angle = Math.atan2(dy, dx);
    }

    // W/S movement controls (disabled during hyperspace jump except waiting phase)
    if (!warmupActive && keys.KeyW && (!hyperSpaceJumpEffectRef.current.active || hyperSpaceJumpEffectRef.current.phase === 'waiting')) {
      ship.vx += Math.cos(ship.angle) * ship.speed;
      ship.vy += Math.sin(ship.angle) * ship.speed;
    }

    // Apply velocity and friction
    if (!warmupActive) {
      ship.x += ship.vx;
      ship.y += ship.vy;
    }

    // S key brakes (slows down to zero, no reverse) - disabled during hyperspace jump except waiting phase
    if (!warmupActive && (!hyperSpaceJumpEffectRef.current.active || hyperSpaceJumpEffectRef.current.phase === 'waiting')) {
      if (keys.KeyS) {
        ship.vx *= SHIP_DECELERATION;
        ship.vy *= SHIP_DECELERATION;
      } else {
        ship.vx *= SHIP_FRICTION;
        ship.vy *= SHIP_FRICTION;
      }
    } else if (warmupActive) {
      ship.vx = 0;
      ship.vy = 0;
    }
    wrapPosition(ship); // World wrapping

    if (modeRef?.current === 'survival' && survivalState && portalRef?.current) {
      const portal = portalRef.current;
      if (portal?.active && !survivalState.portalTriggered) {
        const dx = ship.x - portal.x;
        const dy = ship.y - portal.y;
        const radius = portal.getRadius();
        if ((dx * dx) + (dy * dy) <= radius * radius) {
          survivalState.portalTriggered = true;
          survivalState.portalActive = false;
          survivalState.waitingForRoundStart = true;
          survivalState.portalTriggeredElapsedMs = survivalElapsedMs ?? 0;
          portal.active = false;
          portalRef.current = null;
        }
      }
    }

    if (modeRef?.current === 'survival' && survivalState?.portalTriggered) {
      if (!survivalState.portalSequenceStarted) {
        survivalState.portalSequenceStarted = true;
        if (typeof setUiState === 'function') {
          setUiState(prev => ({ ...prev, survivalHold: true }));
        }

        const shipAngle = ship?.angle ?? 0;
        const currentRound = survivalState.round ?? 1;
        const nextRound = currentRound + 1;

        const handleRoundRestart = () => {
          survivalState.spawnCount = 0;
          survivalState.speedMultiplier = 1;
          survivalState.lastSpawnMs = performance.now();
          survivalState.round = nextRound;
          survivalState.roundStartElapsedMs = survivalElapsedMs ?? 0;
          survivalState.elapsedThisRound = 0;
          survivalState.waitingForRoundStart = false;
          survivalState.portalActive = false;
          survivalState.portalTriggered = false;
          survivalState.portalSequenceStarted = false;
          survivalState.portalOpenedElapsedMs = null;
          survivalState.portalTriggeredElapsedMs = null;
          portalRef.current = null;

          if (typeof setUiState === 'function') {
            setUiState(prev => ({ ...prev, survivalHold: false, round: nextRound }));
          }

          survivalStateRef.current = survivalState;
        };

        if (hyperSpaceJumpEffectRef.current) {
          hyperSpaceJumpEffectRef.current.trigger(
            shipAngle,
            currentRound,
            0,
            handleRoundRestart,
            {
              title: `ROUND ${nextRound}`,
              subtitle: 'wow .. that got crazy.. let\'s try again..',
              prompt: 'click to jump back in',
            }
          );
          hyperSpaceJumpEffectRef.current.initStarVelocities(starsRef.current);
        }
      }
    }

    // Update camera to follow ship
    camera.followShip(ship.x, ship.y, canvasWidth, canvasHeight);

    if (warmupActive) {
      updateAsteroidCounts();
      return;
    }

    // Update asteroids
    asteroidsRef.current.forEach((asteroid) => {
      asteroid.update();
      wrapPosition(asteroid); // World wrapping
    });

    // Update bullets
    bulletsRef.current.forEach((bullet) => {
      bullet.update();
      wrapPosition(bullet); // World wrapping
    });
    bulletsRef.current = bulletsRef.current.filter((bullet) => !bullet.isExpired());
    setBulletCount(bulletsRef.current.length);

    // Unified, smooth firing cadence for Space or LMB hold
    const currentTime = Date.now();
    const isFiring = keys.Space || isMouseDownRef.current;
    if (
      isFiring &&
      currentTime - lastShotTimeRef.current >= BULLET_FIRE_RATE &&
      bulletsRef.current.length < MAX_BULLETS
    ) {
      bulletsRef.current.push(new Bullet(ship.x, ship.y, ship.angle));
      lastShotTimeRef.current = currentTime;
      setBulletCount(bulletsRef.current.length);
    }

    // Collisions
    let asteroidsToRemove = [];
    let bulletsToRemove = [];
    let newAsteroids = [];

    bulletsRef.current.forEach((bullet, bi) => {
      asteroidsRef.current.forEach((asteroid, ai) => {
        if (checkCollision(bullet, asteroid)) {
          if (!bulletsToRemove.includes(bi)) bulletsToRemove.push(bi);
          if (!asteroidsToRemove.includes(ai)) asteroidsToRemove.push(ai);
          newAsteroids.push(...asteroid.split());
          spawnPickups(asteroid.x, asteroid.y);
        }
      });
    });

    // Remove collided items (iterate backwards to avoid index issues)
    bulletsToRemove.sort((a, b) => b - a).forEach(index => {
      bulletsRef.current.splice(index, 1);
    });
    asteroidsToRemove.sort((a, b) => b - a).forEach(index => {
      asteroidsRef.current.splice(index, 1);
    });

    // Add new asteroids from splits
    asteroidsRef.current.push(...newAsteroids);

    // Ship collision handling with invulnerability and death pause
    let shipCollisionIndex = -1;

    if (!shipRef.current.isInvulnerable(nowMs)) {
      for (let ai = 0; ai < asteroidsRef.current.length; ai += 1) {
        const asteroid = asteroidsRef.current[ai];
        if (checkCollision(shipRef.current, asteroid)) {
          // Trigger death explosion effect
          const isGameOver = livesRef.current <= 1; // Check if this death causes game over
          deathExplosionRef.current.trigger(
            shipRef.current.x,
            shipRef.current.y,
            () => {
              // Respawn callback
              shipRef.current.resetKinematics(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
              shipRef.current.setInvulnerableFrom(performance.now());
            },
            shipRef,
            isGameOver // Pass the flag
          );

          // life loss
          livesRef.current -= 1;
          deathPauseUntilRef.current = nowMs + DEATH_PAUSE_MS;
          if (typeof onLifeLost === 'function') {
            onLifeLost(DEATH_PAUSE_MS);
          }
          if (livesRef.current <= 0) {
            gameOverRef.current = true;
          }

          shipCollisionIndex = ai;
          break; // stop after first hit
        }
      }
    }

    // remove the asteroid that hit the ship
    if (shipCollisionIndex >= 0) {
      asteroidsRef.current.splice(shipCollisionIndex, 1);
    }

    // Effects update
    levelUpEffectRef.current.update();
    stageClearEffectRef.current.update();
    hyperSpaceJumpEffectRef.current.update();
    hyperSpaceJumpEffectRef.current.updateStars(starsRef.current);
    deathExplosionRef.current.update();

    updatePickups(shipRef.current);

    if (survivalState) {
      survivalStateRef.current = survivalState;
    }

    // Update asteroid counts and check for stage clear
    updateAsteroidCounts();
  }, [
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
    survivalElapsedMs,
    portalRef,
    setUiState,
    warmupRef,
    spawnSurvivalAsteroid,
    onLifeLost,
  ]);

  return { update };
}
