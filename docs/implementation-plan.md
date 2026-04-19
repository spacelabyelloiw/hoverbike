# Implementation Plan

## Phase 0: Repo Foundation

- adapt the GDD to a web-specific architecture
- set repository conventions
- add GitHub Pages deploy workflow
- create placeholder asset and procedural audio strategy

## Phase 1: Movement Prototype

- create hoverbike controller with arcade acceleration and steering
- add drift state and boost system
- implement chase camera with speed-based pullback
- create greybox test lane with ramps and banking
- expose tuning values in code for rapid balancing

## Phase 2: Race Loop

- checkpoints and respawn system
- lap counting
- race countdown
- position and timing
- results screen
- pause and restart flow

## Phase 3: Helix City Circuit Blockout

- build the full course from modular pieces
- add loop-specific handling aids
- author boost zones and shortcuts
- establish skyline landmarks and color-coded track guidance

## Phase 4: Opponents And Feel

- add AI path following
- create racer tuning differences
- improve collisions and recovery behavior
- integrate procedural audio feedback
- improve VFX and HUD readability

## Phase 5: Vertical Slice Polish

- refine menus
- improve generated placeholder art
- add track presentation pass
- improve controller prompt support
- add accessibility toggles

## Phase 6: Post-Slice Exploration

- investigate private-lobby multiplayer architecture
- determine deterministic or server-authoritative model
- replace placeholders with authored art and audio
- consider a menu/UI framework only if complexity justifies it

## First Deliverable Definition

The first meaningful playable web milestone is:

- one browser-playable track
- one human-controlled hoverbike
- responsive drift and boost
- one lap flow with checkpoints and respawn
- placeholder UI and procedural audio

That milestone should happen before full racer select, AI, or track art polish expand too far.
