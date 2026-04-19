export function createTrackSummary() {
  const panel = document.createElement("div");
  panel.className = "track-panel";
  panel.innerHTML = `
    <div class="track-title-row">
      <h3>Helix City Circuit</h3>
      <span>3 laps</span>
    </div>
    <p>
      Sunset megacity course with elevated transit lines, a signature skybridge loop,
      rooftop shortcuts, and a descending helix finish.
    </p>
    <div class="track-pills">
      <span>Downtown Launch</span>
      <span>Building Thread</span>
      <span>Transit Ramp Rise</span>
      <span>Skybridge Loop</span>
      <span>Rooftop Dash</span>
      <span>Grand Helix Finale</span>
    </div>
  `;

  return panel;
}
