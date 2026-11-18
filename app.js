// 1. GESTION DES ONGLETS
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// 2. DONNÉES FARM (Extraites de la feuille FARM - Top spots AP/Drop)
const farmMaterials = [
  {
    code: "A301", name: "Proof of Hero", rarity: "bronze",
    spots: [
      { rank: 1, area: "Okeanos", quest: "Pirate Ship", ap: 12, apDrop: "18.3", rate: "65.5%" },
      { rank: 2, area: "Orleans", quest: "Marseille", ap: 7, apDrop: "20.3", rate: "34.5%" },
      { rank: 3, area: "Okeanos", quest: "Pirate Island", ap: 13, apDrop: "20.7", rate: "62.8%" }
    ]
  },
  {
    code: "A302", name: "Evil Bone", rarity: "bronze",
    spots: [
      { rank: 1, area: "Fuyuki", quest: "Unknown Coordinates X-C", ap: 4, apDrop: "18.9", rate: "21.2%" },
      { rank: 2, area: "Fuyuki", quest: "Unknown Coordinates X-D", ap: 5, apDrop: "20.0", rate: "25.0%" },
      { rank: 3, area: "Fuyuki", quest: "Unknown Coordinates X-G", ap: 15, apDrop: "21.2", rate: "70.7%" }
    ]
  },
  {
    code: "A303", name: "Dragon Fang", rarity: "bronze",
    spots: [
      { rank: 1, area: "E Pluribus Unum", quest: "Deming", ap: 17, apDrop: "25.2", rate: "67.5%" },
      { rank: 2, area: "Okeanos", quest: "Island of Wyverns", ap: 14, apDrop: "25.5", rate: "54.9%" },
      { rank: 3, area: "Babylonia", quest: "Eridu", ap: 21, apDrop: "28.6", rate: "73.4%" }
    ]
  },
  {
    code: "A201", name: "Seed of Yggdrasil", rarity: "silver",
    spots: [
      { rank: 1, area: "Bleached Earth", quest: "Southern African Area", ap: 40, apDrop: "28.1", rate: "142.5%" },
      { rank: 2, area: "Salem", quest: "Quiet Forest", ap: 20, apDrop: "35.1", rate: "56.9%" },
      { rank: 3, area: "Babylonia", quest: "Fallen Babylon", ap: 20, apDrop: "35.2", rate: "56.8%" }
    ]
  },
  {
    code: "A110", name: "Primordial Lanugo", rarity: "gold",
    spots: [
      { rank: 1, area: "Babylonia", quest: "Blood Fort", ap: 21, apDrop: "105.5", rate: "19.9%" },
      { rank: 2, area: "Götterdämmerung", quest: "Road to the End", ap: 21, apDrop: "106.8", rate: "19.7%" }
    ]
  }
];

function renderFarm() {
  const query = document.getElementById('farm-search').value.toLowerCase();
  const rarity = document.getElementById('farm-rarity').value;
  const grid = document.getElementById('farm-grid');

  const filtered = farmMaterials.filter(m => {
    const matchText = m.name.toLowerCase().includes(query) || m.spots.some(s => s.area.toLowerCase().includes(query) || s.quest.toLowerCase().includes(query));
    const matchRarity = rarity === 'all' || m.rarity === rarity;
    return matchText && matchRarity;
  });

  grid.innerHTML = filtered.map(mat => `
    <div class="card">
      <div class="mat-header">
        <strong>${mat.name}</strong>
        <span class="mat-code">${mat.code}</span>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>#</th><th>Zone / Quête</th><th>AP</th><th>AP/Drop</th><th>Drop</th></tr>
        </thead>
        <tbody>
          ${mat.spots.map(s => `
            <tr>
              <td>${s.rank}</td>
              <td><strong>${s.area}</strong><br><small class="muted">${s.quest}</small></td>
              <td>${s.ap}</td>
              <td>${s.apDrop}</td>
              <td>${s.rate}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');
}

document.getElementById('farm-search').addEventListener('input', renderFarm);
document.getElementById('farm-rarity').addEventListener('change', renderFarm);

// 3. DONNÉES BOND LEVEL + SAUVEGARDE LOCALE
const defaultBonds = [
  { name: "Hassan hundred persona", cls: "Assassin", done: false, prio: "Priorité 1" },
  { name: "Aoko aozaki", cls: "Foreigner", done: false, prio: "Priorité 2" },
  { name: "Setanta", cls: "Saber", done: false, prio: "Priorité 3" },
  { name: "Bedivere", cls: "Saber", done: false, prio: "En attente" },
  { name: "Caligula", cls: "Berserker", done: true, prio: "Max" },
  { name: "Artoria alter", cls: "Saber", done: true, prio: "Max" }
];

let bondList = JSON.parse(localStorage.getItem('fgo_bond_tracker')) || defaultBonds;

function toggleBond(index) {
  bondList[index].done = !bondList[index].done;
  bondList[index].prio = bondList[index].done ? "Max" : "En attente";
  localStorage.setItem('fgo_bond_tracker', JSON.stringify(bondList));
  renderBonds();
}

function renderBonds() {
  const query = document.getElementById('bond-search').value.toLowerCase();
  const filter = document.getElementById('bond-filter').value;
  const tbody = document.getElementById('bond-tbody');
  const stats = document.getElementById('bond-stats');

  const maxCount = bondList.filter(b => b.done).length;
  const todoCount = bondList.length - maxCount;
  stats.innerHTML = `
    <div class="stat-pill">✅ Bond Max : <strong>${maxCount}</strong></div>
    <div class="stat-pill">⏳ À faire : <strong>${todoCount}</strong></div>
    <div class="stat-pill">📊 Total suivi : <strong>${bondList.length}</strong></div>
  `;

  tbody.innerHTML = bondList.map((item, idx) => {
    const matchText = item.name.toLowerCase().includes(query) || item.cls.toLowerCase().includes(query);
    const matchFilter = filter === 'all' || (filter === 'max' && item.done) || (filter === 'todo' && !item.done);
    if (!matchText || !matchFilter) return '';

    const badgeClass = item.done ? 'prio-max' : (item.prio.startsWith('Priorité') ? 'prio-high' : 'prio-wait');
    return `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.cls}</td>
        <td><span class="prio-badge ${badgeClass}">${item.prio}</span></td>
        <td><input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleBond(${idx})" /></td>
      </tr>
    `;
  }).join('');
}

document.getElementById('bond-search').addEventListener('input', renderBonds);
document.getElementById('bond-filter').addEventListener('change', renderBonds);

renderFarm();
renderBonds();