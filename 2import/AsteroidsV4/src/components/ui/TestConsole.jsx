import { SURVIVAL_TUNING_DEFAULTS } from '../../utils/constants.js';

function formatMultiplier(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return `${value.toFixed(2)}×`;
}

function TestConsole({
  open,
  effectActions,
  statOptions,
  statSelections,
  onToggleStat,
  survivalControls,
  activeTab,
  onSelectTab,
}) {
  const consoleClasses = ['testConsole'];
  if (open) {
    consoleClasses.push('open');
  }

  const showSurvivalSection = Boolean(survivalControls);

  const tuning = survivalControls?.tuning ?? SURVIVAL_TUNING_DEFAULTS;
  const currentState = survivalControls?.survivalStateRef?.current ?? {};

  const handleNumberChange = (key, transform = (value) => value) => (event) => {
    if (!survivalControls?.updateTuning) return;
    const parsed = Number(event.target.value);
    if (!Number.isFinite(parsed)) return;
    const mapped = transform(parsed);
    if (!Number.isFinite(mapped) || mapped <= 0) return;
    survivalControls.updateTuning({ [key]: mapped });
  };

  const handleToggleOverlay = (event) => {
    survivalControls?.setOverlayVisible?.(event.target.checked);
  };

  const handleResetTuning = () => {
    survivalControls?.updateTuning?.(() => ({ ...SURVIVAL_TUNING_DEFAULTS }));
  };

  const handleRestart = () => {
    survivalControls?.restartGame?.();
  };

  const renderEffects = () => (
    <section className="testConsole__section">
      <div className="testConsole__sectionHeader">
        <h3>Effects</h3>
        <p>Trigger the current visual FX without waiting for gameplay.</p>
      </div>
      <div className="testConsole__effects">
        {effectActions?.length ? (
          effectActions.map(({ key, label, description, hotkey, handler }) => (
            <button
              type="button"
              key={key}
              className="testConsole__effectButton"
              onClick={handler}
            >
              <span>
                <strong>{label}</strong>
                {description ? <small>{description}</small> : null}
              </span>
              {hotkey ? <span className="testConsole__chip">[{hotkey}]</span> : null}
            </button>
          ))
        ) : (
          <p className="dim">No effect triggers are available yet.</p>
        )}
      </div>
    </section>
  );

  const renderTelemetry = () => (
    <section className="testConsole__section">
      <div className="testConsole__sectionHeader testConsole__sectionHeader--telemetry">
        <div>
          <h3>Telemetry</h3>
          <p>Stack debug readouts in the top-left corner.</p>
        </div>
        <button type="button" className="testConsole__secondary" onClick={() => onSelectTab('survival')}>
          Back to Survival
        </button>
      </div>
      <div className="testConsole__checkboxList">
        {statOptions?.map(({ key, label }) => (
          <label key={key} className="testConsole__checkbox">
            <input
              type="checkbox"
              checked={Boolean(statSelections[key])}
              onChange={() => onToggleStat(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </section>
  );

  const renderSurvival = () => {
    const rampMinutes = Math.round(((tuning?.rampDurationMs ?? SURVIVAL_TUNING_DEFAULTS.rampDurationMs) / 60000) * 10) / 10;
    const maxMultiplier = tuning?.maxMultiplier ?? SURVIVAL_TUNING_DEFAULTS.maxMultiplier;
    const spawnInterval = Math.round(tuning?.spawnIntervalMs ?? SURVIVAL_TUNING_DEFAULTS.spawnIntervalMs);
    const stretch = tuning?.stretch ?? SURVIVAL_TUNING_DEFAULTS.stretch;
    const baseTau = tuning?.baseTau ?? SURVIVAL_TUNING_DEFAULTS.baseTau;
    const liveMultiplier = currentState?.speedMultiplier ?? 1;
    const liveSpawnCount = currentState?.spawnCount ?? 0;

    return (
      <section className="testConsole__section">
          <div className="testConsole__sectionHeader">
            <h3>Survival Tuning</h3>
            <p>Adjust the live speed ramp while testing survival.</p>
          </div>
        <div className="testConsole__survivalControls">
          <label className="testConsole__survivalField">
            <span>Spawn Interval (ms)</span>
            <input
              type="number"
              min={500}
              step={100}
              value={spawnInterval}
              onChange={handleNumberChange('spawnIntervalMs')}
            />
          </label>
          <label className="testConsole__survivalField">
            <span>Max Multiplier</span>
            <input
              type="number"
              min={1}
              step={0.1}
              value={maxMultiplier}
              onChange={handleNumberChange('maxMultiplier')}
            />
          </label>
          <label className="testConsole__survivalField">
            <span>Base Tau</span>
            <input
              type="number"
              min={1}
              step={1}
              value={baseTau}
              onChange={handleNumberChange('baseTau')}
            />
          </label>
          <label className="testConsole__survivalField">
            <span>Curve Stretch</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={stretch}
              onChange={handleNumberChange('stretch')}
            />
          </label>
          <label className="testConsole__survivalField">
            <span>Ramp Length (min)</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={rampMinutes}
              onChange={handleNumberChange('rampDurationMs', (minutes) => minutes * 60000)}
            />
          </label>

          <div className="testConsole__survivalReadout">
            <div>
              <span>Current speed</span>
              <strong>{formatMultiplier(liveMultiplier)}</strong>
            </div>
            <div>
              <span>Spawn count</span>
              <strong>{liveSpawnCount}</strong>
            </div>
          </div>

          <div className="testConsole__survivalActions">
            <label className="testConsole__checkbox">
              <input
                type="checkbox"
                checked={Boolean(survivalControls?.overlayVisible)}
                onChange={handleToggleOverlay}
              />
              <span>Show survival overlay</span>
            </label>
            <div className="testConsole__survivalButtons">
              <button type="button" className="testConsole__secondary" onClick={handleResetTuning}>
                Reset Defaults
              </button>
              <button type="button" className="testConsole__primary" onClick={handleRestart}>
                Restart Level
              </button>
              <button type="button" className="testConsole__secondary" onClick={() => onSelectTab('telemetry')}>
                Telemetry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderActiveTab = () => {
    if (activeTab === 'survival' && showSurvivalSection) {
      return renderSurvival();
    }
    if (activeTab === 'telemetry' && showSurvivalSection) {
      return renderTelemetry();
    }
    return renderEffects();
  };

  return (
    <aside className={consoleClasses.join(' ')} aria-hidden={!open}>
      <header className="testConsole__header">
        <div>
          <h2 className="testConsole__title">Test Console</h2>
          <p className="testConsole__helper">Shift + Tab to toggle</p>
        </div>
        <nav className="testConsole__tabs" aria-label="Test console sections">
          <button
            type="button"
            className={`testConsole__tab ${activeTab === 'effects' ? 'is-active' : ''}`}
            onClick={() => onSelectTab('effects')}
          >
            Effects
          </button>
          <button
            type="button"
            className={`testConsole__tab ${activeTab === 'survival' ? 'is-active' : ''}`}
            onClick={() => onSelectTab('survival')}
            disabled={!showSurvivalSection}
          >
            Survival Tuning
          </button>
          <button
            type="button"
            className={`testConsole__tab ${activeTab === 'telemetry' ? 'is-active' : ''}`}
            onClick={() => onSelectTab('telemetry')}
            disabled={!showSurvivalSection}
          >
            Telemetry
          </button>
        </nav>
      </header>

      {renderActiveTab()}
    </aside>
  );
}

export default TestConsole;
