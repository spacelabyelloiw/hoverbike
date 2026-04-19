# Architecture

## High-Level Runtime Model

The game is split into small modules with a thin bootstrap layer:

- `src/main.ts`: app bootstrap and DOM wiring
- `src/game/app.ts`: game lifecycle orchestration
- `src/game/content/`: racer and track definitions
- `src/game/rendering/`: Three.js scene setup and updates
- `src/game/audio/`: procedural sound systems
- `src/game/ui/`: HUD and menu rendering helpers

## Current Architectural Principles

- Data first, content second, polish third
- Keep gameplay state serializable where practical
- Separate tuning data from behavior code
- Use placeholders that can be replaced without rewiring systems

## Planned Content Model

### Racer Data

- identifier
- display name
- short bio
- tuning stats
- color palette
- placeholder asset references

### Track Data

- identifier
- display name
- section markers
- lap defaults
- track theme colors
- checkpoint metadata

## Rendering Strategy

- stylized lighting over realism
- strong color separation for readability
- minimal post-processing at first
- environment built from modular geometry

## Audio Strategy

Procedural audio should be generated from gameplay events:

- engine pitch follows speed
- drift noise follows slip intensity
- boost swell follows active burst duration
- impact noise follows collision strength

This keeps early iteration lightweight and avoids blocking on asset sourcing.

## UI Strategy

- use lightweight DOM overlays for menus and HUD
- keep the game canvas dominant
- favor readable large-scale HUD over ornament early on

## Deployment Model

- static build output in `dist/`
- GitHub Actions builds on push to `main`
- Pages serves the built static artifact
