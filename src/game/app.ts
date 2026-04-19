import * as THREE from "three";

import { createRacerCards } from "./content/racers";
import { createTrackSummary } from "./content/tracks";
import { createAudioController } from "./audio/proceduralAudio";
import { createPrototypeScene, type PrototypeTelemetry } from "./rendering/prototypeScene";

export async function mountApp(root: HTMLDivElement) {
  const shell = document.createElement("div");
  shell.className = "app-shell";

  shell.innerHTML = `
    <main class="game-shell">
      <div class="viewport-frame">
        <canvas class="game-canvas" aria-label="Prototype game viewport"></canvas>

        <header class="game-header">
          <div class="brand-block">
            <p class="eyebrow">SkyRush Prototype</p>
            <h1>Neon Circuit</h1>
          </div>
          <div class="hud-cluster">
            <div class="hud-chip">
              <span class="hud-label">Speed</span>
              <strong class="hud-value" data-speed>000 KPH</strong>
            </div>
            <div class="hud-chip">
              <span class="hud-label">Boost</span>
              <strong class="hud-value" data-boost>3.0 / 3</strong>
            </div>
            <div class="hud-chip">
              <span class="hud-label">State</span>
              <strong class="hud-value" data-state>Cruise</strong>
            </div>
          </div>
        </header>

        <aside class="session-panel">
          <div class="session-card session-card-primary">
            <span class="session-kicker">Current Slice</span>
            <strong class="session-title" data-section>Downtown Launch</strong>
            <p class="session-copy">
              Fullscreen movement prototype for validating speed, drift, boost, and track readability.
            </p>
          </div>
          <div class="session-card">
            <span class="session-kicker">Course Progress</span>
            <strong class="session-title" data-distance>000 m</strong>
            <p class="session-copy" data-recovery>Clean run</p>
          </div>
          <div class="session-card">
            <span class="session-kicker">Controls</span>
            <div class="controls-list">
              <div><span>Throttle</span><strong>W / Up</strong></div>
              <div><span>Brake</span><strong>S / Down</strong></div>
              <div><span>Steer</span><strong>A D / Arrows</strong></div>
              <div><span>Drift</span><strong>Space</strong></div>
              <div><span>Boost</span><strong>Shift</strong></div>
              <div><span>Reset</span><strong>R</strong></div>
            </div>
          </div>
        </aside>

        <footer class="bottom-strip">
          <section class="bottom-card">
            <div class="bottom-head">
              <h2>Racers</h2>
              <span>Phase 4 tuning</span>
            </div>
            <div class="racer-grid"></div>
          </section>
          <section class="bottom-card track-card">
            <div class="bottom-head">
              <h2>Helix City Circuit</h2>
              <button class="primary-action" type="button">Start Audio</button>
            </div>
            <div class="track-summary"></div>
            <p class="input-note">Next plan step: replace this runway loop with a greybox checkpoint course.</p>
          </section>
        </footer>
      </div>
    </main>
  `;

  root.append(shell);

  const racerGrid = shell.querySelector<HTMLDivElement>(".racer-grid");
  const trackSummary = shell.querySelector<HTMLDivElement>(".track-summary");
  const canvas = shell.querySelector<HTMLCanvasElement>(".game-canvas");
  const audioButton = shell.querySelector<HTMLButtonElement>(".primary-action");
  const speedValue = shell.querySelector<HTMLElement>("[data-speed]");
  const boostValue = shell.querySelector<HTMLElement>("[data-boost]");
  const stateValue = shell.querySelector<HTMLElement>("[data-state]");
  const sectionValue = shell.querySelector<HTMLElement>("[data-section]");
  const distanceValue = shell.querySelector<HTMLElement>("[data-distance]");
  const recoveryValue = shell.querySelector<HTMLElement>("[data-recovery]");

  if (
    !racerGrid ||
    !trackSummary ||
    !canvas ||
    !audioButton ||
    !speedValue ||
    !boostValue ||
    !stateValue ||
    !sectionValue ||
    !distanceValue ||
    !recoveryValue
  ) {
    throw new Error("Failed to build prototype UI.");
  }

  createRacerCards().forEach((card) => racerGrid.append(card));
  trackSummary.append(createTrackSummary());

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  const audio = createAudioController();
  const updateHud = (telemetry: PrototypeTelemetry) => {
    speedValue.textContent = `${Math.round(telemetry.speedKph).toString().padStart(3, "0")} KPH`;
    boostValue.textContent = `${telemetry.boostCharges.toFixed(1)} / 3`;
    stateValue.textContent = telemetry.boosting ? "Boost" : telemetry.drifting ? "Drift" : "Cruise";
    sectionValue.textContent = telemetry.section;
    distanceValue.textContent = `${Math.round(telemetry.distance).toString().padStart(3, "0")} m`;
    recoveryValue.textContent = telemetry.recoveryHint ?? "Clean run";
    if (audio.isRunning()) {
      audio.update({
        speedRatio: Math.min(telemetry.speedKph / 360, 1),
        driftRatio: telemetry.drifting ? 1 : Math.min(Math.abs(telemetry.steering), 1) * 0.35,
        boosting: telemetry.boosting,
      });
    }
  };

  const stopScene = createPrototypeScene(renderer, canvas, {
    onTelemetry: updateHud,
  });

  audioButton.addEventListener("click", async () => {
    await audio.start();
    audioButton.textContent = audio.isRunning() ? "Audio Running" : "Start Prototype Audio";
  });

  window.addEventListener("beforeunload", () => {
    stopScene();
    audio.stop();
  });
}
