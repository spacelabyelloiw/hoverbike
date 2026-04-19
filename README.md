# SkyRush: Neon Circuit

Web-first prototype for a futuristic arcade hoverbike racer based on the supplied game design document in [hoverbike_racing_game_design_document_v_1.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/hoverbike_racing_game_design_document_v_1.md).

## Why This Repo Exists

The original GDD was written with Unreal-style assumptions. This repository adapts that vision into a browser-native project that can ship as a static site on GitHub Pages while preserving the important product pillars:

- arcade speed and flow
- expressive drifting and boost
- readable futuristic track design
- controller-first play
- expandable architecture for later multiplayer work

## Recommended Web Stack

- `Vite` for local dev and static production builds
- `TypeScript` for maintainable gameplay systems
- `Three.js` for 3D rendering
- `@dimforge/rapier3d-compat` for lightweight gameplay-friendly physics
- `Web Audio API` for procedural engine, boost, drift, and impact sound design
- `SVG + CSS + generated placeholder assets` until a bespoke art pipeline replaces them
- `GitHub Actions + GitHub Pages` for deploy-on-push hosting

## Current Phase

This repo is set up for a first web vertical-slice prototype with:

- documentation for humans and future bots
- a basic Vite/TypeScript project structure
- placeholder generated assets
- a lightweight 3D prototype scene with procedural audio hooks
- GitHub Pages deployment workflow

## Getting Started

1. Install dependencies with `npm install`
2. Start local dev with `npm run dev`
3. Build production output with `npm run build`
4. Preview the production build with `npm run preview`

## Repo Guide

- [docs/gdd-review.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/gdd-review.md): review of the supplied design doc from a web-production perspective
- [docs/tech-stack.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/tech-stack.md): chosen stack and reasoning
- [docs/implementation-plan.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/implementation-plan.md): milestone plan for the first playable version
- [docs/architecture.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/docs/architecture.md): repo and runtime architecture
- [AGENTS.md](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/AGENTS.md): future-bot handoff and working agreements

## Deployment

Every push to `main` is configured to build and deploy to GitHub Pages through [`.github/workflows/deploy.yml`](/C:/Users/zerot/OneDrive/Documents/Apps/Game1/.github/workflows/deploy.yml).

For the first publish:

1. Push this repo to GitHub
2. In repository settings, ensure Pages is set to `GitHub Actions`
3. Push to `main`

## Scope Guardrails

The web version intentionally starts with:

- single-player first
- AI-ready architecture, not networked multiplayer first
- one polished prototype course
- procedural audio
- generated placeholder visuals

It intentionally avoids early investment in:

- real-time multiplayer
- account systems
- cosmetics economy
- combat systems
- open world traversal
