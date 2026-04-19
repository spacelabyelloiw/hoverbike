type RacerCardData = {
  name: string;
  archetype: string;
  palette: string;
  stats: Record<string, number>;
};

const racers: RacerCardData[] = [
  {
    name: "Nova Vega",
    archetype: "Balanced all-rounder",
    palette: "Cyan / White / Magenta",
    stats: { Speed: 3, Acceleration: 3, Handling: 3, Stability: 3 },
  },
  {
    name: "Rex Flint",
    archetype: "Heavy speed bike",
    palette: "Orange / Black / Red",
    stats: { Speed: 4, Acceleration: 2, Handling: 2, Stability: 4 },
  },
  {
    name: "Kira Sol",
    archetype: "Agile drift specialist",
    palette: "Lime / Deep Blue / Violet",
    stats: { Speed: 2, Acceleration: 4, Handling: 4, Stability: 2 },
  },
];

export function createRacerCards() {
  return racers.map((racer) => {
    const card = document.createElement("section");
    card.className = "racer-card";
    card.innerHTML = `
      <div class="racer-badge">${racer.name}</div>
      <p class="racer-role">${racer.archetype}</p>
      <p class="racer-palette">${racer.palette}</p>
      <div class="stat-list">
        ${Object.entries(racer.stats)
          .map(
            ([label, value]) => `
            <div class="stat-row">
              <span>${label}</span>
              <div class="stat-bar">${Array.from({ length: 4 }, (_, index) => {
                const active = index < value ? "is-active" : "";
                return `<span class="stat-segment ${active}"></span>`;
              }).join("")}</div>
            </div>
          `,
          )
          .join("")}
      </div>
    `;
    return card;
  });
}
