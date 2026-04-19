# Tech Stack Recommendation

## Chosen Stack

- `Vite`
- `TypeScript`
- `Three.js`
- `@dimforge/rapier3d-compat`
- `Web Audio API`
- `GitHub Actions`
- `GitHub Pages`

## Why This Stack Fits

### Vite

- very fast local iteration
- static-output friendly
- easy GitHub Pages deployment

### TypeScript

- helps future bots refactor safely
- good fit for data-driven gameplay systems
- lowers ambiguity across tuning and race-state code

### Three.js

- mature browser 3D ecosystem
- enough control for stylized arcade rendering
- avoids engine overhead that would slow early prototyping

### Rapier

- better fit than heavyweight simulation for arcade collision and track alignment support
- WebAssembly-backed performance
- usable for forgiving gameplay physics instead of full simulation realism

### Web Audio API

- ideal for procedural placeholders
- no dependence on recorded sound packs early on
- engine tones, boost swells, drift noise, and UI pulses can all be generated in code

### GitHub Pages

- simplest deployment path for a static web prototype
- works well with Vite builds
- easy deploy-on-push workflow through GitHub Actions

## Libraries To Add Soon

- `three`
- `@dimforge/rapier3d-compat`
- `vite`
- `typescript`

Optional additions after the core loop is stable:

- `lil-gui` for live tuning panels
- `zustand` if state coordination becomes cumbersome
- `postprocessing` for restrained speed and bloom effects
- `vitest` for logic-heavy race systems

## Deliberate Non-Choices

### No React For The First Pass

React would be reasonable for menus, but the current goal is a lean gameplay-first prototype. The first scaffold uses direct DOM + gameplay modules to keep ownership of timing, rendering, and input simple.

### No Backend For v1

GitHub Pages is static. A backend should not be introduced until we intentionally begin multiplayer or cloud save work.

### No Heavy Art Pipeline Yet

Placeholder generated assets let the team validate handling, UI clarity, and track readability before committing to a large content production burden.
