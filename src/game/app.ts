import * as THREE from "three";

import { getBuildLabel } from "../buildInfo";
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
            <button class="audio-toggle" type="button">Audio Off</button>
          </div>
        </header>

        <aside class="status-panel">
          <div class="status-card">
            <span class="status-kicker">Section</span>
            <strong class="status-value" data-section>Downtown Launch</strong>
          </div>
          <div class="status-card">
            <span class="status-kicker">Run</span>
            <strong class="status-value" data-state>Cruise</strong>
            <span class="status-note" data-recovery>Clean run</span>
          </div>
        </aside>

        <div class="progress-panel">
          <div class="progress-copy">
            <span class="status-kicker">Course Progress</span>
            <strong class="progress-value" data-distance>000 m</strong>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" data-progress-fill></div>
          </div>
        </div>

        <footer class="control-ribbon">
          <span>Throttle Alt</span>
          <span>Steer A/D or arrows</span>
          <span>Drift Space</span>
          <span>Boost Shift</span>
          <span>Brake S / Down</span>
          <span>Reset R</span>
        </footer>

        <div class="build-stamp" data-build-stamp></div>
      </div>
    </main>
  `;

  root.append(shell);

  const canvas = shell.querySelector<HTMLCanvasElement>(".game-canvas");
  const audioButton = shell.querySelector<HTMLButtonElement>(".audio-toggle");
  const speedValue = shell.querySelector<HTMLElement>("[data-speed]");
  const boostValue = shell.querySelector<HTMLElement>("[data-boost]");
  const stateValue = shell.querySelector<HTMLElement>("[data-state]");
  const sectionValue = shell.querySelector<HTMLElement>("[data-section]");
  const distanceValue = shell.querySelector<HTMLElement>("[data-distance]");
  const recoveryValue = shell.querySelector<HTMLElement>("[data-recovery]");
  const progressFill = shell.querySelector<HTMLElement>("[data-progress-fill]");
  const buildStamp = shell.querySelector<HTMLElement>("[data-build-stamp]");

  if (
    !canvas ||
    !audioButton ||
    !speedValue ||
    !boostValue ||
    !stateValue ||
    !sectionValue ||
    !distanceValue ||
    !recoveryValue ||
    !progressFill ||
    !buildStamp
  ) {
    throw new Error("Failed to build prototype UI.");
  }

  buildStamp.textContent = getBuildLabel();

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
    progressFill.style.width = `${(telemetry.distance / 420) * 100}%`;
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
    if (audio.isRunning()) {
      audio.stop();
      audioButton.textContent = "Audio Off";
      return;
    }
    await audio.start();
    audioButton.textContent = "Audio On";
  });

  window.addEventListener("beforeunload", () => {
    stopScene();
    audio.stop();
  });
}
