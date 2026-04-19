# GDD Review

## What The Design Doc Gets Right

- Clear arcade-first direction
- Strong scope discipline around a vertical slice
- Good emphasis on drifting, loops, jumps, and readability
- Useful racer archetypes for early differentiation
- Production-aware priorities that focus on fun before breadth

## What Needs Adaptation For Web

The GDD assumes Unreal-style rendering and production scope. For a browser build, the following changes are recommended:

- Treat the first release as a web prototype vertical slice, not a full PC content target
- Start with one high-quality track blockout before attempting dense city detail
- Keep rider animation scope very small early on
- Defer online multiplayer until the single-player race loop is reliable
- Replace bespoke audio asset creation with procedural sound design
- Use generated placeholder art and modular environment pieces until visual direction stabilizes

## Recommended Scope Translation

### Keep For Web v1

- one race mode
- one track
- three racers with clearly different tuning
- boost, drift, jumps, loops
- 3-lap race flow
- AI opponents
- controller and keyboard support

### Defer For Later

- online multiplayer
- advanced tutorial sequence
- voice lines
- elaborate rider animation sets
- cinematic intro flow
- progression systems

## Web-Specific Risks

- Browser performance during dense city scenes
- Camera readability during loops and vertical sections
- Input consistency across browsers and controller types
- Over-scoping visual polish before core handling is proven
- Heavy asset pipelines slowing iteration

## Practical Recommendation

Use the GDD as a vision document and this repo’s docs as the implementation contract. If a future task conflicts with both, prefer:

1. Fun movement
2. Stable frame rate
3. Readable track geometry
4. Quick iteration speed
5. Expandability after proof of fun
