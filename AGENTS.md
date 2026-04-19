# Agent Guide

This repository is intended to be worked on by multiple future coding agents. Optimize for momentum, clarity, and low-regret iteration.

## Product Intent

Build a browser-playable arcade hoverbike racing game inspired by the attached GDD. The web adaptation should preserve:

- fast arcade movement
- readable track flow
- controller-first support
- stylized futuristic presentation
- data-driven expansion later

## Primary Constraints

- Deploy as a static site on GitHub Pages
- Prefer browser-native systems over backend-dependent features
- Keep the first playable build single-player and AI-first
- Use procedural audio for now
- Use generated placeholder assets until the art pipeline matures

## Technical Direction

- Rendering: `Three.js`
- Gameplay language: `TypeScript`
- Physics: `Rapier`
- Audio: `Web Audio API`
- Build tool: `Vite`

Do not introduce server requirements unless the task explicitly justifies them.

## Working Rules

- Preserve the arcade feel over simulation accuracy
- Keep systems data-driven where feasible
- Keep menus and HUD lightweight
- Prefer small composable gameplay modules over giant classes
- Add documentation when making architectural decisions
- Update docs when changing milestones or repo conventions

## First Playable Priorities

1. Movement feel
2. Camera readability
3. Lap/checkpoint flow
4. AI scaffolding
5. HUD and menu clarity
6. VFX and audio polish

## Files Future Bots Should Read First

1. [README.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/README.md)
2. [docs/gdd-review.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/gdd-review.md)
3. [docs/tech-stack.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/tech-stack.md)
4. [docs/implementation-plan.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/implementation-plan.md)
5. [docs/architecture.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/architecture.md)

## Short-Term Asset Guidance

- Keep placeholder art in `public/assets/`
- Prefer SVG, gradients, simple silhouettes, and procedural textures
- Avoid spending time on high-detail art before the movement loop is fun

## Short-Term Audio Guidance

- Synthesize hover engine, boost, drift, landing, and UI feedback in code
- Keep a clean abstraction so prerecorded audio can replace procedural sources later

## Multiplayer Guidance

Multiplayer is a later phase. Current code should be deterministic-friendly where practical, but do not let speculative netcode distort the first playable architecture.
