import * as THREE from "three";

import { createRacerCards } from "./content/racers";
import { createTrackSummary } from "./content/tracks";
import { createAudioController } from "./audio/proceduralAudio";
import { createPrototypeScene, type PrototypeTelemetry } from "./rendering/prototypeScene";

export async function mountApp(root: HTMLDivElement) {
  const shell = document.createElement("div");
  shell.className = "app-shell";

  shell.innerHTML = `
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Web Vertical Slice Prototype</p>
        <h1>SkyRush: Neon Circuit</h1>
        <p class="lede">
          Browser-first adaptation of the hoverbike racer GDD with a controllable movement sandbox,
          reactive procedural audio, and generated placeholder art.
        </p>
        <div class="hero-actions">
          <button class="primary-action" type="button">Start Prototype Audio</button>
          <span class="input-note">Drive with WASD or arrow keys. Drift with Space, boost with Shift, reset with R.</span>
        </div>
      </div>
      <aside class="project-panel">
        <h2>Movement Sandbox</h2>
        <ul>
          <li>Acceleration, braking, and lane control</li>
          <li>Arcade drift state with sharper steering</li>
          <li>Rechargeable three-charge boost system</li>
          <li>Reactive chase camera and audio</li>
        </ul>
      </aside>
    </header>
    <main class="layout">
      <section class="viewport-card">
        <div class="section-head">
          <h2>Playable Prototype</h2>
          <p>Phase 1 sandbox for validating the hoverbike feel before laps, AI, and race flow come online.</p>
        </div>
        <div class="viewport-frame">
          <div class="hud-overlay">
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
          <canvas class="game-canvas" aria-label="Prototype game viewport"></canvas>
        </div>
      </section>
      <section class="sidebar">
        <article class="info-card">
          <h2>Racers</h2>
          <div class="racer-grid"></div>
        </article>
        <article class="info-card">
          <h2>Track</h2>
          <div class="track-summary"></div>
        </article>
        <article class="info-card">
          <h2>Controls</h2>
          <div class="controls-list">
            <div><span>Throttle</span><strong>W / Up</strong></div>
            <div><span>Brake</span><strong>S / Down</strong></div>
            <div><span>Steer</span><strong>A D / Left Right</strong></div>
            <div><span>Drift</span><strong>Space</strong></div>
            <div><span>Boost</span><strong>Shift</strong></div>
            <div><span>Reset</span><strong>R</strong></div>
          </div>
        </article>
        <article class="info-card">
          <h2>Prototype Notes</h2>
          <p>
            This slice intentionally focuses on feel first. The next build step after this should be
            checkpoints, lap flow, and a longer greybox course.
          </p>
        </article>
      </section>
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

  if (!racerGrid || !trackSummary || !canvas || !audioButton || !speedValue || !boostValue || !stateValue) {
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
