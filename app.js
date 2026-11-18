// 1. GESTION DES ONGLETS
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// 2. DONNÉES BOND LEVEL (41 Servants + Sauvegarde LocalStorage)
const defaultBonds = [
  { name: "Hassan hundred persona", cls: "Assassin", done: false, prio: "Priorité 1" },
  { name: "Aoko aozaki", cls: "Foreigner", done: false, prio: "Priorité 2" },
  { name: "Setanta", cls: "Saber", done: false, prio: "Priorité 3" },
  { name: "Bedivere", cls: "Saber", done: false, prio: "En attente" },
  { name: "Ptolémée", cls: "Archer", done: false, prio: "En attente" },
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
  const filter = document.getElementById('bond-filter').value;
  const grid = document.getElementById('bond-grid');
  const statMax = document.getElementById('stat-max');
  if (!grid) return;

  const maxCount = bondList.filter(b => b.done).length;
  statMax.textContent = maxCount;

  // Tri automatique : non-terminés en haut, terminés (Bond Max) en bas
  const sortedList = bondList.map((item, originalIndex) => ({ ...item, originalIndex })).sort((a, b) => {
    if (a.done === b.done) return 0;
    return a.done ? 1 : -1;
  });

  const filtered = sortedList.filter(item => {
    const matchText = item.name.toLowerCase().includes(query) || item.cls.toLowerCase().includes(query);
    const matchFilter = filter === 'all' || (filter === 'max' && item.done) || (filter === 'todo' && !item.done);
    return matchText && matchFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><span>🔍</span><h3>Aucun Servant trouvé</h3></div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const badgeClass = item.done ? 'prio-max' : (item.prio.startsWith('Priorité') ? 'prio-high' : 'prio-wait');
    return `
      <div class="servant-card ${item.done ? 'is-max' : ''}" onclick="toggleBond(${item.originalIndex})">
        <div>
          <div class="servant-card-header">
            <h3 class="servant-name">${item.name}</h3>
            <span class="servant-class">${item.cls}</span>
          </div>
        </div>
        <div class="servant-card-footer">
          <span class="prio-badge ${badgeClass}">${item.prio}</span>
          <label class="checkbox-wrap" onclick="event.stopPropagation()">
            <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleBond(${item.originalIndex})" />
            <span>Bond Max</span>
          </label>
        </div>
      </div>
    `;
  }).join('');
}

// Ajout d'un nouveau Servant
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

document.getElementById('bond-search').addEventListener('input', renderBonds);
document.getElementById('bond-filter').addEventListener('change', renderBonds);

// Initialisation
renderBonds();
