// 1. GESTION DES ONGLETS
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// 2. DONNÉES FARM (Matériaux)
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
    code: "A201", name: "Seed of Yggdrasil", rarity: "silver",
    spots: [
      { rank: 1, area: "Bleached Earth", quest: "Southern African Area", ap: 40, apDrop: "28.1", rate: "142.5%" },
      { rank: 2, area: "Salem", quest: "Quiet Forest", ap: 20, apDrop: "35.1", rate: "56.9%" }
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
  if (!grid) return;

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

const farmSearch = document.getElementById('farm-search');
const farmRarity = document.getElementById('farm-rarity');
if (farmSearch) farmSearch.addEventListener('input', renderFarm);
if (farmRarity) farmRarity.addEventListener('change', renderFarm);

// 3. GESTION DES SERVANTS & BOND LEVEL (Tri automatique : Prioritaires haut / Max bas)
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
  saveAndRenderBonds();
}

function saveAndRenderBonds() {
  localStorage.setItem('fgo_bond_tracker', JSON.stringify(bondList));
  renderBonds();
}

function renderBonds() {
  const query = document.getElementById('bond-search').value.toLowerCase();
  const grid = document.getElementById('bond-grid');
  const stats = document.getElementById('bond-stats');
  if (!grid) return;

  const maxCount = bondList.filter(b => b.done).length;
  const todoCount = bondList.length - maxCount;
  stats.innerHTML = `
    <div class="stat-pill">✅ Bond Max : <strong>${maxCount}</strong></div>
    <div class="stat-pill">⏳ À faire / Prioritaires : <strong>${todoCount}</strong></div>
    <div class="stat-pill">📊 Total : <strong>${bondList.length}</strong></div>
  `;

  // TRI AUTOMATIQUE : 
  // 1. Les non-terminés (done: false) en haut.
  // 2. Les terminés (done: true) tout en bas.
  const sortedList = bondList.map((item, originalIndex) => ({ ...item, originalIndex })).sort((a, b) => {
    if (a.done === b.done) return 0;
    return a.done ? 1 : -1; // false (0) avant true (1)
  });

  const filtered = sortedList.filter(item => 
    item.name.toLowerCase().includes(query) || item.cls.toLowerCase().includes(query)
  );

  grid.innerHTML = filtered.map(item => {
    const badgeClass = item.done ? 'prio-max' : (item.prio.startsWith('Priorité') ? 'prio-high' : 'prio-wait');
    return `
      <div class="servant-select-card ${item.done ? 'is-max' : ''}" onclick="toggleBond(${item.originalIndex})">
        <div class="servant-header">
          <span class="servant-name">${item.name}</span>
          <span class="servant-class">${item.cls}</span>
        </div>
        <div class="servant-footer">
          <span class="prio-badge ${badgeClass}">${item.prio}</span>
          <label class="checkbox-container" onclick="event.stopPropagation()">
            <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleBond(${item.originalIndex})" />
            <span>Bond Max</span>
          </label>
        </div>
      </div>
    `;
  }).join('');
}

// Ajout d'un nouveau Servant via le formulaire
const addForm = document.getElementById('add-servant-form');
if (addForm) {
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-servant-name').value.trim();
    const cls = document.getElementById('new-servant-class').value;
    const prio = document.getElementById('new-servant-prio').value;

    if (name && cls) {
      bondList.unshift({ name, cls, done: false, prio });
      saveAndRenderBonds();
      addForm.reset();
    }
  });
}

const bondSearch = document.getElementById('bond-search');
if (bondSearch) bondSearch.addEventListener('input', renderBonds);

// Initialisation
renderFarm();
renderBonds();
