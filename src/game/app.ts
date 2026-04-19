import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

import { createRacerCards } from "./content/racers";
import { createTrackSummary } from "./content/tracks";
import { createAudioController } from "./audio/proceduralAudio";
import { createPrototypeScene } from "./rendering/prototypeScene";

export async function mountApp(root: HTMLDivElement) {
  await RAPIER.init();

  const shell = document.createElement("div");
  shell.className = "app-shell";

  shell.innerHTML = `
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Web Vertical Slice Prototype</p>
        <h1>SkyRush: Neon Circuit</h1>
        <p class="lede">
          Browser-first adaptation of the hoverbike racer GDD with a 3D prototype scene,
          procedural placeholder audio, and generated UI art.
        </p>
        <div class="hero-actions">
          <button class="primary-action" type="button">Start Prototype Audio</button>
          <span class="input-note">Controller-first design. Keyboard fallback: WASD, Space, Shift.</span>
        </div>
      </div>
      <aside class="project-panel">
        <h2>Prototype Goals</h2>
        <ul>
          <li>Responsive drift-heavy movement</li>
          <li>Readable futuristic city track</li>
          <li>Single-player first</li>
          <li>GitHub Pages deploy on push</li>
        </ul>
      </aside>
    </header>
    <main class="layout">
      <section class="viewport-card">
        <div class="section-head">
          <h2>Prototype View</h2>
          <p>Early 3D scene showing the visual direction and scaffold for gameplay integration.</p>
        </div>
        <div class="viewport-frame">
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
          <h2>Procedural Audio</h2>
          <p>
            Hover engine, boost swell, and drift texture are intended to be synthesized in code
            until authored audio replaces them.
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

  if (!racerGrid || !trackSummary || !canvas || !audioButton) {
    throw new Error("Failed to build prototype UI.");
  }

  createRacerCards().forEach((card) => racerGrid.append(card));
  trackSummary.append(createTrackSummary());

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  const stopScene = createPrototypeScene(renderer, canvas);
  const audio = createAudioController();

  audioButton.addEventListener("click", async () => {
    await audio.start();
    audioButton.textContent = audio.isRunning() ? "Audio Running" : "Start Prototype Audio";
  });

  window.addEventListener("beforeunload", () => {
    stopScene();
    audio.stop();
  });
}
