// =======================
// MAP CORE
// =======================
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [121.046, 14.412],
  zoom: 13,
  pitch: 60,
  bearing: -20,
  antialias: true
});

map.addControl(new maplibregl.NavigationControl());

// =======================
// 3D BUILDINGS
// =======================
map.on('load', () => {
  new OSMBuildings(map, { minZoom: 15 }).load();
});

// =======================
// STATE
// =======================
let offlineMode = false;

// =======================
// OFFLINE MODE
// =======================
document.getElementById("offlineBtn").onclick = () => {
  offlineMode = !offlineMode;
  alert(offlineMode
    ? "Offline Disaster Mode Enabled"
    : "Live Data Mode Enabled");
};

// =======================
// CLICK INSPECTION
// =======================
map.on('click', async (e) => {
  const loc = e.lngLat;

  renderOverview(loc);
});

// =======================
// OVERVIEW TAB
// =======================
function renderOverview(loc) {
  document.getElementById("details").innerHTML = `
    <div class="card">
      <strong>Coordinates</strong>
      <p>${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}</p>
    </div>

    <div class="card">
      <strong>Infrastructure</strong>
      <p>Roads: Moderate</p>
      <p>Drainage: Poor</p>
      <p>Power: Stable</p>
    </div>
  `;
}

// =======================
// DISASTER ENGINE
// =======================
function renderDisaster(loc) {
  document.getElementById("details").innerHTML = `
    <div class="card">
      <strong>Hazard Status</strong><br>
      <span class="badge orange">Flood: High</span><br><br>
      <span class="badge yellow">Earthquake: Medium</span><br><br>
      <span class="badge red">Typhoon: Extreme</span>
    </div>

    <div class="card">
      <strong>Flood Simulation</strong>
      <p>Projected depth: 0.8m</p>
      <p>Affected buildings: 214</p>
    </div>
  `;
}

// =======================
// AI PLANNER (GPT READY)
// =======================
async function renderAIPlanner(loc) {
  document.getElementById("details").innerHTML = `
    <div class="card">
      <strong>AI Infrastructure Planner</strong>
      <ul>
        <li>Elevated housing (PHP 2.2M/unit)</li>
        <li>Flood wall (PHP 18M/km)</li>
        <li>Drainage automation</li>
      </ul>
      <p><em>ROI: 26% over 10 years</em></p>
    </div>
  `;

  // GPT API HOOK (server-side recommended)
  /*
  fetch("/api/ai-planner", {
    method: "POST",
    body: JSON.stringify({ lat: loc.lat, lng: loc.lng })
  })
  */
}

// =======================
// LGU DASHBOARD
// =======================
function renderLGU(loc) {
  document.getElementById("details").innerHTML = `
    <div class="card">
      <strong>LGU Dashboard</strong>
      <p>Population: 38,200</p>
      <p>Annual Damage Cost: PHP 92M</p>
      <p>Available Budget: PHP 140M</p>
    </div>

    <div class="card">
      <strong>Priority Projects</strong>
      <ol>
        <li>Flood control</li>
        <li>Evacuation center</li>
        <li>Early warning system</li>
      </ol>
    </div>
  `;
}

// =======================
// TAB HANDLING
// =======================
document.querySelectorAll("#tabs button").forEach(btn => {
  btn.onclick = () => {
    const tab = btn.dataset.tab;
    if (tab === "overview") renderOverview(map.getCenter());
    if (tab === "disaster") renderDisaster(map.getCenter());
    if (tab === "ai") renderAIPlanner(map.getCenter());
    if (tab === "lgu") renderLGU(map.getCenter());
  };
});

// =======================
// SEARCH
// =======================
document.getElementById("searchBox").addEventListener("keydown", async e => {
  if (e.key !== "Enter") return;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
  const data = await res.json();
  if (data[0]) {
    map.flyTo({ center: [data[0].lon, data[0].lat], zoom: 15 });
  }
});

// =======================
// LIVE MOTION DETECTION (HOOK)
// =======================
setInterval(() => {
  if (!offlineMode) {
    console.log("Satellite / IoT motion scan running...");
  }
}, 5000);
