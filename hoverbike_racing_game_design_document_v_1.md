# Hoverbike Racing Game Design Document v1

## Working Title
**SkyRush: Neon Circuit**

## One-Line Pitch
A fast, vibrant, arcade-style hoverbike racing game inspired by Jet Moto, built for PC and controller-first play, featuring modern visuals, drifting, jumps, loops, and high-speed multiplayer racing through a stylized futuristic city.

## Document Purpose
This document is written as a single implementation-ready source for an AI coding system to build the first playable version of the game. It includes game vision, mechanics, art direction, UI/UX, audio, networking assumptions, technical structure, and production constraints.

---

# 1. Product Overview

## Game Type
Arcade hoverbike racing game.

## Target Platform
PC first.

## Target Input
Game controller is the primary input method. Keyboard support should exist for development and accessibility, but all design decisions should assume controller-first play.

## Initial Scope
A polished vertical slice with:
- 1 race track
- 3 playable racers
- 3 unique hoverbikes
- 1 core race mode
- Single-player with AI
- Online multiplayer support if feasible in first implementation, otherwise architecture-ready with local testing support

## Core Pillars
1. **Arcade speed and flow**: Racing should feel fast, readable, and satisfying.
2. **Expressive handling**: Drift-heavy turns, jumps, loops, and vertical traversal should create skill expression.
3. **Strong visual identity**: Bright, vibrant, futuristic city with readable geometry and bold colors.
4. **Immediate fun**: The player should be able to launch the game and race quickly.
5. **Expandable foundation**: The codebase and content structure should make it easy to add more racers, tracks, and modes later.

---

# 2. Design Vision

## Desired Feel
- Arcade
- Fast
- Stylish
- Energetic
- Accessible to learn
- Skillful to master

## Reference Direction
Primary inspiration: **Jet Moto** for the fantasy of futuristic racing over dramatic 3D terrain.
Secondary references for feel and presentation:
- Wipeout for futuristic speed and readability
- Mario Kart drift readability and accessibility
- F-Zero for pace and intensity
- Trackmania for memorable track geometry and flow

## Design Positioning
This is **not** a simulation racer. It is an **arcade racer with light physics flavor**. Visual spectacle and input feel matter more than simulation realism.

## Session Target
- One race: 4–6 minutes
- First-time setup to first race: under 60 seconds if skipping tutorial

## Tone
Family-friendly, energetic, lightly futuristic sports-racing tone. No dark or grim storytelling required.

---

# 3. First Playable Build Goals

## Goal of Initial Build
Create a highly playable, visually convincing vertical slice that proves the core fun of:
- hoverbike movement
- drifting
- ramps and loops
- one memorable city track
- three distinct racer archetypes

## Included at Launch
- Title screen
- Main menu
- Racer select
- Track select with only one available track
- Race gameplay
- AI opponents
- Results screen
- Settings menu
- Pause menu

## Nice-to-Have but Optional for First Pass
- Online multiplayer lobby flow
- Ghost replay system
- Practice mode
- Intro cinematic
- Advanced progression

---

# 4. Core Gameplay Loop

1. Player launches game.
2. Player selects Play.
3. Player selects racer.
4. Player confirms the only available track.
5. Race begins after a short countdown.
6. Player completes 3 laps while competing against AI or other players.
7. Results screen displays finishing order, total time, best lap.
8. Player can rematch, change racer, or return to menu.

---

# 5. Race Format

## Default Rules
- 8 racers per race total
- 3 laps
- Win condition: first racer across finish line after final lap

## Player Count
- Single-player: 1 human + 7 AI
- Multiplayer target: up to 8 total racers

## Track Time Target
- Strong player lap time: ~75–95 seconds
- Total race duration: ~4–5 minutes

## Race Start
- Racers line up on a starting grid
- 3-2-1-Go countdown
- False start penalty not required in version 1

---

# 6. Vehicle Handling Model

## Overview
Handling should be custom arcade-style, not simulation-heavy. The bike should feel like a high-speed hover vehicle with strong traction assistance, limited ground contact dependency, and predictable racing behavior.

## Core Principles
- Easy to steer at baseline
- Drift creates advanced cornering control
- Air time is brief but expressive
- Loops and ramps feel spectacular but stable
- Bikes should not wobble unpredictably

## Hover Behavior
- Bikes visually hover 0.5–1.0 meters above the surface
- Hovering is mostly a controlled visual/physical hybrid
- The bike aligns to the track surface normal smoothly
- The hover system should maintain stable altitude over the track

## Steering
- Left stick controls steering
- Steering is responsive but lightly smoothed at high speeds
- Minor steering assist should stabilize the bike on straightaways

## Throttle and Braking
- Right trigger: accelerate
- Left trigger: brake/reverse
- Reverse is slow and mainly used for recovery

## Drift System
- Drift is activated by a dedicated button, default: A / Cross or X / Square depending on prompt scheme
- While drift is held, turn responsiveness increases and rear/visual bike slide becomes more pronounced
- Drifting allows tighter cornering at controlled speed loss, but skilled use preserves momentum better than normal turning

## Drift Goals
- Easy to understand
- Hard to fully optimize
- Visually obvious
- Satisfying controller feel

## Air Control
- Limited midair control
- Player can gently influence yaw and pitch for landing alignment
- No trick system in v1

## Jumps and Landings
- Jumps should feel punchy, not floaty
- Gravity should be arcade-heavy enough that players rejoin the track quickly
- Landing should create a brief camera and controller impact response

## Loop Traversal
- Loops are special track-authoring surfaces with magnetic adherence
- The game should strongly stabilize the vehicle on loop surfaces
- The loop experience should feel cinematic and confident rather than physically risky

## Boost
Boost is included.
- Players have a boost meter with 3 charges
- A small amount of boost is earned over time and slightly faster through clean drifting
- Boost gives a short forward acceleration burst
- Boost is used strategically on straightaways and exits from corners

## Collisions
- Light wall contact causes scraping and slight slowdown
- Heavy wall impact causes spin correction and stronger speed loss
- Rider-to-rider contact causes bumping, but not extreme chaos
- Falling off the track triggers respawn at nearest checkpoint

## Respawn
- Fast and forgiving
- 1.5–2.0 second reset flow
- Fade, reposition, reorient, relaunch with modest speed

---

# 7. Racer Roster

The first build includes three racers with distinct handling archetypes and unique visual identities.

## Shared Design Rules
- All racers are balanced and viable
- Differences are noticeable but not extreme
- Collision/hitbox dimensions are normalized for fairness
- Each racer has a unique rider model, bike model, color palette, and UI identity

## Racer 1: Nova Vega
**Archetype:** Balanced all-rounder
- Strong beginner choice
- Medium top speed
- Medium acceleration
- Medium handling
- Medium stability

**Visual identity:**
- Bright cyan, white, and magenta accents
- Clean elite racing aesthetic
- Sleek bike silhouette

**Personality:**
- Confident, composed, professional

## Racer 2: Rex Flint
**Archetype:** Heavy speed bike
- Highest top speed
- Slowest turning response
- Best straight-line stability
- Hardest for beginners

**Visual identity:**
- Orange, black, and red
- Bulkier bike shape with powerful rear propulsion
- More aggressive posture

**Personality:**
- Cocky, adrenaline-driven, aggressive competitor

## Racer 3: Kira Sol
**Archetype:** Agile drift specialist
- Best cornering
- Fast acceleration
- Lower top speed
- Best drift performance

**Visual identity:**
- Lime, purple, and deep blue
- Narrow lightweight bike silhouette
- More expressive drift VFX

**Personality:**
- Energetic, playful, stylish

## Stats Presentation
Show 4 visible stats in racer select:
- Speed
- Acceleration
- Handling
- Stability

---

# 8. Track Design: City Course

## Track Name
**Helix City Circuit**

## Fantasy
A bright futuristic megacity race course weaving through city streets, transit corridors, rooftop lanes, skybridges, and interior building passages, culminating in dramatic loops and elevated jumps.

## Tone and Time of Day
- Late afternoon to sunset
- Warm light with neon accents beginning to glow
- The city is vibrant, colorful, and polished

## Style Direction
Not gritty cyberpunk. Instead:
- clean sci-fi metropolis
- bold color blocking
- readable shapes
- high-energy racing spectacle

## Track Length and Flow
- 1 lap: ~80–90 seconds for a skilled player
- 3 laps total per race
- One primary route with 2 minor shortcut opportunities

## Track Structure
### Section 1: Downtown Launch
- Start on a broad neon-lined city avenue
- Long acceleration zone
- Gentle tutorial-like turns
- Moving signage and holographic billboards

### Section 2: Building Thread
- Enter between skyscrapers
- Narrower lanes
- Quick S-curves through service alleys and lower atriums
- First major drift test

### Section 3: Transit Ramp Rise
- Series of ramps lift players onto elevated transit routes
- Opportunity for boost use
- Strong skyline views

### Section 4: Skybridge Loop Complex
- Signature set piece
- Racers pass through a transparent skybridge tube
- Enter one large loop integrated into elevated architecture
- Loop exit leads into descending banked turn

### Section 5: Rooftop Dash
- Wide rooftop straightaway with ventilation units, support pylons, and light hazard avoidance
- Optional shortcut jump for skilled players

### Section 6: Interior Dive
- Players descend into a large interior passage through a high-tech commercial tower
- Lighting shifts slightly, becoming more saturated and enclosed
- Tight corners emphasize handling

### Section 7: Grand Helix Finale
- Large descending spiral roadway around a central tower
- Final dramatic jump back to street level
- Fast final straight into finish line

## Geometry Rules
- Track width: medium-wide in most sections, narrow only in deliberate challenge segments
- Guardrails are present where readability or fairness matters
- Open-danger edges are used sparingly and mostly around advanced shortcuts

## Shortcuts
Two optional shortcuts:
1. **Rooftop jump shortcut** requiring clean entry speed
2. **Interior split shortcut** with tighter corners but shorter distance

## Hazards
Version 1 hazards should be light and readable:
- Moving transit shutters
- Rotating warning gates
- Occasional traffic drones crossing specific lanes

No destructible chaos systems are required in v1.

## Checkpoints
- Frequent enough to prevent frustrating resets
- Each major section contains at least one checkpoint

---

# 9. Art Direction

## Overall Style
Stylized-modern arcade realism.

This means:
- Modern rendering and materials
- Clean forms
- Bold colors
- Not ultra-realistic
- Readability over fine-detail clutter

## Palette
Primary palette goals:
- saturated blues, teals, oranges, magentas, lime accents
- strong environmental color coding for track guidance
- bright signage and race infrastructure

## Material Language
- Smooth composites
- Glossy painted bike shells
- Lit edge panels
- Glass, metal, polished road surfaces
- Occasional holographic race signage

## Environment Readability
The environment must support high-speed readability.
- Racing surfaces are easy to distinguish
- Hazard colors are obvious
- Jump ramps and loop entrances are clearly framed
- Shortcuts are visible but not confusing

## Lighting
- Main lighting: warm late-day sunlight
- Secondary accents: emissive signs and race lane lighting
- Avoid overly dark scenes

## Motion and Speed FX
- Mild motion blur
- Speed streaks at high velocity
- Drift sparks/energy trails
- Hover glow beneath bikes
- Boost trail when active

## Artistic Priorities
1. Readability at speed
2. Memorable track landmarks
3. Strong racer silhouettes
4. Vibrant visual identity

---

# 10. Character and Vehicle Art Needs

## Rider Presentation
- Riders are fully visible
- Full-face helmets for cleaner production scope and strong silhouette
- Distinct suit design and color identity per character

## Bike Visual Design
Each hoverbike should have:
- unique silhouette
- unique color scheme
- recognizable propulsion treatment
- identifiable hover energy look

## Asset Priorities
### Hero assets
- 3 rider models
- 3 hoverbike models
- 1 modular city kit
- 1 set of loop/ramp race structures
- signage kit
- VFX kit for drift, boost, impacts, respawn

### Reusable environment modules
- road pieces
- barriers
- support structures
- rooftop props
- glass tunnel pieces
- holographic ad boards
- checkpoint gates

## LOD Strategy
Optimize for fast traversal and multiplayer. Prioritize silhouette and broad readability over fine detail.

---

# 11. Animation and VFX

## Required Rider Animations
- idle on bike
- accelerate
- brake
- drift left
- drift right
- airborne
- hard impact reaction
- victory pose
- defeat idle

## Bike Animation Behaviors
- lean into turns
- increased lean in drift
- subtle hover stabilization bob
- landing compression effect

## VFX List
- hover glow
- drift sparks / energy trails
- boost exhaust burst
- impact sparks
- checkpoint ring pulse
- respawn flash effect
- finish line celebration FX

## VFX Design Rule
Clarity beats spectacle when they conflict.

---

# 12. Camera Design

## Default Camera
Third-person chase camera only in v1.

## Camera Goals
- Stable at high speed
- Responsive but not twitchy
- Handles loops and jumps cleanly
- Preserves readability in tight city sections

## Camera Behavior
- Slightly pulls back at high speed
- Slight FOV increase during boost
- Mild tilt during drift
- Mild impact shake on collision and landing
- Auto-aligns during loops to reduce nausea

## No First-Person Camera in v1
This can be a future enhancement.

## Look Back
Dedicated button allows quick rear view.

---

# 13. UI / UX Design

## UI Tone
Sleek arcade-futurist. Bold, readable, high-contrast, slightly animated, but not cluttered.

## HUD Requirements
- Current lap / total laps
- Race position
- Speed readout
- Boost meter / charges
- Mini-map
- Race timer
- Best lap / current lap timer
- Optional drift state indicator

## HUD Layout
- Top left: lap and race timer
- Top right: position and mini-map
- Bottom center: speed
- Bottom right: boost charges
- Drift feedback near the bike reticle or speed area

## Menus Required
- Title screen
- Main menu
- Racer select
- Track select
- Settings
- Pause menu
- Results screen
- Multiplayer lobby if multiplayer enabled

## Racer Select
- 3D bike/rider turntable
- stat bars
- short character descriptor

## Results Screen
- finishing order
- racer portraits
- total time
- best lap
- rematch button
- return to menu

## UI Motion Guidelines
- Short, slick transitions
- Strong confirmation states
- Minimal delay before interaction

## Prompt System
Button prompts should support Xbox-style default prompts first, but ideally swap based on detected controller type.

---

# 14. Audio Direction

## Music Style
High-energy electronic soundtrack with racing intensity.
Suggested blend:
- synthwave energy
- breakbeat / drum and bass pacing
- modern arcade racing feel

## Audio Priorities
- Boost should sound powerful
- Drift should provide satisfying friction/energy feedback
- Hover engine tone should sell speed and anti-grav tech
- Collisions and landings should have punch

## Voice
Minimal racer voice lines are acceptable:
- selection acknowledgement
- race start exclamations
- victory / defeat lines

No announcer required in v1.

## Ambience
Subtle city ambience and passing infrastructure audio should exist but not overpower gameplay feedback.

---

# 15. Multiplayer Design

## Recommended Scope
Design the codebase so multiplayer is supported cleanly, but do not let online complexity block the first fun playable build.

## Recommended Launch Strategy
### Phase 1
- Fully playable single-player with AI
- Networking-ready architecture
- Local multi-instance development testing allowed

### Phase 2
- Online private lobbies
- Up to 8 players
- Server-authoritative race state

## Networking Principles
- Server-authoritative position and race state
- Client-side prediction for local feel
- Countdown starts only when all players are loaded
- Disconnecting players become AI or are removed from standings depending on implementation complexity

## Multiplayer Features for Initial Online Pass
- private lobby creation
- invite / join by code if implemented
- racer selection sync
- ready state
- race launch
- post-race rematch vote

## Not Required in v1
- ranked matchmaking
- leaderboards
- voice chat
- spectators
- host migration if dedicated server architecture is used

---

# 16. AI Racer Design

## AI Purpose
AI is essential for the first playable version so the game works even without multiplayer.

## AI Count
Up to 7 AI racers.

## AI Difficulty Levels
- Easy
- Normal
- Hard

## AI Behavior Rules
- Follow racing line with authored variation
- Use drift on designated turns
- Use boost in readable strategic zones
- Make occasional small mistakes on lower difficulties
- Use shortcuts on Hard difficulty only or at reduced frequency on Normal

## AI Technical Recommendation
AI may use simplified driving logic rather than exactly matching player physics, but should visually appear to obey the same rules.

---

# 17. Game Modes

## Included in v1
### Standard Race
The only required mode in the first implementation.

## Future-Friendly Modes
Design structure to allow:
- time trial
- practice mode
- championship cup
- ghost racing
- elimination mode

But do not build these first if they endanger core scope.

---

# 18. Progression and Save Data

## v1 Progression
Very light.
- All 3 racers unlocked from start
- Best lap and best race time saved locally
- Last selected racer can be remembered

## No upgrade system in v1
Racer stats are fixed to preserve clarity and fairness.

## Future Expansion
- unlockable skins
- medals for time trial
- track unlocks
- cosmetic bike variants

---

# 19. Controls

## Default Controller Mapping
- Left Stick: steer
- Right Trigger: accelerate
- Left Trigger: brake / reverse
- South Face Button: drift
- East Face Button: boost
- West Face Button: look back
- North Face Button: reset if stuck
- Start/Menu: pause

## Input Design Rules
- Analog triggers matter
- Steering should have speed-based sensitivity tuning
- Vibration supported for boost, impacts, landings, and strong drift states

## Keyboard Support
Provide a reasonable keyboard fallback:
- WASD steer/throttle/brake
- Space drift
- Shift boost
- R reset
- Esc pause

---

# 20. Accessibility

## Required Accessibility Features
- remappable controls
- camera shake toggle
- motion blur toggle
- subtitles for voice lines
- colorblind-friendly UI cues
- larger HUD scale option
- reduced flashing option

## Recommended Driving Assists
- optional steering assist
- optional auto-accelerate
- optional camera stabilization assist

---

# 21. Tutorial and Onboarding

## First-Time Flow
On first launch:
- Press Start screen
- Main menu
- Prompt: “Play Tutorial” or “Skip to Race”

## Tutorial Scope
A short playable tutorial is recommended but optional for earliest build.
If included, teach:
- accelerate and brake
- steering
- drift
- boost
- ramps and landing
- respawn/recovery

## Tutorial Style
Text prompts in-world on a compact training lane version of the city aesthetic.

---

# 22. Technical Design Recommendations

## Engine Recommendation
**Unreal Engine 5** is the strongest default recommendation for this project because of:
- strong 3D visuals
- modern rendering
- robust controller support
- multiplayer support potential
- Blueprint + C++ extensibility

If implementation speed matters more than visual fidelity, Unity is also valid, but this document assumes Unreal-style capabilities and structure.

## Movement Implementation Recommendation
Use a **custom arcade hoverbike movement controller** rather than raw physics-only simulation.

Recommended approach:
- velocity-driven movement
- hover stabilization using raycasts or track surface alignment
- custom drift state handling
- special handling volumes or track metadata for loops and magnetic surfaces
- authored checkpoint and respawn system

## Loop System Recommendation
Loops should use authored support logic:
- special track segment metadata
- stronger surface adherence
- camera stabilization rules
- fail-safe orientation correction

Do not rely on unconstrained rigidbody physics for loops.

## Collision Recommendation
Use forgiving collision handling:
- wall scraping slows but does not hard-stop immediately
- heavy impacts trigger correction
- rider-to-rider contacts are damped

## Respawn Recommendation
- authored checkpoints
- forward-facing reorientation
- temporary collision grace after respawn

## Debug/Tuning Tools
Include developer-facing tuning variables for:
- top speed
- acceleration
- drift angle
- grip
- hover height
- camera FOV
- boost duration
- AI difficulty modifiers

---

# 23. Data Architecture and Content Structure

The implementation should be modular and data-driven.

## Recommended Data Definitions
### Racer Data
- name
- description
- stat values
- bike asset reference
- rider asset reference
- color palette
- UI portrait
- audio references

### Track Data
- name
- lap count default
- checkpoint list
- boost zones
- shortcut definitions
- AI path data
- visual theme settings
- music selection

### Game Mode Data
- player count rules
- lap count
- AI settings
- win conditions

### Tuning Data
- movement tuning per racer
- camera tuning
- drift tuning
- boost tuning

---

# 24. Production Priorities for Codex

## Build Order Recommendation
### Milestone 1: Core Movement Sandbox
- hoverbike movement
- camera
- drift
- jump handling
- boost
- simple test track

### Milestone 2: Race Rules
- laps
- checkpoints
- position tracking
- respawn
- HUD basics

### Milestone 3: Vertical Slice Track
- Helix City Circuit blockout
- loops and ramps
- AI pathing
- racer roster setup

### Milestone 4: Presentation
- art pass
- VFX
- UI polish
- audio pass

### Milestone 5: Multiplayer Pass
- sync movement
- lobby flow
- race state synchronization
- rematch flow

## Codex Priorities
The system should prioritize:
1. Fun movement feel
2. Stable race flow
3. Readable track design
4. Expandable architecture
5. Visual polish after core feel works

---

# 25. Features Explicitly Out of Scope for v1

To protect scope, the following are excluded unless implementation proves very fast:
- weapons / combat pickups
- complex trick systems
- open world free roam
- deep story mode
- ranked matchmaking
- advanced progression economy
- cosmetic store systems
- weather variants
- split-screen local multiplayer
- photo mode
- replay editor

---

# 26. Success Criteria

The first version is successful if:
1. Driving feels fun within the first minute.
2. Drifting around corners feels expressive and satisfying.
3. The city track feels memorable and visually coherent.
4. Loops and jumps are exciting without being frustrating.
5. The three racers feel distinct but fair.
6. A full 3-lap race works start-to-finish reliably.
7. Players immediately understand the fantasy: futuristic arcade hoverbike racing through a vibrant city.

## Playtest Questions
After a test session, ask:
1. Did the bike feel fun to control?
2. Was the track exciting and easy enough to read at speed?
3. Did the racers feel meaningfully different?
4. Were loops and jumps thrilling or frustrating?
5. Would you want to race again immediately?

---

# 27. Final High-Level Defaults

When ambiguity exists, default to these decisions:
- **Arcade over simulation**
- **Controller-first**
- **Single polished race mode first**
- **AI included from the start**
- **Boost included**
- **Dedicated drift button**
- **No weapons in v1**
- **Bright futuristic city, not dark cyberpunk**
- **Late afternoon / sunset lighting with neon accents**
- **Stylized-modern visuals**
- **Server-authoritative multiplayer when online is added**
- **Expandable, data-driven architecture**

---

# 28. Implementation Summary for the Builder

Build a PC arcade hoverbike racing game with one polished 3D city course, three distinct racers, controller-first controls, drift-heavy handling, ramps, loops, boost, AI opponents, and a strong foundation for online multiplayer. Prioritize movement feel, track readability, and visual excitement over simulation realism or feature breadth.

